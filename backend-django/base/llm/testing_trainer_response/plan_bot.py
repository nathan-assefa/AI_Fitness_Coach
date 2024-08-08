from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_openai import ChatOpenAI
from langchain_community.chat_models import ChatOllama
from typing import List
from .transform import Transform
import json
from datetime import datetime
from docx import Document
from typing import Dict
from .docx_tool import generate_docx
from langchain.memory import ConversationBufferMemory
from typing import Optional


time_now = datetime.now()
model = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)


## Meal Plan Data Model
class NutritionalInfo(BaseModel):
    ## Information about the nutritional details of the food being recommended
    calories: int = Field(description="Calories in the meal")
    protein_grams: int = Field(description="Protein content in grams")
    carbs_grams: int = Field(description="Carbohydrates content in grams")
    fat_grams: int = Field(description="Fat content in grams")

class MealItem(BaseModel):
    ## The items being used in the food
    type: str = Field(description="Type of the meal, e.g., breakfast, lunch, dinner, snack")
    items: List[str] = Field(description="List of food items in the meal")
    nutritional_info: List[NutritionalInfo] = Field(None, description="Nutritional information for the meal")
    time: str = Field(None, description="Time of the meal, e.g., 07:00 AM")

class MealDay(BaseModel):
    ## Details about the day of the food
    day: int = Field(description="Day of the month")
    date: str = Field(None, description="Date of the meal day in YYYY-MM-DD format")
    meals: List[MealItem] = Field(description="List of meals for the day")

class MealPlan(BaseModel):
    # The Plan
    month: str = Field(description="Month of the plan")
    year: int = Field(description="Year of the plan")
    plan_type: str = Field(description="Type of plan, in this case, 'meal'")
    days: List[MealDay] = Field(description="List of days in the plan")
    
## Workout Data Model

class WorkoutItem(BaseModel):
    type: str = Field(description="Type of the workout, e.g., cardio, strength, flexibility")
    duration_minutes: int = Field(description="Duration of the workout in minutes")
    intensity: str = Field(description="Intensity of the workout, e.g., low, medium, high")
    description: str = Field(None, description="Description of the workout")
    equipment_needed: List[str] = Field(None, description="List of equipment needed for the workout")
    target_muscle_groups: List[str] = Field(None, description="Targeted muscle groups")

class WorkoutDay(BaseModel):
    day: int = Field(description="Day of the month")
    date: str = Field(None, description="Date of the workout day in YYYY-MM-DD format")
    workouts: List[WorkoutItem] = Field(description="List of workouts for the day")
    notes: str = Field(None, description="Additional notes for the day")

class WorkoutPlan(BaseModel):
    month: str = Field(description="Month of the plan")
    year: int = Field(description="Year of the plan")
    plan_type: str = Field(description="Type of plan, in this case, 'workout'")
    days: List[WorkoutDay] = Field(description="List of days in the plan")

id = {
    "id": "startup-oiooi80-kjshsn-00lkaun"
}

    
def plan_generator(chat_history: List, trainer_message: str, current_time=time_now):
    """Function to generate plans according to plans and format"""
    
    transformed_chat = Transform.transform_chat_history(chat_history=chat_history)
    trainer_suggestion = trainer_message
    sender_name = transformed_chat["messages"][0]["sender_name"]
    plan_type = transformed_chat["users"][sender_name]["subscription_plan"]
    user_preferences = {
        "chat_history": transformed_chat,
        "trainer_message": trainer_suggestion,
        "plan_type": plan_type,
        "time_now": current_time
    }

    if user_preferences["plan_type"] == "meal_plan":
        parser = JsonOutputParser(pydantic_object=MealPlan)
    else:
        parser = JsonOutputParser(pydantic_object=WorkoutPlan)

    prompt = PromptTemplate(
        template="""You are an expert meal and workout planner. You will be provided with a chat history which the user had with one of our experts and the trainer/expert comment. You will take into account the conversation and the trainer/expert's comment to generate a plan. The plan should be a one month plan of workout or meal based on the user's preference. Generate ONLY the JSON object of the plan. Here is the chat history: {chat_history}. Here is the trainer/expert recommendation: {trainer_message}. And here is the plan type the user wants {plan_type} \n{format_instructions}\n, make sure the plans are well prepared. and here is the time now {current_time} and detailed. And make sure you generate a 1 week plan. Generate consistent json. Strictly follow the format instructions, do not divert from the format instructions.
    When you generate a meal plan the plan MUST follow this schema, and plan name must be meal_plan
    
    {{
      "title": "MealPlan",
      "type": "object",
      "properties": {{
        "month": {{
          "type": "string",
          "description": "Month of the plan"
        }},
        "year": {{
          "type": "integer",
          "description": "Year of the plan"
        }},
        "plan_type": {{
          "type": "string",
          "description": "Type of plan, in this case, 'meal'"
        }},
        "days": {{
          "type": "array",
          "description": "List of days in the plan",
          "items": {{
            "type": "object",
            "properties": {{
              "day": {{
                "type": "integer",
                "description": "Day of the month"
              }},
              "date": {{
                "type": "string",
                "description": "Date of the meal day in YYYY-MM-DD format",
                "format": "date"
              }},
              "meals": {{
                "type": "array",
                "description": "List of meals for the day",
                "items": {{
                  "type": "object",
                  "properties": {{
                    "type": {{
                      "type": "string",
                      "description": "Type of the meal, e.g., breakfast, lunch, dinner, snack"
                    }},
                    "items": {{
                      "type": "array",
                      "description": "List of food items in the meal",
                      "items": {{
                        "type": "string"
                      }}
                    }},
                    "nutritional_info": {{
                      "type": "array",
                      "description": "Nutritional information for the meal",
                      "items": {{
                        "type": "object",
                        "properties": {{
                          "calories": {{
                            "type": "integer",
                            "description": "Calories in the meal"
                          }},
                          "protein_grams": {{
                            "type": "integer",
                            "description": "Protein content in grams"
                          }},
                          "carbs_grams": {{
                            "type": "integer",
                            "description": "Carbohydrates content in grams"
                          }},
                          "fat_grams": {{
                            "type": "integer",
                            "description": "Fat content in grams"
                          }}
                        }},
                        "required": ["calories", "protein_grams", "carbs_grams", "fat_grams"]
                      }},
                      "nullable": true
                    }},
                    "time": {{
                      "type": "string",
                      "description": "Time of the meal, e.g., 07:00 AM",
                      "nullable": true
                    }}
                  }},
                  "required": ["type", "items"]
                }}
              }}
            }},
            "required": ["day", "meals"]
          }}
        }}
      }},
      "required": ["month", "year", "plan_type", "days"]
    }}
    
    And for the workout, you must follow the following schema,
    
    {{
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "WorkoutPlan",
      "type": "object",
      "properties": {{
        "month": {{
          "type": "string",
          "description": "Month of the plan"
        }},
        "year": {{
          "type": "integer",
          "description": "Year of the plan"
        }},
        "plan_type": {{
          "type": "string",
          "description": "Type of plan, in this case, 'workout'"
        }},
        "days": {{
          "type": "array",
          "description": "List of days in the plan",
          "items": {{
            "type": "object",
            "properties": {{
              "day": {{
                "type": "integer",
                "description": "Day of the month"
              }},
              "date": {{
                "type": "string",
                "description": "Date of the workout day in YYYY-MM-DD format",
                "format": "date"
              }},
              "workouts": {{
                "type": "array",
                "description": "List of workouts for the day",
                "items": {{
                  "type": "object",
                  "properties": {{
                    "type": {{
                      "type": "string",
                      "description": "Type of the workout, e.g., cardio, strength, flexibility"
                    }},
                    "duration_minutes": {{
                      "type": "integer",
                      "description": "Duration of the workout in minutes"
                    }},
                    "intensity": {{
                      "type": "string",
                      "description": "Intensity of the workout, e.g., low, medium, high"
                    }},
                    "description": {{
                      "type": "string",
                      "description": "Description of the workout",
                      "nullable": true
                    }},
                    "equipment_needed": {{
                      "type": "array",
                      "description": "List of equipment needed for the workout",
                      "items": {{
                        "type": "string"
                      }},
                      "nullable": true
                    }},
                    "target_muscle_groups": {{
                      "type": "array",
                      "description": "Targeted muscle groups",
                      "items": {{
                        "type": "string"
                      }},
                      "nullable": true
                    }}
                  }},
                  "required": ["type", "duration_minutes", "intensity"]
                }}
              }},
              "notes": {{
                "type": "string",
                "description": "Additional notes for the day",
                "nullable": true
              }}
            }},
            "required": ["day", "workouts"]
          }}
        }}
      }},
      "required": ["month", "year", "plan_type", "days"]
    }}

    Make sure you follow the schema all the time, do not leave out anything or forget something out of this, it is necessary you do this or the ui will break.
""",
        input_variables=["chat_history", "trainer_message", "current_time", "plan_type"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )


    chain = prompt | model | parser

    result = chain.invoke({
        "chat_history": user_preferences["chat_history"],
        "trainer_message": user_preferences["trainer_message"],
        "plan_type": user_preferences["plan_type"],
        "current_time": user_preferences["time_now"]
    })
    
    
    doc_file = generate_docx(nutrition_data=result, chat_history=id)
    
    return doc_file, result
    # print(json.dumps(result, indent=4))