from datetime import datetime, timedelta
from sqlalchemy import func, distinct
from sqlalchemy.orm import Session

from app.models import Order, Event, Product


def get_total_revenue(db: Session):
    revenue = db.query(func.sum(Order.total_amount)).scalar()
    return revenue if revenue is not None else 0


def get_total_orders(db: Session):
    orders = db.query(func.count(Order.id)).scalar()
    return orders if orders is not None else 0


def get_dau(db: Session):
    active_users = db.query(
        func.count(distinct(Event.user_id))
    ).scalar()
    return active_users if active_users is not None else 0


def get_conversion_rate(db: Session):
    total_visitors = db.query(
        func.count(distinct(Event.user_id))
    ).filter(
        Event.event_type == "page_view"
    ).scalar()

    purchasing_users = db.query(
        func.count(distinct(Event.user_id))
    ).filter(
        Event.event_type == "purchase"
    ).scalar()

    total_visitors = total_visitors if total_visitors is not None else 0
    purchasing_users = purchasing_users if purchasing_users is not None else 0

    if total_visitors == 0:
        return 0

    return round((purchasing_users / total_visitors) * 100, 2)

def get_average_order_value(db: Session):
    total_revenue = db.query(func.sum(Order.total_amount)).scalar()
    total_orders = db.query(func.count(Order.id)).scalar()

    total_revenue = total_revenue if total_revenue is not None else 0
    total_orders = total_orders if total_orders is not None else 0

    if total_orders == 0:
        return 0

    return round(total_revenue / total_orders, 2)


def get_repeat_customers(db: Session):
    repeat_customers = (
        db.query(Order.user_id)
        .group_by(Order.user_id)
        .having(func.count(Order.id) > 1)
        .count()
    )
    return repeat_customers


def get_top_products(db: Session):
    results = (
        db.query(
            Product.name,
            func.count(Order.id).label("total_orders"),
            func.sum(Order.total_amount).label("revenue")
        )
        .join(Product, Order.product_id == Product.id)
        .group_by(Product.name)
        .order_by(func.count(Order.id).desc())
        .all()
    )

    return [
        {
            "product_name": row[0],
            "total_orders": row[1],
            "revenue": float(row[2]) if row[2] is not None else 0
        }
        for row in results
    ]


def get_sales_by_category(db: Session):
    results = (
        db.query(
            Product.category,
            func.count(Order.id).label("total_orders"),
            func.sum(Order.total_amount).label("revenue")
        )
        .join(Product, Order.product_id == Product.id)
        .group_by(Product.category)
        .order_by(func.sum(Order.total_amount).desc())
        .all()
    )

    return [
        {
            "category": row[0],
            "total_orders": row[1],
            "revenue": float(row[2]) if row[2] is not None else 0
        }
        for row in results
    ]




def get_revenue_trend(db: Session, days: int = 30):
    start_date = datetime.utcnow() - timedelta(days=days)

    results = (
        db.query(
            func.date(Order.created_at).label("date"),
            func.sum(Order.total_amount).label("revenue")
        )
        .filter(Order.created_at >= start_date)
        .group_by(func.date(Order.created_at))
        .order_by(func.date(Order.created_at))
        .all()
    )

    return [
        {
            "date": str(row[0]),
            "revenue": float(row[1]) if row[1] is not None else 0
        }
        for row in results
    ]


def get_orders_trend(db: Session, days: int = 30):
    start_date = datetime.utcnow() - timedelta(days=days)

    results = (
        db.query(
            func.date(Order.created_at).label("date"),
            func.count(Order.id).label("orders")
        )
        .filter(Order.created_at >= start_date)
        .group_by(func.date(Order.created_at))
        .order_by(func.date(Order.created_at))
        .all()
    )

    return [
        {
            "date": str(row[0]),
            "orders": row[1]
        }
        for row in results
    ]


def get_dau_trend(db: Session, days: int = 30):
    start_date = datetime.utcnow() - timedelta(days=days)

    results = (
        db.query(
            func.date(Event.timestamp).label("date"),
            func.count(distinct(Event.user_id)).label("dau")
        )
        .filter(Event.timestamp >= start_date)
        .group_by(func.date(Event.timestamp))
        .order_by(func.date(Event.timestamp))
        .all()
    )

    return [
        {
            "date": str(row[0]),
            "dau": row[1]
        }
        for row in results
    ]


def get_funnel_summary(db: Session):
    page_view_users = (
        db.query(func.count(distinct(Event.user_id)))
        .filter(Event.event_type == "page_view")
        .scalar()
    ) or 0

    product_view_users = (
        db.query(func.count(distinct(Event.user_id)))
        .filter(Event.event_type == "product_view")
        .scalar()
    ) or 0

    add_to_cart_users = (
        db.query(func.count(distinct(Event.user_id)))
        .filter(Event.event_type == "add_to_cart")
        .scalar()
    ) or 0

    purchase_users = (
        db.query(func.count(distinct(Event.user_id)))
        .filter(Event.event_type == "purchase")
        .scalar()
    ) or 0

    return {
        "page_view_users": page_view_users,
        "product_view_users": product_view_users,
        "add_to_cart_users": add_to_cart_users,
        "purchase_users": purchase_users
    }


def get_category_revenue_trend(db: Session, days: int = 30):
    start_date = datetime.utcnow() - timedelta(days=days)

    results = (
        db.query(
            func.date(Order.created_at).label("date"),
            Product.category.label("category"),
            func.sum(Order.total_amount).label("revenue")
        )
        .join(Product, Order.product_id == Product.id)
        .filter(Order.created_at >= start_date)
        .group_by(func.date(Order.created_at), Product.category)
        .order_by(func.date(Order.created_at), Product.category)
        .all()
    )

    return [
        {
            "date": str(row[0]),
            "category": row[1],
            "revenue": float(row[2]) if row[2] is not None else 0
        }
        for row in results
    ]