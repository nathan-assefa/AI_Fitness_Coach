from django.db.models import Sum, Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from ...models import User, Subscription
from datetime import timedelta
from django.db.models.functions import ExtractMonth
from django.utils.timezone import now
from django.db.models import Case, IntegerField, Sum, Value, When
from django.db.models.functions import Coalesce
import calendar
from django.db.models import F



class AnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Exclude the user whose first_name is 'LLM'
        non_llm_users = User.objects.exclude(first_name="LLM")

        # Plan Information
        meal_plan_users = (
            Subscription.objects.filter(plan="meal_plan")
            .exclude(user__first_name="LLM")
            .count()
        )
        workout_plan_users = (
            Subscription.objects.filter(plan="workout_plan")
            .exclude(user__first_name="LLM")
            .count()
        )
        meal_workout_plan_users = (
            Subscription.objects.filter(plan="meal_workout_plan")
            .exclude(user__first_name="LLM")
            .count()
        )

        # Revenue Information
        total_revenue = Subscription.objects.exclude(user__first_name="LLM").aggregate(
            total=Sum("price")
        )["total"]
        revenue_by_month = (
            Subscription.objects.exclude(user__first_name="LLM")
            .values("start_date__month")
            .annotate(total=Sum("price"))
        )
        revenue_by_plan = (
            Subscription.objects.exclude(user__first_name="LLM")
            .values("plan")
            .annotate(total=Sum("price"))
        )
        revenue_by_month_plan = (
            Subscription.objects.exclude(user__first_name="LLM")
            .values("start_date__month", "plan")
            .annotate(total=Sum("price"))
        )

        # Activity Information
        total_logins = non_llm_users.filter(
            last_login__isnull=False
        ).count()  # Count of users who have logged in
        completed_chat_users = non_llm_users.filter(chat_status="Completed").count()
        total_users = non_llm_users.count()
        not_started_chats = non_llm_users.filter(chat_status="Not Started").count()
        in_progress_chats = non_llm_users.filter(chat_status="In Progress").count()

        # Performance Information
        active_subscribers = non_llm_users.filter(subscription_status="Active").count()
        inactive_subscribers = non_llm_users.filter(
            subscription_status="Inactive"
        ).count()
        trial_to_paid_conversion_rate = (
            active_subscribers / inactive_subscribers
            if inactive_subscribers != 0
            else 0
        )

        # Subscription Information
        popular_plan = (
            Subscription.objects.exclude(user__first_name="LLM")
            .values("plan")
            .annotate(count=Count("id"))
            .order_by("-count")
            .first()
        )

        # Comparative Analysis
        current_month = datetime.now().month
        previous_month = (datetime.now().replace(day=1) - timedelta(days=1)).month
        current_month_metrics = (
            Subscription.objects.filter(start_date__month=current_month)
            .exclude(user__first_name="LLM")
            .aggregate(total=Sum("price"))["total"]
        )
        previous_month_metrics = (
            Subscription.objects.filter(start_date__month=previous_month)
            .exclude(user__first_name="LLM")
            .aggregate(total=Sum("price"))["total"]
        )
        plan_comparison = (
            Subscription.objects.exclude(user__first_name="LLM")
            .values("plan")
            .annotate(total=Sum("price"))
            .order_by("plan")
        )



        # Calculate profit of total revenue in each month
        current_year = now().year


        profit_by_month = Subscription.objects.filter(
            start_date__year=current_year
        ).annotate(
            month=ExtractMonth("start_date")
        ).values(
            "month"
        ).annotate(
            profit=Sum("price")
        )

        # Calculate profit of total revenue in each month
        profit_by_month = Subscription.objects.filter(
            start_date__year=current_year
        ).annotate(
            month=ExtractMonth("start_date")
        ).values(
            "month"
        ).annotate(
            profit=Sum(
                Case(
                    When(price__isnull=True, then=Value(0)),
                    default=F("price"),
                    output_field=IntegerField(),
                )
            )
        ).order_by("month")

        # Ensure all 12 months are included in the result
        month_profits = {month: 0 for month in range(1, 13)}
        for item in profit_by_month:
            month_profits[item["month"]] = item["profit"]

        # Convert the month number to month abbreviation
        month_profit_dict = {calendar.month_abbr[month]: profit for month, profit in month_profits.items()}


        return Response(
            {
                "plan_information": {
                    "meal_plan_users": meal_plan_users,
                    "workout_plan_users": workout_plan_users,
                    "meal_workout_plan_users": meal_workout_plan_users,
                },
                "revenue_information": {
                    "total_revenue": total_revenue,
                    "revenue_by_month": revenue_by_month,
                    "revenue_by_plan": revenue_by_plan,
                    "revenue_by_month_plan": revenue_by_month_plan,
                },
                "activity_information": {
                    "total_logins": total_logins,
                    "completed_chats": completed_chat_users,
                    "total_users": total_users,
                    "not_started_chats": not_started_chats,
                    "in_progress_chats": in_progress_chats,
                },
                "performance_information": {
                    "trial_to_paid_conversion_rate": trial_to_paid_conversion_rate,
                },
                "subscription_information": {
                    "popular_plan": popular_plan,
                },
                "comparative_analysis": {
                    "current_month_metrics": current_month_metrics,
                    "previous_month_metrics": previous_month_metrics,
                    "plan_comparison": plan_comparison,
                },
                "profit_by_month": month_profit_dict,
            }
        )
