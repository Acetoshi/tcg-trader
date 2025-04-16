from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.auth_utils.jwt import generate_jwt

User = get_user_model()


class VerifyEmailView(APIView):

    def get(self, request, uidb64, token):
        # TODO : add serializer here
        try:
            # Step 1: Decode the user ID from the URL
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)

            # Step 2: Check if the token is valid
            if default_token_generator.check_token(user, token):
                user.is_active = True  # Activate user account
                user.save()

                # Step 4: Create the response and set JWT token in cookies
                response = Response(
                    {"message": "Email verified and logged in successfully!"},
                    status=status.HTTP_200_OK,
                )

                # Set the access token in HttpOnly cookies
                token = generate_jwt(user)

                response.set_cookie(
                    key="access_token",
                    value=token,
                    httponly=True,
                    secure=not request.get_host().startswith("localhost"),
                    samesite="Strict",
                    max_age=60 * 15,  # 15 minutes
                )

                return response
            else:
                return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
