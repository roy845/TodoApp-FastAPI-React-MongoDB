from pymongo import MongoClient
from .config import settings


client = MongoClient(settings.DATABASE_URI)
print('🚀 Connected to MongoDB...')
db = client.TodoApp  # database name
Todo = db["todos"]  # collection name
User = db["users"]  # collection name
