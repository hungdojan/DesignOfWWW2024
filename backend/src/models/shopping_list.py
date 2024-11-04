from __future__ import annotations

from models.base import Base, BaseManager
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column


class ShoppingLists(Base):
    __tablename__ = "ShoppingLists"
    name: Mapped[str] = mapped_column(String(100), nullable=False)

    @staticmethod
    def get_columns():
        return [c.name for c in __class__.__table__.columns]


class ShoppingListManager(BaseManager[ShoppingLists]):
    pass
