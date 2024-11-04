from flask import request
from flask_restx import Namespace, Resource, fields
from flask_restx.api import HTTPStatus
from models.ingredients import IngredientManager
from utils import error_message, response_ok

ingredients_api_ns = Namespace(
    "Ingredients",
    description="All endpoints related to ingredients.",
    path="/ingredients",
)

ingred_mdl = {
    "new": ingredients_api_ns.model("IngredientNew", {"name": fields.String}),
    "view": ingredients_api_ns.model(
        "IngredientView", {"ID": fields.String, "name": fields.String}
    ),
}


@ingredients_api_ns.route("/")
class IngredientsAPI(Resource):

    @ingredients_api_ns.marshal_list_with(ingred_mdl["view"])
    def get(self):
        # TODO: user query
        return [g.as_dict() for g in IngredientManager.query_all()], HTTPStatus.OK

    @ingredients_api_ns.expect(ingred_mdl["new"])
    @ingredients_api_ns.marshal_with(ingred_mdl["view"])
    def post(self):
        data = request.get_json()

        try:
            ingredient = IngredientManager.insert_one(name=data["name"])
        except TypeError:
            return error_message("Missing name parameter")

        return ingredient.as_dict(), HTTPStatus.CREATED

    @ingredients_api_ns.expect(ingred_mdl["view"])
    @ingredients_api_ns.marshal_with(ingred_mdl["view"])
    def patch(self):
        data = request.get_json()
        if not data.get("ID"):
            return error_message("ID not provided.")
        _id = data.pop("ID")
        ingredient = IngredientManager.update_one(_id, **data)
        if not ingredient:
            return error_message("Ingredient not found.")
        return ingredient.as_dict()


@ingredients_api_ns.route("/<_id>")
@ingredients_api_ns.doc(data={"_id": "Ingredient's ID."})
class IngredientAPI(Resource):

    @ingredients_api_ns.marshal_with(ingred_mdl["view"])
    def get(self, _id: str):
        ingredient = IngredientManager.query_by_id(_id)
        _dict = {}
        if ingredient:
            _dict = ingredient.as_dict()
        return _dict, HTTPStatus.OK

    def delete(self, _id: str):
        IngredientManager.delete_by_id(_id)
        return response_ok("OK")
