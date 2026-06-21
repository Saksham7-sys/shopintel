from fastapi import FastAPI

from app.database import engine
from app.models import Base
from app.routers import (
    users,
    products,
    orders,
    events
)

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(products.router)
app.include_router(users.router)
app.include_router(orders.router)


@app.get("/")
def home():
    return {"message": "ShopIntel Backend Running"}

app.include_router(
    events.router
)