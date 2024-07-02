import React from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import defaultImg from "../constant.js";

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
    <div className=" py-[5vh] flex flex-col justify-between  items-center h-screen w-[100px] fixed top-0 z-10">
      <div className=" size-14 cursor-pointer">
        <Link to={"/"}>
          <img
            className=" hover:scale-105"
            src="./assets/twinelogo.png"
            alt=""
          />
        </Link>
      </div>
      <ul className=" flex flex-col gap-[4vh] max-h-[400px] justify-center items-center">
        <li className=" hover:bg-zinc-900 p-2 rounded-lg cursor-pointer">
          <Link to={"/"}>
            <img src="./assets/home.svg" alt="" />
          </Link>
        </li>
        <li className=" hover:bg-zinc-900 p-2 rounded-lg cursor-pointer">
          <img src="./assets/search.svg" alt="" />
        </li>
        <li className=" hover:bg-zinc-900 p-2 rounded-lg cursor-pointer">
          <img src="./assets/heart.svg" alt="" />
        </li>
        <li className=" hover:bg-zinc-900 p-2 rounded-lg cursor-pointer">
          <img
            className=" rounded-full size-8 object-cover"
            src={user?.data?.data?.profileImg || defaultImg}
            alt=""
          />
        </li>
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
