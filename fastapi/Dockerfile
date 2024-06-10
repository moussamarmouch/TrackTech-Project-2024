# Use an official Python runtime as a parent image
FROM python:3.11.5

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# RUN pip install --upgrade pip
RUN apt-get update && apt-get install -y libmagic-dev

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

RUN pip install fastapi
# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variable for Python to run in unbuffered mode
ENV PYTHONUNBUFFERED 1

# Command to run your application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", "--log-level", "info"]
