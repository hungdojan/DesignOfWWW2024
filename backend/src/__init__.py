from flask import Flask
from .routes.echo import echo

def create_app() -> Flask:
    app = Flask(__name__)

    app.register_blueprint(echo)
    return app
