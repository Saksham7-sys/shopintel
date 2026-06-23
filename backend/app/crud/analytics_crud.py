from datetime import datetime, timedelta, date
from sqlalchemy import func, distinct
from sqlalchemy.orm import Session
from app.ml.predict_forecast import predict_revenue_forecast
from app.models import Order, Event, Product, User

def get_date_range(days: int | None = None, start_date: str | None = None, end_date: str | None = None):
    if start_date and end_date:
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
        end = end + timedelta(days=1)  # include full end date
        return start, end

    if days is not None:
        end = datetime.utcnow()
        start = end - timedelta(days=days)
        return start, end

    return None, None

def get_total_revenue(
    db: Session,
    days: int | None = None,
    start_date: str | None = None,
    end_date: str | None = None
):
    start, end = get_date_range(days, start_date, end_date)

    query = db.query(func.sum(Order.total_amount))

    if start and end:
        query = query.filter(Order.created_at >= start, Order.created_at < end)

    revenue = query.scalar()
    return revenue if revenue else 0

def get_total_orders(
    db: Session,
    days: int | None = None,
    start_date: str | None = None,
    end_date: str | None = None
):
    start, end = get_date_range(days, start_date, end_date)

    query = db.query(func.count(Order.id))

    if start and end:
        query = query.filter(Order.created_at >= start, Order.created_at < end)

    orders = query.scalar()
    return orders if orders else 0

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




def get_revenue_trend(
    db: Session,
    days: int | None = 30,
    start_date: str | None = None,
    end_date: str | None = None
):
    start, end = get_date_range(days, start_date, end_date)

    query = db.query(
        func.date(Order.created_at).label("date"),
        func.sum(Order.total_amount).label("revenue")
    )

    if start and end:
        query = query.filter(Order.created_at >= start, Order.created_at < end)

    results = (
        query.group_by(func.date(Order.created_at))
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

def get_orders_trend(
    db: Session,
    days: int | None = 30,
    start_date: str | None = None,
    end_date: str | None = None
):
    start, end = get_date_range(days, start_date, end_date)

    query = db.query(
        func.date(Order.created_at).label("date"),
        func.count(Order.id).label("orders")
    )

    if start and end:
        query = query.filter(Order.created_at >= start, Order.created_at < end)

    results = (
        query.group_by(func.date(Order.created_at))
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

def get_dau_trend(
    db: Session,
    days: int | None = 30,
    start_date: str | None = None,
    end_date: str | None = None
):
    start, end = get_date_range(days, start_date, end_date)

    query = db.query(
        func.date(Event.timestamp).label("date"),
        func.count(distinct(Event.user_id)).label("dau")
    )

    if start and end:
        query = query.filter(Event.timestamp >= start, Event.timestamp < end)

    results = (
        query.group_by(func.date(Event.timestamp))
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


def get_top_users(
    db: Session,
    limit: int = 10,
    days: int | None = None,
    start_date: str | None = None,
    end_date: str | None = None
):
    start, end = get_date_range(days, start_date, end_date)

    query = (
        db.query(
            User.id.label("user_id"),
            User.name,
            User.email,
            func.sum(Order.total_amount).label("total_spent"),
            func.count(Order.id).label("total_orders")
        )
        .join(Order, Order.user_id == User.id)
    )

    if start and end:
        query = query.filter(Order.created_at >= start, Order.created_at < end)

    results = (
        query.group_by(User.id, User.name, User.email)
        .order_by(func.sum(Order.total_amount).desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "user_id": row.user_id,
            "name": row.name,
            "email": row.email,
            "total_spent": float(row.total_spent) if row.total_spent else 0,
            "total_orders": row.total_orders
        }
        for row in results
    ]

def get_customer_breakdown(
    db: Session,
    days: int | None = None,
    start_date: str | None = None,
    end_date: str | None = None
):
    start, end = get_date_range(days, start_date, end_date)

    query = db.query(Order.user_id, func.count(Order.id).label("order_count"))

    if start and end:
        query = query.filter(Order.created_at >= start, Order.created_at < end)

    user_order_counts = query.group_by(Order.user_id).all()

    total_customers = len(user_order_counts)
    new_customers = sum(1 for row in user_order_counts if row.order_count == 1)
    returning_customers = sum(1 for row in user_order_counts if row.order_count > 1)

    return {
        "total_customers": total_customers,
        "new_customers": new_customers,
        "returning_customers": returning_customers
    }

def get_customer_repeat_rate(
    db: Session,
    days: int | None = None,
    start_date: str | None = None,
    end_date: str | None = None
):
    breakdown = get_customer_breakdown(db, days, start_date, end_date)

    total_customers = breakdown["total_customers"]
    returning_customers = breakdown["returning_customers"]

    repeat_rate = 0
    if total_customers > 0:
        repeat_rate = (returning_customers / total_customers) * 100

    return {
        "total_customers": total_customers,
        "returning_customers": returning_customers,
        "repeat_rate": round(repeat_rate, 2)
    }
def get_revenue_forecast(days: int = 7):
    forecast = predict_revenue_forecast(days)
    return forecast


def get_revenue_forecast_summary(days: int = 7):
    forecast = predict_revenue_forecast(days)

    if not forecast:
        return {
            "forecast_days": days,
            "total_predicted_revenue": 0,
            "average_predicted_revenue": 0,
            "max_predicted_revenue": 0,
            "min_predicted_revenue": 0
        }

    values = [item["predicted_revenue"] for item in forecast]

    return {
        "forecast_days": days,
        "total_predicted_revenue": round(sum(values), 2),
        "average_predicted_revenue": round(sum(values) / len(values), 2),
        "max_predicted_revenue": round(max(values), 2),
        "min_predicted_revenue": round(min(values), 2)
    }