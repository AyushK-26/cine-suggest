import React from "react";
import { Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { SearchQueryProvider } from "./context/SearchQueryContext";
import { SelectedMovieProvider } from "./context/SelectedMovieContext";

import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Favorites from "./components/favorites/Favorites";

function Root() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <SearchQueryProvider>
              <SelectedMovieProvider>
                <Home />
              </SelectedMovieProvider>
            </SearchQueryProvider>
          }
        />

        <Route
          path="/favorites/"
          element={
            <SearchQueryProvider>
              <SelectedMovieProvider>
                <Favorites />
              </SelectedMovieProvider>
            </SearchQueryProvider>
          }
        />

        <Route path="/login/" element={<Login />} />
        <Route path="/register/" element={<Register />} />
      </Routes>
    </AuthProvider>
  );
}

export default Root;
