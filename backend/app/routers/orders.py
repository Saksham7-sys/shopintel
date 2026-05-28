from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.order_schema import OrderCreate, OrderResponse
from app.crud.order_crud import create_order, get_orders

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


@router.post("/", response_model=OrderResponse)
def add_order(order: OrderCreate, db: Session = Depends(get_db)):
    return create_order(db, order)


@router.get("/", response_model=list[OrderResponse])
def read_orders(db: Session = Depends(get_db)):
    return get_orders(db)