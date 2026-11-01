"""FastAPI dependencies for authentication and authorization.

- `get_current_user` extracts and validates JWT, returning the DB user.
- `require_role` creates a dependency that raises 403 if the user lacks the required role.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from ..security.auth import decode_token
from ..crud.user import get_user_by_email
from ..db.session import get_async_session
from ..models.user import User, RoleName

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_async_session)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(token)
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await get_user_by_email(db, email)
    if user is None:
        raise credentials_exception
    return user

def require_role(required_role: RoleName):
    async def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role.name != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return current_user
    return role_checker
