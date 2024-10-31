from flask import jsonify
from flask_restx import Namespace, Resource
from models.groups import GroupManager
from models.images import ImageManager
from models.ingredients import IngredientManager
from models.recipes import RecipeManager
from models.shopping_item import ShoppingItemManager
from models.shopping_list import ShoppingListManager
from models.users import UserManager

debug_api_ns = Namespace(
    "Debug", description="API endpoints for testing purposes.", path="/debug"
)


@debug_api_ns.route("/echo")
class EchoAPI(Resource):
    def get(self):
        return {"Hello": "world"}


@debug_api_ns.route("/users")
class UsersAPI(Resource):
    def get(self):
        return jsonify(UserManager.query_all())


@debug_api_ns.route("/groups")
class GroupsAPI(Resource):
    def get(self):
        return jsonify(GroupManager.query_all())


@debug_api_ns.route("/recipes")
class RecipesAPI(Resource):
    def get(self):
        return jsonify(RecipeManager.query_all())


@debug_api_ns.route("/images")
class ImagesAPI(Resource):
    def get(self):
        return jsonify(ImageManager.query_all())


@debug_api_ns.route("/ingredients")
class IngredientsAPI(Resource):
    def get(self):
        return jsonify(IngredientManager.query_all())


@debug_api_ns.route("/shop_list")
class ShoppingListsAPI(Resource):
    def get(self):
        return jsonify(ShoppingListManager.query_all())


@debug_api_ns.route("/shop_item")
class ShoppingItemsAPI(Resource):
    def get(self):
        return jsonify(ShoppingItemManager.query_all())
