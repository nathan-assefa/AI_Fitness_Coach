from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.utils import timezone

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from base.api.views_folder.signup import register_user
from base.api.views_folder.stripe.stripe import StripeCheckoutView
from base.api.views_folder.stripe.stripe_webhook import stripe_webhook
from base.api.views_folder.message import GetUserMessagesView, SendMessageView, GetUserLLMMessagesView
from base.api.views_folder.update_user_data import UpdateUserData
from base.api.views_folder.get_user_data import GetUserProfile
from base.api.views_folder.update_user_data import UpdateUserData, SetUserPlan
from base.api.views_folder.get_google_token import handle_google_auth
from base.api.views_folder.users.users_list import UserListView
from base.api.views_folder.users.subscribed_users_list import SubscribedUserListView
from base.api.views_folder.stripe.get_stripe_data import RevenueAndPricesAPIView
from base.api.views_folder.users.unsubscribed_users import UnsubscribedUserListView
from base.api.views_folder.analytics.analytics_view import AnalyticsView
from base.api.views_folder.users.trainer_chat import TrainerOpinionView
from base.api.views_folder.stripe.list_stripe_products import StripeProductsView
from base.api.views_folder.stripe.update_product_price import StripeProductPriceUpdateView
from rest_framework import serializers
from base.api.views_folder.documents.generated_plan import DownloadRecentDocument
from base.api.views_folder.users.trainer_chat_history import TrainerChatHistoryView


class UserTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['id'] = user.id
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['gender'] = user.gender

        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])
        return data
    

class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['id'] = user.id
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['gender'] = user.gender

        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        
        if not user.is_staff:
            raise serializers.ValidationError('You do not have permission to access this area.')
        
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])
        return data
    
class UserTokenObtainPairView(TokenObtainPairView):
    serializer_class = UserTokenObtainPairSerializer


class AdminTokenObtainPairView(TokenObtainPairView):
    serializer_class = AdminTokenObtainPairSerializer


@api_view(['GET'])
def hello_world(request):
    return Response("Hello world")