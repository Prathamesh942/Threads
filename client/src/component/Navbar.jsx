import React from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { isLoggedIn, logout, user } = useAuth();

  console.log(user);

  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/auth/logout");
    } catch (error) {}
    logout();
  };
  return (
    <div className=" py-[5vh] flex flex-col justify-between  items-center h-screen w-[100px] fixed top-0">
      <div className="">LOGO</div>
      <ul className=" flex flex-col gap-[4vh] max-h-[400px] justify-center">
        <li>HOME</li>
        <li>SEARCH</li>
        <li>NEW</li>
        <li>ACTIVITY</li>
        <li>PROFILE</li>
      </ul>
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className=" bg-white rounded-lg px-2 py-1 text-black"
        >
          Log out
        </button>
      ) : (
        <Link to={"/auth"}>
          <button className=" bg-white rounded-lg px-2 py-1 text-black">
            Log in
          </button>
        </Link>
      )}
    </div>
  );
};

export default Navbar;
