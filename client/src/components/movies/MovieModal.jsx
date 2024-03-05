import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { XMarkIcon } from "@heroicons/react/20/solid";
import { HeartIcon } from "@heroicons/react/24/outline";

import { useSelectedMovie } from "../../context/SelectedMovieContext";
import { useAuth } from "../../context/AuthContext";

import {
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import UseDidMountEffect from "../../hooks/UseDidMountEffect";

const MovieModal = () => {
  const { selectedMovieDetails, setSelectedMovieDetails } = useSelectedMovie();
  const [isFavorite, setIsFavorite] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleOnClose = () => {
    setSelectedMovieDetails(null);
  };

  const handleFavorite = () => {
    if (currentUser) {
      setIsFavorite(!isFavorite);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const checkIsFavorite = async () => {
      try {
        if (currentUser) {
          const res = await getDoc(doc(db, "users", currentUser.uid));
          if (res.exists()) {
            const favorites = res.data().favorites;
            const isMovieInFavorites = favorites.includes(
              selectedMovieDetails.id
            );
            setIsFavorite(isMovieInFavorites);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    checkIsFavorite();
  }, []);

  UseDidMountEffect(() => {
    const updateFavorites = async () => {
      if (isFavorite) {
        await updateDoc(doc(db, "users", currentUser.uid), {
          favorites: arrayUnion(selectedMovieDetails.id),
        });
      } else {
        await updateDoc(doc(db, "users", currentUser.uid), {
          favorites: arrayRemove(selectedMovieDetails.id),
        });
      }
    };
    updateFavorites();
  }, [isFavorite]);

  const renderGridItem = (label, value) => {
    return value ? (
      <div className="text-xs">
        <span className="font-semibold">{label}: </span>
        <span>
          {label === "Homepage" ? (
            <a href={value} target="_blank">
              {value}
            </a>
          ) : Array.isArray(value) ? (
            value.slice(0, 5).join(", ")
          ) : (
            value
          )}
        </span>
      </div>
    ) : null;
  };

  return (
    <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="max-w-screen-md mx-4 md:mx-auto relative bg-gray-900 rounded-lg">
        <img
          className="h-full w-full object-cover rounded-t-lg"
          src={`https://image.tmdb.org/t/p/original/${selectedMovieDetails.backdrop_path}`}
          alt=""
        />
        <div className="bg-gray-900 text-gray-300 p-6 pb-8 rounded-b-lg">
          <div className="flex justify-between pr-4 items-center pb-4">
            <h2 className="font-medium text-xl">
              {selectedMovieDetails.title}
            </h2>
            <button
              className="flex gap-2 items-center font-medium focus:outline-none"
              onClick={handleFavorite}
            >
              <HeartIcon
                className={`h-5 w-5 ${
                  isFavorite ? "fill-red-600 text-red-600" : null
                }`}
              />
              <span className="hidden sm:block">Add to favorite</span>
            </button>
          </div>
          <h3 className=" text-xs">{selectedMovieDetails.overview}</h3>
          <div className="grid md:grid-cols-2 gap-2 mt-4">
            {renderGridItem("Released", selectedMovieDetails.release_date)}
            {renderGridItem("Genre", selectedMovieDetails.genres)}
            {renderGridItem("Cast", selectedMovieDetails.cast_name)}
            {renderGridItem("Crew", selectedMovieDetails.crew)}
            {renderGridItem("Homepage", selectedMovieDetails.homepage)}
          </div>
        </div>
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={handleOnClose}
        >
          <XMarkIcon className="h-8 w-8 fill-gray-100" />
        </button>
      </div>
    </div>
  );
};

export default MovieModal;
