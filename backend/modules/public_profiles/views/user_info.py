from rest_framework import status
from rest_framework.response import Response
from modules.accounts.auth_utils.silding_auth_base_view import SlidingAuthBaseView


class UserInfoView(SlidingAuthBaseView):

    def get(self, request, **kwargs):
        target_username = kwargs["target_username"]
        print(target_username)
        return Response(
            {"message": "User info endpoint is not implemented yet."}, status=status.HTTP_200_OK
        )
