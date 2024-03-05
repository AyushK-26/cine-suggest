import React from "react";

import { useSelectedMovie } from "../../context/SelectedMovieContext";

import { Transition } from "@headlessui/react";

import Navbar from "../navbar/Navbar";
import HomeContainer from "./HomeContainer";
import MovieModal from "../movies/MovieModal";

const Home = () => {
  const { selectedMovieDetails } = useSelectedMovie();

  return (
    <>
      <Navbar />
      <HomeContainer />
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

export default Home;
