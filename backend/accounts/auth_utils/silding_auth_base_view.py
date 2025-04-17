from rest_framework.views import APIView
from accounts.auth_utils.cookie import attach_jwt_cookie


class SlidingAuthBaseView(APIView):
    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)

        if hasattr(request, "new_access_token"):
            attach_jwt_cookie(response, request.new_access_token)

        return response
