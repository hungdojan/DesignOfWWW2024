from dataclasses import dataclass

from models import DB
from models.base import BaseManager


@dataclass
class Recipes(DB.Model):
    __tablename__ = "Recipes"
    ID: int
    name: str
    externalPage: str
    description: str
    instructions: str

    ID = DB.Column(DB.Integer, primary_key=True)
    name = DB.Column(DB.String(100), nullable=False)
    externalPage = DB.Column(DB.String(255), nullable=True)
    description = DB.Column(DB.Text, nullable=True)
    instructions = DB.Column(DB.Text, nullable=True)


class RecipeManager(BaseManager[Recipes]):

    @staticmethod
    def query_all() -> list[Recipes]:
        recipes = Recipes.query.all()
        return recipes

