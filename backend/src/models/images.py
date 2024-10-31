from __future__ import annotations

from typing import Optional
from uuid import uuid4

from models import DB
from models.base import Base, BaseManager
from models.recipes import Recipes
from sqlalchemy import ForeignKey, String, and_, delete, select
from sqlalchemy.orm import Mapped, mapped_column
from utils import allowed_columns, preprocess_filter


class Images(Base):
    __tablename__ = "Images"
    ID: Mapped[str] = mapped_column(String(255), primary_key=True)
    recipeID: Mapped[int] = mapped_column(ForeignKey(Recipes.ID), nullable=False)
    target: Mapped[str] = mapped_column(String(255), nullable=False)

    @staticmethod
    def get_columns():
        return [c.name for c in __class__.__table__.columns]


class ImageManager(BaseManager[Images]):

    @staticmethod
    def query_all() -> list[Images]:
        groups = DB.session.execute(select(Images)).scalars().all()
        return [g for g in groups]

    @staticmethod
    def query_by_id(_id: str) -> Optional[Images]:
        return DB.session.get(Images, _id)

    @staticmethod
    def query_by_filter(**_filter) -> list[Images]:
        _filt = preprocess_filter(_filter, Images)
        groups = DB.session.execute(select(Images).where(and_(*_filt))).scalars().all()
        return [g for g in groups]

    @staticmethod
    def insert_one(**args) -> Images:
        cols = allowed_columns(args, Images)
        cols.pop("ID", None)
        group = Images(ID=str(uuid4()), **args)

        DB.session.add(group)
        DB.session.commit()
        return group

    @staticmethod
    def update_one(_id: str, **args) -> Optional[Images]:
        group = ImageManager.query_by_id(_id)
        if not group:
            return None
        data = allowed_columns(args, Images)
        for k, v in data.items():
            setattr(group, k, v)
        DB.session.commit()
        return group

    @staticmethod
    def delete_by_id(_id: str) -> None:
        DB.session.execute(delete(Images).where(Images.ID == _id))
        DB.session.commit()

    @staticmethod
    def delete_many(_ids: list[str]) -> None:
        DB.session.execute(delete(Images).where(Images.ID.in_(_ids)))
        DB.session.commit()
