import React from "react";
import { usePagination, DOTS } from "../../hooks/UsePagination";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const Pagination = (props) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    if (currentPage < Math.ceil(totalCount / pageSize)) {
      onPageChange(currentPage + 1);
    }
  };

  const onPrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <ul className="flex justify-center items-center gap-1 sm:gap-2">
      <li
        className={`px-2 sm:px-4 text-gray-200 cursor-pointer ${
          currentPage === 1 ? "text-gray-700" : null
        }`}
        onClick={onPrevious}
      >
        <ChevronLeftIcon className="h-8 w-8" />
      </li>

      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <li
              key={`dots-${index}`}
              className="px-1.5 text-2xl font-thin text-gray-300 cursor-default"
            >
              &#8230;
            </li>
          );
        }

        return (
          <li
            key={pageNumber}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-sm text-gray-200 cursor-pointer ${
              pageNumber === currentPage
                ? "bg-blue-700 font-semibold"
                : "bg-gray-700"
            }`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}

      <li
        className={`px-2 sm:px-4 text-gray-200 cursor-pointer ${
          currentPage === lastPage ? "text-gray-700" : null
        }`}
        onClick={onNext}
      >
        <ChevronRightIcon className="h-8 w-8" />
      </li>
    </ul>
  );
};

export default Pagination;
