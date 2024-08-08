from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from base.api.models import User, Messages, Subscription, StripeProduct, Document



class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "gender",
            "country",
            "language",
            "is_active",
            "is_staff",
            "chat_status",
            "subscription_status",
            "created_at",
            "updated_at",
            "last_login",
            "subscription_plan",
            "plan_generated_status"
        ]


class SubscriptionSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Subscription
        fields = "__all__"


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.HiddenField(default=serializers.CurrentUserDefault())

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["recipient"] = UserSerializer(instance.recipient).data
        data["sender"] = UserSerializer(instance.sender).data
        return data

    class Meta:
        model = Messages
        fields = "__all__"


class TrainerOpinionSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    trainer_opinion = serializers.CharField()


class TrainerChatHistorySerializer(serializers.Serializer):
    user_id = serializers.IntegerField()


class StripeProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = StripeProduct
        fields = ['product_id', 'name', 'description', 'pricing']


class StripeProductsListSerializer(serializers.Serializer):
    product_id = serializers.CharField(max_length=255)
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True)
    pricing = serializers.DecimalField(max_digits=10, decimal_places=2)
    currency = serializers.CharField(max_length=3)
    default_price = serializers.CharField(max_length=255)


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'file_name', 'file_data', 'generated_at']
