from flask_restx import Api
from .debug_api import debug_api_ns

api = Api(
    title="FoodTipsAPI",
    version="1.0.0",
)

api.add_namespace(debug_api_ns)
