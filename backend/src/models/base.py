from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Generic, Optional, TypeVar

from sqlalchemy.orm import DeclarativeBase, MappedAsDataclass

T = TypeVar("T")


class Base(DeclarativeBase, MappedAsDataclass):
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    @staticmethod
    @abstractmethod
    def get_columns():
        raise NotImplemented()


class BaseManager(ABC, Generic[T]):

    @staticmethod
    @abstractmethod
    def query_all() -> list[T]:
        pass

    @staticmethod
    @abstractmethod
    def query_by_filter(**_filter) -> list[T]:
        pass

    @staticmethod
    @abstractmethod
    def query_by_id(_id: str) -> Optional[T]:
        pass

    @staticmethod
    @abstractmethod
    def insert_one(**args) -> T:
        pass

    @staticmethod
    @abstractmethod
    def update_one(_id: str, **args) -> Optional[T]:
        pass

    @staticmethod
    @abstractmethod
    def delete_by_id(_id: str) -> None:
        pass

    @staticmethod
    @abstractmethod
    def delete_many(_ids: list[str]) -> None:
        pass
