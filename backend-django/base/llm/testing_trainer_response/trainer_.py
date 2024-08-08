from langchain_core.messages import SystemMessage, HumanMessage
from langchain_openai import ChatOpenAI
from langchain_core.pydantic_v1 import BaseModel
from typing import List
import os
from langchain_core.runnables import RunnableLambda
from langchain_core.messages import ToolMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import Runnable, RunnableConfig
from .transform import Transform
import uuid
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.graph import MessageGraph, END


class TrainerBot:
    def __init__(self):
        self.llm = ChatOpenAI(temperature=0)
        self.memory = SqliteSaver.from_conn_string(":memory:")
        self.config = {"configurable": {"thread_id": str(uuid.uuid4())}}
        self.nodes = {k: k for k in ["info", "prompt", END]}
        self.workflow = MessageGraph()
        self._initialize_workflow()

    def _initialize_workflow(self):
        chain = self.get_messages_info | self.llm.bind_tools([self.PromptInstructions])
        prompt_gen_chain = self.get_prompt_messages | self.llm

        self.workflow.add_node("info", chain)
        self.workflow.add_node("prompt", prompt_gen_chain)
        self.workflow.add_conditional_edges("info", self.get_state, self.nodes)
        self.workflow.add_conditional_edges("prompt", self.get_state, self.nodes)
        self.workflow.set_entry_point("info")
        self.graph = self.workflow.compile(checkpointer=self.memory)

    def get_messages_info(self, messages):
        return [SystemMessage(content=self.template)] + messages

    class PromptInstructions(BaseModel):
        """Instructions on how to prompt the LLM."""
        objective: str
        variables: List[str]
        constraints: List[str]
        requirements: List[str]

    def _is_tool_call(self, msg):
        return hasattr(msg, "additional_kwargs") and "tool_calls" in msg.additional_kwargs

    def get_prompt_messages(self, messages):
        tool_call = None
        other_msgs = []
        for m in messages:
            if self._is_tool_call(m):
                tool_call = m.additional_kwargs["tool_calls"][0]["function"]["arguments"]
            elif tool_call is not None:
                other_msgs.append(m)
        return [SystemMessage(content=self.prompt_system.format(reqs=tool_call))] + other_msgs

    def get_state(self, messages):
        if self._is_tool_call(messages[-1]):
            return "prompt"
        elif not isinstance(messages[-1], HumanMessage):
            return END
        for m in messages:
            if self._is_tool_call(m):
                return "prompt"
        return "info"

    def transform_chat(self, chat_history: List):
        return Transform.transform_chat_history(chat_history)

    def generate_template(self, chat_history, trainer_message):
        transformed_chat = self.transform_chat(chat_history)
        self.template = f"""You are an expert meal and workout planner. You will be provided with a chat history which the user had with one of our experts.
        and the trainer/expert comment. You will take into account the conversation and the trainer/experts comment to generate a plan.
        
        The plan should be a one day plan of workout or meal based on the user's preference. And it should be in json format. Only json object
        of the plan should be generated. No notes, no text, nothing additional from you. Only json should be generated. JSON Object of a monthly workout
        or meal plan based on the user's preference which you will extract from the history that will be given to you.
        
        Here is the chat history {transformed_chat}
        
        And here is the trainer/expert recommendation, message to you {trainer_message}
        
        Generate ONLY JSON Object of the plan based off of this. More like return a one month plan based on the user's preferred plan.
        
        Do not talk about anything. You only generate a json plan based on the information given to you above.
        """

    def trainer_conversation(self, chat_history, trainer_message):
        self.generate_template(chat_history, trainer_message)
        # if user_input.lower() in {"q", "quit"}:
            # return "AI"
        response = []
        for output in self.graph.stream([HumanMessage(content=self.template)], config=self.config):
            if "__end__" in output:
                continue
            for key, value in output.items():
                response.append(value.content)
        response_text = "\n---\n".join(response)
        return response_text

if __name__ == "__main__":
    bot = TrainerBot()
    # print("Welcome to the Trainer! Type 'quit' or 'q' to exit.")
    # user_input = input("You: ")
    history = None
    response = bot.trainer_conversation(chat_history=history, trainer_message="This is good consider not adding diary products")
    print("Bot:", response)

