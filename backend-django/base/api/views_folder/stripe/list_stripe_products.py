from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...serializers import StripeProductsListSerializer
import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY

class StripeProductsView(APIView):
    def get(self, request):
        try:
            products = stripe.Product.list()
            product_data = []

            for product in products['data']:
                price_info = stripe.Price.retrieve(product['default_price'])
                product_info = {
                    'product_id': product['id'],
                    'name': product['name'],
                    'description': product.get('description', ''),
                    'pricing': float(price_info['unit_amount']) / 100,
                    'currency': price_info['currency'].upper(),
                    'default_price': product['default_price']
                }
                product_data.append(product_info)
            
            
            serializer = StripeProductsListSerializer(product_data, many=True)
            return Response({'products': serializer.data}, status=status.HTTP_200_OK)
        except stripe.error.StripeError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
