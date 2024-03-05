tmdb_constants = {
    "N_PAGES" : 400,
    "TOP_K_CAST" : 10,
    "TOP_K_CREW": 3,
    "API_CALLS": 50,
    "RATE_LIMIT": 1,
    "IMAGE_BASE_URL" : "https://image.tmdb.org/t/p/original/"
    }

file_path_constants = {
    "TMDB_DATA_FILE_PATH": "./src/data_store/tmdb_data.json",
    "FIRESTORE_DATA_FILE_PATH": "./src/data_store/firestore_data.json",
    "EMBEDDINGS_FILE_PATH": "./src/data_store/embeddings.json"
}

bert_constants = {
    "MODEL": "sentence-t5-large",
    # "MODEL": "gtr-t5-large"
    # "MODEL": "all-mpnet-base-v2"
}

pinecone_constants = {
    "UPSERT_BATCH_SIZE": 100
}

cluster_constants = {
    "K_CLUSTERS": 5
}