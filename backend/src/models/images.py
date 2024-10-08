from dataclasses import dataclass

from models import DB
from models.base import BaseManager
from sqlalchemy import ForeignKey


# @dataclass
# class Images(DB.Model):
#     __tablename__ = "Images"
#     ID: int
#     recipeID: int
#     target: str
#
#     ID = DB.Column(DB.Integer, primary_key=True)
#     recipeID = DB.Column(DB.String(100), ForeignKey("Recipes.ID"), nullable=False)
#
#
# class ImageManager(BaseManager[Images]):
#
#     @staticmethod
#     def query_all() -> list[Images]:
#         images = Images.query.all()
#         return images
