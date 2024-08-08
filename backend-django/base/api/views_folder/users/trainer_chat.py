from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from ...models import Messages, User, Document
from ...serializers import TrainerOpinionSerializer, MessageSerializer
from base.llm.testing_trainer_response.plan_bot import plan_generator
from rest_framework.permissions import IsAuthenticated
from datetime import datetime


class TrainerOpinionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = TrainerOpinionSerializer(data=request.data)
        if serializer.is_valid():
            user_id = serializer.validated_data.get('user_id')
            trainer_opinion = serializer.validated_data.get('trainer_opinion')


            try:
                llm = User.objects.get(first_name='LLM')
            except User.DoesNotExist:
                return Response({"error": "LLM user not found."}, status=status.HTTP_404_NOT_FOUND)
            
            trainer = request.user
            print(f"Trainer: {trainer}")
            print(f"User ID: {user_id}")  
            
            Messages.objects.create(
                sender=trainer,
                recipient=llm,
                content=trainer_opinion,
                related_user_id=user_id
            )
            
            messages = Messages.objects.filter(sender_id=user_id) | Messages.objects.filter(recipient_id=user_id)

            message_serializer = MessageSerializer(messages, many=True) 
            serialized_messages = message_serializer.data
            
            # try:
            doc_file, parsed_result = plan_generator(chat_history=serialized_messages, trainer_message=trainer_opinion)
            
            # Read the bytes from the BytesIO object
            doc_file.seek(0)
            file_data = doc_file.read()
            

            timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
            file_name = f"generated_plan_{user_id}_{timestamp}.docx"

            Document.objects.create(
                user_id=user_id,
                file_name=file_name,
                file_data=file_data,
            )

            Messages.objects.create(
                sender=llm,
                recipient=trainer,
                content=parsed_result,
                related_user_id=user_id
            )
            
            updated_messages = Messages.objects.filter(
                related_user_id=user_id,
                sender__in=[trainer, llm],
                recipient__in=[trainer, llm]
            )
            
            updated_message_serializer = MessageSerializer(updated_messages, many=True)
            updated_serialized_messages = updated_message_serializer.data

            return Response({
                "chat_history": updated_serialized_messages,
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

