import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
EXPIRY_MINUTES = settings.EXPIRY_MINUTES


def generate_jwt(user):
    payload = {
        "user_id": str(user.id),
        "exp": datetime.utcnow() + timedelta(minutes=EXPIRY_MINUTES),
        "iat": datetime.utcnow(),
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


# Errors like jwt.ExpiredSignatureError, jwt.InvalidTokenError need to be caught where this is used
def decode_jwt(token):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])


def get_user_from_token(token):
    data = decode_jwt(token)
    if not data:
        return None
    try:
        return User.objects.get(id=data["user_id"])
    except User.DoesNotExist:
        return None
