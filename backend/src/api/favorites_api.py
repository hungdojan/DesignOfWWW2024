import api.recipes_api as recipes_api
from flask_restx import Namespace, Resource, fields, marshal
from flask_restx.api import HTTPStatus
from models.recipes import RecipeManager
from models.users import UserManager
from utils import error_message, message_response_dict, response_ok

favorites_api_ns = Namespace(
    "Favorites", description="All endpoints related to favorites.", path="/favorites"
)

favorite_user_post_parser = favorites_api_ns.parser()
favorite_user_post_parser.add_argument(
    "recipe_id", help="Recipe's ID.", required=True, location="json"
)


@favorites_api_ns.route("/favorite_recipes/<_id>")
@favorites_api_ns.doc(params={"_id": "User's ID."})
class FavoriteUserAPI(Resource):

    @favorites_api_ns.doc(description="Retrieve all favorite recipes.")
    @favorites_api_ns.response(
        HTTPStatus.OK,
        "Success",
        fields.List(fields.Nested(recipes_api.recipe_mdl["short_view"])),
    )
    @favorites_api_ns.response(
        **message_response_dict("Object not found", "User not found.")
    )
    def get(self, _id: str):
        # TODO: require auth
        user = UserManager.query_by_id(_id)
        if not user:
            return error_message("User not found")
        return marshal(
            [recipes_api.fill_source(r.as_dict()) for r in user.favorites],
            recipes_api.recipe_mdl["short_view"],
        )

    @favorites_api_ns.doc(
        description="Add new recipe to favorites.", parser=favorite_user_post_parser
    )
    @favorites_api_ns.response(
        **message_response_dict(
            "Success", "User user_id added recipe_id to favorites.", HTTPStatus.OK
        )
    )
    @favorites_api_ns.response(
        **message_response_dict("An object not found", "User not found.")
    )
    def post(self, _id: str):
        # TODO: require auth
        args = favorite_user_post_parser.parse_args()

        user = UserManager.query_by_id(_id)
        if not user:
            return error_message("User not found")
        recipe = RecipeManager.query_by_id(args["recipe_id"])
        if not recipe:
            return error_message("Recipe not found")

        # TODO: add recipe to user
        success = UserManager.add_recipe_to_favorites(user, recipe)
        if success:
            return response_ok(f"User {user.ID} added {recipe.ID} to favorites.")
        return response_ok(f"User {user.ID} has already {recipe.ID} in favorites.")


@favorites_api_ns.route("/users/<_id>/delete/<recipe_id>")
@favorites_api_ns.doc(params={"_id": "User's ID.", "recipe_id": "Recipe's ID."})
class FavoriteUserDeleteAPI(Resource):

    @favorites_api_ns.doc(description="Remove recipe from the favorites.")
    @favorites_api_ns.response(
        **message_response_dict(
            "Operation result.",
            "User user_id has remove recipe_id from the favorites.",
            HTTPStatus.OK,
        )
    )
    @favorites_api_ns.response(
        **message_response_dict("An object not found.", "User not found.")
    )
    def delete(self, _id: str, recipe_id: str):
        # TODO: require auth
        user = UserManager.query_by_id(_id)
        if not user:
            return error_message("User not found.")
        deleted = UserManager.delete_recipe_from_favorites(user, recipe_id)
        if deleted:
            return response_ok(
                f"User {user.ID} has removed {recipe_id} from the favorites."
            )
        return response_ok(f"User {user.ID} has not {recipe_id} in the favorites.")


@favorites_api_ns.route("/nof_likes/<_id>")
@favorites_api_ns.doc(params={"_id": "Recipe's ID."})
class FavoriteRecipeAPI(Resource):

    @favorites_api_ns.doc(description="Get the number of favorites.")
    @favorites_api_ns.response(
        HTTPStatus.OK, "Success", fields.Integer, envelope="nof_favorites"
    )
    @favorites_api_ns.response(
        **message_response_dict("Object not found", "Recipe not found.")
    )
    def get(self, _id: str):
        recipe = RecipeManager.query_by_id(_id)
        if not recipe:
            return error_message("Recipe not found")
        return {"nof_favorites": len(recipe.favorited_by)}
