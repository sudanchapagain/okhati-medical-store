from typing import Optional

from pydantic import BaseModel


class RegisterUser(BaseModel):
    name: Optional[str]
    email: Optional[str]
    password: Optional[str]
    is_staff: Optional[bool]
    is_active: Optional[bool]


class UpdateUser(BaseModel):
    name: Optional[str]
    email: Optional[str]
    password: Optional[str]
    is_staff: Optional[bool]
    is_active: Optional[bool]
