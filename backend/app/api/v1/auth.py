"""Authentication endpoints.

- POST /login – validates credentials and returns JWT access/refresh tokens.
- (Future) POST /refresh – exchange refresh token for new access token.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from ..dependencies import get_async_session
from ...crud import user as user_crud
from ...schemas.auth import TokenResponse, LoginInput
from ...security.auth import create_access_token, create_refresh_token

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginInput, db: AsyncSession = Depends(get_async_session)):
    user = await user_crud.authenticate_user(db, data.email, data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access = create_access_token(subject=user.email)
    refresh = create_refresh_token(subject=user.email)
    return TokenResponse(access_token=access, refresh_token=refresh)
