from flask import request
from flask_restx import Namespace, Resource, fields
from flask_restx.api import HTTPStatus
from models.images import ImageManager
from utils import error_message, response_ok

images_api_ns = Namespace(
    "Images", description="All endpoints related to images.", path="/images"
)

image_mdl = {
    "new": images_api_ns.model(
        "ImageNew", {"recipeID": fields.String, "target": fields.String}
    ),
    "view": images_api_ns.model(
        "ImageView",
        {"ID": fields.String, "recipeID": fields.String, "target": fields.String},
    ),
}


@images_api_ns.route("/")
class ImagesAPI(Resource):

    @images_api_ns.marshal_list_with(image_mdl["view"])
    def get(self):
        return [g.as_dict() for g in ImageManager.query_all()], HTTPStatus.OK

    @images_api_ns.expect(image_mdl["new"])
    @images_api_ns.marshal_with(image_mdl["view"])
    def post(self):
        data = request.get_json()

        try:
            image = ImageManager.insert_one(name=data["name"])
        except TypeError:
            return error_message("Missing name parameter")

        return image.as_dict(), HTTPStatus.CREATED

    @images_api_ns.expect(image_mdl["view"])
    @images_api_ns.marshal_with(image_mdl["view"])
    def patch(self):
        data = request.get_json()
        if not data.get("ID"):
            return error_message("ID not provided.")
        _id = data.pop("ID")
        image = ImageManager.update_one(_id, **data)
        if not image:
            return error_message("Image not found.")
        return image.as_dict()

@images_api_ns.route("/<_id>")
@images_api_ns.doc(data={"_id": "Image's ID."})
class ImageAPI(Resource):

    @images_api_ns.marshal_with(image_mdl["view"])
    def get(self, _id: str):
        image = ImageManager.query_by_id(_id)
        _dict = {}
        if image:
            _dict = image.as_dict()
        return _dict, HTTPStatus.OK

    def delete(self, _id: str):
        ImageManager.delete_by_id(_id)
        return response_ok("OK")
