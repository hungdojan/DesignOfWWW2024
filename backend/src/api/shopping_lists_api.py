import api.shopping_items_api as shi_api
from flask_restx import Namespace, Resource, fields
from flask_restx.api import HTTPStatus
from models.shopping_item import ShoppingItemManager
from models.shopping_list import ShoppingListManager
from utils import error_message, message_response_dict, response_ok

shopping_lists_api_ns = Namespace(
    "ShoppingLists",
    description="All endpoints related to shopping_lists.",
    path="/shopping_lists",
)

shop_list_mdl = {
    "new": shopping_lists_api_ns.model(
        "ShoppingListNew",
        {
            "name": fields.String(min_length=1),
        },
    ),
    "short_view": shopping_lists_api_ns.model(
        "ShoppingListView",
        {
            "ID": fields.String,
            "name": fields.String,
            "groupID": fields.String,
        },
    ),
    "full_view": shopping_lists_api_ns.model(
        "ShoppingListFullView",
        {
            "ID": fields.String,
            "name": fields.String,
            "groupID": fields.String,
            "items": fields.List(fields.Nested(shi_api.shop_item_mdl["view"])),
        },
    ),
}


@shopping_lists_api_ns.route("/")
@shopping_lists_api_ns.deprecated
class ShoppingListsAPI(Resource):

    @shopping_lists_api_ns.marshal_list_with(shop_list_mdl["full_view"])
    def get(self):
        return [g.serialize() for g in ShoppingListManager.query_all()]


@shopping_lists_api_ns.route("/<_id>")
@shopping_lists_api_ns.doc(data={"_id": "ShoppingList's ID."})
class ShoppingListAPI(Resource):

    @shopping_lists_api_ns.response(
        **message_response_dict("Shopping list not found.", "Shopping list not found.")
    )
    @shopping_lists_api_ns.response(
        HTTPStatus.OK, "Success", shop_list_mdl["full_view"]
    )
    @shopping_lists_api_ns.doc(description="Retrieve shopping list data.")
    def get(self, _id: str):
        # TODO: require auth
        shopping_list = ShoppingListManager.query_by_id(_id)
        if not shopping_list:
            return error_message("Shopping list not found.")
        return shopping_list.serialize(), HTTPStatus.OK

    @shopping_lists_api_ns.doc("Update a shopping list data.")
    @shopping_lists_api_ns.expect(shop_list_mdl["new"])
    @shopping_lists_api_ns.response(
        HTTPStatus.OK, "Success", shop_list_mdl["short_view"]
    )
    @shopping_lists_api_ns.response(
        **message_response_dict("Shopping list not found.", "Shopping list not found.")
    )
    def patch(self, _id: str):
        # TODO: require auth
        data = shopping_lists_api_ns.payload

        shop_list = ShoppingListManager.query_by_id(_id)
        if not shop_list:
            return error_message("Shopping list not found.")

        shop_list = ShoppingListManager.update_obj(shop_list, **data)
        return shop_list.as_dict()

    @shopping_lists_api_ns.doc(description="Delete a shopping list.")
    @shopping_lists_api_ns.response(
        **message_response_dict(
            "Operation result.", "Shopping list shop_list_id deleted.", HTTPStatus.OK
        )
    )
    def delete(self, _id: str):
        # TODO: require auth
        shop_list = ShoppingListManager.query_by_id(_id)
        if not shop_list:
            return response_ok("Nothing deleted")

        ShoppingListManager.delete_obj(shop_list)
        return response_ok(f"Shopping list {_id} deleted.")


@shopping_lists_api_ns.route("<_id>/items")
@shopping_lists_api_ns.doc(params={"_id": "Shopping list's ID."})
class ShoppingListItemAPI(Resource):

    @shopping_lists_api_ns.doc(description="Retrieve all items from the shopping list.")
    @shopping_lists_api_ns.response(
        HTTPStatus.OK,
        "Success",
        fields.List(fields.Nested(shi_api.shop_item_mdl["view"])),
    )
    @shopping_lists_api_ns.response(
        **message_response_dict("Shopping list not found.", "Shopping list not found.")
    )
    def get(self, _id: str):
        # TODO: require auth
        shop_list = ShoppingListManager.query_by_id(_id)
        if not shop_list:
            return error_message("Shopping list not found.")
        return [i.as_dict() for i in shop_list.items]

    @shopping_lists_api_ns.doc(description="Add new item to the shopping list.")
    @shopping_lists_api_ns.expect(shi_api.shop_item_mdl["new"])
    @shopping_lists_api_ns.response(
        **message_response_dict(
            "Success.", "Item successfully added.", HTTPStatus.CREATED
        )
    )
    @shopping_lists_api_ns.response(
        **message_response_dict("Shopping list not found.", "Shopping list not found.")
    )
    def post(self, _id: str):
        # TODO: require auth
        data = shopping_lists_api_ns.payload
        shop_list = ShoppingListManager.query_by_id(_id)
        if not shop_list:
            return error_message("Shopping list not found.")

        _ = ShoppingItemManager.insert_one(**data, shoppingListID=shop_list.ID)
        return {"message": "Item successfully added."}, HTTPStatus.CREATED


@shopping_lists_api_ns.route("<_id>/items/<item_id>")
@shopping_lists_api_ns.doc(
    params={"_id": "Shopping list's ID.", "item_id": "Shopping item's ID."}
)
class ShoppingListItemDeleteAPI(Resource):
    @shopping_lists_api_ns.doc(description="Remove an item from the shopping list.")
    @shopping_lists_api_ns.response(
        **message_response_dict(
            "Operation result.", "Successfully deleted 1 item.", HTTPStatus.OK
        )
    )
    @shopping_lists_api_ns.response(
        **message_response_dict("Shopping list not found.", "Shopping list not found.")
    )
    def delete(self, _id: str, item_id: str):
        # TODO: require auth
        shop_list = ShoppingListManager.query_by_id(_id)
        if not shop_list:
            return error_message("Shopping list not found.")

        res = ShoppingItemManager.query_by_filter(ID=item_id, shoppingListID=_id)
        shi_ids = [si.ID for si in res]
        ShoppingItemManager.delete_many(shi_ids)
        return {"message": f"Successfully deleted {len(shi_ids)} items."}
