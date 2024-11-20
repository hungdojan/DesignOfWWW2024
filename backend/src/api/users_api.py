from flask_login import login_required, current_user
import api.recipes_api as rcp_api
import api.shopping_lists_api as shl_api
from api.recipes_api import fill_source
from flask_restx import Namespace, Resource, fields, marshal
from flask_restx.api import HTTPStatus
from models.groups import GroupManager
from models.shopping_list import ShoppingListManager
from models.recipes import RecipeManager
from models.users import UserManager, UserRole
from utils import error_message, message_response_dict, response_ok

users_api_ns = Namespace(
    "Users", description="All endpoints related to users.", path="/users"
)

user_mdl = {
    "new": users_api_ns.model(
        "UserNew",
        {
            "username": fields.String,
            "name": fields.String,
            "email": fields.String,
        },
    ),
    "view": users_api_ns.model(
        "UserView",
        {
            "ID": fields.String,
            "username": fields.String,
            "role": fields.String(enum=[e.value for e in UserRole]),
            "name": fields.String,
            "email": fields.String,
        },
    ),
    "author": users_api_ns.model(
        "UserAuthor",
        {
            "ID": fields.String,
            "username": fields.String,
        },
    ),
}


@users_api_ns.route("/")
@users_api_ns.deprecated
class UsersAPI(Resource):

    @users_api_ns.marshal_list_with(user_mdl["view"])
    def get(self):
        return [g.as_dict() for g in UserManager.query_all()], HTTPStatus.OK

    @users_api_ns.doc(description="Create a new user.")
    @users_api_ns.expect(user_mdl["new"])
    @users_api_ns.response(
        HTTPStatus.CREATED, "Created", user_mdl["view"]
    )
    @users_api_ns.response(
        **message_response_dict("Error while processing.", "Missing parameter.")
    )
    def post(self):
        data = users_api_ns.payload

        try:
            user = UserManager.insert_one(
                **data, role=UserRole.User, groups=[], favorites=[]
            )
        except TypeError:
            return error_message("Missing name parameter")

        return user.as_dict(), HTTPStatus.CREATED


@users_api_ns.route("/<_id>")
@users_api_ns.doc(data={"_id": "User's ID."})
class UserAPI(Resource):

    @users_api_ns.doc(description="Retrive user data.")
    @users_api_ns.response(
        HTTPStatus.OK, "Created", user_mdl["view"]
    )
    @users_api_ns.response(
        **message_response_dict("User not found.", "User not found.")
    )
    def get(self, _id: str):
        # TODO: require auth
        user = UserManager.query_by_id(_id)
        if not user:
            return error_message("User not found.")
        return user.as_dict(), HTTPStatus.OK

    @users_api_ns.doc(description="Update user data.")
    @users_api_ns.expect(user_mdl["new"])
    @users_api_ns.response(
        HTTPStatus.OK, "Created", user_mdl["view"]
    )
    @users_api_ns.response(
        **message_response_dict("User not found.", "User not found.")
    )
    def patch(self, _id: str):
        # TODO: require auth
        data = users_api_ns.payload
        user = UserManager.query_by_id(_id)
        if not user:
            return error_message("User not found.")

        user = UserManager.update_obj(user, **data)
        return user.as_dict()

    @users_api_ns.doc(description="Delete a user.")
    @users_api_ns.response(
        **message_response_dict(
            "Operation result.", "User user_id deleted.", HTTPStatus.OK
        )
    )
    def delete(self, _id: str):
        # TODO: require auth
        user = UserManager.query_by_id(_id)
        if not user:
            return response_ok("Nothing deleted.")
        UserManager.delete_obj(user)
        return response_ok(f"User {user.ID} deleted.")


@users_api_ns.route("/<_id>/recipes")
@users_api_ns.doc(data={"_id": "User's ID."})
class UserRecipeAPI(Resource):

    @users_api_ns.doc(description="Retrive user recipes.")
    @users_api_ns.response(
        **message_response_dict("User not found.", "User not found.")
    )
    @users_api_ns.response(
        HTTPStatus.OK,
        "Success",
        fields.List(fields.Nested(rcp_api.recipe_mdl["short_view"])),
    )
    def get(self, _id: str):
        import api.recipes_api as rcp_api

        user = UserManager.query_by_id(_id)
        if not user:
            return error_message("User not found.")
        res = RecipeManager.query_by_filter(authorID=user.ID)
        return marshal(
            [fill_source(r.as_dict()) for r in res], rcp_api.recipe_mdl["short_view"]
        )

    @users_api_ns.doc(description="Create a new recipe.")
    @users_api_ns.expect(rcp_api.recipe_mdl["new"], HTTPStatus.CREATED)
    @users_api_ns.response(
        HTTPStatus.CREATED,
        "Success",
        rcp_api.recipe_mdl["short_view"],
    )
    @users_api_ns.response(
        **message_response_dict("Error while processing", "Missing parameters.")
    )
    def post(self, _id: str):
        # TODO: require auth
        data = users_api_ns.payload
        user = UserManager.query_by_id(_id)
        if not user:
            return error_message("User not found.")

        try:
            recipe = RecipeManager.insert_new_recipe(**data, authorID=user.ID)
        except TypeError:
            return error_message("Missing parameters")
        return (
            marshal(fill_source(recipe.as_dict()), rcp_api.recipe_mdl["short_view"]),
            HTTPStatus.CREATED,
        )


@users_api_ns.route("/<_id>/groups")
class UserGroupsAPI(Resource):

    import api.groups_api as grp_api

    @users_api_ns.doc(
        description="Retrieve a list of all the group that the user is part of."
    )
    @users_api_ns.response(
        HTTPStatus.OK, "Success", fields.List(fields.Nested(grp_api.group_mdl["view"]))
    )
    @users_api_ns.response(
        **message_response_dict("User not found.", "User not found.")
    )
    def get(self, _id: str):
        import api.groups_api as grp_api

        # TODO: require auth
        user = UserManager.query_by_id(_id)
        if not user:
            return error_message("User not found.")

        return marshal(user.groups, grp_api.group_mdl["view"])


@users_api_ns.route("/shop_lists")
class UserShoppingListAPI(Resource):

    @users_api_ns.doc(description="Retrieve a list of all shopping lists.")
    @users_api_ns.response(
        HTTPStatus.OK,
        "Success",
        fields.List(fields.Nested(shl_api.shop_list_mdl["short_view"])),
    )
    @users_api_ns.response(
        **message_response_dict("User not found.", "User not found.")
    )
    
    @login_required
    def get(self):
        user = UserManager.query_by_id(current_user.id)
        if not user:
            return error_message("User not found.")

        shopping_lists = UserManager.retrieve_shopping_lists(user)
        return marshal(shopping_lists, shl_api.shop_list_mdl["short_view"])
    
    @users_api_ns.doc("Create a shopping list.")
    @users_api_ns.expect(shl_api.shop_list_mdl["new"])
    @users_api_ns.response(
        HTTPStatus.CREATED,
        "Success",
        fields.String(example="shop_list_id"),
        envelope="shopping_list_id"
    )
    @users_api_ns.response(
        **message_response_dict("User not found.", "User not found.")
    )

    @login_required
    def post(self):
        user_id = current_user.id
        user = UserManager.query_by_id(user_id)
        if not user:
            return error_message("User not found.")

        data = users_api_ns.payload
        group = GroupManager.insert_one(name=f"Group_{data['name']}", users=[])
        GroupManager.add_users_to_group(group, [user_id])
        shop_list = ShoppingListManager.insert_one(**data, groupID=group.ID, items=[])
        return {"shopping_list_id": shop_list.ID}, HTTPStatus.CREATED
