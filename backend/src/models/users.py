from __future__ import annotations

import enum
from typing import Optional

from models import DB
from models.base import Base, BaseManager
from models.relationship_tables import Favorite, UsersGroupsTBL
from sqlalchemy import Enum, String
from sqlalchemy.orm import Mapped, mapped_column


class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    USER = "USER"


class Users(Base):
    __tablename__ = "Users"
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
    pass
