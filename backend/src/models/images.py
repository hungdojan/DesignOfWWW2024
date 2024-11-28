from __future__ import annotations

import os
import pathlib
from uuid import uuid4

from flask import current_app as app
from models.base import Base, BaseManager
from models.recipes import Recipes
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column
from werkzeug.datastructures import FileStorage


class Images(Base):
    __tablename__ = "Images"
    recipeID: Mapped[int] = mapped_column(ForeignKey(Recipes.ID), nullable=False)
    target: Mapped[str] = mapped_column(String(255), nullable=False)

    @staticmethod
    def get_columns():
        return [c.name for c in __class__.__table__.columns]


class ImageManager(BaseManager[Images]):

    @classmethod
    def insert_new_image(cls, image_file_storage: FileStorage, recipeID: str) -> Images:
        if not image_file_storage.filename:
            raise ValueError("File name not found.")
        filename: str = image_file_storage.filename
        ext = filename.rsplit(".", 1)[1].lower()
        _id = uuid4()
        filename = f"{_id}_{recipeID}.{ext}"
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        image_file_storage.save(filepath)

        image = cls.insert_one(ID=str(_id), recipeID=recipeID, target=filepath)
        return image

    @classmethod
    def remove_image(cls, _id: str, recipeID: str) -> list[str]:
        images = cls.query_by_filter(ID=_id, recipeID=recipeID)
        lof_ids = [i.ID for i in images]
        for i in images:
            p = pathlib.Path(i.target)
            p.unlink(missing_ok=True)

        cls.delete_many(lof_ids)
        return lof_ids

    @classmethod
    def update_image(cls, image_file_storage: FileStorage, image: Images):
        if not image_file_storage.filename:
            raise ValueError("File name not found.")
        filename: str = image_file_storage.filename
        ext = filename.rsplit(".", 1)[1].lower()
        _id=image.ID
        filename = f"{_id}_{image.recipeID}.{ext}"
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        image_file_storage.save(filepath)

        image.target = filepath
        cls._update_db()
