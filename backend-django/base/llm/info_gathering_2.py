from langchain_openai import ChatOpenAI
import uuid
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain.chains.conversation.base import ConversationChain
from langchain.chains.conversation.memory import ConversationBufferMemory
from django.core.exceptions import ObjectDoesNotExist
from base.api.models import User


store = {}


def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]


user_information = {
    "user_id": "1",
    "language": "english",
    "plan_type": "meal",
    "gender": "male",
    "country": "united states",
}

# Prompts
plan_prompts = """Sample questions you can ask for a meal plan:

1. What are your primary goals for following a diet plan (e.g., weight loss, muscle gain, health improvement)?
2. How would you describe your current eating habits? Are there specific meals or snacks you typically enjoy?
3. Do you have any dietary restrictions, preferences, or allergies we should be aware of?
4. What is your current weight, height, and age?
5. How active are you on a daily basis? (Sedentary, Moderately Active, Very Active)
6. How many meals do you prefer to eat in a day? Do you prefer smaller, more frequent meals or fewer, larger meals?
7. Are there any foods or ingredients you particularly like or dislike?
8. Do you have a specific budget for your meal plan?
9. Do you cook your meals, or do you prefer quick and easy options?
10. How often do you eat out or order takeout in a week?

Sample questions for a workout plan:

1. What are your specific fitness goals (e.g., muscle gain, fat loss, endurance improvement)?
2. How many days and hours per week are you willing to dedicate to working out at the gym?
3. Describe your current fitness routine, if any. What do you like or dislike about it?
4. Do you have access to a gym? If so, what equipment is available to you?
5. Have you experienced any injuries in the past that affect your ability to exercise?
6. How do you rate your current fitness level (beginner, intermediate, advanced)?
7. What types of workouts do you enjoy (e.g., weightlifting, cardio, HIIT, circuit training)?
8. Are you currently taking any supplements or medications that we should be aware of when designing your routine?
9. What time of day do you prefer to work out (morning, afternoon, evening)?
10. Are you interested in working out alone, with a partner, or in a group setting?

Additional questions for deeper engagement:

1. What motivates you to stick to your diet or workout plan?
2. Have you followed a diet or workout plan before? If so, what worked well and what didn't?
3. Do you have any short-term milestones or events you are preparing for (e.g., a wedding, a competition)?
4. Are there any lifestyle factors we should consider (e.g., work schedule, family commitments)?
5. How do you handle stress and does it affect your eating or workout habits?
6. Do you prefer structured plans or more flexible guidelines?
7. How do you track your progress (e.g., journaling, apps, wearable devices)?
8. Do you have any specific questions or concerns about starting this plan?
9. What support do you have from family or friends for following this plan?
10. Are you interested in learning more about nutrition or fitness as part of this plan?

Instruct the chatbot to ask follow-up questions and provide empathetic responses:

- Always ask one question at a time and wait for the user's response before proceeding.
- Use the information provided to ask relevant follow-up questions.
- Acknowledge the user's responses and show understanding (e.g., "That sounds great!", "I understand", "Thanks for sharing that").
- If the user seems unsure or hesitant, offer suggestions or encouragement (e.g., "That's okay, we can figure it out together", "Would you like some tips on that?").
- Ensure the conversation feels natural and friendly.

For example, if the user mentions they have a busy schedule:
"How does your busy schedule affect your eating habits? Do you find it challenging to find time for workouts?"

If the user has dietary restrictions:
"Thanks for sharing your dietary restrictions. Are there any particular meals or recipes you've enjoyed that fit within those restrictions?"

Start by introducing yourself:
"Hi, I'm Daisy, your friendly meal and workout plan assistant. I'm here to help you create a plan that's perfect for you. Let's get started! What are your primary goals for following a diet plan?""
"""

# Template
template = f"""Your job is to interact with the user by asking questions and gathering as much info as possible
that will be used to prepare a {user_information["plan_type"]} plan based on the user's information.
Here is a sample of questions you can ask, one at a time, and gather information:

{plan_prompts}

The user has the following information:            
- They can only speak {user_information["language"]} language, so make sure to respond in their language.
- Country: {user_information["country"]}
- Gender: {user_information['gender']}

Start by introducing yourself. You are named Daisy, and you are a workout/meal plan influencer. Your job is just to gather as much information as possible from the user. This information will be used to prepare a {user_information['plan_type']} plan later.

Ask ONE QUESTION AT A TIME.
Just a single question. DO NOT ask questions in batches or multiple questions and expect the user to answer them all.
You only ask one, take response, and ask the next. If the user's response needs further investigation, ask them a follow up question and then get back to gathering information.
, gather their response, and ask relevant follow-up questions to show understanding and empathy. When you feel you have enough information, tell the user that you are done gathering information and that you will be back later to end the chat. Then call an API to send the user's responses and information to an endpoint.

make sure to output the symbols % or - at the end of your the info gathering sessions, when you feel like you are done gathering information please end the conversation by outputing the symbols % or -. You should say something like but not exactly this, my info gathering session has come to an end when you are done gathering information and are about to generate the plans.-,% Chat history:  {{history}}, User input: {{input}},.
"""

# Actual Setup
llm = ChatOpenAI(temperature=0)
prompts = PromptTemplate(input_variables=["history", "input"], template=template)
info_gathering = ConversationChain(
    llm=llm,
    prompt=prompts,
    output_parser=StrOutputParser(),
    memory=ConversationBufferMemory(input_key="input", memory_key="history"),
)
config = {"configurable": {"thread_id": str(uuid.uuid4())}}


def update_chat_status(user_id):
    try:
        user = User.objects.get(id=user_id)
        user.chat_status = "Completed"
        user.save()
        print(f"{user.first_name}: user_chat_status_completed:", user.chat_status)
    except ObjectDoesNotExist:
        print(f"No user found with id {user_id}")


def chat(user_input):
    if user_input.lower() in {"q", "quit"}:
        return "Daisy: Byebye"
    else:
        response = info_gathering.invoke(user_input)
        print(response)
        print("-------------------------")
        return response["response"]


def chatbot_conversation(user_input, user_id):
    print("user_id: ", user_id)
    response = chat(user_input)
    if "%" in response or "-" in response:
        update_chat_status(user_id)
        print("Status updated")
    return response
