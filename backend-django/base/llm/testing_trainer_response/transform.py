# utils/transform.py, class to transform recieved chat history into something shorter to reduce token counts on api call

class Transform:
    @staticmethod
    def transform_chat_history(chat_history):
        users = {}
        messages = []

        for chat in chat_history:
            # Recipient information
            recipient_info = {
                "first_name": chat["recipient"]["first_name"],
                "last_name": chat["recipient"]["last_name"],
                "email": chat["recipient"]["email"],
                "phone_number": chat["recipient"]["phone_number"],
                "country": chat["recipient"]["country"],
                "language": chat["recipient"]["language"],
                "is_active": chat["recipient"]["is_active"],
                "is_staff": chat["recipient"]["is_staff"],
                "chat_status": chat["recipient"]["chat_status"],
                "subscription_status": chat["recipient"]["subscription_status"],
                "subscription_plan": chat["recipient"]["subscription_plan"],
                "plan_generated_status": chat["recipient"]["plan_generated_status"]
            }
            recipient_name = f"{chat['recipient']['first_name']} {chat['recipient']['last_name']}"
            users[recipient_name] = recipient_info

            sender_info = {
                "first_name": chat["sender"]["first_name"],
                "last_name": chat["sender"]["last_name"],
                "email": chat["sender"]["email"],
                "phone_number": chat["sender"]["phone_number"],
                "country": chat["sender"]["country"],
                "language": chat["sender"]["language"],
                "is_active": chat["sender"]["is_active"],
                "is_staff": chat["sender"]["is_staff"],
                "chat_status": chat["sender"]["chat_status"],
                "subscription_status": chat["sender"]["subscription_status"],
                "subscription_plan": chat["sender"]["subscription_plan"],
                "plan_generated_status": chat["sender"]["plan_generated_status"]
            }
            sender_name = f"{chat['sender']['first_name']} {chat['sender']['last_name']}"
            users[sender_name] = sender_info

            message = {
                "id": chat["id"],
                "content": chat["content"],
                "recipient_name": recipient_name,
                "sender_name": sender_name
            }
            messages.append(message)

        return {"users": users, "messages": messages}
