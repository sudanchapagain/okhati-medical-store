from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm.session import Session

from config.database import get_db
from config.token import get_currentUser
from dto.orderschema import OrderCreatePlaceOrder

from .orderservice import OrderService

router = APIRouter(prefix="/order", tags=["Order"])


@router.get("/")
def getAll(db: Session = Depends(get_db), current_user=Depends(get_currentUser)):
    if not current_user.is_staff:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin privileges required.",
        )
    return OrderService.getAll(db=db)


@router.get("/orderbyuser/{userid}/")
def orderByUser(
    userid: int, db: Session = Depends(get_db), current_user=Depends(get_currentUser)
):
    if not current_user.is_staff and current_user.id != userid:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. You can only view your own orders.",
        )
    return OrderService.getOrderByUserId(userid=userid, db=db)


@router.get("/orderbyid/{id}/")
def orderById(
    id: int, db: Session = Depends(get_db), current_user=Depends(get_currentUser)
):
    order = OrderService.getOrderById(id=id, db=db)

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )

    if not current_user.is_staff and order.get("user_id") != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. You can only view your own orders.",
        )

    return order


@router.get("/export-csv")
def export_csv(db: Session = Depends(get_db), current_user=Depends(get_currentUser)):
    if not current_user.is_staff:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin privileges required.",
        )

    orders = OrderService.getAll(db=db)

    csv_data = "OrderID,Product,Quantity,Price,Name,Email,TransactionId,UserId,Id,IsDelivered\n"
    for order in orders:
        csv_data += f"{order.id},{order.name},{order.orderAmount},{order.price},"
        csv_data += f"{order.name},{order.email},{order.transactionId},{order.user_id},{order.id},{order.isDelivered}\n"

    response = StreamingResponse(content=iter([csv_data]), media_type="text/csv")
    response.headers["Content-Disposition"] = 'attachment; filename="orders.csv"'

    return response
