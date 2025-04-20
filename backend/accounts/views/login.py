from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.auth_utils.cookie import attach_jwt_cookie

User = get_user_model()


class LoginView(APIView):
    def post(self, request):

        try:
            identifier = request.data.get("identifier")
            password = request.data.get("password")

            if not identifier or not password:
                return Response(
                    {"detail": "Missing credentials"}, status=status.HTTP_400_BAD_REQUEST
                )

            target_user = (
                User.objects.filter(email=identifier).first()
                or User.objects.filter(username=identifier).first()
            )

            if not target_user:
                raise InvalidCredentials()

            authenticated_user = authenticate(
                request, username=target_user.username, password=password
            )

            if not authenticated_user:
                raise InvalidCredentials()

            # Auth successful
            response = Response({"detail": "Login successful"}, status=status.HTTP_200_OK)

            attach_jwt_cookie(response, authenticated_user)

            return response

        except InvalidCredentials:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class InvalidCredentials(Exception):
    pass
