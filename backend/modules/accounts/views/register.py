import os
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from modules.accounts.serializers.create_user import CreateUserSerializer
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.db import transaction
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterView(APIView):

    def post(self, request):
        serializer = CreateUserSerializer(data=request.data)

        if serializer.is_valid():
            try:
                with transaction.atomic():  # Start a transaction
                    user = serializer.save()

                    # Generate email verification token
                    token = default_token_generator.make_token(user)
                    uid = urlsafe_base64_encode(force_bytes(user.pk))

                    # Generate confirmation link
                    current_site = os.getenv(
                        "FRONTEND_URL", "http://localhost:5000"
                    )  # Change this for production
                    relative_link = f"/verify-email?id={uid}&token={token}"
                    verification_link = f"{current_site}{relative_link}"

                    # Prepare email
                    subject = "[BULBATRADE.COM] - Activate your account"
                    html_message = render_to_string(
                        "auth/email_verification.html",
                        {
                            "user": user,
                            "verification_link": verification_link,
                        },
                    )
                    plain_text_message = f"Hi {user.username},\n\nClick the link below to verify your email:\n{verification_link}"

                    email = EmailMultiAlternatives(
                        subject, plain_text_message, settings.DEFAULT_FROM_EMAIL, [user.email]
                    )

                    email.attach_alternative(html_message, "text/html")
                    try:
                        email.send()  # Send the email
                    except Exception as e:
                        print(f"Error sending email : {e}")

                    return Response(
                        {"message": "User registered successfully"}, status=status.HTTP_201_CREATED
                    )

            except Exception:
                transaction.set_rollback(True)  # Rollback transaction if email sending fails
                return Response(
                    {"error": "User registration failed, please try again."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
