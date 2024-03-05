import React, { useMemo, useState } from "react";

import MovieCard from "../movies/MovieCard";
import { PaginationPageSize } from "../../constants/constants";
import Pagination from "../pagination/Pagination";

const FavoriteSection = ({ favoriteMovies }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const currentFavoriteData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PaginationPageSize;
    const lastPageIndex = firstPageIndex + PaginationPageSize;
    return favoriteMovies.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, favoriteMovies]);

  return (
    <>
      <Pagination
        currentPage={currentPage}
        totalCount={favoriteMovies.length}
        pageSize={PaginationPageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 auto-rows-fr gap-4 gap-y-6 py-10">
        {currentFavoriteData.map((movieData) => {
          return (
            <MovieCard
              key={movieData.id}
              id={movieData.id}
              title={movieData.title}
              releaseDate={movieData.release_date}
              posterPath={movieData.poster_path}
            />
          );
        })}
      </div>
    </>
  );
};

export default FavoriteSection;
