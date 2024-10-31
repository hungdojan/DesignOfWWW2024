from __future__ import annotations

from datetime import datetime
from typing import Optional

from models import DB
from models.base import BaseManager
from models.relationship_tables import Favorite, RecipesIngredientsTBL
from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class Recipes(DB.Model):
    __tablename__ = "Recipes"
    ID: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    externalPage: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    authorID: Mapped[int] = mapped_column(ForeignKey("Users.ID"), nullable=True)
    timeCreated: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    description: Mapped[Optional[str]] = mapped_column(Text)
    instructions: Mapped[Optional[str]] = mapped_column(Text)

    favorited_by = DB.relationship("Users", secondary=Favorite, backref="Recipes")
    ingredients = DB.relationship(
        "Ingredients", secondary=RecipesIngredientsTBL, backref="Recipes"
    )


class RecipeManager(BaseManager[Recipes]):

    @staticmethod
    def query_all() -> list[Recipes]:
        recipes = Recipes.query.all()
        return recipes
