from __future__ import annotations

import enum
from typing import Optional

from models import DB
from models.base import BaseManager
from models.relationship_tables import Favorite, UsersGroupsTBL
from sqlalchemy import Enum, String
from sqlalchemy.orm import Mapped, mapped_column


class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    USER = "USER"


class Users(DB.Model):
    __tablename__ = "Users"
    ID: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), nullable=False)
    name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # relationships
    groups = DB.relationship("Groups", secondary=UsersGroupsTBL)
    favorites = DB.relationship("Recipes", secondary=Favorite)


class UserManager(BaseManager[Users]):

    @staticmethod
    def query_all() -> list[Users]:
        user: list[Users] = Users.query.all()
        return user
