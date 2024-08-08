import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone

User = get_user_model()

@api_view(['POST'])
def handle_google_auth(request):
    token = request.data.get('access_token')
    if not token:
        return Response({'error': 'Token not provided'}, status=400)

    google_token_verify_url = f'https://oauth2.googleapis.com/tokeninfo?id_token={token}'
    response = requests.get(google_token_verify_url)
    
    if response.status_code != 200:
        return Response({'error': 'Failed to verify token'}, status=400)
    
    token_info = response.json()
    
    if token_info.get('aud') != settings.GOOGLE_CLIENT_ID:
        return Response({'error': 'Invalid token'}, status=400)
    
    email = token_info.get('email')
    given_name = token_info.get('given_name')
    family_name = token_info.get('family_name')

    user, created = User.objects.get_or_create(email=email, defaults={
        'first_name': given_name,
        'last_name': family_name,
        'last_login': timezone.now()
    })

    refresh = RefreshToken.for_user(user)
    refresh['id'] = user.id
    refresh['email'] = user.email
    refresh['first_name'] = user.first_name


    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    })

