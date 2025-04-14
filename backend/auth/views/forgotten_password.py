import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.contrib.auth.models import User


class ForgottenPasswordView(APIView):

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)

            # Generate reset token and uid
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            # Build reset link
            current_site = os.getenv("FRONTEND_URL", "http://localhost:5000")
            reset_link = f"{current_site}/reset-password?id={uid}&token={token}"  # TODO how to make this link expire after some time ? https://shuup.readthedocs.io/en/latest/_modules/django/contrib/auth/tokens.html

            # Email content
            subject = "[BULBATRADE.COM] - Password Reset Request"
            html_message = render_to_string(
                "auth/password_reset.html",
                {"user": user, "reset_link": reset_link},
            )
            plain_text = (
                f"Hi {user.username},\n\nClick the link below to reset your password:\n{reset_link}"
            )

            email_msg = EmailMultiAlternatives(
                subject, plain_text, settings.DEFAULT_FROM_EMAIL, [user.email]
            )
            email_msg.attach_alternative(html_message, "text/html")
            try:
                success = email_msg.send()
                if not success:
                    raise Exception("Email sending failed")
            except Exception:
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response(status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response(status=status.HTTP_200_OK)
