from fastapi import Depends
from sqlalchemy.orm import Session

from config.database import get_db
from config.hashing import Hashing
from dto.userschema import RegisterUser, UpdateUser
from models.usermodels import User


class UserService:
    def get_allUser(db: Session):
        return db.query(User).all()

    def get_user(email: str, db: Session = Depends(get_db)):
        return db.query(User).filter(User.email == email).first()

    def create_user(user: RegisterUser, db: Session = Depends(get_db)):
        db_user = User(
            name=user.name,
            email=user.email,
            password=Hashing.bcrypt(user.password),
            is_staff=user.is_staff,
            is_active=user.is_active,
        )

        db.add(db_user)
        db.commit()

        db.refresh(db_user)
        db_user.password = None

        return db_user

    def update_user(userid: int, user: UpdateUser, db: Session):
        db_userid = db.query(User).filter(User.id == userid).first()

        if user.name is not None:
            db_userid.name = user.name
        if user.email is not None:
            db_userid.email = user.email
        if user.password is not None:
            db_userid.password = Hashing.bcrypt(user.password)
        if user.is_staff is not None:
            db_userid.is_staff = user.is_staff
        if user.is_active is not None:
            db_userid.is_active = user.is_active

        db.commit()
        db.refresh(db_userid)
        return db_userid

    def deleteUser(userid: int, db: Session):
        db_userid = db.query(User).filter(User.id == userid).first()

        db.delete(db_userid)

        db.commit()

        return db_userid
