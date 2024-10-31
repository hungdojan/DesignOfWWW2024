from __future__ import annotations

from typing import Optional
from uuid import uuid4

from models import DB
from models.base import Base, BaseManager
from models.relationship_tables import UsersGroupsTBL
from sqlalchemy import String, and_, delete, select
from sqlalchemy.orm import Mapped, mapped_column
from utils import allowed_columns, preprocess_filter


class Groups(Base):
    __tablename__ = "Groups"
    ID: Mapped[str] = mapped_column(String(255), primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)

    users = DB.relationship(
        "Users", secondary=UsersGroupsTBL, backref="Groups", viewonly=True
    )

    @staticmethod
    def get_columns():
        return [c.name for c in __class__.__table__.columns]


class GroupManager(BaseManager[Groups]):

    @staticmethod
    def query_all() -> list[Groups]:
        groups = DB.session.execute(select(Groups)).scalars().all()
        return [g for g in groups]

    @staticmethod
    def query_by_id(_id: str) -> Optional[Groups]:
        return DB.session.get(Groups, _id)

    @staticmethod
    def query_by_filter(**_filter) -> list[Groups]:
        _filt = preprocess_filter(_filter, Groups)
        groups = DB.session.execute(select(Groups).where(and_(*_filt))).scalars().all()
        return [g for g in groups]

    @staticmethod
    def insert_one(**args) -> Groups:
        cols = allowed_columns(args, Groups)
        cols.pop("ID", None)
        group = Groups(ID=str(uuid4()), **args)

        DB.session.add(group)
        DB.session.commit()
        return group

    @staticmethod
    def update_one(_id: str, **args) -> Optional[Groups]:
        group = GroupManager.query_by_id(_id)
        if not group:
            return None
        data = allowed_columns(args, Groups)
        for k, v in data.items():
            setattr(group, k, v)
        DB.session.commit()
        return group

    @staticmethod
    def delete_by_id(_id: str) -> None:
        DB.session.execute(delete(Groups).where(Groups.ID == _id))
        DB.session.commit()

    @staticmethod
    def delete_many(_ids: list[str]) -> None:
        DB.session.execute(delete(Groups).where(Groups.ID.in_(_ids)))
        DB.session.commit()
