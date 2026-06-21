from sqlalchemy.orm import Session

from app.models import Event


def create_event(
    db: Session,
    event
):
    db_event = Event(
        user_id=event.user_id,
        event_type=event.event_type,
        event_value=event.event_value
    )

    db.add(db_event)

    db.commit()

    db.refresh(db_event)

    return db_event


def get_events(db: Session):
    return (
        db.query(Event)
        .all()
    )