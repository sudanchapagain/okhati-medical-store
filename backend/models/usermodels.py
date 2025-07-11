from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship

from config.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    is_staff = Column(Boolean, default=False)
    is_active = Column(Boolean, default=False)

    reviews = relationship("ReviewModel", back_populates="user")

    def __repr__(self):
        return f"<User {self.email}"
