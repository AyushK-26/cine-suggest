import json

import firebase_admin
from firebase_admin import credentials, firestore_async

from pinecone.grpc import PineconeGRPC as Pinecone

from src.utils.globals import api_keys, sms_service_account_key


# Initialize Firebase
cred = credentials.Certificate(sms_service_account_key)
firebase_admin.initialize_app(cred)
db = firestore_async.client()


# Initialize Pinecone
pc = Pinecone(api_key=api_keys["PINECONE_API_KEY"])
index = pc.Index("movie-embeddings")