from __future__ import annotations

from flask import Response, jsonify
from flask_restx.api import HTTPStatus
from models.base import Base


def error_message(
    msg: str, error_code: int = HTTPStatus.BAD_REQUEST
) -> tuple[Response, int]:
    return jsonify({"message": msg}), error_code


def allowed_columns(_filter: dict, _cls: type[Base]) -> dict:
    return {k: v for k, v in _filter.items() if k in _cls.get_columns()}


def preprocess_filter(_filter: dict, _cls: type[Base]) -> list:
    return [
        f"{_cls.__tablename__}.{k}" == v
        for k, v in allowed_columns(_filter, _cls).items()
    ]
