# DesignOfWWW2024

A submission to an assignment of class "Design Of WWW Services" @ Aalto University 2024/25.

## Requirements

To run this project, ensure you have one of the following container engines installed:

- **Docker** and **Docker Compose**
- **Podman** and **Podman Compose**

## Project setup

After cloning the project to your local machine, configure your environment.
In the root of the project, create a file named `.env`. This file will contain important database variables.
You can find a template in `./config/example/env_example`.

Fill in the following values in the `.env` file:

- `DB_LOCAL_DIR`: A directory on the host machine where persistent database data are stored.
- `IMAGE_LOCAL_DIR`: A directory on the host machine where images will be stored.
- `DB_USERNAME`: Root username for the database
- `DB_PASSWORD`: Root password for the database
- `DB_NAME`: Name of the database

Your project root directory should now contain the following files:

```sh
$ tree -L 1 -a
.
├── backend
├── compose.yaml
├── config
├── data
├── .dockerignore
├── docs
├── .editorconfig
├── .env
├── frontend
├── .git
├── .gitignore
├── LICENSE
├── prod_compose.yaml
└── README.md
```

## Build the images and run the development environment

To build all images, use your preferred container engine with the provided `compose.yaml` file.
Run the following command:

For **Docker**:

```sh
docker compose build
```

For **Podman**:

```sh
podman-compose build
```

Once the images are built, start the containers:

For **Docker**:

```sh
docker compose up
```

For **Podman**:

```sh
podman-compose up
```

## Development

#### Adding Library to Frontend or Backend

When you need to install a new library in either the frontend or backend container, it's important to rebuild the image.
Follow these steps:

```sh
$ cd <project-root>
$ podman-compose down
... terminating containers ...

$ podman-compose build
... building containers ...

$ podman-compose up
... starting containers ...
```

#### Updating the Database Schema

If you need to update the database schema, make sure to modify both:

- `./config/mariadb/init_scripts/00-init_script.sql`
- `./backend/src/models/`

If persistent data is enabled in the `compose.yaml` file, you must delete the persistent data before restarting the containers. Here’s how:

```sh
$ podman-compose down
... terminating containers ...

# delete database data and images stored under
# DB_LOCAL_DIR and IMAGE_LOCAL_DIR environment variables
# these variables should be defined in '.env' file
$ rm -rf "${DB_LOCAL_DIR}*"
... deleting database data ...

$ rm -rf "${IMAGE_LOCAL_DIR}*"
... deleting images data ...

$ podman-compose up
... creating a volume and starting containers ...
```

## Fetching new recipes

Please note that this web application is intended for educational purposes only, as a proof of concept. For commercial use, please contact the team behind the API.

The Python script located at `./backend/scripts/fetch_recipes.py` can be used to
fetch new recipes from the external API, [The Meal DB](https://www.themealdb.com/api.php).
Please note that this web application is intended for educational purposes only, as a proof of concept. For commercial use, please contact the [team behind the API](thedatadb@gmail.com).

#### Usage

To fetch and load new recipes, follow these steps:

1. Use the fetch_recipes.py script to generate a JSON file.
2. Use the load-recipes CLI option to load the generated JSON file.

Ensure that the requests library is installed.

```sh
# If the 'requests' library is not installed
# Install it using:
# pip install requests

# It's recommended to generate the output file in the ./backend folder
python ./backend/scripts/fetch_recipes.py > ./data/

# Alternatively, you can execute the script inside a container
podman exec -it <food-tips_backend_1> bash -c "python /design_of_www/scripts/fetch_recipes.py > /design_of_www/scripts/recipes.json"

# Load the generated JSON file with the load-recipes command
podman exec -it <food-tips_backend_1> bash -c "python /design_of_www/src/app/__init__.py load-recipes /design_of_www/scripts/recipes.json"
```

## Deployment
To deploy the web application, used the provided `prod_compose.yaml` file.
```sh
podman-compose -f prod_compose.yaml build
podman-compose -f prod_compose.yaml up
```

Please note that the production containers are named with a prefix `food-tips-prod` instead
of `food-tips-dev`.
