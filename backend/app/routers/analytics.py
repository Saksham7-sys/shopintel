from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.crud.analytics_crud import (
    get_total_revenue,
    get_total_orders,
    get_dau,
    get_conversion_rate
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/revenue")
def revenue(db: Session = Depends(get_db)):
    return {
        "total_revenue": get_total_revenue(db)
    }


@router.get("/orders")
def orders(db: Session = Depends(get_db)):
    return {
        "total_orders": get_total_orders(db)
    }


@router.get("/dau")
def dau(db: Session = Depends(get_db)):
    return {
        "daily_active_users": get_dau(db)
    }


@router.get("/conversion")
def conversion(db: Session = Depends(get_db)):
    return {
        "conversion_rate": get_conversion_rate(db)
    }