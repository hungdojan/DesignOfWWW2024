from flask import request
from flask_restx import Namespace, Resource, fields
from flask_restx.api import HTTPStatus
from models.images import ImageManager
from utils import error_message

images_api_ns = Namespace(
    "Images", description="All endpoints related to images.", path="/images"
)

image_model = images_api_ns.model(
    "Image", {"ID": fields.String, "recipeID": fields.String, "target": fields.String}
)


@images_api_ns.route("/")
class ImagesAPI(Resource):

    def get(self):
        return [g.as_dict() for g in ImageManager.query_all()], HTTPStatus.OK

    @images_api_ns.expect(image_model)
    def post(self):
        data = request.get_json()

        try:
            image = ImageManager.insert_one(name=data["name"])
        except TypeError:
            return error_message("Missing name parameter")

        return image.as_dict(), HTTPStatus.CREATED


@images_api_ns.route("/<_id>")
@images_api_ns.doc(data={"_id": "Image's ID."})
class ImageAPI(Resource):

    def get(self, _id: str):
        image = ImageManager.query_by_id(_id)
        _dict = {}
        if image:
            _dict = image.as_dict()
        return _dict, HTTPStatus.OK

    @images_api_ns.expect(image_model)
    def patch(self, _id: str):
        data = request.get_json()
        image = ImageManager.update_one(_id, **data)
        if not image:
            return error_message("Image not found.")
        return image.as_dict()
