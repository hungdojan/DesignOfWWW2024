from flask import request
from flask_restx import Namespace, Resource, fields
from flask_restx.api import HTTPStatus
from models.shopping_list import ShoppingListManager
from utils import error_message, response_ok

shopping_lists_api_ns = Namespace(
    "ShoppingLists",
    description="All endpoints related to shopping_lists.",
    path="/shopping_lists",
)

shop_list_mdl = {
    "new": shopping_lists_api_ns.model("ShoppingListNew", {"name": fields.String}),
    "view": shopping_lists_api_ns.model(
        "ShoppingListView", {"ID": fields.String, "name": fields.String}
    ),
}


@shopping_lists_api_ns.route("/")
class ShoppingListsAPI(Resource):

    @shopping_lists_api_ns.marshal_list_with(shop_list_mdl["view"])
    def get(self):
        # TODO: user query
        return [g.as_dict() for g in ShoppingListManager.query_all()], HTTPStatus.OK

    @shopping_lists_api_ns.expect(shop_list_mdl["new"])
    @shopping_lists_api_ns.marshal_with(shop_list_mdl["view"])
    def post(self):
        data = request.get_json()

        try:
            shopping_list = ShoppingListManager.insert_one(name=data["name"])
        except TypeError:
            return error_message("Missing name parameter")

        return shopping_list.as_dict(), HTTPStatus.CREATED


    @shopping_lists_api_ns.expect(shop_list_mdl["view"])
    @shopping_lists_api_ns.marshal_with(shop_list_mdl["view"])
    def patch(self):
        data = request.get_json()
        if not data.get("ID"):
            return error_message("ID not provided.")
        _id = data.pop("ID")
        shopping_list = ShoppingListManager.update_one(_id, **data)
        if not shopping_list:
            return error_message("ShoppingList not found.")
        return shopping_list.as_dict()

@shopping_lists_api_ns.route("/<_id>")
@shopping_lists_api_ns.doc(data={"_id": "ShoppingList's ID."})
class ShoppingListAPI(Resource):

    @shopping_lists_api_ns.marshal_with(shop_list_mdl["view"])
    def get(self, _id: str):
        shopping_list = ShoppingListManager.query_by_id(_id)
        _dict = {}
        if shopping_list:
            _dict = shopping_list.as_dict()
        return _dict, HTTPStatus.OK

    def delete(self, _id: str):
        ShoppingListManager.delete_by_id(_id)
        return response_ok("OK")
