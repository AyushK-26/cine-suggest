from fastapi import FastAPI, HTTPException
from typing import Union
from fastapi.middleware.cors import CORSMiddleware

from google.cloud import firestore
from sentence_transformers import SentenceTransformer

from ..utils.db_utils import db, index
from ..utils.constants import bert_constants, cluster_constants
from ..utils.movie_suggestions import get_favorites, get_movie_embeddings, create_clusters, search_recommendations


# Initialize the API server
app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Sentence Transformer model
model = SentenceTransformer(bert_constants["MODEL"])


@app.get("/")
def home():
    return {"Home": "Data"}

@app.get("/search-movies")
async def search_movies(query: Union[str, None] = None):
    embedding = model.encode(query)
    movie_list = index.query(
        vector=embedding.tolist(),
        top_k=12,
        include_metadata=True,
    ).to_dict()
    
    if movie_list:
        return movie_list
    raise HTTPException(status_code=404, detail="No movies found matching the description")


@app.get("/search-movies/popular")
async def fetch_popular_movies():
    docs = db.collection("movies").order_by("popularity", direction=firestore.Query.DESCENDING).limit(120).stream()
    popular_movies = []
    async for doc in docs:
        document = doc.to_dict()
        formmated_doc = {"id": document["id"],
                            "metadata": {
                                "title": document["title"],
                                "poster_path": document["poster_path"],
                                "genres": document["genres"], 
                                "release_date": document["release_date"],
                            }
                        }
        popular_movies.append(formmated_doc)
        
    if popular_movies:
        return {"matches": popular_movies}
    raise HTTPException(status_code=500, detail="Error fetching movies")


@app.get("/search-movies/{movie_id}")
async def fetch_moive_detail(movie_id: str):
    doc_ref = db.collection("movies").document(movie_id)
    movie_details = await doc_ref.get()
    if movie_details.exists:
        return movie_details.to_dict()
    raise HTTPException(status_code=404, detail="No movie found")

    
@app.get("/recommendations/{user_id}")
async def recommended_movies(user_id: str):
    k_clusters = cluster_constants["K_CLUSTERS"]

    liked_movie_ids = await get_favorites(user_id)

    if len(liked_movie_ids) < 5:
        k_clusters = len(liked_movie_ids)

    if liked_movie_ids:
        pinecone_embeddings = get_movie_embeddings(liked_movie_ids)
        centroids = create_clusters(k_clusters, pinecone_embeddings)
        movie_recommendations = search_recommendations(centroids)

        filtered_recommendations = [movie for movie in movie_recommendations if movie["id"] not in [str(movie_id) for movie_id in liked_movie_ids]]
        if filtered_recommendations:
            return filtered_recommendations
    
        return []
    
    raise HTTPException(status_code=500, detail="Error searching recommendations")



    