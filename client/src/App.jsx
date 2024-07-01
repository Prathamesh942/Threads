import { useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Authentication from "./pages/Authentication";
import axios from "axios";
import UpdateProfile from "./component/UpdateProfile";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth",
    element: <Authentication />,
  },
  {
    path: "/updateprofile",
    element: <UpdateProfile />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
