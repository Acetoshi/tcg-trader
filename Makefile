db-make-migrations:
	docker exec -it tcg-trader-backend python manage.py makemigrations

db-migrate:
	docker exec -it tcg-trader-backend python manage.py migrate

db-seed:
	@docker exec -it tcg-trader-backend python manage.py languages_seeder
	@docker exec -it tcg-trader-backend python manage.py pokedex_seeder
	@docker exec -it tcg-trader-backend python manage.py rarities_seeder
	@docker exec -it tcg-trader-backend python manage.py sets_seeder
	@docker exec -it tcg-trader-backend python manage.py colors_seeder
	@docker exec -it tcg-trader-backend python manage.py card_types_seeder
	@docker exec -it tcg-trader-backend python manage.py card_seeder

dev:
	docker compose up

download-game-data:
	@docker exec -it tcg-trader-backend python manage.py download_game_data

download-assets:
	@docker exec -it tcg-trader-backend python manage.py download_cards_images
	@docker exec -it tcg-trader-backend python manage.py download_types_images
	@docker exec -it tcg-trader-backend python manage.py download_rarity_images

api-admin:
	@docker exec -it tcg-trader-backend python3 manage.py createsuperuser

db-reset:
	@echo "Stopping the backend container..."
	@docker compose stop backend
	@echo "Dropping database..."
	@docker exec -it tcg-trader-db psql -U postgres -c "DROP DATABASE IF EXISTS tcg_trader_db;"
	@docker exec -it tcg-trader-db psql -U postgres -c "CREATE DATABASE tcg_trader_db;"
	@echo "Database dropped and recreated."
	@echo "Creating unaccent extension if not exists..."
	@docker exec -it tcg-trader-db psql -U postgres -d tcg_trader_db -c "CREATE EXTENSION IF NOT EXISTS unaccent;"
	@echo "Unaccent extension created."
	@echo "Starting the backend container..."
	@docker compose start backend
	@docker exec -it tcg-trader-backend python manage.py migrate

db-sql:
	@docker exec -it tcg-trader-db psql -U postgres -d tcg_trader_db

lint:
	@cd backend && venv/bin/pre-commit run --all-files
	@cd frontend && npm run format+lint:fix
