import React from "react";
import "./index.css";

import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./Root.jsx";
import Error from "./components/error/Error.jsx";

const router = createBrowserRouter([
  {
    path: "*",
    element: <Root />,
    errorElement: <Error />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);
