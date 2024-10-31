from __future__ import annotations
from typing import Optional
from uuid import uuid4

from models import DB
from models.base import Base, BaseManager
from models.relationship_tables import RecipesIngredientsTBL
from sqlalchemy import String, and_, delete, select
from sqlalchemy.orm import Mapped, mapped_column

from utils import allowed_columns, preprocess_filter


class Ingredients(Base):
    __tablename__ = "Ingredients"
    ID: Mapped[str] = mapped_column(String(255), primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)

    recipes = DB.relationship("Recipes", secondary=RecipesIngredientsTBL, viewonly=True)

    @staticmethod
    def get_columns():
        return [c.name for c in __class__.__table__.columns]


class IngredientManager(BaseManager[Ingredients]):

    @staticmethod
    def query_all() -> list[Ingredients]:
        groups = DB.session.execute(select(Ingredients)).scalars().all()
        return [g for g in groups]

    @staticmethod
    def query_by_id(_id: str) -> Optional[Ingredients]:
        return DB.session.get(Ingredients, _id)

    @staticmethod
    def query_by_filter(**_filter) -> list[Ingredients]:
        _filt = preprocess_filter(_filter, Ingredients)
        groups = DB.session.execute(select(Ingredients).where(and_(*_filt))).scalars().all()
        return [g for g in groups]

    @staticmethod
    def insert_one(**args) -> Ingredients:
        cols = allowed_columns(args, Ingredients)
        cols.pop("ID", None)
        group = Ingredients(ID=str(uuid4()), **args)

        DB.session.add(group)
        DB.session.commit()
        return group

    @staticmethod
    def update_one(_id: str, **args) -> Optional[Ingredients]:
        group = IngredientManager.query_by_id(_id)
        if not group:
            return None
        data = allowed_columns(args, Ingredients)
        for k, v in data.items():
            setattr(group, k, v)
        DB.session.commit()
        return group

    @staticmethod
    def delete_by_id(_id: str) -> None:
        DB.session.execute(delete(Ingredients).where(Ingredients.ID == _id))
        DB.session.commit()

    @staticmethod
    def delete_many(_ids: list[str]) -> None:
        DB.session.execute(delete(Ingredients).where(Ingredients.ID.in_(_ids)))
        DB.session.commit()
