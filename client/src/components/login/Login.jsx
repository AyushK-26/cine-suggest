import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MovieIllustration from "../../assets/MovieIllustration.jpg";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";

import { useAuth } from "../../context/AuthContext";
import { doSignInWithEmailAndPassword } from "../../firebase/auth";

const Login = () => {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userLoggedIn) {
      navigate("/");
    }
  }, [userLoggedIn, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const togglePasswordView = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (event) => {
    try {
      event.preventDefault();
      await doSignInWithEmailAndPassword(email, password);
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="flex flex-col w-11/12 max-w-md rounded-md">
        <img
          src={MovieIllustration}
          alt="Login Illustration"
          className="rounded-t-md"
        />

        <div className="p-6 pb-10 sm:p-10 sm:pb-14 rounded-b-md shadow-md bg-neutral-900 text-gray-200">
          <h2 className="text-3xl font-semibold pb-8">Welcome Back!</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="email"
                value={email}
                placeholder="Email"
                className="w-full px-6 py-3 text-sm text-gray-800 placeholder-gray-500 focus:outline-none rounded-md bg-gray-200"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative mb-6">
              <input
                type={showPassword ? "test" : "password"}
                value={password}
                placeholder="Password"
                className="w-full px-6 py-3 text-sm text-gray-800 placeholder-gray-500 focus:outline-none rounded-md bg-gray-200"
                onChange={(e) => setPassword(e.target.value)}
              />
              {showPassword ? (
                <EyeSlashIcon
                  className="absolute top-3 right-5 h-5 w-5 fill-gray-600 cursor-pointer"
                  onClick={togglePasswordView}
                />
              ) : (
                <EyeIcon
                  className="absolute top-3 right-5 h-5 w-5 fill-gray-600 cursor-pointer"
                  onClick={togglePasswordView}
                />
              )}
            </div>

            <button
              type="submit"
              className="py-3 w-full text-sm font-medium shadow-md rounded-md bg-blue-600 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring focus:border-blue-300"
            >
              Login
            </button>

            {error && (
              <div className="bg-red-700 rounded-md mt-2 px-4 py-2 ">
                <span className="text-sm">
                  We couldn't find your account!{" "}
                  <Link to="/register" className="text-gray-100 underline">
                    Create new account
                  </Link>{" "}
                  if you don't already have one.
                </span>
              </div>
            )}

            <div className="flex justify-between pr-1 mt-3 text-xs">
              <Link to="/register" className="hover:underline">
                Dont have an account?
              </Link>
              <Link to="/" className="hover:underline">
                Go to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
