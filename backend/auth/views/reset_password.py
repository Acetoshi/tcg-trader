from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.models import User
from auth.serializers import ResetPasswordSerializer


class ResetPasswordView(APIView):

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:
            # Make sure the user exists
            encoded_id = serializer.validated_data.get("id")
            id = urlsafe_base64_decode(encoded_id).decode()

            user = User.objects.get(pk=id)

            # Check if the token is valid
            token = serializer.validated_data.get("token")

            if not default_token_generator.check_token(user, token):
                return Response(status=status.HTTP_401_UNAUTHORIZED)

            # Set the new password
            new_password = request.data.get("password")
            print(user.password)
            user.set_password(new_password)
            user.is_active = True  # Activate user account if never accessed, considering password reset is an email verification
            user.save()

            return Response(status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response(status=status.HTTP_200_OK)
