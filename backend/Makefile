env:
	source venv/bin/activate

update-env:
	@venv/bin/python -m pip freeze > requirements.txt

seed:
	@venv/bin/python manage.py card_seeder

migrations:
	@venv/bin/python manage.py makemigrations

migrate:
	@venv/bin/python manage.py migrate

download-cards:
	@venv/bin/python manage.py download_cards_images

lint:
	@venv/bin/pre-commit run --all-files
