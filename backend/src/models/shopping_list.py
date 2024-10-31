from __future__ import annotations
from typing import Optional
from uuid import uuid4

from models import DB
from models.base import Base, BaseManager
from sqlalchemy import String, and_, delete, select
from sqlalchemy.orm import Mapped, mapped_column

from utils import allowed_columns, preprocess_filter


class ShoppingLists(Base):
    __tablename__ = "ShoppingLists"
    ID: Mapped[str] = mapped_column(String(255), primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)

    @staticmethod
    def get_columns():
        return [c.name for c in __class__.__table__.columns]


class ShoppingListManager(BaseManager[ShoppingLists]):

    @staticmethod
    def query_all() -> list[ShoppingLists]:
        groups = DB.session.execute(select(ShoppingLists)).scalars().all()
        return [g for g in groups]

    @staticmethod
    def query_by_id(_id: str) -> Optional[ShoppingLists]:
        return DB.session.get(ShoppingLists, _id)

    @staticmethod
    def query_by_filter(**_filter) -> list[ShoppingLists]:
        _filt = preprocess_filter(_filter, ShoppingLists)
        groups = DB.session.execute(select(ShoppingLists).where(and_(*_filt))).scalars().all()
        return [g for g in groups]

    @staticmethod
    def insert_one(**args) -> ShoppingLists:
        cols = allowed_columns(args, ShoppingLists)
        cols.pop("ID", None)
        group = ShoppingLists(ID=str(uuid4()), **args)

        DB.session.add(group)
        DB.session.commit()
        return group

    @staticmethod
    def update_one(_id: str, **args) -> Optional[ShoppingLists]:
        group = ShoppingListManager.query_by_id(_id)
        if not group:
            return None
        data = allowed_columns(args, ShoppingLists)
        for k, v in data.items():
            setattr(group, k, v)
        DB.session.commit()
        return group

    @staticmethod
    def delete_by_id(_id: str) -> None:
        DB.session.execute(delete(ShoppingLists).where(ShoppingLists.ID == _id))
        DB.session.commit()

    @staticmethod
    def delete_many(_ids: list[str]) -> None:
        DB.session.execute(delete(ShoppingLists).where(ShoppingLists.ID.in_(_ids)))
        DB.session.commit()
