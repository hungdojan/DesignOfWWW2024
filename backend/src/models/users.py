import enum
from dataclasses import dataclass

from models import DB
from models.base import BaseManager

class UserRole(enum.Enum):
    ADMIN=1
    USER=2

@dataclass
class Users(DB.Model):
    __tablename__ = "Users"
    ID: int
    username: str
    role: UserRole
    name: str
    email: str

    ID = DB.Column(DB.Integer, primary_key=True)
    username = DB.Column(DB.String(50), nullable=False, unique=True)
    role = DB.Column(DB.Integer, nullable=False)
    name = DB.Column(DB.String(100), nullable=True)
    email = DB.Column(DB.String(100), nullable=True)

class UserManager(BaseManager[Users]):

    @staticmethod
    def query_all() -> list[Users]:
        user = Users.query.all()
        return user
