import React, { useState, useContext } from "react";

const SelectedMovieContext = React.createContext();

export const useSelectedMovie = () => {
  return useContext(SelectedMovieContext);
};

export const SelectedMovieProvider = ({ children }) => {
  const [selectedMovieDetails, setSelectedMovieDetails] = useState(null);

  return (
    <SelectedMovieContext.Provider
      value={{ selectedMovieDetails, setSelectedMovieDetails }}
    >
      {children}
    </SelectedMovieContext.Provider>
  );
};
