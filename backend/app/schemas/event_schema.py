from pydantic import BaseModel
from datetime import datetime


class EventCreate(BaseModel):
    user_id: int
    event_type: str
    event_value: str


class EventResponse(EventCreate):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True