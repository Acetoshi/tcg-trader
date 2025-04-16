from rest_framework.authentication import BaseAuthentication
from accounts.auth_utils.jwt import get_user_from_token
from django.contrib.auth import get_user_model

User = get_user_model()


class CookieJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get("access_token")
        if not token:
            return None

        try:
            user = get_user_from_token(token)

        except User.DoesNotExist:
            return None

        return (user, None)
