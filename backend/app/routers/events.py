from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.event_schema import (
    EventCreate,
    EventResponse
)

from app.crud.event_crud import (
    create_event,
    get_events
)

router = APIRouter(
    prefix="/events",
    tags=["Events"]
)


@router.post(
    "/",
    response_model=EventResponse
)
def add_event(
    event: EventCreate,
    db: Session = Depends(get_db)
):
    return create_event(
        db,
        event
    )


@router.get(
    "/",
    response_model=list[EventResponse]
)
def read_events(
    db: Session = Depends(get_db)
):
    return get_events(db)