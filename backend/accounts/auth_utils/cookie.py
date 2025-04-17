from django.conf import settings


def attach_jwt_cookie(response, jwt_token):
    response.set_cookie(
        key="access_token",
        value=jwt_token,
        httponly=True,
        secure=settings.IS_PRODUCTION,
        samesite="Strict",
        max_age=settings.EXPIRY_MINUTES * 60,
    )
    return response
