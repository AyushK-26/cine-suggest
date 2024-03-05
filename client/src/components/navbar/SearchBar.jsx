import React, { useRef } from "react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useSearchQuery } from "../../context/SearchQueryContext";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const inputRef = useRef(null);
  const { setSearchQuery } = useSearchQuery();
  const navigate = useNavigate();

  const clearInput = () => {
    inputRef.current.value = "";
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchQuery(inputRef.current.value);
    navigate("/");
    clearInput();
  };

  return (
    <form onSubmit={handleSearch} className="w-full sm:w-1/3">
      <div className="flex items-center my-4 border-2 rounded-md relative z-50 w-full bg-neutral-800 border-neutral-800 text-gray-300 text-sm">
        <input
          type="text"
          ref={inputRef}
          className="w-full px-4 py-2 focus:outline-none rounded-md bg-neutral-800"
          placeholder="Seach for movies..."
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSearch(event);
            }
          }}
        />
        {inputRef.current?.value && (
          <button onClick={clearInput} className="m-2">
            <XMarkIcon className="h-5 w-5 fill-gray-100" />
          </button>
        )}
        <button
          type="submit"
          className="h-8 w-8 bg-blue-600 rounded-md flex justify-center items-center m-1 p-2"
        >
          <MagnifyingGlassIcon className="h-4 w-4 fill-gray-100" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
