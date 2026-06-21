from sqlalchemy.orm import Session
from sqlalchemy import func, distinct, case

from app.models import Order, Event


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