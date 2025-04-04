from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

# View to return the authenticated user's details.


class UserDetailsView(APIView):

    def get(self, request):

        access_token = request.COOKIES.get("access_token")
        if not access_token:
            return Response({"error": "Access token missing"}, status=401)

        # Set the Authorization header to the JWT token
        request.META["HTTP_AUTHORIZATION"] = f"Bearer {access_token}"

        user = JWTAuthentication().authenticate(request)

        try:
            # This will check the validity of the token and populate request.user
            user, auth = JWTAuthentication().authenticate(request)

            if not user:
                return Response({"error": "Invalid token"}, status=401)
        except Exception as e:
            return Response({"error": str(e)}, status=401)

        user_data = {
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }

        return Response(user_data, status=status.HTTP_200_OK)
