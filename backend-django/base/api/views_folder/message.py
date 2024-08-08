from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.response import Response
from base.api.serializers import MessageSerializer
from base.api.models import Messages
from rest_framework import status
from django.db.models import Q



class SendMessageView(CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        recipient_id = serializer.validated_data['recipient'].id
  
        if recipient_id == self.request.user.id:
            return Response(
                {'error': 'You cannot send a message to yourself.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer.save(sender=self.request.user)


class GetUserMessagesView(ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        current_user_id = self.request.user.id
        print(f"Current user ID: {current_user_id}")

        queryset = Messages.objects.filter(
            (Q(recipient=self.request.user) & Q(sender_id=user_id)) |
            (Q(sender=self.request.user) & Q(recipient_id=user_id))
        )
        queryset = queryset.order_by('updated_at')
        return queryset


class GetUserLLMMessagesView(ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        llm_id = 1

        queryset = Messages.objects.filter(
            (Q(sender_id=user_id) & Q(recipient_id=llm_id)) |
            (Q(sender_id=llm_id) & Q(recipient_id=user_id))
        )
        queryset = queryset.order_by('updated_at')
        return queryset