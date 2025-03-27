db-migrate:
	docker exec -it tcg-trader-backend python manage.py migrate

db-seed:
	docker exec -it tcg-trader-backend python manage.py card_seeder

dev:
	docker compose up -d