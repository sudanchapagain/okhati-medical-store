import os
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from config.database import get_db
from dto.orderschema import OrderCreatePlaceOrder
from order.orderservice import OrderService
from payment.khalti_service import KhaltiService

router = APIRouter()


@router.post("/initiate")
def initiate_payment(payload: OrderCreatePlaceOrder, db: Session = Depends(get_db)):
    try:
        purchase_order_id = f"order_{uuid.uuid4()}"
        cart_items = payload.cartItems
        user = payload.currentUser
        khalti_payload = {
            "return_url": os.getenv("BASE_URL") + "/payment-status",
            "website_url": os.getenv("BASE_URL"),
            "amount": payload.subtotal * 100,
            "purchase_order_id": purchase_order_id,
            "purchase_order_name": ", ".join([item.name for item in cart_items]),
            "customer_info": {
                "name": user.name,
                "email": user.email,
                "phone": payload.token.email,
            },
            "product_details": [
                {
                    "identity": purchase_order_id,
                    "name": item.name,
                    "total_price": item.price * item.quantity,
                    "quantity": item.quantity,
                    "unit_price": item.price,
                }
                for item in cart_items
            ],
        }
        khalti_res = KhaltiService.initiate_payment(khalti_payload)

        order = OrderService.createOrderPlace(
            request=payload, db=db, transaction_id=khalti_res["pidx"]
        )

        return {
            "success": True,
            "payment_url": khalti_res["payment_url"],
            "pidx": khalti_res["pidx"],
            "order_id": order.id,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
