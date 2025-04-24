from django.conf import settings
from modules.accounts.auth_utils.jwt import generate_jwt


def attach_jwt_cookie(response, user):

    access_token = generate_jwt(user)

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=settings.IS_PRODUCTION,
        samesite="Strict",
        max_age=settings.EXPIRY_MINUTES * 60,
    )

    return response
