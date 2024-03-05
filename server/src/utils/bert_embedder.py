import os
import json
import asyncio
from tqdm import tqdm

from sentence_transformers import SentenceTransformer

from db_utils import db, index
from constants import bert_constants, pinecone_constants, file_path_constants


# Initialize Sentence Transformer model
model = SentenceTransformer(bert_constants["MODEL"])


# MISC FUNCTIONS
def read_data_from_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

def write_data_to_file(file_path, data):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=2)

def read_embeddings_from_file(file_path):
    with open(file_path, 'r') as file:
        embeddings = json.load(file)
    return embeddings

def write_embeddings_to_file(file_path, embeddings):
    with open(file_path, 'w') as file:
        json.dump(embeddings, file, indent=2)


# Fetch data from Firestore
async def fetch_firestore_data():
    documents = db.collection("movies").stream()
    data = []
    async for document in documents:
        data.append(document.to_dict())
    return data

# Create word embeddings using Sentence Transformers
def create_word_embeddings(data):
    embeddings = []

    for item in tqdm(data):
        id = item['id']
        title = item['title']
        overview = item['overview']
        genres = item.get("genres", [])
        cast_name = item.get("name", [])
        cast_character = item.get("character", [])
        crew = item.get("crew", [])
        
        document = f'{title}. {overview} Genre: {" ".join(genres)}. Casts: {" ".join(cast_name)}. Characters: {" ".join(cast_character)}. Producers: {" ".join(crew)}'

        if document:
            embedding = model.encode(document)
            formatted_data = {'id': str(id), 
                              'values': embedding.tolist(),
                              'metadata': {
                                  'title': title, 
                                  "poster_path": item.get("poster_path") or "",
                                  "release_date": item.get("release_date") or "",
                                  "genres": genres
                                  }
                              }
            embeddings.append(formatted_data)

    return embeddings

# Chunker for pinecone save
def chunker(embeddings, batch_size):
    return (embeddings[pos:pos + batch_size] for pos in range(0, len(embeddings), batch_size))

# Save embeddings to Pinecone
def save_to_pinecone(embeddings):
    try:
        async_results = [
            index.upsert(vectors=chunk, async_req=True)
            for chunk in chunker(embeddings, batch_size=pinecone_constants["UPSERT_BATCH_SIZE"])
        ]
        [async_result.result() for async_result in async_results]
        
    except Exception as e:
        print("An error occured when saving embeddings to pinecone: ", e)


async def main():
    firestore_data_file_path = file_path_constants["FIRESTORE_DATA_FILE_PATH"]
    embeddings_file_path = file_path_constants["EMBEDDINGS_FILE_PATH"]

    if os.path.exists(firestore_data_file_path):
        print("Fetching data from Firestore data file...")
        data = read_data_from_file(firestore_data_file_path)
    else:
        print("Fetching Firestore data...")
        data = await fetch_firestore_data()
        write_data_to_file(firestore_data_file_path, data)

    if os.path.exists(embeddings_file_path):
        print("Fetching Embeddings from file...")
        embeddings = read_embeddings_from_file(embeddings_file_path)
    else:
        print("Creating word Embeddings...")
        embeddings = create_word_embeddings(data)
        write_embeddings_to_file(embeddings_file_path, embeddings)

    print("Saving Embeddings into Pinecone...")
    save_to_pinecone(embeddings)

if __name__ == "__main__":
    asyncio.run(main())
