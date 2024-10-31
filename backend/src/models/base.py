from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Generic, TypeVar
from sqlalchemy.orm import DeclarativeBase, MappedAsDataclass

T = TypeVar("T")

class Base(DeclarativeBase, MappedAsDataclass):
    pass

class BaseManager(ABC, Generic[T]):

    @staticmethod
    @abstractmethod
    def query_all() -> list[T]:
        pass
