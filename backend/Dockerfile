# Step 1: Use official Python image as a base
FROM python:3.10-slim

# Step 2: Set environment variables to prevent python from writing pyc files to disk
# and to ensure that the output of python and pip is sent straight to the terminal
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Step 3: Set the working directory
WORKDIR /app

# Step 4: Copy the requirements.txt file into the container
COPY requirements.txt /app/

# Step 5: Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Step 6: Copy the entire Django project to the container's working directory
COPY . /app/

# Step 7: Expose the port on which the app will run
EXPOSE 8000

# Step 8: Set the entry point to run Django's development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]