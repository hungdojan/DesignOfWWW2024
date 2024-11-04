from __future__ import annotations

from models.base import Base, BaseManager
from models.recipes import Recipes
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column


class Images(Base):
    __tablename__ = "Images"
    recipeID: Mapped[int] = mapped_column(ForeignKey(Recipes.ID), nullable=False)
    target: Mapped[str] = mapped_column(String(255), nullable=False)

    @staticmethod
    def get_columns():
        return [c.name for c in __class__.__table__.columns]


class ImageManager(BaseManager[Images]):
    pass
