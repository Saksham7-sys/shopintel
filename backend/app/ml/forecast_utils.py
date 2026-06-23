import pandas as pd
from sqlalchemy import func
from app.database import SessionLocal
from app.models import Order


def get_daily_revenue_dataframe():
    """
    Fetch daily revenue from orders table and return a pandas DataFrame
    with columns: date, revenue
    """
    db = SessionLocal()

    try:
        results = (
            db.query(
                func.date(Order.created_at).label("date"),
                func.sum(Order.total_amount).label("revenue")
            )
            .group_by(func.date(Order.created_at))
            .order_by(func.date(Order.created_at))
            .all()
        )

        data = [
            {
                "date": row[0],
                "revenue": float(row[1]) if row[1] is not None else 0.0
            }
            for row in results
        ]

        df = pd.DataFrame(data)

        if df.empty:
            return pd.DataFrame(columns=["date", "revenue"])

        df["date"] = pd.to_datetime(df["date"])
        df = df.sort_values("date").reset_index(drop=True)

        return df

    finally:
        db.close()