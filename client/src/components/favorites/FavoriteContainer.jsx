import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import FavoriteSection from "../favorites/FavoriteSection";
import ForYouSection from "./ForYouSection";

import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { BaseApiUrl, PaginationPageSize } from "../../constants/constants";
import UseDidMountEffect from "../../hooks/UseDidMountEffect";

const FavoriteContainer = () => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);

  const { currentUser } = useAuth();

  const axiosInstance = axios.create({
    method: "get",
    maxBodyLength: Infinity,
    headers: {},
  });

  const fetchMovieData = async (movieId) => {
    const movieSnapshot = await getDoc(doc(db, "movies", String(movieId)));
    return movieSnapshot.exists() ? movieSnapshot.data() : null;
  };

  const fetchFavoriteMovies = async (favoriteIds) => {
    try {
      const favoriteMoviesData = await Promise.all(
        favoriteIds.map(fetchMovieData)
      );
      setFavoriteMovies(favoriteMoviesData.reverse());
    } catch (error) {
      console.error("Error fetching favorite movies:", error);
    }
  };

  const fetchRecommendedMovies = async () => {
    try {
      const response = await axiosInstance(
        `${BaseApiUrl}recommendations/${currentUser.uid}`
      );
      setRecommendedMovies(response.data);
      console.log("Recommended movies: ", recommendedMovies);
    } catch (error) {
      console.error("Error fetching recommended movies:", error);
    }
  };

  const handleFavoritesChange = (snapshot) => {
    try {
      if (snapshot.exists()) {
        const favoriteIds = snapshot.data().favorites || [];
        fetchFavoriteMovies(favoriteIds);
        // fetchRecommendedMovies();
        console.log("Favorite movies: ", favoriteMovies);
      }
    } catch (error) {
      console.error("Error handling favorites change:", error);
    }
  };

  useEffect(() => {
    const userDocRef = doc(db, "users", currentUser.uid);

    const fetchUserData = async () => {
      try {
        const snapshot = await getDoc(userDocRef);
        const favoriteIds = snapshot.exists()
          ? snapshot.data().favorites || []
          : [];
        fetchFavoriteMovies(favoriteIds);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    // fetchRecommendedMovies();
    console.log("Favorite movies Initial Render: ", favoriteMovies);

    const unsubscribe = onSnapshot(userDocRef, handleFavoritesChange);

    return () => unsubscribe();
  }, [currentUser]);

  UseDidMountEffect(() => {
    fetchRecommendedMovies();
  }, [favoriteMovies]);

  return (
    <div className="py-10 px-8 sm:px-26 md:px-32 lg:px-48">
      <div>
        <div className="text-xl tracking-widest uppercase font-medium text-gray-400 border-blue-600 border-l-4 px-2">
          Your favorites
        </div>

        {favoriteMovies.length == 0 && (
          <div className="sm:text-2xl md:text-4xl text-gray-400 text-center py-36 flex flex-col gap-2 md:gap-4">
            <span>Your favorites tab is feeling a bit empty ...</span>

            <span>Add movies for personalized recommendations ! 🍿</span>
            <Link to="/" className="text-sm sm:text-lg underline">
              Home Page
            </Link>
          </div>
        )}

        <FavoriteSection favoriteMovies={favoriteMovies} />
      </div>

      {favoriteMovies.length > 0 && (
        <div>
          <div className="text-xl tracking-widest uppercase font-medium text-gray-400 border-blue-600 border-l-4 my-6 px-2">
            Recommendations for you
          </div>
          <ForYouSection recommendedMovies={recommendedMovies} />
        </div>
      )}
    </div>
  );
};

export default FavoriteContainer;
