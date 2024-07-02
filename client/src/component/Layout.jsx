import React, { Children } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className=" bg-zinc-950 w-[100%] text-white ">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
