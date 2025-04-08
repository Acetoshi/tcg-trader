# Step 1: Use official Python image as a base
FROM python:3.10-slim AS builder

# Step 2: Set environment variables to prevent python from writing pyc files to disk
# and to ensure that the output of python and pip is sent straight to the terminal
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Step 3: Set the working directory
WORKDIR /app

# Step 4: Copy the requirements.txt file into the container
COPY requirements.txt /app/

# Upgrade pip
RUN pip install --upgrade pip
# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt
# Install Postgresql Client
RUN apt update && apt install -y postgresql-client

# Step 6: Copy the entire Django project to the container's working directory
COPY . /app/

# Step 7: Expose the port on which the app will run
EXPOSE 8000

# Set build argument (defaults to "production" if not set)
ARG ENVIRONMENT=production
ENV ENVIRONMENT=${ENVIRONMENT}
RUN echo "The environment is set to: ${ENVIRONMENT}"

# Set the entrypoint for the application based on the environment
CMD if [ "$ENVIRONMENT" = "development" ]; then python manage.py runserver 0.0.0.0:8000; \
    elif [ "$ENVIRONMENT" = "production" ]; then gunicorn --bind 0.0.0.0:8000 your_project_name.wsgi:application; \
    fi
