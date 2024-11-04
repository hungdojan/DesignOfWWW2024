from __future__ import annotations

from models import DB
from models.base import Base, BaseManager
from models.relationship_tables import RecipesIngredientsTBL
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column


class Ingredients(Base):
    __tablename__ = "Ingredients"
    name: Mapped[str] = mapped_column(String(100), nullable=False)

    recipes = DB.relationship("Recipes", secondary=RecipesIngredientsTBL, viewonly=True)

    @staticmethod
    def get_columns():
        return [c.name for c in __class__.__table__.columns]


class IngredientManager(BaseManager[Ingredients]):
    pass
