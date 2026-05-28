from sqlalchemy.orm import Session
from app.models import Order


def create_order(db: Session, order):
    db_order = Order(
        user_id=order.user_id,
        total_amount=order.total_amount
    )

    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    return db_order


def get_orders(db: Session):
    return db.query(Order).all()