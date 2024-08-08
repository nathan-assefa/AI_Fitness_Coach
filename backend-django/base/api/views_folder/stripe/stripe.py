from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import redirect
from base.api.models import User
import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY

class StripeCheckoutView(APIView):
    def post(self, request, product_id):
        try:
            current_user_id = request.query_params.get('userId')
            price_id = request.query_params.get('price_id')
            print("price_id: ", price_id)

            if not price_id:
                return Response(
                    {'error': 'price_id is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            currentUser = User.objects.get(id=current_user_id)

            if currentUser:
                metadata = {
                    'user_id': current_user_id
                }

            if product_id == 'product_id_1':
                plan = 'meal_plan'
            elif product_id == 'product_id_2':
                plan = 'meal_workout_plan'
            elif product_id == 'product_id_3':
                plan = 'workout_plan'
            else:
                return Response(
                    {'error': 'Invalid product ID'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            metadata['plan'] = plan
            
            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        'price': price_id,
                        'quantity': 1,
                    },
                ],
                payment_method_types=['card'],
                mode='subscription',
                success_url=settings.SITE_URL + '/?success=true&session_id={CHECKOUT_SESSION_ID}',
                cancel_url=settings.SITE_URL + '/?canceled=true',
                metadata=metadata,
            )

            return redirect(checkout_session.url)
        except Exception as e:
            print("error as e: ", e)
            return Response(
                {'error': 'Something went wrong when creating stripe checkout session'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
