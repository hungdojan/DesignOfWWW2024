from flask import request
from flask_restx import Namespace, Resource, fields
from flask_restx.api import HTTPStatus
from models.recipes import RecipeManager
from utils import error_message, response_ok

recipes_api_ns = Namespace(
    "Recipes", description="All endpoints related to recipes.", path="/recipes"
)

_model_new = recipes_api_ns.model(
    "RecipeNew",
    {
        "name": fields.String,
        "externalPage": fields.String,
        "authorID": fields.String,
        "timeCreated": fields.DateTime,
        "description": fields.String,
        "instructions": fields.String,
    },
)
_model_view = recipes_api_ns.model(
    "RecipeView",
    {
        "ID": fields.String,
        "name": fields.String,
        "externalPage": fields.String,
        "authorID": fields.String,
        "timeCreated": fields.DateTime,
        "description": fields.String,
        "instructions": fields.String,
    },
)


@recipes_api_ns.route("/")
class RecipesAPI(Resource):

    @recipes_api_ns.marshal_list_with(_model_view)
    def get(self):
        # TODO: user query
        return [g.as_dict() for g in RecipeManager.query_all()], HTTPStatus.OK

    @recipes_api_ns.expect(_model_new)
    @recipes_api_ns.marshal_with(_model_view)
    def post(self):
        data = request.get_json()

        try:
            recipe = RecipeManager.insert_one(name=data["name"])
        except TypeError:
            return error_message("Missing name parameter")

        return recipe.as_dict(), HTTPStatus.CREATED

    @recipes_api_ns.expect(_model_view)
    @recipes_api_ns.marshal_with(_model_view)
    def patch(self):
        data = request.get_json()
        if not data.get("ID"):
            return error_message("ID not provided")
        _id = data.pop("ID")
        recipe = RecipeManager.update_one(_id, **data)
        if not recipe:
            return error_message("Recipe not found.")
        return recipe.as_dict()


@recipes_api_ns.route("/<_id>")
@recipes_api_ns.doc(data={"_id": "Recipe's ID."})
class RecipeAPI(Resource):

    @recipes_api_ns.marshal_with(_model_view)
    def get(self, _id: str):
        recipe = RecipeManager.query_by_id(_id)
        _dict = {}
        if recipe:
            _dict = recipe.as_dict()
        return _dict, HTTPStatus.OK

    def delete(self, _id: str):
        RecipeManager.delete_by_id(_id)
        return response_ok("OK")
