from flask import request
from flask_restx import Namespace, Resource, fields
from flask_restx.api import HTTPStatus
from models.groups import GroupManager
from utils import error_message

groups_api_ns = Namespace(
    "Groups", description="All endpoints related to groups.", path="/groups"
)

group_mdl = {
    "new": groups_api_ns.model("GroupsNew", {"name": fields.String}),
    "view": groups_api_ns.model(
        "GroupsView", {"ID": fields.String, "name": fields.String}
    ),
}


@groups_api_ns.route("/")
class GroupsAPI(Resource):

    @groups_api_ns.marshal_list_with(group_mdl["view"])
    def get(self):
        # TODO: user query
        return [g.as_dict() for g in GroupManager.query_all()], HTTPStatus.OK

    @groups_api_ns.expect(group_mdl["new"])
    @groups_api_ns.marshal_with(group_mdl["view"])
    def post(self):
        data = request.get_json()

        try:
            group = GroupManager.insert_one(name=data["name"])
        except TypeError:
            return error_message("Missing name parameter")

        return group.as_dict(), HTTPStatus.CREATED


@groups_api_ns.route("/<_id>")
@groups_api_ns.doc(data={"_id": "Group's ID."})
class GroupAPI(Resource):

    @groups_api_ns.marshal_with(group_mdl["view"])
    def get(self, _id: str):
        group = GroupManager.query_by_id(_id)
        _dict = {}
        if group:
            _dict = group.as_dict()
        return _dict, HTTPStatus.OK

    @groups_api_ns.expect(group_mdl["view"])
    @groups_api_ns.marshal_with(group_mdl["view"])
    def patch(self, _id: str):
        data = request.get_json()
        group = GroupManager.update_one(_id, **data)
        if not group:
            return error_message("Group not found.")
        return group.as_dict()
