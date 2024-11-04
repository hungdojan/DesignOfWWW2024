import api.ingredients_api as ing_api
from flask_restx import Namespace, Resource, fields, inputs, marshal
from flask_restx.api import HTTPStatus
from models.images import ImageManager
from models.recipes import RecipeDifficulty, RecipeManager
from models.users import UserManager
from utils import allowed_files, error_message, message_response_dict, response_ok
from werkzeug.datastructures import FileStorage

recipes_api_ns = Namespace(
    "Recipes", description="All endpoints related to recipes.", path="/recipes"
)

# file upload parser
upload_parser = recipes_api_ns.parser()
upload_parser.add_argument("file", location="files", type=FileStorage, required=True)


# get filter parser
get_filter_parser = recipes_api_ns.parser()
get_filter_parser.add_argument(
    "isExternal", help="Choose only externalPages", type=inputs.boolean
)
get_filter_parser.add_argument("byAuthor", help="Author's unique field.")
get_filter_parser.add_argument(
    "ingredients", help="List of ingredients (separated by comma).", action="split"
)
get_filter_parser.add_argument(
    "cookingTimeLonger",
    help="Select recipes with longer cooking time then given value.",
    type=int,
    default=0,
)
get_filter_parser.add_argument(
    "cookingTimeShorter",
    help="Select recipes with shorter cooking time then given value.",
    type=int,
    default=-1,
)

_source_mdl = recipes_api_ns.model(
    "Source structure",
    {
        "isExternal": fields.Boolean,
        "userID": fields.String,
        "name": fields.String,
        "externalPage": fields.String,
    },
)
recipe_mdl = {
    "new": recipes_api_ns.model(
        "RecipeNew",
        {
            "name": fields.String,
            "timeCreated": fields.DateTime,
            "expectedTime": fields.Integer,
            "difficulty": fields.String(enum=[e.value for e in RecipeDifficulty]),
            "description": fields.String,
            "instructions": fields.String,
            "ingredients": fields.List(fields.Nested(ing_api.ingred_mdl["new"])),
        },
    ),
    "update": recipes_api_ns.model(
        "RecipeUpdate",
        {
            "name": fields.String,
            "timeCreated": fields.DateTime,
            "expectedTime": fields.Integer,
            "difficulty": fields.String(enum=[e.value for e in RecipeDifficulty]),
            "description": fields.String,
            "instructions": fields.String,
        },
    ),
    "short_view": recipes_api_ns.model(
        "RecipeView",
        {
            "ID": fields.String,
            "name": fields.String,
            "source": fields.Nested(_source_mdl, skip_none=True),
            "timeCreated": fields.DateTime,
            "expectedTime": fields.Integer,
            "difficulty": fields.String(enum=[e.value for e in RecipeDifficulty]),
            "description": fields.String,
            "instructions": fields.String,
        },
    ),
    "full_view": recipes_api_ns.model(
        "RecipeFullView",
        {
            "ID": fields.String,
            "name": fields.String,
            "source": fields.Nested(_source_mdl, skip_none=True),
            "timeCreated": fields.DateTime,
            "expectedTime": fields.Integer,
            "difficulty": fields.String(enum=[e.value for e in RecipeDifficulty]),
            "description": fields.String,
            "instructions": fields.String,
            "ingredients": fields.List(fields.Nested(ing_api.ingred_mdl["view"])),
        },
    ),
}


def fill_source(_dict: dict) -> dict:
    """Fill dict with nested source structure (defined in recipe_api)."""
    authorID = _dict.pop("authorID")
    external_page = _dict.pop("externalPage")

    _dict.update({"source": {}})
    if external_page:
        _dict["source"].update({"isExternal": True, "externalPage": external_page})
    else:
        user = UserManager.query_by_id(authorID)
        _dict["source"].update(
            {
                "isExternal": False,
                "userID": user.ID if user else "",
                "name": user.name if user else "",
            }
        )
    return _dict


@recipes_api_ns.route("/")
class RecipesAPI(Resource):

    @recipes_api_ns.doc(
        description="Get the recipes based on the filter.",
        parser=get_filter_parser,
    )
    @recipes_api_ns.marshal_list_with(recipe_mdl["short_view"])
    def get(self):

        args = get_filter_parser.parse_args()
        return [
            fill_source(g.as_dict())
            for g in RecipeManager.query_recipe_by_filter(**args)
        ], HTTPStatus.OK


@recipes_api_ns.route("/<_id>")
@recipes_api_ns.doc(data={"_id": "Recipe's ID."})
class RecipeAPI(Resource):

    @recipes_api_ns.doc(description="Retrieve recipe.")
    @recipes_api_ns.response(HTTPStatus.OK, "Success.", recipe_mdl["full_view"])
    @recipes_api_ns.response(
        **message_response_dict("Recipe not found", "Recipe not found.")
    )
    def get(self, _id: str):
        recipe = RecipeManager.query_by_id(_id)
        if not recipe:
            return error_message("Recipe not found.")
        _dict = fill_source(recipe.serialize())
        return marshal(_dict, recipe_mdl["full_view"]), HTTPStatus.OK

    @recipes_api_ns.doc(description="Update recipe.")
    @recipes_api_ns.expect(recipe_mdl["update"])
    @recipes_api_ns.response(HTTPStatus.OK, "Success.", recipe_mdl["short_view"])
    @recipes_api_ns.response(
        **message_response_dict("Recipe not found", "Recipe not found.")
    )
    def patch(self, _id: str):
        # TODO: require auth
        data = recipes_api_ns.payload
        recipe = RecipeManager.query_by_id(_id)
        if not recipe:
            return error_message("Recipe not found.")

        recipe = RecipeManager.update_obj(recipe, **data)
        return marshal(fill_source(recipe.as_dict()), recipe_mdl["short_view"])

    @recipes_api_ns.doc(description="Delete a recipe.")
    @recipes_api_ns.response(
        **message_response_dict(
            "Operation result.", "Recipe recipe_id deleted.", HTTPStatus.OK
        )
    )
    def delete(self, _id: str):
        # TODO: require auth
        recipe = RecipeManager.query_by_id(_id)
        if not recipe:
            return response_ok("Nothing deleted.")

        RecipeManager.delete_obj(recipe)
        return response_ok(f"Recipe {recipe.ID} deleted.")


@recipes_api_ns.route("/<_id>/image")
@recipes_api_ns.doc(data={"_id": "Recipe's ID."})
class RecipeImageAPI(Resource):

    @recipes_api_ns.doc(description="Get recipe image's ids.")
    @recipes_api_ns.response(
        HTTPStatus.OK,
        "Success",
        fields.String(example=["image_id1", "image_id2"]),
        envelope="image_ids",
    )
    def get(self, _id: str):
        recipe = RecipeManager.query_by_id(_id)
        if not recipe:
            return {"images_ids": []}
        images = ImageManager.query_by_filter(recipeID=recipe.ID)
        return {"images_ids": [i.ID for i in images]}

    @recipes_api_ns.doc(description="Add new image to a recipe.", parser=upload_parser)
    @recipes_api_ns.response(
        **message_response_dict("Recipe not found.", "Recipe not found.")
    )
    @recipes_api_ns.response(
        **message_response_dict(
            "File extension not supported.",
            "File extension not supported.",
            HTTPStatus.UNSUPPORTED_MEDIA_TYPE,
        )
    )
    @recipes_api_ns.response(
        HTTPStatus.CREATED,
        "Image added.",
        fields.String(example="image_id"),
        envelope="image_id",
    )
    def post(self, _id: str):
        # TODO: require auth
        args = upload_parser.parse_args()
        upload_file: FileStorage = args["file"]

        recipe = RecipeManager.query_by_id(_id)
        if not recipe:
            return error_message("Recipe not found.")

        if not allowed_files(str(upload_file.filename)):
            return error_message(
                "File extension not supported", HTTPStatus.UNSUPPORTED_MEDIA_TYPE
            )

        image = ImageManager.insert_new_image(upload_file, recipeID=recipe.ID)
        return {"image_id": image.ID}


@recipes_api_ns.route("/<_id>/image/<image_id>")
@recipes_api_ns.doc(
    description="Remove the image from the recipe.",
    data={"_id": "Recipe's ID.", "image_id": "Image's ID."},
)
class RecipeDeleteImageAPI(Resource):

    @recipes_api_ns.response(
        **message_response_dict(
            "Recipe not found.",
            "Recipe not found.",
            code=HTTPStatus.BAD_REQUEST,
        )
    )
    @recipes_api_ns.response(
        **message_response_dict(
            "Number of images that has been delete.",
            "Deleted 1 image(s).",
            code=HTTPStatus.OK,
        )
    )
    def delete(self, _id: str, image_id: str):
        # TODO: require auth
        recipe = RecipeManager.query_by_id(_id)
        if not recipe:
            return error_message("Recipe not found.")
        nof_images = ImageManager.remove_image(image_id, _id)
        return response_ok(f"Deleted {len(nof_images)} image(s).")
