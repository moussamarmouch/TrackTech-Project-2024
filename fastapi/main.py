from ctypes import Union
from uuid import uuid4
import json
import random
import boto3
from botocore.exceptions import ClientError
import magic
import uvicorn
from fastapi import FastAPI, HTTPException, Response, UploadFile, status, Security, WebSocket
from fastapi.security import APIKeyHeader
from loguru import logger
import psycopg2
import os
import asyncio

# VARIABLES
AWS_ACCESS_KEY_ID = os.getenv('aws_access_key')
AWS_SECRET_ACCESS_KEY = os.getenv('aws_secret_key')
AWS_SESSION_TOKEN = os.getenv('aws_token')
AWS_BUCKET = os.getenv('s3_bucket')
DB_HOST = "db.test"
DB_USER = os.getenv('aws_db_username')
DB_PASSWORD = os.getenv('aws_db_password')
DB_DATABASE = "postgres"
API_KEY_HEADER = 'X-API-Key'
API_KEY_VALUE = os.getenv('api_key_fastapi')

api_keys = [API_KEY_VALUE]

# FastAPI instance
app = FastAPI()
api_key_header = APIKeyHeader(name=API_KEY_HEADER)

# Set to keep track of WebSocket clients for anomalies and assets
clientsAnomalies = set()
clientsAssets = set()
update_anomaly_event = asyncio.Event()
update_asset_event = asyncio.Event()

# Constants for file sizes
KB = 5120
MB = 5120 * KB

# Supported file types for upload
SUPPORTED_FILE_TYPES = {
    'image/png': 'png',
    'image/jpeg': 'jpg'
}

# Initialize AWS resources and bucket
s3 = boto3.resource('s3',
                    aws_access_key_id=AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                    aws_session_token=AWS_SESSION_TOKEN
                    )
bucket = s3.Bucket(AWS_BUCKET)

# Load data from a JSON file
with open('lijnsecties.json', 'r') as file:
    data = json.load(file)

results = data

# Check if data is available for random selection
if results and len(results) > 0:
    # Get a random index
    random_index = random.randint(0, len(results) - 1)

    # Get the random longitude and latitude
    random_point = results[random_index]['geo_point_2d']
    random_longitude = random_point['lon']
    random_latitude = random_point['lat']
else:
    print('The dataset is empty or does not have the expected structure.')

# Create an AWS session
session = boto3.Session(
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    aws_session_token=AWS_SESSION_TOKEN
)

# Upload anomaly to s3 bucket and get link
async def s3_uploadAnomaly(contents: bytes, key: str):
    folder_path = 'anomaly_images/'
    full_key = folder_path + key
    logger.info(f'Uploading {full_key} to s3')

    # Use ACL parameter to set 'public-read'
    acl = 'public-read'

    bucket.put_object(
        Key=full_key,
        Body=contents,
        ACL=acl
    )

    # Generate a public URL for the uploaded file
    file_url = f'https://{AWS_BUCKET}/{full_key}'

    return file_url

# Upload Asset to s3 bucket and get link
async def s3_uploadAsset(contents: bytes, key: str):
    folder_path = 'asset_images/'
    full_key = folder_path + key
    logger.info(f'Uploading {full_key} to s3')

    # Use ACL parameter to set 'public-read'
    acl = 'public-read'

    bucket.put_object(
        Key=full_key,
        Body=contents,
        ACL=acl
    )

    # Generate a public URL for the uploaded file
    file_url = f'https://{AWS_BUCKET}/{full_key}'

    return file_url


# Function to insert the URL into PostgreSQL Anomaly
async def insert_url_to_postgresql_anomaly(file_name: str):
    try:
        # Replace with your PostgreSQL connection details
        connection = psycopg2.connect(
            host=DB_HOST,
            port=5432,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_DATABASE
        )

        cursor = connection.cursor()
        url = "https://s3.amazonaws.com/"
        # New querry to fill in all the data and not only the photo
        query = """
            INSERT INTO public."Anomaly" ("AnomalyTypeId", "TimeStamp", "Photo", "IsSolved", "IsFlagged", "Latitude", "Longitude")
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(
            query,
            (
                1,  # AnomalyTypeId (assuming it's always 1 based on your code)
                "now()",  # Use the current timestamp
                url + AWS_BUCKET + "/anomaly_images/" + file_name,
                False,  # Default value for IsSolved
                False,  # Default value for IsFlagged
                random_latitude,  # Default value for Latitude
                random_longitude,  # Default value for Longitude
            )
        )

        connection.commit()
        cursor.close()
        connection.close()

        update_anomaly_event.set()
        for client in clientsAnomalies:
            await client.send_text("anomaly")

    except Exception as e:
        logger.error(f"Error inserting URL into PostgreSQL: {e}")


# Function to insert the URL into PostgreSQL Asset
async def insert_url_to_postgresql_asset(file_name: str, asset_type_id: int):
    try:
        # Replace with your PostgreSQL connection details
        connection = psycopg2.connect(
            host=DB_HOST,
            port=5432,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_DATABASE
        )

        cursor = connection.cursor()
        url = "https://s3.amazonaws.com/"
        # New querry to fill in all the data and not only the photo
        query = """
            INSERT INTO public."Asset" ("AssetTypeId", "TimeStamp", "Photo", "IsFlagged", "Latitude", "Longitude")
            VALUES (%s, %s, %s, %s, %s, %s)
        """

        cursor.execute(
            query,
            (
                asset_type_id,  # change to asset type
                "now()",  # Use the current timestamp
                url + AWS_BUCKET + "/asset_images/" + file_name,
                False,  # Default value for IsFlagged
                random_latitude,  # Default value for Latitude
                random_longitude,  # Default value for Longitude
            )
        )

        connection.commit()
        cursor.close()
        connection.close()

        update_asset_event.set()
        for client in clientsAssets:
            await client.send_text("asset")

    except Exception as e:
        logger.error(f"Error inserting URL into PostgreSQL: {e}")

# WebSocket endpoint for anomalies
@app.websocket("/ws/anomalies")
async def websocket_anomalies_endpoint(websocket: WebSocket):
    await websocket.accept()
    clientsAnomalies.add(websocket)
    try:
        while True:
            # Wait for an update event
            await update_anomaly_event.wait()

            await websocket.send_text("anomaly")

            # Clear the event to allow waiting for the next update
            update_anomaly_event.clear()
    finally:
        clientsAnomalies.remove(websocket)

# WebSocket endpoint for assets
@app.websocket("/ws/assets")
async def websocket_assets_endpoint(websocket: WebSocket):
    await websocket.accept()
    clientsAssets.add(websocket)
    try:
        while True:
            # Wait for an update event
            await update_asset_event.wait()

            await websocket.send_text("asset")

            # Clear the event to allow waiting for the next update
            update_asset_event.clear()
    finally:
        clientsAssets.remove(websocket)


# Function to get API key from header
def get_api_key(api_key_header: str = Security(api_key_header)) -> str:
    if api_key_header in api_keys:
        return api_key_header
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing API Key",
    )


@app.get('/')
async def home(api_key: str = Security(get_api_key)):
    return {"Hello! :)"}

# Upload anomaly endpoint
@app.post('/uploadAnomaly')
async def uploadAnomaly(file: UploadFile | None = None, api_key: str = Security(get_api_key)):
    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='No file found!!'
        )

    contents = await file.read()
    size = len(contents)

    if not 0 < size <= 1 * MB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Supported file size is 0 - 1 MB'
        )

    file_type = magic.from_buffer(buffer=contents, mime=True)
    if file_type not in SUPPORTED_FILE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f'Unsupported file type: {file_type}. Supported types are {SUPPORTED_FILE_TYPES}'
        )
    file_name = f'{uuid4()}.{SUPPORTED_FILE_TYPES[file_type]}'
    # Upload the file and get the URL
    file_url = await s3_uploadAnomaly(contents=contents, key=file_name)
    # Insert the URL into PostgreSQL
    await insert_url_to_postgresql_anomaly(file_name=file_name)
    return {'file_name': file_name, 'file_url': file_url}

# Upload asset endpoint
@app.post('/uploadAsset')
async def uploadAsset(file: UploadFile | None = None, api_key: str = Security(get_api_key), asset_type_id: int | None = None):
    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='No file found!!'
        )

    contents = await file.read()
    size = len(contents)

    if not 0 < size <= 1 * MB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Supported file size is 0 - 1 MB'
        )

    file_type = magic.from_buffer(buffer=contents, mime=True)
    if file_type not in SUPPORTED_FILE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f'Unsupported file type: {file_type}. Supported types are {SUPPORTED_FILE_TYPES}'
        )
    file_name = f'{uuid4()}.{SUPPORTED_FILE_TYPES[file_type]}'
    # Upload the file and get the URL
    file_url = await s3_uploadAsset(contents=contents, key=file_name)
    # Insert the URL into PostgreSQL
    await insert_url_to_postgresql_asset(file_name=file_name, asset_type_id=asset_type_id)
    return {'file_name': file_name, 'file_url': file_url}


if __name__ == '__main__':
    # Run FastAPI application using uvicorn
    uvicorn.run(app='main:app', reload=True,
                host='0.0.0.0', port=8000, log_level="info")
