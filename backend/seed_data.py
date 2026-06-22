from random import choice, randint, uniform, random
from datetime import datetime, timedelta

from faker import Faker
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import User, Product, Order, Event

fake = Faker()


# -----------------------------
# CONFIG
# -----------------------------
NUM_USERS = 1000
NUM_PRODUCTS = 50
NUM_ORDERS = 5000
NUM_EVENTS = 25000

PRODUCT_CATEGORIES = {
    "Electronics": [
        ("iPhone 15", 79999),
        ("Samsung Galaxy S24", 74999),
        ("OnePlus 12", 64999),
        ("MacBook Air M2", 99999),
        ("Dell XPS 13", 89999),
        ("Sony Headphones", 12999),
        ("Boat Earbuds", 2999),
        ("Smart Watch Pro", 8999),
        ("Gaming Mouse", 2499),
        ("Mechanical Keyboard", 4999),
    ],
    "Fashion": [
        ("Men T-Shirt", 799),
        ("Women Kurti", 1499),
        ("Jeans", 1999),
        ("Sneakers", 2999),
        ("Jacket", 3499),
        ("Formal Shirt", 1799),
        ("Summer Dress", 2299),
        ("Hoodie", 2499),
        ("Running Shoes", 3999),
        ("Cap", 499),
    ],
    "Home": [
        ("Mixer Grinder", 3499),
        ("Cookware Set", 4999),
        ("Bedsheet Set", 1499),
        ("Office Chair", 6999),
        ("Study Table", 8999),
        ("Lamp", 999),
        ("Vacuum Cleaner", 7999),
        ("Air Fryer", 5999),
        ("Water Bottle", 599),
        ("Wall Clock", 899),
    ],
    "Beauty": [
        ("Face Wash", 299),
        ("Moisturizer", 499),
        ("Perfume", 1499),
        ("Lipstick", 799),
        ("Shampoo", 399),
        ("Sunscreen", 599),
        ("Body Lotion", 449),
        ("Hair Serum", 699),
        ("Beard Kit", 999),
        ("Makeup Kit", 2499),
    ],
    "Sports": [
        ("Cricket Bat", 2999),
        ("Football", 999),
        ("Yoga Mat", 1499),
        ("Dumbbell Set", 3999),
        ("Skipping Rope", 399),
        ("Badminton Racket", 1999),
        ("Tennis Ball Pack", 499),
        ("Gym Gloves", 699),
        ("Protein Shaker", 349),
        ("Cycling Helmet", 2499),
    ]
}


# -----------------------------
# HELPERS
# -----------------------------
def random_datetime_within_last_n_days(days=90):
    now = datetime.utcnow()
    random_days = randint(0, days - 1)
    random_seconds = randint(0, 86399)
    return now - timedelta(days=random_days, seconds=random_seconds)


def clear_tables(db: Session):
    print("Deleting old data...")

    db.query(Event).delete()
    db.query(Order).delete()
    db.query(Product).delete()
    db.query(User).delete()

    db.commit()
    print("Old data deleted.")


def seed_users(db: Session):
    print("Seeding users...")

    users = []
    for i in range(NUM_USERS):
        user = User(
            name=fake.name(),
            email=f"user{i+1}@example.com",
            password="seed123"
        )
        users.append(user)

    db.bulk_save_objects(users)
    db.commit()

    print(f"{NUM_USERS} users inserted.")


def seed_products(db: Session):
    print("Seeding products...")

    products = []

    for category, items in PRODUCT_CATEGORIES.items():
        for name, price in items:
            product = Product(
                name=name,
                category=category,
                price=float(price)
            )
            products.append(product)

    db.bulk_save_objects(products)
    db.commit()

    print(f"{len(products)} products inserted.")


def seed_orders(db: Session):
    print("Seeding orders...")

    users = db.query(User).all()
    products = db.query(Product).all()

    orders = []

    for _ in range(NUM_ORDERS):
        user = choice(users)
        product = choice(products)

        order = Order(
            user_id=user.id,
            product_id=product.id,
            total_amount=float(product.price),
            created_at=random_datetime_within_last_n_days(90)
        )
        orders.append(order)

    db.bulk_save_objects(orders)
    db.commit()

    print(f"{NUM_ORDERS} orders inserted.")


def seed_events(db: Session):
    print("Seeding events...")

    users = db.query(User).all()
    products = db.query(Product).all()

    event_types = ["page_view", "product_view", "add_to_cart", "purchase"]
    weights = [0.45, 0.30, 0.15, 0.10]

    events = []

    for _ in range(NUM_EVENTS):
        user = choice(users)
        product = choice(products)

        # weighted event type selection
        r = random()
        cumulative = 0
        selected_event = "page_view"

        for event_type, weight in zip(event_types, weights):
            cumulative += weight
            if r <= cumulative:
                selected_event = event_type
                break

        event = Event(
            user_id=user.id,
            event_type=selected_event,
            event_value=product.name,
            timestamp=random_datetime_within_last_n_days(90)
        )
        events.append(event)

    db.bulk_save_objects(events)
    db.commit()

    print(f"{NUM_EVENTS} events inserted.")


def main():
    db = SessionLocal()
    try:
        clear_tables(db)
        seed_users(db)
        seed_products(db)
        seed_orders(db)
        seed_events(db)

        print("Seeding completed successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    main()