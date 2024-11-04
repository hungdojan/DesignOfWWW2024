from __future__ import annotations

from datetime import datetime
from typing import Optional

from models import DB
from models.base import Base, BaseManager
from models.relationship_tables import Favorite, RecipesIngredientsTBL
from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column



class Recipes(Base):
    __tablename__ = "Recipes"
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    externalPage: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    authorID: Mapped[int] = mapped_column(ForeignKey("Users.ID"), nullable=True)
    timeCreated: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    description: Mapped[Optional[str]] = mapped_column(Text)
    instructions: Mapped[Optional[str]] = mapped_column(Text)

    favorited_by = DB.relationship(
        "Users", secondary=Favorite, backref="Recipes", viewonly=True
    )
    ingredients = DB.relationship(
        "Ingredients", secondary=RecipesIngredientsTBL, backref="Recipes", viewonly=True
    )

    @staticmethod
    def get_columns():
        return [c.name for c in __class__.__table__.columns]

class RecipeManager(BaseManager[Recipes]):
    pass
