from __future__ import annotations
from typing import Optional
from uuid import uuid4

from models import DB
from models.base import Base, BaseManager
from models.shopping_list import ShoppingLists
from sqlalchemy import String, and_, delete, select
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm.properties import ForeignKey

from utils import allowed_columns, preprocess_filter


class ShoppingItems(Base):
    __tablename__ = "ShoppingItems"
    ID: Mapped[str] = mapped_column(String(255), primary_key=True)
    shoppingListID: Mapped[int] = mapped_column(
        ForeignKey(ShoppingLists.ID, ondelete="CASCADE"), nullable=False
    )
    total: Mapped[int] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    completed: Mapped[bool] = mapped_column(default=False)

    @staticmethod
    def get_columns():
        return [c.name for c in __class__.__table__.columns]


class ShoppingItemManager(BaseManager[ShoppingItems]):

    @staticmethod
    def query_all() -> list[ShoppingItems]:
        groups = DB.session.execute(select(ShoppingItems)).scalars().all()
        return [g for g in groups]

    @staticmethod
    def query_by_id(_id: str) -> Optional[ShoppingItems]:
        return DB.session.get(ShoppingItems, _id)

    @staticmethod
    def query_by_filter(**_filter) -> list[ShoppingItems]:
        _filt = preprocess_filter(_filter, ShoppingItems)
        groups = DB.session.execute(select(ShoppingItems).where(and_(*_filt))).scalars().all()
        return [g for g in groups]

    @staticmethod
    def insert_one(**args) -> ShoppingItems:
        cols = allowed_columns(args, ShoppingItems)
        cols.pop("ID", None)
        group = ShoppingItems(ID=str(uuid4()), **args)

        DB.session.add(group)
        DB.session.commit()
        return group

    @staticmethod
    def update_one(_id: str, **args) -> Optional[ShoppingItems]:
        group = ShoppingItemManager.query_by_id(_id)
        if not group:
            return None
        data = allowed_columns(args, ShoppingItems)
        for k, v in data.items():
            setattr(group, k, v)
        DB.session.commit()
        return group

    @staticmethod
    def delete_by_id(_id: str) -> None:
        DB.session.execute(delete(ShoppingItems).where(ShoppingItems.ID == _id))
        DB.session.commit()

    @staticmethod
    def delete_many(_ids: list[str]) -> None:
        DB.session.execute(delete(ShoppingItems).where(ShoppingItems.ID.in_(_ids)))
        DB.session.commit()
