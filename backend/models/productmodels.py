from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey

from config.database import Base

from .reviewmodels import ReviewModel


class ProductModel(Base):
    __tablename__ = "product"

    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    image = Column(String(200), nullable=True, default="")
    category = Column(String(25), nullable=False)
    description = Column(String(1024), nullable=False, default="")
    price = Column(Integer, nullable=False)
    countInStock = Column(Integer, nullable=False, default=0)
    rating = Column(Integer, nullable=True, default=0)

    reviews_user = relationship("ReviewModel", back_populates="product")
