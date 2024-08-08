import re
from base.api.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
from django.core.exceptions import ValidationError


def validate_email_address(email):
    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(email_pattern, email)


@csrf_exempt
@require_POST
def register_user(request):
    try:
        data = json.loads(request.body)
        print("data: ", data)
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        phone_number = data.get("phone_number")
        agreed_to_terms = data.get("agreed_to_terms")
        email = data.get("email")
        password = data.get("password")
        gender = data.get("gender")
        language = data.get("language")
        country = data.get("country")

        if not agreed_to_terms:
            return JsonResponse({"error": "Please agree to the terms and conditions"}, status=400)    
        if not language:
            return JsonResponse({"error": "Please choose your language preference"}, status=400)
        if not gender:
            return JsonResponse({"error": "Please choose your gender"}, status=400)
        if not country:
            return JsonResponse({"error": "Please choose your country"}, status=400)



        if (
            not first_name
            or not password
            or not email
            or not last_name
            or not phone_number
            or not agreed_to_terms
            or not gender
            or not language
            or not country
        ):
            return JsonResponse({"error": "Incomplete registration data"}, status=400)

        try:
            if not validate_email_address(email):
                return JsonResponse({"error": "Invalid email address"}, status=400)
        except ValidationError as e:
            return JsonResponse({"error": "Invalid email address"}, status=400)

        # Password strength validation
        password_pattern = r"^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{8,}$"
        if not re.match(password_pattern, password):
            return JsonResponse(
                {"error": "Password does not meet strength requirements"}, status=400
            )


        user_data = {
            "password": password,
            "email": email,
            "first_name": first_name,
            "phone_number": phone_number,
            "agreed_to_terms": agreed_to_terms,
            "last_name": last_name,
            "gender": gender,
            "language": language,
            "country": country
        }

        User.objects.create_user(**user_data)

        return JsonResponse({"message": "User registered successfully"}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
