from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.models import Base
from app.routers import (
    users,
    products,
    orders,
    events,
    analytics
)

app = FastAPI(
    title="ShopIntel API"
)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # local frontend
        "http://127.0.0.1:5173",   # local frontend alt
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(users.router)
app.include_router(orders.router)
app.include_router(analytics.router)
app.include_router(events.router)

@app.get("/")
def home():
    return {"message": "ShopIntel Backend Running"}