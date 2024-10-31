from __future__ import annotations

from sqlalchemy import String

from models import DB
from models.base import BaseManager
from models.relationship_tables import UsersGroupsTBL
from sqlalchemy.orm import Mapped, mapped_column


class Groups(DB.Model):
    __tablename__ = "Groups"
    ID: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)

    users = DB.relationship("Users", secondary=UsersGroupsTBL, backref="Groups")


class GroupManager(BaseManager[Groups]):

    @staticmethod
    def query_all() -> list[Groups]:
        groups: list[Groups] = Groups.query.all()
        return groups
