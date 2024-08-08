from rest_framework.views import APIView
from rest_framework.response import Response
from ...models import Subscription
from django.db.models import Sum
from rest_framework.permissions import IsAuthenticated


class RevenueAndPricesAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        total_revenue = (
            Subscription.objects.aggregate(total_revenue=Sum("price"))[
                "total_revenue"
            ]
            or 0
        )

        meal_plan_revenue = (
            Subscription.objects.filter(plan="meal_plan")
            .aggregate(total_revenue=Sum("price"))["total_revenue"]
            or 0
        )
        workout_plan_revenue = (
            Subscription.objects.filter(plan="workout_plan")
            .aggregate(total_revenue=Sum("price"))["total_revenue"]
            or 0
        )
        meal_workout_plan_revenue = (
            Subscription.objects.filter(plan="meal_workout_plan")
            .aggregate(total_revenue=Sum("price"))["total_revenue"]
            or 0
        )

        return Response(
            {
                "total_revenue": total_revenue,
                "meal_plan_revenue": meal_plan_revenue,
                "workout_plan_revenue": workout_plan_revenue,
                "meal_workout_plan_revenue": meal_workout_plan_revenue,
            }
        )