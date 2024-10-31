from __future__ import annotations

import enum
from typing import Optional
from uuid import uuid4

from models import DB
from models.base import Base, BaseManager
from models.relationship_tables import Favorite, UsersGroupsTBL
from sqlalchemy import Enum, String, and_, delete, select
from sqlalchemy.orm import Mapped, mapped_column

from utils import allowed_columns, preprocess_filter


class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    USER = "USER"


class Users(Base):
    __tablename__ = "Users"
    ID: Mapped[str] = mapped_column(String(255), primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), nullable=False)
    name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # relationships
    groups = DB.relationship("Users", secondary=UsersGroupsTBL, viewonly=True)
    favorites = DB.relationship("Recipes", secondary=Favorite, viewonly=True)

    @staticmethod
    def get_columns():
        return [c.name for c in __class__.__table__.columns]


class UserManager(BaseManager[Users]):

    @staticmethod
    def query_all() -> list[Users]:
        groups = DB.session.execute(select(Users)).scalars().all()
        return [g for g in groups]

    @staticmethod
    def query_by_id(_id: str) -> Optional[Users]:
        return DB.session.get(Users, _id)

    @staticmethod
    def query_by_filter(**_filter) -> list[Users]:
        _filt = preprocess_filter(_filter, Users)
        groups = DB.session.execute(select(Users).where(and_(*_filt))).scalars().all()
        return [g for g in groups]

    @staticmethod
    def insert_one(**args) -> Users:
        cols = allowed_columns(args, Users)
        cols.pop("ID", None)
        group = Users(ID=str(uuid4()), **args)

        DB.session.add(group)
        DB.session.commit()
        return group

    @staticmethod
    def update_one(_id: str, **args) -> Optional[Users]:
        group = UserManager.query_by_id(_id)
        if not group:
            return None
        data = allowed_columns(args, Users)
        for k, v in data.items():
            setattr(group, k, v)
        DB.session.commit()
        return group

    @staticmethod
    def delete_by_id(_id: str) -> None:
        DB.session.execute(delete(Users).where(Users.ID == _id))
        DB.session.commit()

    @staticmethod
    def delete_many(_ids: list[str]) -> None:
        DB.session.execute(delete(Users).where(Users.ID.in_(_ids)))
        DB.session.commit()
