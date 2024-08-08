from rest_framework.generics import CreateAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from base.api.serializers import UserSerializer, MessageSerializer
from rest_framework.response import Response
from rest_framework import status
from base.llm.info_gathering_2 import chatbot_conversation
from base.api.models import User



class UpdateUserData(UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def perform_update(self, serializer):
        user_instance = self.request.user
        user_instance.language = serializer.validated_data.get('language', user_instance.language)
        user_instance.save()

        return Response(serializer.data)
    

class SetUserPlan(CreateAPIView):
    print("inin")
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        plan = self.request.data.get('content')
        print("\n\n\n\n\n\n plan \n\n\n\n\n\n")
        user = self.request.user
        
        sender = User.objects.get(pk=1)
        message_content = f"Hello, could you assist me to generate my {plan}?, and I want you to answer my questions in {sender.language}"
        try:
            chatbot_response = chatbot_conversation(message_content, sender.id)
            print("chatbot_res: ", chatbot_response)
            content = f"Daisy: {chatbot_response}"
        except Exception as e:
            content = f"Daisy: Sorry, I encountered an error: {str(e)}"

        serializer.save(recipient=self.request.user, sender=sender, content=content)
'''
from rest_framework.generics import CreateAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from base.api.serializers import UserSerializer, MessageSerializer
from rest_framework.response import Response
from rest_framework import status
from base.llm.info_2 import ChatbotConversation
from base.api.models import User




class UpdateUserData(UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def perform_update(self, serializer):
        user_instance = self.request.user
        user_instance.language = serializer.validated_data.get(
            "language", user_instance.language
        )
        user_instance.save()

        return Response(serializer.data)


class SetUserPlan(CreateAPIView):
    print("inin")
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        plan = self.request.data.get("content")
        sender = User.objects.get(pk=1)

        user = self.request.user


        message_content = f"Hello, could you assist me to generate my {plan}?, and I want you to answer my questions in {sender.language}"
        print("\n\n\n\n\n sender_language: ", user.language)
        print("sender_Name: ", user.first_name, "\n\n\n\n\n\n\n")
        # try:
        bot = ChatbotConversation(
            user_id=sender.id,
            language=user.language,
            plan_type=plan,
            gender=user.gender,
            country=user.country
        )
        chatbot_response = bot.chatbot_conversation(message_content)
        print("chatbot_res: ", chatbot_response)
        content = chatbot_response
        # except Exception as e:
        #     content = f"Sorry, I encountered an error: {str(e)}"


        serializer.save(recipient=self.request.user, sender=sender, content=content)

'''