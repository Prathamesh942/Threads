import { useEffect, useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Authentication from "./pages/Authentication";
import axios from "axios";
import UpdateProfile from "./component/UpdateProfile";
import New from "./pages/New";
import Layout from "./component/Layout";
import Profile from "./pages/Profile";
import SingleThread from "./pages/SingleThread";
import Activity from "./pages/Activity";
import Search from "./pages/Search";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/:username",
        element: <Profile />,
      },
      {
        path: "/twine/:threadId",
        element: <SingleThread />,
      },
      {
        path: "/activity",
        element: <Activity />,
      },
      {
        path: "/search",
        element: <Search />,
      },
    ],
  },

  {
    path: "/auth",
    element: <Authentication />,
  },
  {
    path: "/updateprofile",
    element: <UpdateProfile />,
  },
  {
    path: "/new",
    element: <New />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
