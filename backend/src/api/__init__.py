import api.groups_api
import api.images_api
import api.ingredients_api
import api.recipes_api
import api.shopping_items_api
import api.shopping_lists_api
import api.users_api
import api.favorites_api
import api.auth_api
from flask_restx import Api

food_tips_api = Api(
    title="FoodTipsAPI",
    version="1.0.0",
)

food_tips_api.add_namespace(api.auth_api.auth_ns_api)
food_tips_api.add_namespace(api.favorites_api.favorites_api_ns)
food_tips_api.add_namespace(api.groups_api.groups_api_ns)
food_tips_api.add_namespace(api.images_api.images_api_ns)
food_tips_api.add_namespace(api.ingredients_api.ingredients_api_ns)
food_tips_api.add_namespace(api.recipes_api.recipes_api_ns)
food_tips_api.add_namespace(api.shopping_items_api.shopping_items_api_ns)
food_tips_api.add_namespace(api.shopping_lists_api.shopping_lists_api_ns)
food_tips_api.add_namespace(api.users_api.users_api_ns)

