from dataclasses import dataclass

from models import DB
from models.base import BaseManager

@dataclass
class Groups(DB.Model):
    __tablename__ = "Groups"
    ID: int
    name: str

    ID = DB.Column(DB.Integer, primary_key=True)
    name = DB.Column(DB.String(100), nullable=False)

class GroupManager(BaseManager[Groups]):

    @staticmethod
    def query_all() -> list[Groups]:
        groups = Groups.query.all()
        return groups

