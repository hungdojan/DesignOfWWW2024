import enum

from models.base import Base
from sqlalchemy import Column, Enum, Float, ForeignKey, Integer, Table

Favorite = Table(
    "Favorite",
    Base.metadata,
    Column(
        "userID",
        Integer,
        ForeignKey("Users.ID", ondelete="CASCADE"),
        nullable=False,
        primary_key=True,
    ),
    Column(
        "recipeID",
        Integer,
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
        Integer,
        ForeignKey("Users.ID", ondelete="CASCADE"),
        nullable=False,
        primary_key=True,
    ),
    Column(
        "groupID",
        Integer,
        ForeignKey("Groups.ID", ondelete="CASCADE"),
        nullable=False,
        primary_key=True,
    ),
)


class UnitEnum(enum.Enum):
    mg = "mg"
    g = "g"
    kg = "kg"
    ml = "ml"
    l = "l"


RecipesIngredientsTBL = Table(
    "RecipesIngredientsTBL",
    Base.metadata,
    Column(
        "recipeID",
        Integer,
        ForeignKey("Recipes.ID", ondelete="CASCADE"),
        nullable=False,
        primary_key=True,
    ),
    Column(
        "ingredientID",
        Integer,
        ForeignKey("Ingredients.ID", ondelete="CASCADE"),
        nullable=False,
        primary_key=True,
    ),
    Column("value", Float, nullable=False),
    Column("unit", Enum(UnitEnum), nullable=False),
)
