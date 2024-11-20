from __future__ import annotations

from models.base import Base, BaseManager
from sqlalchemy import ForeignKey, String, select
from sqlalchemy.orm import Mapped, mapped_column

class Ingredients(Base):
    __tablename__ = "Ingredients"
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    recipeID: Mapped[str] = mapped_column(
        ForeignKey("Recipes.ID", ondelete="CASCADE"), nullable=False
    )
    amount: Mapped[str] = mapped_column(String(255), nullable=False)

    @staticmethod
    def get_columns():
        return [c.name for c in __class__.__table__.columns]


class IngredientManager(BaseManager[Ingredients]):

    @classmethod
    def get_names(cls) -> list[str]:
        from models import DB
        _select = select(Ingredients.__table__.c.name).distinct()
        query = DB.session.execute(_select).scalars().all()
        return [r for r in query]
