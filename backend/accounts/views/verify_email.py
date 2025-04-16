from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny

User = get_user_model()


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

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

                # Step 3: Generate JWT token
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)

                # Step 4: Create the response and set JWT token in cookies
                response = Response(
                    {"message": "Email verified and logged in successfully!"},
                    status=status.HTTP_200_OK,
                )

                # Set the access token in HttpOnly cookies
                response.set_cookie(
                    key="access_token",
                    value=access_token,
                    httponly=True,
                    secure=True,  # Set to True in production
                    samesite="Strict",
                    max_age=60 * 60 * 24 * 7,  # 7 days
                )

                return response
            else:
                return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
