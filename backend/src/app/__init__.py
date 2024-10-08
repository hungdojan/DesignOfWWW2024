import mysql.connector
from flask import Flask
from models import DB
from routes.database_api import database_api
from routes.echo import echo


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.update(
        SECRET_KEY="nv6Ly5pXuAeV7VOWKWFWOZMTqei9JxMV",
        SQLALCHEMY_DATABASE_URI="mysql://root:password@database:3306/db",
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        UPDATE_FOLDER="/data",
        MAX_CONTENT_LENGTH=10_000_000,
    )

    DB.init_app(app)

    app.register_blueprint(echo)
    app.register_blueprint(database_api)
    return app
