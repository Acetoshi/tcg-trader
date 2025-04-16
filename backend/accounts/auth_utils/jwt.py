import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
EXPIRY_MINUTES = settings.EXPIRY_MINUTES
SLIDING_REFRESH_THRESHOLD = settings.SLIDING_REFRESH_THRESHOLD


def generate_jwt(user):
    payload = {
        "user_id": str(user.id),
        "exp": datetime.utcnow() + timedelta(minutes=EXPIRY_MINUTES),
        "iat": datetime.utcnow(),
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


def decode_jwt(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def get_user_from_token(token):
    data = decode_jwt(token)
    if not data:
        return None
    try:
        return User.objects.get(id=data["user_id"])
    except User.DoesNotExist:
        return None
