import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";

import MovieCard from "../movies/MovieCard";

import { BaseApiUrl, PaginationPageSize } from "../../constants/constants";
import { useSearchQuery } from "../../context/SearchQueryContext";
import Pagination from "../pagination/Pagination";

const HomeSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [similarMovies, setSimilarMovies] = useState([]);
  const { searchQuery } = useSearchQuery();

  const currentMoviesData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PaginationPageSize;
    const lastPageIndex = firstPageIndex + PaginationPageSize;
    return similarMovies.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, similarMovies]);

  useEffect(() => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${BaseApiUrl}search-movies?query=${searchQuery}`,
      headers: {},
    };

    if (!searchQuery) {
      config.url = `${BaseApiUrl}search-movies/popular`;
    }

    const fetchMoviesList = async () => {
      try {
        const response = await axios.request(config);
        const moviesList = response.data;
        console.log(moviesList);
        setSimilarMovies(moviesList.matches);
      } catch (error) {
        console.log("Error fetching movies: ", error);
      }
    };
    fetchMoviesList();
  }, [searchQuery]);

  return (
    <>
      <Pagination
        currentPage={currentPage}
        totalCount={similarMovies.length}
        pageSize={PaginationPageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
      {similarMovies.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 auto-rows-fr gap-4 gap-y-6 py-10">
            {currentMoviesData.map((movieData) => (
              <MovieCard
                key={movieData.id}
                id={movieData.id}
                title={movieData.metadata.title}
                releaseDate={movieData.metadata.release_date}
                posterPath={movieData.metadata.poster_path}
              />
            ))}
          </div>
        </>
      )}
      <Pagination
        currentPage={currentPage}
        totalCount={similarMovies.length}
        pageSize={PaginationPageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
};

export default HomeSection;
