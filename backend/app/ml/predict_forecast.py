import os
import joblib
import pandas as pd
from datetime import timedelta

from app.ml.forecast_utils import get_daily_revenue_dataframe


MODEL_PATH = "app/ml/revenue_forecast_model.pkl"

"""
Baseline revenue forecasting inference using a trained LinearRegression model
on daily aggregated revenue history.
"""
def predict_revenue_forecast(days: int = 7):
    """
    Load trained revenue forecast model and predict next N days revenue.
    Returns chart-ready forecast list.
    """
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            "Forecast model not found. Train the model first using: python -m app.ml.train_forecast"
        )

    model = joblib.load(MODEL_PATH)

    df = get_daily_revenue_dataframe()
    if df.empty:
        return []

    last_date = df["date"].max()
    history_length = len(df)

    future_day_indices = pd.DataFrame({
        "day_index": range(history_length, history_length + days)
    })

    predictions = model.predict(future_day_indices)

    forecast = []
    for i, pred in enumerate(predictions, start=1):
        forecast_date = last_date + timedelta(days=i)

        forecast.append({
            "date": str(forecast_date.date()),
            "predicted_revenue": round(max(float(pred), 0), 2)
        })

    return forecast