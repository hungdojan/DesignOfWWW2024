from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Generic, Optional, TypeVar, get_args
from uuid import uuid4

import models
from sqlalchemy import String, and_, delete, select
from sqlalchemy.orm import DeclarativeBase, Mapped, MappedAsDataclass, mapped_column
from utils import allowed_columns, preprocess_filter


class Base(DeclarativeBase, MappedAsDataclass):
    ID: Mapped[str] = mapped_column(String(255), primary_key=True)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    @staticmethod
    @abstractmethod
    def get_columns():
        raise NotImplemented()

    @classmethod
    def get_columns_extended(cls):
        return cls.get_columns()


T = TypeVar("T", bound=Base)


class BaseManager(ABC, Generic[T]):

    # the model class to do query
    _model_class: type[T]

    def __init_subclass__(cls) -> None:
        cls._model_class = get_args(cls.__orig_bases__[0])[0]  # pyright: ignore

    @classmethod
    def query_all(cls) -> list[T]:
        objs = models.DB.session.execute(select(cls._model_class)).scalars().all()
        return [g for g in objs]

    @classmethod
    def query_by_id(cls, _id: str) -> Optional[T]:
        return models.DB.session.get(cls._model_class, _id)

    @classmethod
    def query_by_many_ids(cls, _ids: list[str]) -> list[T]:
        objs = (
            models.DB.session.execute(
                select(cls._model_class).where(cls._model_class.ID.in_(_ids))
            )
            .scalars()
            .all()
        )
        return [o for o in objs]

    @classmethod
    def query_by_filter(cls, **_filter) -> list[T]:
        _filt = preprocess_filter(_filter, cls._model_class)
        objs = (
            models.DB.session.execute(select(cls._model_class).where(and_(*_filt)))
            .scalars()
            .all()
        )
        return [o for o in objs]

    @classmethod
    def insert_one(cls, **args) -> T:
        cols = allowed_columns(args, cls._model_class)
        _id = cols.pop("ID", None)
        if not _id:
            _id = uuid4()
        obj = cls._model_class(ID=str(_id), **cols)

        models.DB.session.add(obj)
        models.DB.session.commit()
        return obj

    @classmethod
    def insert_multiple_obj(cls, lof_obj: list[T]):
        models.DB.session.bulk_save_objects(lof_obj)
        models.DB.session.commit()

    @classmethod
    def update_one(cls, _id: str, **args) -> Optional[T]:
        obj = cls.query_by_id(_id)
        if not obj:
            return None
        data = allowed_columns(args, cls._model_class)
        for k, v in data.items():
            setattr(obj, k, v)
        models.DB.session.commit()
        return obj

    @classmethod
    def update_obj(cls, obj: T, **args) -> T:
        data = allowed_columns(args, cls._model_class)
        for k, v in data.items():
            setattr(obj, k, v)
        models.DB.session.commit()
        return obj

    @classmethod
    def _update_db(cls) -> None:
        models.DB.session.commit()

    @classmethod
    def delete_obj(cls, obj: T) -> None:
        models.DB.session.delete(obj)
        models.DB.session.commit()

    @classmethod
    def delete_by_id(cls, _id: str) -> None:
        models.DB.session.execute(
            delete(cls._model_class).where(cls._model_class.ID == _id)
        )
        models.DB.session.commit()

    @classmethod
    def delete_many(cls, _ids: list[str]) -> None:
        models.DB.session.execute(
            delete(cls._model_class).where(cls._model_class.ID.in_(_ids))
        )
        models.DB.session.commit()
