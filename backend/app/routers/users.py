from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.user_schema import UserCreate, UserResponse
from app.crud.user_crud import create_user, get_users

from app.schemas.user_schema import (
    UserCreate,
    UserResponse,
    UserLogin
)

from app.auth import create_access_token

from app.security import verify_password

from app.crud.user_crud import (
    create_user,
    get_users,
    get_user_by_email
)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post("/", response_model=UserResponse)
def add_user(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user)


@router.get("/", response_model=list[UserResponse])
def read_users(db: Session = Depends(get_db)):
    return get_users(db)

@router.post("/login")
def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):

    user = get_user_by_email(
        db,
        credentials.email
    )

    if not user:
        return {
            "error":
            "Invalid credentials"
        }

    if not verify_password(
        credentials.password,
        user.password
    ):
        return {
            "error":
            "Invalid credentials"
        }

    token = create_access_token(
        {
            "sub": str(user.id)
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }