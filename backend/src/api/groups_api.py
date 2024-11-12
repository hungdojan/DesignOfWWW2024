import api.shopping_lists_api as shl_api
from flask_restx import Namespace, Resource, fields
from flask_restx.api import HTTPStatus
from models.groups import GroupManager
from models.shopping_list import ShoppingListManager
from utils import error_message, message_response_dict, response_ok

groups_api_ns = Namespace(
    "Groups", description="All endpoints related to groups.", path="/groups"
)

group_user_id_parser = groups_api_ns.parser()
group_user_id_parser.add_argument(
    "user_ids", help="User IDs seperated by comma.", action="split", location="form"
)


group_mdl = {
    "new": groups_api_ns.model("GroupsNew", {"name": fields.String}),
    "view": groups_api_ns.model(
        "GroupsView", {"ID": fields.String, "name": fields.String}
    ),
}


@groups_api_ns.route("/")
class GroupsAPI(Resource):

    @groups_api_ns.deprecated
    @groups_api_ns.marshal_list_with(group_mdl["view"])
    def get(self):
        return [g.as_dict() for g in GroupManager.query_all()]

    @groups_api_ns.doc(description="Create a new group.")
    @groups_api_ns.expect(group_mdl["new"])
    @groups_api_ns.response(
        **message_response_dict("Missing parameter", "Missing name parameter.")
    )
    @groups_api_ns.response(
        HTTPStatus.CREATED, "Successfully created", group_mdl["view"]
    )
    def post(self):
        # TODO: require auth
        data = groups_api_ns.payload

        try:
            group = GroupManager.insert_one(**data, users=[])
        except TypeError:
            return error_message("Missing name parameter.")

        return group.as_dict(), HTTPStatus.CREATED


@groups_api_ns.route("/<_id>")
@groups_api_ns.doc(data={"_id": "Group's ID."})
class GroupAPI(Resource):

    @groups_api_ns.doc(description="Retrieve the selected group.")
    @groups_api_ns.response(HTTPStatus.OK, "Success", group_mdl["view"])
    @groups_api_ns.response(
        **message_response_dict("Group not found", "Group not found.")
    )
    def get(self, _id: str):
        # TODO: require auth
        group = GroupManager.query_by_id(_id)
        if not group:
            return error_message("Group not found.")
        return group.as_dict(), HTTPStatus.OK

    @groups_api_ns.doc(description="Update group data.")
    @groups_api_ns.expect(group_mdl["new"])
    @groups_api_ns.response(HTTPStatus.OK, "Success", group_mdl["view"])
    @groups_api_ns.response(
        **message_response_dict("Group not found.", "Group not found.")
    )
    def patch(self, _id: str):
        # TODO: require auth
        data = groups_api_ns.payload
        group = GroupManager.query_by_id(_id)
        if not group:
            return error_message("Group not found.")
        group = GroupManager.update_obj(group, **data)
        return group.as_dict(), HTTPStatus.OK

    @groups_api_ns.doc(description="Delete a group.")
    @groups_api_ns.response(
        **message_response_dict(
            "Operation result.", "Group group_id deleted.", HTTPStatus.OK
        )
    )
    def delete(self, _id: str):
        # TODO: require auth
        group = GroupManager.query_by_id(_id)
        if not group:
            return response_ok("Nothing deleted.")
        GroupManager.delete_obj(group)
        return response_ok(f"Group {_id} deleted.")


@groups_api_ns.route("/<_id>/users")
@groups_api_ns.doc(data={"_id": "Group's ID."})
class GroupUsersAPI(Resource):

    @groups_api_ns.doc(
        description="Get list of users in the group.",
    )
    @groups_api_ns.response(
        HTTPStatus.OK, "Success", fields.List(fields.String(example="user_id"))
    )
    @groups_api_ns.response(
        **message_response_dict("Group not found.", "Group not found.")
    )
    def get(self, _id: str):
        # TODO: require auth
        group = GroupManager.query_by_id(_id)
        if not group:
            return error_message("Group not found.")
        return [u.ID for u in group.users]

    @groups_api_ns.doc(
        description="Add users to the group.", parser=group_user_id_parser
    )
    @groups_api_ns.response(
        HTTPStatus.OK, "Success.", fields=fields.String("user_id"), envelope="added"
    )
    @groups_api_ns.response(
        **message_response_dict("Group not found.", "Group not found.")
    )
    def post(self, _id: str):
        # TODO: require auth
        args = group_user_id_parser.parse_args()

        group = GroupManager.query_by_id(_id)
        if not group:
            return error_message("Group not found.")

        new_user_ids = GroupManager.add_users_to_group(group, args["user_ids"])
        return {"added": new_user_ids}

    @groups_api_ns.doc(
        description="Delete users from the group.", parser=group_user_id_parser
    )
    @groups_api_ns.response(
        HTTPStatus.OK, "Success.", fields=fields.String("user_id"), envelope="deleted"
    )
    @groups_api_ns.response(
        **message_response_dict("Group not found.", "Group not found.")
    )
    def put(self, _id: str):
        # TODO: require auth
        args = group_user_id_parser.parse_args()
        group = GroupManager.query_by_id(_id)
        if not group:
            return error_message("Group not found.")

        deleted_ids = GroupManager.remove_users_from_group(group, args["user_ids"])
        return {"deleted": deleted_ids}


@groups_api_ns.route("/<_id>/shop_list")
@groups_api_ns.doc(data={"_id": "Group's ID."})
class GroupShoppingListAPI(Resource):

    @groups_api_ns.doc(
        description="Get list of shopping lists for the given group.",
    )
    @groups_api_ns.response(
        HTTPStatus.OK, "Success", fields.List(fields.String(example="shopping_list_id"))
    )
    def get(self, _id: str):
        # TODO: require auth
        shopping_lists = ShoppingListManager.query_by_filter(groupID=_id)
        return [sl.ID for sl in shopping_lists]

    @groups_api_ns.expect(shl_api.shop_list_mdl["new"])
    @groups_api_ns.doc(
        description="Create and assign a new shopping list to the group."
    )
    @groups_api_ns.response(
        **message_response_dict("Group not found.", "Group not found.")
    )
    @groups_api_ns.response(
        HTTPStatus.CREATED,
        "Success",
        fields.String(example="shopping_list_id"),
        envelope="shopping_list_id",
    )
    def post(self, _id: str):
        # TODO: require auth
        group = GroupManager.query_by_id(_id)
        if not group:
            return error_message("Group not found.")

        data = groups_api_ns.payload
        shop_list = ShoppingListManager.insert_one(**data, groupID=_id, items=[])
        return {"shopping_list_id": shop_list.ID}
