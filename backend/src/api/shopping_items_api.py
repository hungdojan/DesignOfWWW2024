from flask import request
from flask_restx import Namespace, Resource, fields
from flask_restx.api import HTTPStatus
from models.shopping_item import ShoppingItemManager
from utils import error_message

shopping_items_api_ns = Namespace(
    "ShoppingItems",
    description="All endpoints related to shopping_items.",
    path="/shop_items",
)

shop_item_mdl = {
    "new": shopping_items_api_ns.model(
        "ShoppingItemNew",
        {
            "shoppingListID": fields.String,
            "total": fields.Integer,
            "name": fields.String,
            "completed": fields.Boolean,
        },
    ),
    "view": shopping_items_api_ns.model(
        "ShoppingItemView",
        {
            "ID": fields.String,
            "shoppingListID": fields.String,
            "total": fields.Integer,
            "name": fields.String,
            "completed": fields.Boolean,
        },
    ),
}


@shopping_items_api_ns.route("/")
class ShoppingItemsAPI(Resource):

    @shopping_items_api_ns.marshal_list_with(shop_item_mdl["view"])
    def get(self):
        # TODO: user query
        return [g.as_dict() for g in ShoppingItemManager.query_all()], HTTPStatus.OK

    @shopping_items_api_ns.expect(shop_item_mdl["new"])
    @shopping_items_api_ns.marshal_with(shop_item_mdl["view"])
    def post(self):
        data = request.get_json()

        try:
            shopping_item = ShoppingItemManager.insert_one(name=data["name"])
        except TypeError:
            return error_message("Missing name parameter")

        return shopping_item.as_dict(), HTTPStatus.CREATED


@shopping_items_api_ns.route("/<_id>")
@shopping_items_api_ns.doc(data={"_id": "ShoppingItem's ID."})
class ShoppingItemAPI(Resource):

    @shopping_items_api_ns.marshal_with(shop_item_mdl["view"])
    def get(self, _id: str):
        shopping_item = ShoppingItemManager.query_by_id(_id)
        _dict = {}
        if shopping_item:
            _dict = shopping_item.as_dict()
        return _dict, HTTPStatus.OK

    @shopping_items_api_ns.expect(shop_item_mdl["view"])
    @shopping_items_api_ns.marshal_with(shop_item_mdl["view"])
    def patch(self, _id: str):
        data = request.get_json()
        shopping_item = ShoppingItemManager.update_one(_id, **data)
        if not shopping_item:
            return error_message("ShoppingItem not found.")
        return shopping_item.as_dict()
