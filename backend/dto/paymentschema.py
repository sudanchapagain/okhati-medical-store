from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class KhaltiPaymentRequest(BaseModel):
    return_url: str
    website_url: str
    amount: int  # paisa
    purchase_order_id: str
    purchase_order_name: str
    customer_info: dict
    product_details: list


class PaymentInitiateRequest(BaseModel):
    amount: int
    customerName: str
    customerEmail: EmailStr
    customerPhone: str
    customerAddress: Optional[str] = None
    productName: str
    productId: Optional[str] = None
    productDescription: Optional[str] = None
    environment: str = Field(default="test")
