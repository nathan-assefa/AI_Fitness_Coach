from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    GENDER_CHOICES = [
        ("Male", "Male"),
        ("Female", "Female"),
    ]

    COUNTRY_CHOICES = [
        ("Mexico", "Mexico"),
        ("USA", "USA"),
    ]

    LANGUAGE_CHOICES = [
        ("English", "English"),
        ("Spanish", "Spanish"),
    ]

    CHAT_STATUS_CHOICES = [
        ("Not Started", "Not Started"),
        ("In Progress", "In Progress"),
        ("Completed", "Completed"),
    ]

    SUBSCRIPTION_STATUS_CHOICES = [
        ("Active", "Active"),
        ("Inactive", "Inactive"),
    ]

    PLAN_GENERATED_STATUS_CHOICES = [
        ("Generated", "Generated"),
        ("Not Generated", "Not Generated"),
    ]

    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    agreed_to_terms = models.BooleanField(default=False)
    gender = models.CharField(
        _("gender"), choices=GENDER_CHOICES, max_length=10, blank=True, null=True
    )
    country = models.CharField(
        _("country"),
        choices=COUNTRY_CHOICES,
        max_length=50,
        default="USA",
        blank=True,
        null=True,
    )
    language = models.CharField(
        _("language"),
        choices=LANGUAGE_CHOICES,
        max_length=50,
        default="English",
        blank=True,
        null=True,
    )
    stripe_id = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    chat_status = models.CharField(
        _("chat status"),
        choices=CHAT_STATUS_CHOICES,
        max_length=20,
        default="Not Started",
    )
    subscription_plan = models.CharField(max_length=100, blank=True, null=True, default='Not chosen yet')
    subscription_status = models.CharField(
        _("subscription status"),
        choices=SUBSCRIPTION_STATUS_CHOICES,
        max_length=10,
        default="Inactive",
    )
    plan_generated_status = models.CharField(
        _("plan generated status"),
        choices=PLAN_GENERATED_STATUS_CHOICES,
        max_length=15,
        default="Not Generated",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email


class Subscription(models.Model):
    PLAN_CHOICES = [
        ("meal_plan", "Meal_plan"),
        ("workout_plan", "workout_plan"),
        ("meal_workout_plan", "Meal_and_workout_plan"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES)
    subscription_id = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return f"{self.user}'s {self.plan} subscription"


class Messages(models.Model):
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sent_messages"
    )

    recipient = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="received_messages"
    )

    related_user = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=True, null=True,
        related_name="related_messages", 
        help_text="Optional: Associate this message with a specific user."
    )

    content = models.TextField()

    def __str__(self):
        return f"{self.content}"



class StripeProduct(models.Model):
    product_id = models.CharField(max_length=255, unique=True) 
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    pricing = models.DecimalField(max_digits=10, decimal_places=2)


    def __str__(self):
        return self.name
    

class Document(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    file_name = models.CharField(max_length=255)
    file_data = models.BinaryField()
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file_name
