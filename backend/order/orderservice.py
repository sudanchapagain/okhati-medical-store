import os
from uuid import uuid4

from fastapi import Depends
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from dto.orderschema import OrderCreatePlaceOrder
from models.ordermodels import OrderItemsModel, OrderModel, ShippingAddressModel


class OrderService:
    def getAll(db: Session):
        orders = db.query(OrderModel).all()
        result = []
        for order in orders:
            items = (
                db.query(OrderItemsModel)
                .filter(OrderItemsModel.order_id == order.id)
                .all()
            )
            order_items = [
                {
                    "id": item.id,
                    "name": item.name,
                    "quantity": item.quantity,
                    "price": item.price,
                }
                for item in items
            ]
            order_data = {
                "id": order.id,
                "name": order.name,
                "email": order.email,
                "orderAmount": order.orderAmount,
                "transactionId": order.transactionId,
                "isDelivered": order.isDelivered,
                "user_id": order.user_id,
                "created_at": order.created_at,
                "updated_at": order.updated_at,
                "order_items": order_items,
            }
            result.append(order_data)
        return jsonable_encoder(result)

    def createOrderPlace(
        request: OrderCreatePlaceOrder, db: Session, transaction_id: str
    ):
        order_create = OrderModel(
            user_id=request.currentUser.id,
            name=request.currentUser.name,
            email=request.currentUser.email,
            orderAmount=request.subtotal,
            transactionId=transaction_id,
        )
        db.add(order_create)
        db.commit()
        db.refresh(order_create)

        shipping_a = ShippingAddressModel(
            address=request.token.card.address_line1,
            city=request.token.card.address_city,
            country=request.token.card.address_country,
            postalCode=request.token.card.address_zip,
            order_id=order_create.id,
        )
        db.add(shipping_a)

        for dic in request.cartItems:
            order_item_a = OrderItemsModel(
                name=dic.name,
                quantity=dic.quantity,
                price=dic.price,
                order_id=order_create.id,
            )
            db.add(order_item_a)
        db.commit()

        return order_create

    def getOrderById(id: int, db: Session):
        order_byid = db.query(OrderModel).filter(OrderModel.id == id).first()

        orderItembyid = (
            db.query(OrderItemsModel)
            .filter(OrderItemsModel.order_id == order_byid.id)
            .all()
        )
        shippingByid = (
            db.query(ShippingAddressModel)
            .filter(ShippingAddressModel.order_id == order_byid.id)
            .first()
        )

        response = {
            "id": order_byid.id,
            "name": order_byid.name,
            "email": order_byid.email,
            "orderAmount": order_byid.orderAmount,
            "transactionId": order_byid.transactionId,
            "isDelivered": order_byid.isDelivered,
            "user_id": order_byid.user_id,
            "created_at": order_byid.created_at,
            "updated_at": order_byid.updated_at,
            "orderItems": jsonable_encoder(orderItembyid),
            "shippingAddress": jsonable_encoder(shippingByid),
        }

        return response

    def getOrderByUserId(userid: int, db: Session):
        order_by_userid = (
            db.query(OrderModel).filter(OrderModel.user_id == userid).all()
        )

        return order_by_userid
