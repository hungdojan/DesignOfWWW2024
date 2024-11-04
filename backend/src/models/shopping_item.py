from __future__ import annotations

from models.base import Base, BaseManager
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm.properties import ForeignKey


class ShoppingItems(Base):
    __tablename__ = "ShoppingItems"
    shoppingListID: Mapped[int] = mapped_column(
        ForeignKey("ShoppingLists.ID", ondelete="CASCADE"), nullable=False
    )
    total: Mapped[int] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    completed: Mapped[bool] = mapped_column(default=False)

    @staticmethod
    def get_columns():
        return [c.name for c in __class__.__table__.columns]


class ShoppingItemManager(BaseManager[ShoppingItems]):
    pass
