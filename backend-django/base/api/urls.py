from django.urls import path, include
from .views import (
    hello_world,
    # MyTokenObtainPairView,
    register_user,
    StripeCheckoutView,
    stripe_webhook,
    GetUserMessagesView,
    SendMessageView,
    UpdateUserData,
    GetUserProfile,
    SetUserPlan,
    handle_google_auth,
    UserListView,
    SubscribedUserListView,
    RevenueAndPricesAPIView,
    UnsubscribedUserListView,
    GetUserLLMMessagesView,
    AnalyticsView,
    TrainerOpinionView,
    StripeProductsView,
    StripeProductPriceUpdateView,
    UserTokenObtainPairView,
    AdminTokenObtainPairView,
    DownloadRecentDocument,
    TrainerChatHistoryView
    )
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


urlpatterns = [
    path("", hello_world),
    path("token/", UserTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("admin/token/", AdminTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('get-user-data/', GetUserProfile.as_view(), name="user_profile"),
    path("register/", register_user, name="register_user"),
    
    path(
        "stripe/create-checkout-session/<str:product_id>/",
        StripeCheckoutView.as_view(),
        name="product_id",
    ),
    path("stripe-webhook/", stripe_webhook, name="stripe_webhook"),
    path('revenue-and-prices/', RevenueAndPricesAPIView.as_view(), name='revenue_and_prices'),
    path('stripe-products/', StripeProductsView.as_view(), name='stripe-product-list'),
    path('stripe-product-price-update/', StripeProductPriceUpdateView.as_view(), name='stripe-product-price-update'),


    path('send_message/', SendMessageView.as_view(), name='send_message'),
    path('get-user-messages/<int:user_id>/',
         GetUserMessagesView.as_view(), name='get_user_messages'),
    path('update-user-data/', UpdateUserData.as_view(), name="update_user_data"),
    path('set-user-plan/', SetUserPlan.as_view(), name="set_user_plan"),
    path('messages-history/<int:user_id>/', GetUserLLMMessagesView.as_view(), name='user-llm-messages'),
    

    path('auth/google/', handle_google_auth, name='handle_google_auth'),

    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('auth/social/', include('allauth.socialaccount.urls')),

    path('users-list/', UserListView.as_view(), name='users-list'),
    path('subscribed-users/', SubscribedUserListView.as_view(), name='subscribed-user-list'),
    path('unsubscribed-users/', UnsubscribedUserListView.as_view(), name='unsubscribed-users'),


    path('analytics/', AnalyticsView.as_view(), name='analytics'),


    path('trainer-opinion/', TrainerOpinionView.as_view(), name='trainer_opinion'),
    path('trainer-char-history/', TrainerChatHistoryView.as_view(), name='trainer_chathistory'),


    path('download/recent/<int:user_id>/', DownloadRecentDocument.as_view(), name='download-recent-document'),

]
