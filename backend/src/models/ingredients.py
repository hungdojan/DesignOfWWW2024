from __future__ import annotations

from sqlalchemy import String

from models import DB
from models.base import BaseManager
from models.relationship_tables import RecipesIngredientsTBL
from sqlalchemy.orm import Mapped, mapped_column


class Ingredients(DB.Model):
    __tablename__ = "Ingredients"
    ID: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)

    recipes = DB.relationship(
        "Recipes",
        secondary=RecipesIngredientsTBL,
    )


class IngredientManager(BaseManager[Ingredients]):

    @staticmethod
    def query_all() -> list[Ingredients]:
        ingredients = Ingredients.query.all()
        return ingredients
