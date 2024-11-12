from flask_restx import Namespace, Resource, fields
from flask_restx.api import HTTPStatus

from utils import response_ok

auth_ns_api = Namespace(
    "Auth", description="All endpoints related to authentication.", path="/auth"
)

@auth_ns_api.route("/login")
class AuthLogin(Resource):

    def post(self):
        return response_ok("User logged in.")

@auth_ns_api.route("/register")
class AuthRegister(Resource):

    def post(self):
        return response_ok("User registered.")

@auth_ns_api.route("/logout")
class AuthLogout(Resource):

    def get(self):
        return response_ok("User logged out.")
