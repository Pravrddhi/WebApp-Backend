from django.utils import timezone
import logging

import jwt

from config import settings


logger = logging.getLogger(__name__)


def jwt_generator(user, device_info, token_type="normal"):
    algorithm = settings.JWT_ALGORITHM
    normal_secret = settings.JWT_SECRET
    refresh_secret = settings.JWT_SECRET_REFRESH
    time_created = str(timezone.now())

    if token_type == "normal":
        generated_jwt = jwt.encode(
            {
                "device_info": device_info.id,
                "time_created": time_created,
                "user_id": user.id,
                "exp": timezone.now() + timezone.timedelta(hours=6),
            },
            normal_secret,
            algorithm=algorithm,
        )
        payload = {
            "token": generated_jwt,
            "user_id": user.id,
            "time_created": time_created,
            "token_expires_at": timezone.now() + timezone.timedelta(hours=6),
        }

    else:
        refresh_jwt = jwt.encode(
            {
                "device_info": device_info.id,
                "time_created": time_created,
                "user_id": user.id,
                "exp": timezone.now() + timezone.timedelta(days=7),
            },
            refresh_secret,
            algorithm=algorithm,
        )
        payload = {
            "refresh_token": refresh_jwt,
            "user_id": user.id,
            "time_created": time_created,
            "refresh_token_expires_at": timezone.now() + timezone.timedelta(days=7),
        }
        try:
            JWT.objects.filter(user=user, device=device_info).delete()
        except JWT.DoesNotExist:
            pass

        JWT.objects.create(
            user=user,
            device=device_info,
            token=refresh_jwt,
            expires_at=timezone.now() + timezone.timedelta(days=7),
            type=JWTTokenChoice.REFRESH,
        )
    user.save()

    return payload

def jwt_decoder(token, token_type="normal"):
    secret = (
        settings.JWT_SECRET if token_type == "normal" else settings.JWT_SECRET_REFRESH
    )
    try:
        source = jwt.decode(jwt=token, key=secret, algorithms=settings.JWT_ALGORITHM)
        return source
    except Exception as e:
        raise e