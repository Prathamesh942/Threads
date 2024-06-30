import React from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";

const Navbar = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const token = Cookies.get("accessToken");
  console.log(token);

  const handleLogout = async () => {
    await axios.post("/api/v1/auth/logout");
    logout();
  };
  return (
    <div className=" w-screen px-[5vw] flex justify-between items-center h-[100px]">
      <div className="">LOGO</div>
      <ul className=" flex gap-[4vw] max-w-[400px] justify-center">
        <li>HOME</li>
        <li>SEARCH</li>
        <li>NEW</li>
        <li>ACTIVITY</li>
        <li>PROFILE</li>
        {isLoggedIn && user.name}
      </ul>
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className=" bg-white rounded-lg px-2 py-1 text-black"
        >
          Log out
        </button>
      ) : (
        <button className=" bg-white rounded-lg px-2 py-1 text-black">
          Log in
        </button>
      )}
    </div>
  );
};

export default Navbar;
