env:
	@bash -c "source venv/bin/activate && exec bash"

seed: 
	@venv/bin/python manage.py card_seeder

migrations: 
	@venv/bin/python manage.py makemigrations

migrate: 
	@venv/bin/python manage.py migrate

download-cards: 
	@venv/bin/python manage.py download_cards_images