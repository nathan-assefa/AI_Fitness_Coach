from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from base.api.models import User, Subscription
import json
import stripe
from django.conf import settings
import datetime

stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    event = None
    metadata = {}

    try:
        event = stripe.Event.construct_from(
            json.loads(payload), stripe.api_key
        )
    except ValueError as e:
        return JsonResponse({'error': str(e)}, status=400)

    if event.type == 'checkout.session.completed':
        session = event.data.object
        metadata = session.get('metadata', {})
        subscription_id = event.data.object.id

        stripe_customer_id = event.data.object.customer
        # print("metadata: ", event.data.object)
        user_id = metadata.get('user_id')
        plan = metadata.get('plan')
        price = session['amount_total'] / 100
        print("price_id: ", price)

        start_date = datetime.datetime(2024, 5, 1, 0, 0, 0)
        end_date = datetime.datetime(2024, 5, 31, 23, 59, 59) 


        try:
            if user_id:
                try:
                    current_user = User.objects.get(id=user_id)
                    if current_user.stripe_id is None:
                        current_user.stripe_id = stripe_customer_id
                        current_user.subscription_status = "Active"
                        current_user.subscription_plan = plan
                        current_user.save()

                    sub = Subscription.objects.create(
                        user=current_user,
                        plan=plan,
                        subscription_id=subscription_id,
                        start_date=start_date,
                        end_date=end_date,
                        is_active=True,
                        price=price
                        )
                    print("sub: ", sub)
                except User.DoesNotExist:
                    print("user not found")
                    return JsonResponse({'error': 'User not found'}, status=404)
            else:
                print("user_Id not provided")
                return JsonResponse({'error': 'User ID not provided in session'}, status=400)
        except Exception as e:
            print("error to create subscription: ", e)
            return JsonResponse({'error': 'Error creating subscription'}, status=500)   

    return JsonResponse({'status': 'success'})
