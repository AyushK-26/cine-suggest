import React from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useAuth } from "../../context/AuthContext";
import { doSignOut } from "../../firebase/auth";

const Navbar = () => {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-around items-center pt-4 sm:pt-0 px-4 sm:px-10 text-gray-200 p-1 bg-neutral-900 sticky z-50 top-0 drop-shadow-md">
        <div className="w-full sm:w-max flex justify-between items-center">
          <h1 className="flex items-center gap-6 md:gap-12">
            <Link to="/" className="font-medium text-lg lg:text-2xl">
              Cine Suggest
            </Link>
            <Link
              to="/favorites"
              onClick={(event) => {
                if (!userLoggedIn) {
                  event.preventDefault();
                  navigate("/login");
                }
              }}
            >
              Favorites
            </Link>
          </h1>

          {!userLoggedIn ? (
            <div className="flex gap-4 sm:hidden ">
              <Link to="/login">Login</Link>
              <Link to="/register" className="hidden xs:block">
                Register
              </Link>
            </div>
          ) : (
            <div className="sm:hidden">
              <button
                onClick={() => {
                  doSignOut();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <SearchBar />

        {!userLoggedIn ? (
          <div className="gap-8 hidden sm:flex">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        ) : (
          <div className="hidden sm:block">
            <button
              onClick={(event) => {
                event.preventDefault();
                navigate("/");
                doSignOut();
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
