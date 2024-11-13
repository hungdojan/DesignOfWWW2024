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

If persistent data is enabled in the `compose.yaml` file, you must delete the persistent volume before restarting the containers. Here’s how:

```sh
$ podman-compose down
... terminating containers ...

# the volume is named differently if using docker
# the user can omit this step if persistent volume is not enabled
$ podman volume rm food-tips_db_volume
... deleting the persistent volume ...

$ podman-compose up
... creating a volume and starting containers ...
```
