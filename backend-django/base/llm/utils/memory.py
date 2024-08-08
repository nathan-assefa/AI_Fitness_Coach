import enum
from langchain.memory import (
    ConversationBufferMemory,
    ConversationBufferWindowMemory,
    ConversationSummaryMemory,
    ConversationSummaryBufferMemory,
    ConversationKGMemory
)

from langchain_openai import OpenAI
from dotenv import load_dotenv, find_dotenv

class MemoryType (enum.Enum):
    CONVERSATION_BUFFER = "Conversation Buffer"
    CONVERSATION_BUFFER_WINDOW = "Conversation Buffer Window"
    CONVERSATION_SUMMARY = "Conversation Summary"
    CONVERSATION_SUMMARY_BUFFER = "Conversation Summary Buffer"
    CONVERSATION_KNOWLEDGE_GRAPH =  "Conversation Knowledge Graph"
    

class MemoryFactory:
    """
    Provides a factory for creating memory objects based on the specified types.
    
    The factory maintains a mapping of supported memory types for the chatbot.
    
    """
    
    load_dotenv(find_dotenv())
    
    def __init__(self):
        self.memory_classes = {
            MemoryType.CONVERSATION_BUFFER: ConversationBufferMemory,
            MemoryType.CONVERSATION_BUFFER_WINDOW: ConversationBufferWindowMemory,
            MemoryType.CONVERSATION_SUMMARY: ConversationSummaryMemory,
            MemoryType.CONVERSATION_SUMMARY_BUFFER: ConversationSummaryBufferMemory,
            MemoryType.CONVERSATION_KNOWLEDGE_GRAPH: ConversationKGMemory
        }
        
    def create_memory(self, memory_type: MemoryType):
        """
        Creates a memory for the chatbot by the specified memory type.
        
        Args: 
            memory_type: The selected type of memory from the available ones  
            
        Returns:
            The newly created memory objects
            
        Raises:
            A ValueError: If the specified memory type is not supported by the script or the chatbot       
        """
        
        if memory_type not in self.memory_classes:
            raise ValueError(f"Unsupported memory type: {memory_type}")
        
        if memory_type in [MemoryType.CONVERSATION_BUFFER, MemoryType.CONVERSATION_BUFFER_WINDOW, MemoryType.CONVERSATION_SUMMARY, MemoryType.CONVERSATION_KNOWLEDGE_GRAPH]:
            return self.memory_classes[memory_type](llm=OpenAI(temperature=0), memory_key="chat_history", return_messages=True)
        return self.memory_classes[memory_type](memory_key="chat_history", return_messages=True)    
        
        
    
    @staticmethod
    def list_supported_memory_types():
        """
        Lists supported memory types for the chatbot.
        """
        return {
            "items": [{"key": enum_type.name, "value":enum_type.value } for enum_type in MemoryType],
            "name": "memoryType",
            "label": "Memory Types"
        }
        
    