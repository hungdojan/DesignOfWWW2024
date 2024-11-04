from __future__ import annotations
import enum

from models.base import Base, BaseManager
from sqlalchemy import Enum, Float, ForeignKey, String, select
from sqlalchemy.orm import Mapped, mapped_column

class UnitEnum(str, enum.Enum):
    mg = "mg"
    g = "g"
    kg = "kg"
    ml = "ml"
    l = "l"
    ks = "ks"

    def __str__(self):
        return str(self.value)


class Ingredients(Base):
    __tablename__ = "Ingredients"
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    recipeID: Mapped[str] = mapped_column(
        ForeignKey("Recipes.ID", ondelete="CASCADE"), nullable=False
    )
    value: Mapped[float] = mapped_column(Float, nullable=False)
    unit: Mapped[UnitEnum] = mapped_column(Enum(UnitEnum), nullable=False)

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
