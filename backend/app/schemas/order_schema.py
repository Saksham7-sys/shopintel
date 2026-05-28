from pydantic import BaseModel
from datetime import datetime


class OrderCreate(BaseModel):
    user_id: int
    total_amount: float


class OrderResponse(OrderCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True