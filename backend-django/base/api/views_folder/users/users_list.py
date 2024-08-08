from rest_framework.views import APIView
from rest_framework.response import Response
from ...models import User
from ...serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.exclude(first_name='LLM')

        formatted_users = []
        for user in users:
            formatted_user = user.__dict__.copy()
            formatted_user['created_at'] = user.created_at.strftime('%d %b %Y')
            formatted_user['updated_at'] = user.updated_at.strftime('%d %b %Y')
            formatted_user['last_login'] = user.last_login.strftime('%d %b %Y %H:%M:%S') if user.last_login else "Not logged in yet"
            formatted_user['subscription_plan'] = user.subscription_plan if user.subscription_plan else "Not chosen yet"
            formatted_users.append(formatted_user)

        serializer = UserSerializer(data=formatted_users, many=True)
        serializer.is_valid()

        response_data = {
            'count': len(formatted_users),
            'users': serializer.data
        }
        return Response(response_data)

