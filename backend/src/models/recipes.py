from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import uuid4

from models import DB
from models.base import Base, BaseManager
from models.relationship_tables import Favorite, RecipesIngredientsTBL
from sqlalchemy import DateTime, ForeignKey, String, Text, and_, delete, select
from sqlalchemy.orm import Mapped, mapped_column

from utils import allowed_columns, preprocess_filter


class Recipes(Base):
    __tablename__ = "Recipes"
    ID: Mapped[str] = mapped_column(String(255), primary_key=True)
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

    @staticmethod
    def query_all() -> list[Recipes]:
        groups = DB.session.execute(select(Recipes)).scalars().all()
        return [g for g in groups]

    @staticmethod
    def query_by_id(_id: str) -> Optional[Recipes]:
        return DB.session.get(Recipes, _id)

    @staticmethod
    def query_by_filter(**_filter) -> list[Recipes]:
        _filt = preprocess_filter(_filter, Recipes)
        groups = DB.session.execute(select(Recipes).where(and_(*_filt))).scalars().all()
        return [g for g in groups]

    @staticmethod
    def insert_one(**args) -> Recipes:
        cols = allowed_columns(args, Recipes)
        cols.pop("ID", None)
        group = Recipes(ID=str(uuid4()), **args)

        DB.session.add(group)
        DB.session.commit()
        return group

    @staticmethod
    def update_one(_id: str, **args) -> Optional[Recipes]:
        group = RecipeManager.query_by_id(_id)
        if not group:
            return None
        data = allowed_columns(args, Recipes)
        for k, v in data.items():
            setattr(group, k, v)
        DB.session.commit()
        return group

    @staticmethod
    def delete_by_id(_id: str) -> None:
        DB.session.execute(delete(Recipes).where(Recipes.ID == _id))
        DB.session.commit()

    @staticmethod
    def delete_many(_ids: list[str]) -> None:
        DB.session.execute(delete(Recipes).where(Recipes.ID.in_(_ids)))
        DB.session.commit()
