from typing import Optional

from pydantic import BaseModel


class ReviewSchema(BaseModel):
    user_id: int
    name: str
    comment: str
    rating: int


class ProductSchema(BaseModel):
    name: str
    image: Optional[str] = ""
    category: str
    description: str
    price: int
    countInStock: int
    rating: Optional[int] = 0
