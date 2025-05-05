from rest_framework import status
from rest_framework.response import Response
from modules.accounts.auth_utils.silding_auth_base_view import SlidingAuthBaseView
from modules.public_profiles.serializers.read_user_info import ReadUserInfo


class UserInfoView(SlidingAuthBaseView):

    def get(self, request, **kwargs):
        target_username = kwargs["target_username"]
        serializer = ReadUserInfo(data={"username": target_username})

        if not serializer.is_valid():
            return Response(
                {"message": "User info not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        user_info = serializer.read_user_info()
        return Response(user_info, status=status.HTTP_200_OK)
