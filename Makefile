.PHONY: install runserver migrations migrate superuser update
install:
	poetry install

runserver:
	poetry run python -m backend.manage runserver

migrations:
	poetry run python -m backend.manage makemigrations

migrations_app:
	poetry run python -m backend.manage makemigrations $(app)

migrate:
	poetry run python -m backend.manage migrate

superuser:
	poetry run python -m backend.manage createsuperuser

update: install migrate ;
.PHONY: install-pre-commit
install-pre-commit:
	poetry run pre-commit uninstall; poetry run pre-commit install

# command make addapp app=appname
addapp:
	poetry run django-admin startapp $(app)

# command make generate_api_key user=username
generate_api_key:
	poetry run python -m backend.manage generate_api_key $(user)

.PHONY: shell
shell:
	poetry run python -m backend.manage shell

.PHONY: test
test:
	poetry run pytest -v -rs -n auto --show-capture=no

.PHONY: up-dependencies-only
up-dependencies-only:
	test -f .env  || wsl touch .env || touch .env
	docker-compose -f docker-compose.dev.yml up --force-recreate db

.PHONY: up
up:
	docker compose up --build
back:
	docker compose up app --build