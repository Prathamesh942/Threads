import React, { useState } from "react";
import Navbar from "../component/Navbar";
import New from "./New";

const Home = () => {
  const [newPost, setNewPost] = useState(true);
  return (
    <div className=" bg-zinc-950 w-screen h-screen text-white">
      {newPost && <New close={setNewPost} />}
      <Navbar />
    </div>
  );
};

export default Home;
