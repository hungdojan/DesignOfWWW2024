from models import DB
from models.base import BaseManager
from models.recipes import Recipes
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column


class Images(DB.Model):
    __tablename__ = "Images"
    ID: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    recipeID: Mapped[int] = mapped_column(ForeignKey(Recipes.ID), nullable=False)
    target: Mapped[str] = mapped_column(String(255), nullable=False)


class ImageManager(BaseManager[Images]):

    @staticmethod
    def query_all() -> list[Images]:
        images = Images.query.all()
        return images
