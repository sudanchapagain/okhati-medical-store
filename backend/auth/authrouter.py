from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from config.database import get_db
from config.hashing import Hashing
from config.token import create_access_token
from models.usermodels import User

router = APIRouter(tags=["Authentication"])


@router.post("/login/")
def login(
    request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == request.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Invalid Credentials"
        )
    if not Hashing.verify(user.password, request.password):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Incorrect password"
        )

    access_token = create_access_token(data={"sub": user.email})

    response = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "is_staff": user.is_staff,
        "is_active": user.is_active,
        "jwtToken": access_token,
    }

    return response
