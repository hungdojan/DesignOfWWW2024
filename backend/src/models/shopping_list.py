from __future__ import annotations

import models.shopping_item as shi
from models.base import Base, BaseManager
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


class ShoppingLists(Base):
    __tablename__ = "ShoppingLists"
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    groupID: Mapped[str] = mapped_column(
        ForeignKey("Groups.ID", ondelete="CASCADE"), nullable=False
    )

    # relationships
    items: Mapped[list[shi.ShoppingItems]] = relationship(cascade="all,delete")

    @staticmethod
    def get_columns():
        return [c.name for c in __class__.__table__.columns]

    @classmethod
    def get_columns_extended(cls):
        return cls.get_columns() + ["items"]

    def serialize(self) -> dict:
        _d = self.as_dict()
        _d.update(**{"items": [i.as_dict() for i in self.items]})
        return _d


class ShoppingListManager(BaseManager[ShoppingLists]):
    pass
