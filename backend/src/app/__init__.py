import json
import os
from pathlib import Path

import click
import mysql.connector
from api import food_tips_api
from auth import login_manager
from dotenv import load_dotenv
from flask import Flask
from flask.cli import FlaskGroup
from flask_cors import CORS
from models import DB

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


cli = FlaskGroup(create_app=create_app)


@cli.command("load-recipes", help="Load external recipes.")
@click.argument(
    "json-file", type=click.Path(exists=True, readable=True, resolve_path=True)
)
def load_recipes(json_file):
    from models.images import ImageManager
    from models.recipes import RecipeManager

    data = json.loads(Path(json_file).read_text())

    for i in data:
        image_data = i.pop("image")
        recipe = i
        RecipeManager.insert_recipe_external(recipe)
        ImageManager.insert_external_image(image_data)


if __name__ == "__main__":
    cli()
