from rest_framework.views import APIView
from rest_framework.response import Response
from base.api.models import Subscription
from base.api.serializers import UserSerializer
from base.api.models import User
from rest_framework.permissions import IsAuthenticated



class SubscribedUserListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        active_subscriptions = Subscription.objects.filter(is_active=True)
        subscribed_users = (
            User.objects.filter(subscription__in=active_subscriptions)
            .exclude(first_name="LLM")
            .distinct()
        )
        serializer = UserSerializer(subscribed_users, many=True)
        response_data = {"count": subscribed_users.count(), "users": serializer.data}
        return Response(response_data)
