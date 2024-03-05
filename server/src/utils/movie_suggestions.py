import asyncio

from sklearn.cluster import KMeans

from ..utils.db_utils import db, index


async def get_favorites(user_id):
    try:
        user_doc = await db.collection("users").document(user_id).get()
        if user_doc.exists:
            return user_doc.to_dict().get("favorites", [])
        else:
            print(f"User document not found for user ID: {user_id}")
            return []
        
    except Exception as e:
        print("Error getting favorite movies: ", e)


def get_movie_embeddings(movie_ids):
    try:
        pinecone_record = index.fetch([str(movie_id) for movie_id in movie_ids])
        pinecone_vectors = pinecone_record["vectors"]
        pinecone_embeddings = [pinecone_vectors[str(movie_id)]["values"] for movie_id in movie_ids]

        return pinecone_embeddings
    
    except Exception as e:
        print("Error fetching embedding: ", e)


def create_clusters(k_clusters, embeddings):
    kmeans = KMeans(n_clusters = k_clusters, random_state=42)
    kmeans.fit_predict(embeddings)
    centroids = kmeans.cluster_centers_
    return centroids


def search_recommendations(movie_embeddings):
    try:
        movie_recs = []
        for embedding in movie_embeddings:
            recs = index.query(
                vector=embedding.tolist(),
                top_k=10,
                include_metadata=True,
            ).to_dict()
            movie_recs.extend(recs["matches"])
    
        unique_ids = set()
        # Filter out unique movies from movie_recs and sort them based on score
        unique_movies = [movie for movie in movie_recs if (movie_id := movie['id']) not in unique_ids and (unique_ids.add(movie_id) or True)]
        sorted_unique_movies = sorted(unique_movies, key=lambda x: x['score'], reverse=True)


        return sorted_unique_movies
    except Exception as e:
        print("Error searching for recommendations: ", e)