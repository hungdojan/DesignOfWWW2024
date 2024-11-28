import json
from uuid import uuid4

import requests

BASE_URL = "https://www.themealdb.com"
PATH_EXT = "api/json/v1/1/random.php"
NOF_EXT_RECIPES = 10


def transform_data_themealdb(data: dict, externalPage: str) -> dict:
    _id = str(uuid4())
    recipe = {
        "ID": _id,
        "name": data["strMeal"],
        "externalPage": data["strSource"],
        "authorID": None,
        "expectedTime": 0,
        "instructions": data["strInstructions"],
        "description": f"Recipe for {data['strMeal']}. This recipe and the image were fetched using TheMealDB API at {externalPage}.",
        "ingredients": [
            {
                "ID": str(uuid4()),
                "name": data[f"strIngredient{i}"],
                "recipeID": _id,
                "amount": data[f"strMeasure{i}"],
            }
            for i in range(1, 21)
            if data[f"strIngredient{i}"]
        ],
        "difficulty": "Unknown",
        "image": {"url": data["strMealThumb"], "ID": str(uuid4()), "recipeID": _id},
    }
    return recipe


_recipes = []

for i in range(NOF_EXT_RECIPES):
    res = requests.get(url=f"{BASE_URL}/{PATH_EXT}")
    _json_dict = res.json()["meals"].pop()
    _recipe = transform_data_themealdb(_json_dict, BASE_URL)
    _recipes.append(_recipe)

print(json.dumps(_recipes, indent=2))
