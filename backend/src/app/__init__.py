import mysql.connector
from api import api
from flask import Flask
from models import DB


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
    api.init_app(app)
    with app.app_context():
        DB.create_all()

    return app
