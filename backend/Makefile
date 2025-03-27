env:
	@bash -c "source venv/bin/activate && exec bash"

update-env:
	@venv/bin/python pip freeze > requirements.txt

seed: 
	@venv/bin/python manage.py card_seeder

migrations: 
	@venv/bin/python manage.py makemigrations

migrate: 
	@venv/bin/python manage.py migrate

download-cards: 
	@venv/bin/python manage.py download_cards_images
