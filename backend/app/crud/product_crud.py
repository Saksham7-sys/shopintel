from sqlalchemy.orm import Session
from app.models import Product


def create_product(db: Session, product):
    db_product = Product(
        name=product.name,
        category=product.category,
        price=product.price
    )

    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    return db_product


def get_products(db: Session):
    return db.query(Product).all()