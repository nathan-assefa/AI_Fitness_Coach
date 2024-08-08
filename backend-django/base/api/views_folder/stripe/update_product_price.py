from rest_framework.views import APIView
import stripe
from rest_framework.response import Response
from rest_framework import status


class StripeProductPriceUpdateView(APIView):
    def post(self, request, *args, **kwargs):
        product_id = request.data.get('product_id')
        new_price = request.data.get('new_price')

        try:
            product = stripe.Product.retrieve(product_id)


            new_price_obj = stripe.Price.create(
                unit_amount=int(float(new_price) * 100),
                currency='usd',
                product=product_id,
                recurring={'interval': 'month'},
            )


            product.default_price = new_price_obj.id
            product.save()

            return Response({'message': 'Product price updated successfully'}, status=status.HTTP_200_OK)
        except stripe.error.StripeError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


