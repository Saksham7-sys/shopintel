from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.crud.analytics_crud import (
    get_total_revenue,
    get_total_orders,
    get_dau,
    get_conversion_rate,
    get_average_order_value,
    get_repeat_customers,
    get_top_products,
    get_sales_by_category,
    get_revenue_trend,
    get_orders_trend,
    get_dau_trend,
    get_funnel_summary,
    get_category_revenue_trend
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

@router.get("/aov")
def average_order_value(db: Session = Depends(get_db)):
    return {
        "average_order_value": get_average_order_value(db)
    }


@router.get("/repeat-customers")
def repeat_customers(db: Session = Depends(get_db)):
    return {
        "repeat_customers": get_repeat_customers(db)
    }


@router.get("/top-products")
def top_products(db: Session = Depends(get_db)):
    return {
        "top_products": get_top_products(db)
    }


@router.get("/sales-by-category")
def sales_by_category(db: Session = Depends(get_db)):
    return {
        "sales_by_category": get_sales_by_category(db)
    }

@router.get("/revenue-trend")
def revenue_trend(days: int = 30, db: Session = Depends(get_db)):
    return {"revenue_trend": get_revenue_trend(db, days)}


@router.get("/orders-trend")
def orders_trend(days: int = 30, db: Session = Depends(get_db)):
    return {"orders_trend": get_orders_trend(db, days)}


@router.get("/dau-trend")
def dau_trend(days: int = 30, db: Session = Depends(get_db)):
    return {"dau_trend": get_dau_trend(db, days)}


@router.get("/funnel")
def funnel(db: Session = Depends(get_db)):
    return {"funnel": get_funnel_summary(db)}


@router.get("/category-revenue-trend")
def category_revenue_trend(days: int = 30, db: Session = Depends(get_db)):
    return {
        "category_revenue_trend": get_category_revenue_trend(db, days)
    }