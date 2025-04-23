from datetime import datetime
import jwt
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from modules.accounts.auth_utils.jwt import decode_jwt

User = get_user_model()

SLIDING_REFRESH_THRESHOLD = settings.SLIDING_REFRESH_THRESHOLD


class CookieJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get("access_token")
        if not token:
            return None

        try:

            payload = decode_jwt(token)

            user = User.objects.get(id=payload["user_id"])

            # Check how soon is the token to expire
            exp_timestamp = payload["exp"]
            exp_date = datetime.utcfromtimestamp(exp_timestamp)
            time_to_expiration = exp_date - datetime.utcnow()
            time_to_expiration_minutes = round(time_to_expiration.total_seconds() / 60)

            # Generate a new token if needed
            if time_to_expiration_minutes < SLIDING_REFRESH_THRESHOLD:
                request.new_token_needed = True

        except (User.DoesNotExist, jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return None

        return (user, None)
