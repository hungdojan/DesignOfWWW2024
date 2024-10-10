from flask import Blueprint
from models.groups import GroupManager
from models.users import UserManager
# from src.models.images import ImageManager
from src.models.images import ImageManager
from src.models.ingredients import IngredientManager
from src.models.recipes import RecipeManager

database_api = Blueprint("database", __name__, url_prefix="/debug")


@database_api.route("/users")
def users_all():
    return {"users": UserManager.query_all()}


@database_api.route("/groups")
def groups_all():
    return {"groups": GroupManager.query_all()}


@database_api.route("/recipes")
def recipes_all():
    return {"recipe": RecipeManager.query_all()}


@database_api.route("/images")
def images_all():
    return {"images": ImageManager.query_all()}

@database_api.route("/ingredients")
def ingredients_all():
    return {"ingredients": IngredientManager.query_all()}



# | Favorite              |
# | Groups                |
# | Images                |
# | Ingredients           |
# | Recipes               |
# | RecipesIngredientsTBL |
# | ShoppingItem          |
# | ShoppingList          |
# | Users                 |
# | UsersGroupsTBL
