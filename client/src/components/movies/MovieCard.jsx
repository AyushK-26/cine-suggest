import React, { useContext } from "react";
import axios from "axios";

import { useSelectedMovie } from "../../context/SelectedMovieContext";
import { BaseApiUrl } from "../../constants/constants";

const MovieCard = ({ id, title, releaseDate, posterPath }) => {
  const { setSelectedMovieDetails } = useSelectedMovie();

  const handleViewMore = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${BaseApiUrl}search-movies/${id}`,
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const movieDetails = response.data;
      setSelectedMovieDetails(movieDetails);
    } catch (error) {
      console.log("Error fetching movie details: ", error);
    }
  };

  return (
    <div className="flex flex-col justify-between bg-gray-800 rounded-sm">
      <img src={`https://image.tmdb.org/t/p/original/${posterPath}`} alt="" />
      <div className="text-gray-300 text-xs sm:text-lg md:text-sm font-medium p-2">
        <div className="flex items-center justify-between pb-3 pt-1">
          <span>{title.length < 15 ? title : `${title.slice(0, 14)}...`}</span>
          <span>{releaseDate.slice(0, 4)}</span>
        </div>
        <button
          className="py-2 w-full rounded-sm bg-gray-700 drop-shadow-md hover:bg-gray-600"
          onClick={handleViewMore}
        >
          View More
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
