from flask import Blueprint
echo = Blueprint('echo', __name__, url_prefix='/echo')

@echo.route('')
def echo_func():
    return {"hello": "world"}
