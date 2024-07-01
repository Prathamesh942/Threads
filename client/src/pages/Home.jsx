import React, { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import New from "./New";
import axios from "axios";
import Thread from "../component/Thread";

const Home = () => {
  const [newPost, setNewPost] = useState(false);
  const [thread, setThread] = useState([]);

  const getPosts = async () => {
    try {
      const response = await axios.get("/api/v1/posts");
      setThread(response.data.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const makeLike = async (postId) => {
    await axios.post(`/api/v1/posts/${postId}/likes`);
    const response = await axios.get(`/api/v1/posts/${postId}`);
    console.log(response.data.data);
    setThread((prevThread) =>
      prevThread.map((post) =>
        post._id === postId ? response.data.data : post
      )
    );
  };

  const makeComment = async (postId, content) => {
    await axios.post(`/api/v1/posts/${postId}/comments`, { content });
    getPosts();
  };

  useEffect(() => {
    getPosts();
  }, []);
  console.log(thread);
  return (
    <div className=" bg-zinc-950 w-[100%] text-white py-[5vh]">
      {/* {newPost && <New close={setNewPost} />} */}
      <Navbar />
      <div className=" flex justify-center">
        <div className=" w-[40vw] flex flex-col bg-zinc-900  rounded-2xl">
          {thread.map((thread) => {
            return (
              <Thread thread={thread} like={makeLike} comment={makeComment} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
