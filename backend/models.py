from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    is_active = Column(Boolean, default=True)
    dietary_restrictions = Column(String)  # JSON string com restrições
    preferences = Column(String)  # JSON string com preferências

    orders = relationship("Order", back_populates="user")

class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    nutritional_info = Column(String)  # JSON string com informações nutricionais
    ingredients = Column(String)  # JSON string com ingredientes
    image_url = Column(String)
    is_available = Column(Boolean, default=True)

    order_items = relationship("OrderItem", back_populates="meal")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String)  # pending, preparing, delivering, delivered
    total_price = Column(Float)
    delivery_address = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    payment_method = Column(String)  # pix, credit_card, etc
    payment_status = Column(String)  # pending, paid, failed

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    meal_id = Column(Integer, ForeignKey("meals.id"))
    quantity = Column(Integer)
    price = Column(Float)
    customization = Column(String)  # JSON string com personalizações

    order = relationship("Order", back_populates="items")
    meal = relationship("Meal", back_populates="order_items") 