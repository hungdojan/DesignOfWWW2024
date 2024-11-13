from flask_restx import Namespace, Resource, fields
from flask_restx.api import HTTPStatus
from models.ingredients import IngredientManager, UnitEnum
from utils import error_message, message_response_dict, response_ok

ingredients_api_ns = Namespace(
    "Ingredients",
    description="All endpoints related to ingredients.",
    path="/ingredients",
)

ingred_mdl = {
    "new": ingredients_api_ns.model(
        "IngredientNew",
        {
            "name": fields.String,
            "value": fields.Float,
            "unit": fields.String(enum=[e.value for e in UnitEnum]),
        },
    ),
    "view": ingredients_api_ns.model(
        "IngredientView",
        {
            "ID": fields.String,
            "name": fields.String,
            "recipeID": fields.String,
            "value": fields.Float,
            "unit": fields.String(enum=[e.value for e in UnitEnum]),
        },
    ),
}


@ingredients_api_ns.route("/")
@ingredients_api_ns.deprecated
class IngredientsAPI(Resource):

    @ingredients_api_ns.marshal_list_with(ingred_mdl["view"])
    @ingredients_api_ns.deprecated
    def get(self):
        return [i.as_dict() for i in IngredientManager.query_all()], HTTPStatus.OK


@ingredients_api_ns.route("/name")
class IngredientNamesAPI(Resource):

    @ingredients_api_ns.response(
        HTTPStatus.OK,
        "Get list of unique ingredient names.",
        fields.String(example=["ingredient1", "ingredient2"]), envelope="names",
    )
    def get(self):
        return {"names": IngredientManager.get_names()}, HTTPStatus.OK


@ingredients_api_ns.route("/<_id>")
@ingredients_api_ns.doc(data={"_id": "Ingredient's ID."})
class IngredientAPI(Resource):

    @ingredients_api_ns.doc(description="Retrieve an ingredient.")
    @ingredients_api_ns.response(
        HTTPStatus.OK, "Success", ingred_mdl["view"]
    )
    @ingredients_api_ns.response(
        **message_response_dict("Ingredient not found.", "Ingredient not found.")
    )
    def get(self, _id: str):
        ingredient = IngredientManager.query_by_id(_id)
        if not ingredient:
            return error_message("Ingredient not found.")
        return ingredient.as_dict(), HTTPStatus.OK

    @ingredients_api_ns.doc(description="Update an ingredient.")
    @ingredients_api_ns.expect(ingred_mdl["new"])
    @ingredients_api_ns.response(
        HTTPStatus.OK, "Success", ingred_mdl["view"]
    )
    @ingredients_api_ns.response(
        **message_response_dict("Ingredient not found.", "Ingredient not found.")
    )
    def patch(self, _id: str):
        # TODO: require auth
        data = ingredients_api_ns.payload
        ingredient = IngredientManager.update_one(_id, **data)
        if not ingredient:
            return error_message("Ingredient not found.")
        ingredient = IngredientManager.update_obj(ingredient, **data)
        return ingredient.as_dict()

    @ingredients_api_ns.doc(description="Delete an ingredient.")
    @ingredients_api_ns.response(
        **message_response_dict(
            "Operation result.", "Ingredient ingredient_id deleted.", HTTPStatus.OK
        )
    )
    def delete(self, _id: str):
        # TODO: require auth
        ingredient = IngredientManager.query_by_id(_id)
        if not ingredient:
            return response_ok("Nothing deleted.")
        IngredientManager.delete_obj(ingredient)
        return response_ok(f"Ingredient {ingredient.ID} deleted.")
