from dataclasses import dataclass

from models import DB
from models.base import BaseManager


@dataclass
class Ingredients(DB.Model):
    __tablename__ = "Ingredients"
    ID: int
    name: str

    ID = DB.Column(DB.Integer, primary_key=True)
    name = DB.Column(DB.String(100), nullable=False)


class IngredientManager(BaseManager[Ingredients]):

    @staticmethod
    def query_all() -> list[Ingredients]:
        ingredients = Ingredients.query.all()
        return ingredients


