from flask_sqlalchemy import SQLAlchemy
from models.base import Base

DB = SQLAlchemy(model_class=Base)

import models.groups
import models.images
import models.ingredients
import models.recipes
import models.shopping_item
import models.shopping_list
import models.users
