import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key_if_not_set')
    # Convert 'True'/'False' string to boolean
    DEV_MODE = os.getenv('DEV_MODE', 'False').lower() in ('true', '1', 't')
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///valentiflix.db')

    # Admin Credentials
    ADMIN_USERNAME = os.getenv('ADMIN_USERNAME', 'love')
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'you')
