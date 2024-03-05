import os

from dotenv import load_dotenv
load_dotenv()

api_keys = {
    "TMDB_API_KEY": os.getenv("TMDB_API_KEY"),
    "PINECONE_API_KEY": os.getenv("PINECONE_API_KEY")
}