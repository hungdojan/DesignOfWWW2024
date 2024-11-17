from __future__ import annotations

import enum
from typing import Optional

from flask_login import UserMixin

import models.groups as grp
import models.recipes as rcp
import models.shopping_list as shl
from models import DB
from models.base import Base, BaseManager
from models.relationship_tables import Favorite, UsersGroupsTBL
from sqlalchemy import Enum, String, column, select
from sqlalchemy.orm import Mapped, mapped_column, relationship


class UserRole(str, enum.Enum):
    Admin = "Admin"
    User = "User"

    def __str__(self):
        return str(self.value)


class Users(Base, UserMixin):
    __tablename__ = "Users"
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), nullable=False)
    name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # relationships
    groups: Mapped[list[grp.Groups]] = relationship("Groups", secondary=UsersGroupsTBL)
    favorites: Mapped[list[rcp.Recipes]] = relationship("Recipes", secondary=Favorite)

    @property
    def id(self):
        return self.ID
    
    @staticmethod
    def get_columns():
        return [c.name for c in __class__.__table__.columns]

    @classmethod
    def get_columns_extended(cls):
        return cls.get_columns() + ["groups", "favorites"]


class UserManager(BaseManager[Users]):

    @classmethod
    def add_recipe_to_favorites(cls, user: Users, recipe: rcp.Recipes) -> bool:
        if recipe.ID in [r.ID for r in user.favorites]:
            return False
        user.favorites.append(recipe)
        DB.session.commit()
        return True

    @classmethod
    def delete_recipe_from_favorites(cls, user: Users, recipe_id: str) -> bool:
        remaining_favorites = [r for r in user.favorites if recipe_id != r.ID]
        deleted = len(remaining_favorites) < len(user.favorites)
        user.favorites = remaining_favorites
        DB.session.commit()
        return deleted

    @classmethod
    def retrieve_shopping_lists(cls, user: Users) -> list[shl.ShoppingLists]:
        import models.groups as grp

        _select = (
            select(shl.ShoppingLists)
            .join(grp.Groups)
            .join(UsersGroupsTBL)
            .where(UsersGroupsTBL.c.userID == user.ID)
        )
        res = DB.session.execute(_select).scalars().all()
        res = [sl for sl in res]
        return res
