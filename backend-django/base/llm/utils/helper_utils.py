import json

def load_json_file(gender: str, language: str, plan: str) -> dict:
    '''
    Loads the json files based on the gender and language selected by the user.
    
    Args: 
        Gender: Gender of the user.
        Language: The language they want their plan with.
    
    '''
    prompt="/home/biniyam/work/ptmx/new_script/prompts/"
    file_path = f'{prompt}{plan}/{language}-{gender}.json'
    
    # Load the JSON data from the file
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    return data

def generate_template(context: str, initial_questions: dict, follow_up_questions: dict) -> str:
    """
    Generate a prompt template for the LLM to use while interacting with the user.
    
    Parameters: 
        context: The context in which the LLM is going to interact with the user such as the gender and language and the
                 scenario of the reason why the chatbot is needed.
        initial_questions: The questions the chatbot can start off from.
        follow_up_questions: Questions in which the chatbot can ask follow up questions with after asking the first questions.
    Returns: 
        string that contains the complete prompt template for the LLM.  
    """
    initial_questions_str = "\n".join([f"{key}: {value}" for key, value in initial_questions.items()])
    
    follow_up_questions_str = "\n".join([f"{key}: {', '.join(value)}" for key, value in follow_up_questions.items()])
    
    template = f'''
    Ask questions based on the following context : {context} 
    
    Make sure your questions are not too much. Just ask simple questions that need immediate answers.
    
    
    You can start the conversation by asking about ONE of the following things:
    YOU ARE SUPPOSED TO ASK ONE QUESTION AND THEN CONTINUE WITH THE USER BASED ON THEIR REPLY TO YOUR FIRST QUESTION!
    MAKE SURE TO ASK THE BUDGET OF THE USER AND THE TIME THEY CAN DEDICATE TO COOK. MAKE SURE TO ASK IF THEY OCASSIONALLY BUY ORDER FOOD TOO
    
    {initial_questions_str}
    
    and ask follow-up questions from the following lists:
    {follow_up_questions_str}
    
    YOU WILL RETURN A PERSONALIZED MEAL PLAN FOR THE USER AFTER YOU GET ALL THE INFORMATION THAT YOU NEED.
    YOU WILL HAVE TO RETURN THE MEAL PLAN IN A JSON FORMAT AT THE END OF YOUR CONVERSATION. YOU RETURN ONLY JSON AND JSON ONLY AT THE END OF THE CONVERSATION.
    
    MAKE SURE THE JSON IS WELL STRUCTURED, DETAILED AND TAILORED TO THE USER. 
    KEEP IN MIND THAT THIS RETURN TYPE IS INVOKED ONLY AT THE END OR AFTER YOU FINISH GATHERING AS MUCH INFORMATION AS POSSIBLE FROM THE USER.
    MAKE SURE TO ASK THE USER IF THEY WOULD LIKE A WEEKLY, MONTHLY OR A YEARLY PLAN. 
    
    MAKE SURE THAT THE PLAN IS DETAILED AND CAREFULLY CURATED FOR THE USER. 
    
    THE RETURN TYPE MUST BE JSON AND JSON ONLY AT THE END.
    
    If you do your best job I will tip you $200
    '''
    
    return template



def main():
    
    gender = input("Enter gender (man or woman): ").lower()
    language = input("Enter language (english or spanish): ").lower()
    plan = input("What is your plan? Is it workout or meal plan?").lower()
    
    # Load JSON data based on user inputs
    data = load_json_file(gender, language)
    
    # Generate the template string using JSON data
    template = generate_template(data['context'], data['initial_questions'], data['follow_up_questions'])
    
    print(template)

if __name__ == "__main__":
    main()