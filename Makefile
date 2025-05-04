###############################
# Commands to run the project #
###############################

dev:
	docker compose -f docker-compose.dev.yml up

dev-build:
	docker compose -f docker-compose.dev.yml up --build

dev-restart-backend:
	@echo "Stopping the backend container..."
	@docker compose -f docker-compose.dev.yml stop backend
	@echo "Starting the backend container..."
	@docker compose -f docker-compose.dev.yml start backend

dev-restart-frontend:
	@echo "Stopping the frontend container..."
	@docker compose -f docker-compose.dev.yml stop frontend
	@echo "Starting the frontend container..."
	@docker compose -f docker-compose.dev.yml start frontend

lint:
	@cd backend && venv/bin/pre-commit run --all-files
	@cd frontend && npm run format+lint:fix

staged:
	docker compose -f docker-compose.staged.yml up --build

prod:
	docker compose -f docker-compose.prod.yml up

redeploy-prod:
	@docker compose -f docker-compose.prod.yml pull
	@docker compose -f docker-compose.prod.yml up -d
	@docker image prune -f


#########################
# Data related commands #
#########################

# opens an sql terminal
db-sql:
	@docker exec -it tcg-trader-db psql -U postgres -d tcg_trader_db

# this copies the dataset on your local machine to the server.
copy-dataset:
	scp ./backend/dataset/* bulbatrade:/opt/tcg-trader/backend/dataset/

download-game-data:
	@docker exec -it tcg-trader-backend python manage.py download_game_data

download-assets:
	@docker exec -it tcg-trader-backend python manage.py download_cards_images_en
	@docker exec -it tcg-trader-backend python manage.py download_cards_images_fr
	@docker exec -it tcg-trader-backend python manage.py download_colors_images
	@docker exec -it tcg-trader-backend python manage.py download_rarity_images
	@docker exec -it tcg-trader-backend python manage.py download_pokemon_images

# chown is needed here because it is root inside the docker that generates the files.
db-make-migrations:
	docker exec -it tcg-trader-backend python manage.py makemigrations
	sudo chown $(shell id -un):$(shell id -gn) backend/modules/*/migrations/*.py
	chmod u+w backend/modules/*/migrations/*.py

db-migrate:
	@docker exec -it tcg-trader-backend python manage.py migrate
	@echo "Creating unaccent extension if not exists..."
	@docker exec -it tcg-trader-db psql -U postgres -d tcg_trader_db -c "CREATE EXTENSION IF NOT EXISTS unaccent;"

# the -it was replaced wit -i cause TTY isn't available in github actions
db-migrate-prod:
	@docker exec -i tcg-trader-backend python manage.py migrate

db-seed:
	@docker exec -it tcg-trader-backend python manage.py languages_seeder
	@docker exec -it tcg-trader-backend python manage.py pokedex_seeder
	@docker exec -it tcg-trader-backend python manage.py rarities_seeder
	@docker exec -it tcg-trader-backend python manage.py sets_seeder
	@docker exec -it tcg-trader-backend python manage.py colors_seeder
	@docker exec -it tcg-trader-backend python manage.py card_types_seeder
	@docker exec -it tcg-trader-backend python manage.py card_seeder
	@docker exec -it tcg-trader-backend python manage.py card_seeder_fr
	@docker exec -it tcg-trader-backend python manage.py statuses_seeder

db-reset:
	@echo "Stopping the backend container..."
	@docker compose -f docker-compose.dev.yml stop backend
	@echo "Dropping database..."
	@docker exec -it tcg-trader-db psql -U postgres -c "DROP DATABASE IF EXISTS tcg_trader_db;"
	@docker exec -it tcg-trader-db psql -U postgres -c "CREATE DATABASE tcg_trader_db;"
	@echo "Database dropped and recreated."
	@echo "Creating unaccent extension if not exists..."
	@docker exec -it tcg-trader-db psql -U postgres -d tcg_trader_db -c "CREATE EXTENSION IF NOT EXISTS unaccent;"
	@echo "Unaccent extension created."
	@echo "Starting the backend container..."
	@docker compose -f docker-compose.dev.yml start backend
	@docker exec -it tcg-trader-backend python manage.py migrate

api-admin:
	@docker exec -it tcg-trader-backend python3 manage.py createsuperuser

########
# i18n #
########

i18n-merge:
	@cd frontend && npm run merge:i18n
