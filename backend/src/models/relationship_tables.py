from models.base import Base
from sqlalchemy import Column, ForeignKey, String, Table

Favorite = Table(
    "Favorite",
    Base.metadata,
    Column(
        "userID",
        String(255),
        ForeignKey("Users.ID", ondelete="CASCADE"),
        nullable=False,
        primary_key=True,
    ),
    Column(
        "recipeID",
        String(255),
        ForeignKey("Recipes.ID", ondelete="CASCADE"),
        nullable=False,
        primary_key=True,
    ),
)


UsersGroupsTBL = Table(
    "UsersGroupsTBL",
    Base.metadata,
    Column(
        "userID",
        String(255),
        ForeignKey("Users.ID", ondelete="CASCADE"),
        nullable=False,
        primary_key=True,
    ),
    Column(
        "groupID",
        String(255),
        ForeignKey("Groups.ID", ondelete="CASCADE"),
        nullable=False,
        primary_key=True,
    ),
)
