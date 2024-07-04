import React, { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import New from "./New";
import axios from "axios";
import Thread from "../component/Thread";
import { useAuth } from "../context/AuthContext";
import defaultImg from "../constant.js";
import "../App.css";

const Home = () => {
  const { isLoggedIn, logout, user } = useAuth();
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

  const deleteThread = async (threadId) => {
    await axios.delete(`/api/v1/posts/${threadId}`);
    setThread((prevThread) =>
      prevThread.filter((post) => post._id != threadId)
    );
  };

  const updateThread = async (threadId, content) => {
    try {
      await axios.put(`/api/v1/posts/${threadId}`, { content });
      const response = await axios.get("/api/v1/posts");
      setThread(response.data.data.posts);
    } catch (error) {
      console.error("Error updating thread:", error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  console.log(user);
  return (
    <div className=" bg-zinc-950 w-[100%] text-white py-[5vh] min-h-screen max-md:py-0">
      {newPost && (
        <New
          username={user?.username}
          close={setNewPost}
          profileImg={user?.profileImg || defaultImg}
          getPosts={getPosts}
        />
      )}
      <div className=" flex justify-center">
        <div className=" w-[100vw] rounded-2xl h-screen flex flex-col overflow-scroll fixed hide-scrollbar items-center">
          <div className=" w-[40vw] flex flex-col bg-zinc-900  rounded-2xl pb-10 relative max-md:w-[100vw]">
            {isLoggedIn && (
              <div className=" w-[100%]  px-6 border-b border-zinc-700 flex py-6 items-center sticky bg-zinc-900 top-0 rounded-md z-10">
                <img
                  className=" w-10 h-10 object-cover rounded-full"
                  src={user?.profileImg || defaultImg}
                  alt=""
                />
                <div
                  className=" flex flex-col gap-4 px-4 text-zinc-400"
                  onClick={() => {
                    setNewPost(true);
                  }}
                >
                  Start Twine...
                </div>
              </div>
            )}
            {thread.map((thread, index) => {
              return (
                <Thread
                  key={index}
                  thread={thread}
                  like={makeLike}
                  comment={makeComment}
                  userId={user?._id}
                  deleteThread={deleteThread}
                  updateThread={updateThread}
                  postId={thread?._id}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
