from __future__ import annotations

import enum
from datetime import datetime
from typing import Optional
from uuid import uuid4

import models.ingredients as ing
import models.users as usr
from models.base import Base, BaseManager
from models.relationship_tables import Favorite
from sqlalchemy import DateTime, ForeignKey, String, Text, column, select
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Enum
from utils import allowed_columns


class RecipeDifficulty(str, enum.Enum):
    Beginner = "Beginner"
    Intermediate = "Intermediate"
    Advance = "Advance"
    Unknown = "Unknown"

    def __str__(self):
        return str(self.value)


class Recipes(Base):
    __tablename__ = "Recipes"
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    externalPage: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    authorID: Mapped[int] = mapped_column(ForeignKey("Users.ID"), nullable=True)
    timeCreated: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    expectedTime: Mapped[Optional[int]] = mapped_column(nullable=True)
    difficulty: Mapped[RecipeDifficulty] = mapped_column(
        Enum(RecipeDifficulty), nullable=False
    )
    description: Mapped[Optional[str]] = mapped_column(Text)
    instructions: Mapped[Optional[str]] = mapped_column(Text)

    favorited_by: Mapped[list[usr.Users]] = relationship(
        "Users", secondary=Favorite, backref="Recipes"
    )
    ingredients: Mapped[list[ing.Ingredients]] = relationship(cascade="all,delete")

    @staticmethod
    def get_columns():
        return [c.name for c in __class__.__table__.columns]

    @classmethod
    def get_columns_extended(cls):
        return cls.get_columns() + ["favorited_by", "ingredients"]

    def serialize(self) -> dict:
        _d = self.as_dict()
        _d.update(**{"ingredients": [i.as_dict() for i in self.ingredients]})
        return _d


class RecipeManager(BaseManager[Recipes]):

    @classmethod
    def query_recipe_by_filter(cls, **data) -> list[Recipes]:
        from models import DB

        _select = select(Recipes)
        if data.get("isExternal", None) is not None:
            _column = column("externalPage")
            if data["isExternal"]:
                _column = _column.is_not(None)
            else:
                _column = _column.is_(None)
            _select = _select.where(_column)

        if data.get("byAuthor", None) is not None:
            _select = _select.where(column("authorID") == data["byAuthor"])

        if data.get("ingredients", None) is not None:
            _select = _select.join(ing.Ingredients).where(
                ing.Ingredients.name.in_([i.lower() for i in data["ingredients"]])
            )

        _select = _select.where(column("expectedTime") >= data["cookingTimeLonger"])

        if data["cookingTimeShorter"] > -1:
            _select = _select.where(
                column("expectedTime") <= data["cookingTimeShorter"]
            )

        objs = DB.session.execute(_select).scalars().all()
        return [r for r in objs]

    @classmethod
    def insert_new_recipe(cls, **data) -> Recipes:

        ing_list = data.pop("ingredients")
        _filt_cols = allowed_columns(data, cls._model_class)
        dt = _filt_cols.pop("timeCreated")
        recipe = cls.insert_one(
            **_filt_cols,
            timeCreated=datetime.fromisoformat(dt),
            externalPage=None,
            ingredients=[],
            favorited_by=[],
        )

        ingred_obj = [
            ing.Ingredients(str(uuid4()), i["name"], recipe.ID, i["value"], i["unit"])
            for i in ing_list
        ]
        ing.IngredientManager.insert_multiple_obj(ingred_obj)

        return recipe
