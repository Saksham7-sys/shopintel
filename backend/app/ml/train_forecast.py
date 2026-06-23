import os
import joblib
import pandas as pd

from sklearn.linear_model import LinearRegression

from app.ml.forecast_utils import get_daily_revenue_dataframe


MODEL_PATH = "app/ml/revenue_forecast_model.pkl"


def prepare_training_data(df: pd.DataFrame):
    """
    Convert daily revenue dataframe into ML-ready X, y
    X = day index
    y = revenue
    """
    df = df.copy()

    if df.empty:
        return None, None, None

    df["day_index"] = range(len(df))

    X = df[["day_index"]]
    y = df["revenue"]

    return X, y, df


def train_revenue_forecast_model():
    print("Starting revenue forecast training...")

    df = get_daily_revenue_dataframe()

    print("Fetched daily revenue dataframe.")
    print(df.head())

    if df.empty:
        print("No order data found. Cannot train forecast model.")
        return

    X, y, df = prepare_training_data(df)

    if X is None or y is None:
        print("Training data preparation failed.")
        return

    model = LinearRegression()
    model.fit(X, y)

    os.makedirs("app/ml", exist_ok=True)
    joblib.dump(model, MODEL_PATH)

    print("Revenue forecast model trained successfully.")
    print(f"Model saved at: {MODEL_PATH}")
    print(f"Training days used: {len(df)}")

    # preview next 7 days forecast
    future_day_indices = pd.DataFrame({
        "day_index": range(len(df), len(df) + 7)
    })

    predictions = model.predict(future_day_indices)

    print("\nNext 7-day revenue forecast preview:")
    for i, pred in enumerate(predictions, start=1):
        print(f"Day +{i}: {round(float(pred), 2)}")


if __name__ == "__main__":
    train_revenue_forecast_model()