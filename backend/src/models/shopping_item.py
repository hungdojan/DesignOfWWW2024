from sqlalchemy import String
from models import DB
from models.base import BaseManager
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm.properties import ForeignKey

from models.shopping_list import ShoppingLists


class ShoppingItems(DB.Model):
    __tablename__ = "ShoppingItems"
    ID: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    shoppingListID: Mapped[int] = mapped_column(
        ForeignKey(ShoppingLists.ID, ondelete="CASCADE"), nullable=False
    )
    total: Mapped[int] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    completed: Mapped[bool] = mapped_column(default=False)


class ShoppingItemManager(BaseManager[ShoppingItems]):

    @staticmethod
    def query_all() -> list[ShoppingItems]:
        shop_items = ShoppingItems.query.all()
        return shop_items
