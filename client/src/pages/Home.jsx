import React, { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import New from "./New";
import axios from "axios";
import Thread from "../component/Thread";
import { useAuth } from "../context/AuthContext";
import defaultImg from "../constant.js";

const Home = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("twineuser"))?.data?.data
  );
  const { isLoggedIn, logout } = useAuth();
  const [newPost, setNewPost] = useState(false);
  const [thread, setThread] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/v1/auth/checkauth", {
          withCredentials: true,
        });
        console.log(response);
        if (response.data.loggedIn) {
          const storedUser = localStorage.getItem("twineuser");
          const parsedUser = JSON.parse(storedUser);
          console.log(parsedUser);
          setUser(
            await axios.get(`/api/v1/users/${parsedUser.username}
`)
          );
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  console.log(user);

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
  return (
    <div className=" bg-zinc-950 w-[100%] text-white py-[5vh] min-h-screen">
      {newPost && (
        <New
          username={user.data.data.username}
          close={setNewPost}
          profileImg={user.data.data.profileImg || defaultImg}
          getPosts={getPosts}
        />
      )}
      <Navbar />
      <div className=" flex justify-center">
        <div className=" w-[40vw] flex flex-col bg-zinc-900  rounded-2xl">
          {isLoggedIn && (
            <div className=" w-[100%]  px-6 border-b border-zinc-700 flex py-6 items-center">
              <img
                className=" w-10 h-10 object-cover rounded-full"
                src={user?.data?.data?.profileImg || defaultImg}
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
          {thread.map((thread) => {
            console.log(user);
            return (
              <Thread
                thread={thread}
                like={makeLike}
                comment={makeComment}
                userId={user.data.data._id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
