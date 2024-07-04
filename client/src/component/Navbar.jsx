import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import defaultImg from "../constant.js";
import "../App.css";

const Navbar = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/auth/logout");
    } catch (error) {
      console.error(error);
    }
    logout();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="py-[5vh] flex flex-col justify-between items-center h-screen w-[100px] fixed top-0 z-20 max-md:flex-row max-md:h-[60px] max-md:w-[100%] max-md:px-[6vw] max-md:bg-zinc-900 max-md:top-auto max-md:bottom-0 max-md:py-0">
      <Link to={"/"}>
        <div className="size-14 cursor-pointer max-md:hidden">
          <img className="hover:scale-105" src="/assets/twinelogo.png" alt="" />
        </div>
      </Link>
      <ul className="flex flex-col gap-[4vh] max-h-[400px] justify-center items-center max-md:flex-row flex-grow">
        <Link to={"/"}>
          <li className="hover:bg-zinc-900 p-2 rounded-lg cursor-pointer">
            <img src="/assets/home.svg" alt="" />
          </li>
        </Link>
        <Link to={"/search"}>
          <li className="hover:bg-zinc-900 p-2 rounded-lg cursor-pointer">
            <img src="/assets/search.svg" alt="" />
          </li>
        </Link>
        {isLoggedIn && (
          <Link to={"activity"}>
            <li className="hover:bg-zinc-900 p-2 rounded-lg cursor-pointer">
              <img src="/assets/heart.svg" alt="" />
            </li>
          </Link>
        )}
        {user?.data?.data && (
          <Link to={`/${user?.data?.data?.username}`}>
            {isLoggedIn && (
              <li className="hover:bg-zinc-900 p-2 rounded-lg cursor-pointer">
                <img
                  className="rounded-full size-8 object-cover"
                  src={user?.data?.data?.profileImg || defaultImg}
                  alt=""
                />
              </li>
            )}
          </Link>
        )}
      </ul>

      <button
        onClick={toggleMenu}
        className="hidden max-md:block  rounded-lg px-2 py-1 text-whitec"
      >
        ☰
      </button>

      {menuOpen && (
        <div className="absolute bottom-[60px] right-0 bg-zinc-900 p-4 rounded-lg max-md:flex flex-col items-center">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-white rounded-lg px-2 py-1 text-black"
            >
              Log out
            </button>
          ) : (
            <Link to={"/auth"}>
              <button className="bg-white rounded-lg px-2 py-1 text-black">
                Log in
              </button>
            </Link>
          )}
        </div>
      )}

      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className=" border rounded-lg  px-2 py-1 text-white  max-md:hidden"
        >
          Log out
        </button>
      ) : (
        <Link to={"/auth"}>
          <button className=" border rounded-lg px-2 py-1 text-white  max-md:hidden">
            Log In
          </button>
        </Link>
      )}
    </div>
  );
};

export default Navbar;
