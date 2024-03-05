import React, { useState, useContext } from "react";

const SearchQueryContext = React.createContext();

export const useSearchQuery = () => {
  return useContext(SearchQueryContext);
};

export const SearchQueryProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SearchQueryContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchQueryContext.Provider>
  );
};
