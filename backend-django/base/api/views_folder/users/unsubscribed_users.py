from rest_framework.views import APIView
from rest_framework.response import Response
from base.api.models import Subscription, User
from base.api.serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated


class UnsubscribedUserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        active_subscriptions = Subscription.objects.filter(is_active=True)
        subscribed_users = User.objects.filter(subscription__in=active_subscriptions).distinct()
        unsubscribed_users = User.objects.exclude(id__in=subscribed_users.values('id')).exclude(first_name="LLM")

        serializer = UserSerializer(unsubscribed_users, many=True)
        response_data = {"count": unsubscribed_users.count(), "users": serializer.data}
        return Response(response_data)
