from flask_restx import Api
from api.groups_api import groups_api_ns
from api.images_api import images_api_ns
from api.ingredients_api import ingredients_api_ns
from api.recipes_api import recipes_api_ns
from api.shopping_items_api import shopping_items_api_ns
from api.shopping_list_api import shopping_lists_api_ns
from api.users_api import users_api_ns

api = Api(
    title="FoodTipsAPI",
    version="1.0.0",
)

api.add_namespace(groups_api_ns)
api.add_namespace(images_api_ns)
api.add_namespace(ingredients_api_ns)
api.add_namespace(recipes_api_ns)
api.add_namespace(shopping_items_api_ns)
api.add_namespace(shopping_lists_api_ns)
api.add_namespace(users_api_ns)
