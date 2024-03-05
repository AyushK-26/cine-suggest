import React from "react";

import { useSelectedMovie } from "../../context/SelectedMovieContext";

import { Transition } from "@headlessui/react";

import Navbar from "../navbar/Navbar";
import FavoriteContainer from "./FavoriteContainer";
import MovieModal from "../movies/MovieModal";

const Favorites = () => {
  const { selectedMovieDetails } = useSelectedMovie();

  return (
    <>
      <Navbar />
      <FavoriteContainer />
      <Transition
        show={Boolean(selectedMovieDetails)}
        enter="ease-in duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-out duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {selectedMovieDetails && <MovieModal />}
      </Transition>
    </>
  );
};

export default Favorites;
