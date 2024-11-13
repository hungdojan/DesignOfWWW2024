from __future__ import annotations

import models.base
from flask import Response, jsonify, make_response
from flask_restx import fields
from flask_restx.api import HTTPStatus

ALLOWED_EXTENSIONS = {"jpeg", "png", "jpg"}


def error_message(
    msg: str, error_code: int = HTTPStatus.BAD_REQUEST
) -> tuple[dict, int]:
    return {"message": msg}, error_code


def allowed_columns(_filter: dict, _cls: type[models.base.Base]) -> dict:
    return {k: v for k, v in _filter.items() if k in _cls.get_columns_extended()}


def preprocess_filter(_filter: dict, _cls: type[models.base.Base]) -> list:
    return [getattr(_cls, k) == v for k, v in allowed_columns(_filter, _cls).items()]


def response_ok(msg: str | dict) -> Response:
    return make_response({"message": msg}, HTTPStatus.OK)


def allowed_files(filename: str):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def message_response_dict(
    description: str, example: str, code: HTTPStatus = HTTPStatus.BAD_REQUEST
) -> dict:
    return {
        "code": code,
        "description": description,
        "model": fields.String(example=example),
        "envelope": "message"
    }
