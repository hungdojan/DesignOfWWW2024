from flask_restx import Namespace, Resource, fields
from flask_restx.api import HTTPStatus
from models.shopping_item import ShoppingItemManager
from utils import error_message, message_response_dict, response_ok

shopping_items_api_ns = Namespace(
    "ShoppingItems",
    description="All endpoints related to shopping_items.",
    path="/shop_items",
)

shop_item_mdl = {
    "new": shopping_items_api_ns.model(
        "ShoppingItemNew",
        {
            "total": fields.Integer,
            "name": fields.String,
            "completed": fields.Boolean(default=False),
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
@shopping_items_api_ns.deprecated
class ShoppingItemsAPI(Resource):

    @shopping_items_api_ns.marshal_list_with(shop_item_mdl["view"])
    def get(self):
        return [g.as_dict() for g in ShoppingItemManager.query_all()], HTTPStatus.OK


@shopping_items_api_ns.route("/<_id>")
@shopping_items_api_ns.doc(data={"_id": "ShoppingItem's ID."})
class ShoppingItemAPI(Resource):

    @shopping_items_api_ns.response(HTTPStatus.OK, "Success", shop_item_mdl["view"])
    @shopping_items_api_ns.doc(description="Retrieve a shopping item.")
    @shopping_items_api_ns.response(
        **message_response_dict("Shopping item not found.", "Shopping item not found.")
    )
    def get(self, _id: str):
        # TODO: require auth
        shop_item = ShoppingItemManager.query_by_id(_id)
        if not shop_item:
            return error_message("Shopping item not found.")
        return shop_item.as_dict()

    @shopping_items_api_ns.expect(shop_item_mdl["new"])
    @shopping_items_api_ns.response(HTTPStatus.OK, "Success", shop_item_mdl["view"])
    @shopping_items_api_ns.doc(description="Update a shopping item.")
    @shopping_items_api_ns.response(
        **message_response_dict("Shopping item not found.", "Shopping item not found.")
    )
    def patch(self, _id: str):
        # TODO: require auth
        data = shopping_items_api_ns.payload
        shop_item = ShoppingItemManager.query_by_id(_id)
        if not shop_item:
            return error_message("Shopping item not found.")

        shop_item = ShoppingItemManager.update_obj(shop_item, **data)
        return shop_item.as_dict()

    @shopping_items_api_ns.doc(description="Delete a shopping item.")
    @shopping_items_api_ns.response(
        **message_response_dict(
            "Operation result.", "Shopping item group_id deleted.", HTTPStatus.OK
        )
    )
    def delete(self, _id: str):
        # TODO: require auth
        shop_item = ShoppingItemManager.query_by_id(_id)
        if not shop_item:
            return response_ok("Nothing deleted.")

        ShoppingItemManager.delete_obj(shop_item)
        return response_ok(f"Shopping item {shop_item.ID} deleted.")
