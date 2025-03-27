db-migrate:
	docker exec -it tcg-trader-backend python manage.py migrate

db-seed:
	docker exec -it tcg-trader-backend python manage.py card_seeder

dev:
	docker compose up -d

download-assets:
	docker exec -it tcg-trader-backend python manage.py download_cards_images && docker exec -it tcg-trader-backend python manage.py download_types_images && docker exec -it tcg-trader-backend python manage.py download_rarity_images
	