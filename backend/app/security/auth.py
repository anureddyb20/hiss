"""Authentication utilities: password hashing and JWT handling.

- `hash_password` uses bcrypt via passlib.
- `verify_password` checks a plaintext password against a stored hash.
- `create_access_token` and `create_refresh_token` generate signed JWTs.
- `decode_token` validates and returns the payload.
"""

from datetime import datetime, timedelta
from typing import Any, Dict
from passlib.context import CryptContext
from jose import JWTError, jwt
from ..config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def _create_token(data: Dict[str, Any], expires_delta: timedelta) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return encoded_jwt

def create_access_token(subject: str) -> str:
    return _create_token({"sub": subject}, timedelta(minutes=settings.jwt_access_token_expire_minutes))

def create_refresh_token(subject: str) -> str:
    return _create_token({"sub": subject}, timedelta(days=settings.jwt_refresh_token_expire_days))

def decode_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        return payload
    except JWTError as e:
        raise e
