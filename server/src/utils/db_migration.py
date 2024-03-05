import os
import json
import asyncio
import aiohttp

from ratelimit import limits, sleep_and_retry
from tqdm import tqdm

from db_utils import db
from constants import tmdb_constants, file_path_constants
from globals import api_keys


# Check Api Limit function
@sleep_and_retry
@limits(calls=tmdb_constants["API_CALLS"], period=tmdb_constants["RATE_LIMIT"])
def check_limit():
    """Empty function to check for calls to API"""
    return

# Fetch movie ids TMDB
async def fetch_movie_ids(session, url):
    check_limit()
    try:
        async with session.get(url) as res:
            response = await res.json()
            return [item["id"] for item in response.get("results", [])]

    except Exception as e:
        print(f'An exception of type {type(e).__name__} occurred: {str(e)}')


# Fetch movie details from TMDB
async def fetch_movie_details(session, url):
    check_limit()
    try:
       async with session.get(url) as res:
            response = await res.json()

            # Check for request limit reached
            if 'status_code' in response and response['status_code'] == 25:
                print("Request limit reached. Waiting and retrying...")
                await asyncio.sleep(1)  # Wait for 1 seconds before retrying
                return await fetch_movie_details(session, url)

            if 'id' not in response:
                print("API Response without 'id' key:", response)
                
            movie_details = {
                "id": response["id"],
                "title": response["title"],
                "overview": response["overview"],
                "popularity": response["popularity"],
                "homepage": response.get("homepage") or "",
                "backdrop_path": response.get("backdrop_path") or "",
                "poster_path": response.get("poster_path") or "",
                "genres": [genre["name"] for genre in response.get("genres", [])], 
                "release_date": response.get("release_date") or "",
                "cast_name": [cast["name"] for cast in response.get("credits")["cast"][:tmdb_constants["TOP_K_CAST"]]],
                "cast_character": [cast["character"] for cast in response.get("credits")["cast"][:tmdb_constants["TOP_K_CAST"]]],
                "crew": [crew["name"] for crew in response.get("credits")["crew"] if crew["department"] == "Production"][:tmdb_constants["TOP_K_CREW"]],
                }
            return movie_details

    except Exception as e:
        print(f'An exception of type {type(e).__name__} occurred: {str(e)}')


# Store movies in Firebase
async def store_movies_in_firebase(movies):
    try:
        for movie in tqdm(movies):
            await db.collection('movies').document(str(movie['id'])).set(movie)
    except Exception as e:
        print(f'An exception of type {type(e).__name__} occurred: {str(e)}')


async def main():
    tmdb_data_file_path = file_path_constants["TMDB_DATA_FILE_PATH"]

    if os.path.exists(tmdb_data_file_path):
        print("Fetching movies from file")
        with open(tmdb_data_file_path, 'r') as file:
            movie_details = json.load(file)
    else:
        async with aiohttp.ClientSession() as session:
            # Fetch movie ids from TMDB
            print("Fetching movie IDs...")
            movie_ids_tasks = []
            for page in range(1, tmdb_constants["N_PAGES"]+1):
                url = f'https://api.themoviedb.org/3/discover/movie?api_key={api_keys["TMDB_API_KEY"]}&include_adult=false&sort_by=popularity.desc&page={page}'
                movie_ids_tasks.append(asyncio.ensure_future(fetch_movie_ids(session, url)))

            movie_meta = await asyncio.gather(*movie_ids_tasks)
            movie_ids = [movie_id for sublist in movie_meta for movie_id in sublist]

            # Fetch movies from TMDB
            print("Fetching movie details...")
            movie_details_tasks = []
            for id in set(movie_ids):
                url = f'https://api.themoviedb.org/3/movie/{id}?api_key={api_keys["TMDB_API_KEY"]}&append_to_response=credits'
                movie_details_tasks.append(asyncio.ensure_future(fetch_movie_details(session, url)))
                
            movie_details = await asyncio.gather(*movie_details_tasks)

            with open(tmdb_data_file_path, 'w') as file:
                json.dump(movie_details, file, indent=2)

    # Store movies in Firebase
    print("Saving movie details to Firestore...")
    await store_movies_in_firebase(movie_details)


if __name__ == "__main__":
    asyncio.run(main())

    