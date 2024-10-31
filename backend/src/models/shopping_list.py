from models import DB
from models.base import BaseManager
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column


class ShoppingLists(DB.Model):
    __tablename__ = "ShoppingLists"
    ID: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)


class ShoppingListManager(BaseManager[ShoppingLists]):

    @staticmethod
    def query_all() -> list[ShoppingLists]:
        shop_items = ShoppingLists.query.all()
        return shop_items
