db-make-migrations:
	docker exec -it tcg-trader-backend python manage.py makemigrations
	# chown is needed here because it is root inside the docker that generates the files.
	sudo chown $(shell id -un):$(shell id -gn) backend/*/migrations/*.py
	chmod u+w backend/*/migrations/*.py

db-migrate:
	@docker exec -it tcg-trader-backend python manage.py migrate
	@echo "Creating unaccent extension if not exists..."
	@docker exec -it tcg-trader-db psql -U postgres -d tcg_trader_db -c "CREATE EXTENSION IF NOT EXISTS unaccent;"

db-seed:
	@docker exec -it tcg-trader-backend python manage.py languages_seeder
	@docker exec -it tcg-trader-backend python manage.py pokedex_seeder
	@docker exec -it tcg-trader-backend python manage.py rarities_seeder
	@docker exec -it tcg-trader-backend python manage.py sets_seeder
	@docker exec -it tcg-trader-backend python manage.py colors_seeder
	@docker exec -it tcg-trader-backend python manage.py card_types_seeder
	@docker exec -it tcg-trader-backend python manage.py card_seeder

dev:
	docker compose -f docker-compose.dev.yml up --build

staged:
	docker compose -f docker-compose.staged.yml up --build

prod:
	docker compose -f docker-compose.prod.yml up

redeploy-prod:
	@docker compose -f docker-compose.prod.yml pull
	@docker compose -f docker-compose.prod.yml up -d
	@sleep 30
	@docker image prune -f

download-game-data:
	@docker exec -it tcg-trader-backend python manage.py download_game_data

download-assets:
	@docker exec -it tcg-trader-backend python manage.py download_cards_images
	@docker exec -it tcg-trader-backend python manage.py download_colors_images
	@docker exec -it tcg-trader-backend python manage.py download_rarity_images

api-admin:
	@docker exec -it tcg-trader-backend python3 manage.py createsuperuser

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

db-sql:
	@docker exec -it tcg-trader-db psql -U postgres -d tcg_trader_db

lint:
	@cd backend && venv/bin/pre-commit run --all-files
	@cd frontend && npm run format+lint:fix
