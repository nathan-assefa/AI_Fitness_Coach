from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from ...models import Messages, User
from ...serializers import TrainerChatHistorySerializer, MessageSerializer
from rest_framework.permissions import IsAuthenticated



class TrainerChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = TrainerChatHistorySerializer(data=request.data)
        if serializer.is_valid():
            user_id = serializer.validated_data.get('user_id')
            print("user_id: ", user_id)

            try:
                llm = User.objects.get(first_name='LLM')
            except User.DoesNotExist:
                return Response({"error": "LLM user not found."}, status=status.HTTP_404_NOT_FOUND)
            
            trainer = request.user

            print("trainer_name: ", trainer)


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

