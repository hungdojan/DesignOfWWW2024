from flask import request
from flask_restx import Namespace, Resource, fields
from flask_restx.api import HTTPStatus
from models.users import UserManager
from utils import error_message

users_api_ns = Namespace(
    "Users", description="All endpoints related to users.", path="/users"
)

user_mdl = {
    "new": users_api_ns.model(
        "UserNew",
        {
            "username": fields.String,
            "role": fields.String,
            "name": fields.String,
            "email": fields.String,
        },
    ),
    "view": users_api_ns.model(
        "UserView",
        {
            "ID": fields.String,
            "username": fields.String,
            "role": fields.String,
            "name": fields.String,
            "email": fields.String,
        },
    ),
}


@users_api_ns.route("/")
class UsersAPI(Resource):

    @users_api_ns.marshal_list_with(user_mdl["view"])
    def get(self):
        # TODO: user query
        return [g.as_dict() for g in UserManager.query_all()], HTTPStatus.OK

    @users_api_ns.expect(user_mdl["new"])
    @users_api_ns.marshal_with(user_mdl["view"])
    def post(self):
        data = request.get_json()

        try:
            user = UserManager.insert_one(name=data["name"])
        except TypeError:
            return error_message("Missing name parameter")

        return user.as_dict(), HTTPStatus.CREATED


@users_api_ns.route("/<_id>")
@users_api_ns.doc(data={"_id": "User's ID."})
class UserAPI(Resource):

    @users_api_ns.marshal_with(user_mdl["view"])
    def get(self, _id: str):
        user = UserManager.query_by_id(_id)
        _dict = {}
        if user:
            _dict = user.as_dict()
        return _dict, HTTPStatus.OK

    @users_api_ns.expect(user_mdl["view"])
    @users_api_ns.marshal_with(user_mdl["view"])
    def patch(self, _id: str):
        data = request.get_json()
        user = UserManager.update_one(_id, **data)
        if not user:
            return error_message("User not found.")
        return user.as_dict()
