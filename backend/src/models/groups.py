from __future__ import annotations

import models.users as usr
from models.base import Base, BaseManager
from models.relationship_tables import UsersGroupsTBL
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Groups(Base):
    __tablename__ = "Groups"
    name: Mapped[str] = mapped_column(String(100), nullable=False)

    users: Mapped[list[usr.Users]] = relationship(
        "Users", secondary=UsersGroupsTBL, backref="Groups", default=list
    )

    @staticmethod
    def get_columns():
        return [c.name for c in __class__.__table__.columns]

    @classmethod
    def get_columns_extended(cls):
        return [c.name for c in __class__.__table__.columns] + ["users"]


class GroupManager(BaseManager[Groups]):

    @classmethod
    def add_users_to_group(cls, group: Groups, user_ids: list[str]) -> list[str]:
        # get data
        existing_ids = [u.ID for u in group.users]

        # filter out old/existing users
        added_users = list(set(user_ids).difference(set(existing_ids)))

        # inserting
        new_users = usr.UserManager.query_by_many_ids(added_users)
        group.users.extend(new_users)
        cls._update_db()
        return added_users

    @classmethod
    def remove_users_from_group(cls, group: Groups, user_ids: list[str]) -> list[str]:
        # get data
        existing_ids = [u.ID for u in group.users]
        deleted_ids = list(set(user_ids).intersection(existing_ids))

        remaining_users = [u for u in group.users if u.ID not in user_ids]

        # inserting
        group.users = remaining_users
        cls._update_db()
        return deleted_ids
