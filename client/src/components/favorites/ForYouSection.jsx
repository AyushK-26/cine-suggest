import React, { useMemo, useState } from "react";

import MovieCard from "../movies/MovieCard";
import { PaginationPageSize } from "../../constants/constants";
import Pagination from "../pagination/Pagination";

const ForYouSection = ({ recommendedMovies }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const currentRecommendationData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PaginationPageSize;
    const lastPageIndex = firstPageIndex + PaginationPageSize;
    return recommendedMovies.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, recommendedMovies]);

  return (
    <>
      <Pagination
        currentPage={currentPage}
        totalCount={recommendedMovies.length}
        pageSize={PaginationPageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 auto-rows-fr gap-4 gap-y-6 py-10">
        {currentRecommendationData.map((movieData) => {
          return (
            <MovieCard
              key={movieData.id}
              id={movieData.id}
              title={movieData.metadata.title}
              releaseDate={movieData.metadata.release_date}
              posterPath={movieData.metadata.poster_path}
            />
          );
        })}
      </div>
      <Pagination
        currentPage={currentPage}
        totalCount={recommendedMovies.length}
        pageSize={PaginationPageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
};

export default ForYouSection;
