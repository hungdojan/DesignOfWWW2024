import os

import mysql.connector
from api import food_tips_api
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from models import DB

from auth import login_manager

load_dotenv()


def create_app() -> Flask:

    db_username = os.getenv("DB_USERNAME")
    db_password = os.getenv("DB_PASSWORD")
    db_name = os.getenv("DB_NAME")

    if not db_username or not db_password or not db_name:
        raise ValueError(
            "Environmental variables `DB_USERNAME`, `DB_PASSWORD` or `DB_NAME` not set up in `.env` file."
        )

    app = Flask(__name__)
    app.config.update(
        SECRET_KEY="nv6Ly5pXuAeV7VOWKWFWOZMTqei9JxMV",
        SQLALCHEMY_DATABASE_URI=f"mysql://{db_username}:{db_password}@database:3306/{db_name}",
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        MAX_CONTENT_LENGTH=10_000_000,
        UPLOAD_FOLDER=os.getenv("UPLOAD_DIR", "/tmp"),
    )

    login_manager.init_app(app)

    CORS(app, resources={r"/*": {"origins": "*"}})
    app.url_map.strict_slashes = False


    food_tips_api.init_app(app)
    DB.init_app(app)
    with app.app_context():
        DB.create_all()

    return app