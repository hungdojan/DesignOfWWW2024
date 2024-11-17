from flask_restx import Namespace, Resource, fields
from flask_restx.api import HTTPStatus
import api.users_api as usr
from utils import error_message, message_response_dict, response_ok
from models.users import UserManager, UserRole

from auth import login_manager
from flask_login import (
    current_user,
    login_required,
    login_user,
    logout_user,
)

auth_ns_api = Namespace(
    "Auth", description="All endpoints related to authentication.", path="/auth"
)


@login_manager.user_loader
def load_user(user_id):
    return UserManager.query_by_id(user_id)

@auth_ns_api.route("/login")
class AuthLogin(Resource):

    @auth_ns_api.doc(description="Create a new user.")
    @auth_ns_api.expect(usr.user_mdl["new"])
    @auth_ns_api.response(
        HTTPStatus.CREATED, "Created", usr.user_mdl["view"]
    )
    @auth_ns_api.response(
        **message_response_dict("Error while processing.", "Missing parameter.")
    )
    def post(self):
        data = auth_ns_api.payload


        user = UserManager.query_by_filter(username=data["username"])

        try:
            if not user:
                user = UserManager.insert_one(
                    **data, role=UserRole.User, groups=[], favorites=[]
                )
            else:
                user = user[0]
        except TypeError:
            return error_message("Missing name parameter")

    
        login_user(user)
    
        return user.as_dict(), HTTPStatus.CREATED

@auth_ns_api.route("/register")
class AuthRegister(Resource):

    def post(self):
        return response_ok("User registered.")

@auth_ns_api.route("/logout")
class AuthLogout(Resource):

    @login_required
    def get(self):
        logout_user()
        return response_ok("User logged out.")


@auth_ns_api.route("/status")
class AuthStatus(Resource):

    # @login_manager.user_loader
    def get(self):
        return {"authenticated": current_user.is_authenticated}