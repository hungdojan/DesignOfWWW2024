from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Generic, TypeVar

T = TypeVar("T")


class BaseManager(ABC, Generic[T]):

    @staticmethod
    @abstractmethod
    def query_all() -> list[T]:
        pass
