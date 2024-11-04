from __future__ import annotations

from models import DB
from models.base import Base, BaseManager
from models.relationship_tables import UsersGroupsTBL
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column


class Groups(Base):
    __tablename__ = "Groups"
    name: Mapped[str] = mapped_column(String(100), nullable=False)

    users = DB.relationship(
        "Users", secondary=UsersGroupsTBL, backref="Groups", viewonly=True
    )

    @staticmethod
    def get_columns():
        return [c.name for c in __class__.__table__.columns]


class GroupManager(BaseManager[Groups]):
    pass
