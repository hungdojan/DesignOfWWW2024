from flask import send_file
from flask_restx import Namespace, Resource, fields
from flask_restx.api import HTTPStatus
from models.images import ImageManager
from utils import error_message, message_response_dict
import pathlib

images_api_ns = Namespace(
    "Images", description="All endpoints related to images.", path="/images"
)

image_mdl = {
    "view": images_api_ns.model(
        "ImageView",
        {"ID": fields.String, "recipeID": fields.String, "target": fields.String},
    ),
}

@images_api_ns.route("/")
@images_api_ns.deprecated
class ImagesAPI(Resource):

    @images_api_ns.marshal_list_with(image_mdl["view"])
    def get(self):
        return [i.as_dict() for i in ImageManager.query_all()]

@images_api_ns.route("/<_id>")
@images_api_ns.doc(description="Download data.", data={"_id": "Image's ID."})
class ImageAPI(Resource):

    @images_api_ns.response(
        **message_response_dict("Image not found.", "Image not found")
    )
    @images_api_ns.response(
        HTTPStatus.OK, "Image binary.", headers={"Content-Type": "image/*"}
    )
    @images_api_ns.produces(["image/png", "image/jpg"])
    def get(self, _id: str):
        image = ImageManager.query_by_id(_id)
        if not image:
            return error_message("Image not found.")

        filepath = pathlib.Path(image.target)
        file_ext = filepath.suffix[1:]

        return send_file(filepath, mimetype=f"image/{file_ext}")
