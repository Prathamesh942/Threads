import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Thread from "../component/Thread";
import { useAuth } from "../context/AuthContext";
import Edit from "./Edit";

const Profile = () => {
  const { isLoggedIn, logout, user: current } = useAuth();
  const navigate = useNavigate();
  const { username } = useParams();
  const [user, setUser] = useState();
  const [thread, setThread] = useState();
  const [followed, setFollowed] = useState(false);
  const [update, setUpdate] = useState(false);
  const fetchUser = async () => {
    const response = await axios.get(`/api/v1/users/${username}`);
    setUser(response.data.data);
    try {
      const response = await axios.get(`/api/v1/posts/${username}/posts`);

      setThread(response.data.data);
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

  const follow = async () => {
    if (!isLoggedIn) {
      navigate("/auth");
    }
    const res = await axios.post(`/api/v1/users/${user.username}/follow`);
    setFollowed(!followed);
  };
  useEffect(() => {
    fetchUser();
  }, [followed, update, username]);
  return (
    <>
      {update && (
        <Edit
          usernameOld={username}
          nameOld={user.name}
          bioOld={user.bio}
          close={setUpdate}
        />
      )}
      <div className=" bg-zinc-950 w-screen h-screen flex justify-center items-center">
        <div className=" w-[40vw] h-screen py-[6vh] bg-zinc-900 flex flex-col p-10 max-md:w-[80vw] max-md:p-2">
          <div className="w-[100%] flex-1 border-b border-zinc-600 flex flex-col gap-6 pb-10">
            <div className=" flex w-[100%] justify-between flex-col">
              <div className=" flex flex-col gap-4 justify-center items-center">
                <img
                  className=" rounded-full w-[100px] h-[100px] min-w-[100px] min-h-[100px] object-cover"
                  src={user?.profileImg}
                  alt=""
                />
              </div>
              <div className=" flex flex-col gap-4 items-center">
                <div className=" flex flex-col items-center">
                  <h2 className=" text-lg font-medium flex gap-1 items-center">
                    {user?.name}
                    {username == "prathamesh_94" ? (
                      <img className=" size-5" src="./assets/verified.png" />
                    ) : (
                      <></>
                    )}
                  </h2>
                  <span className=" text-zinc-300 font-light ">
                    {user?.username}
                  </span>
                </div>
                <div>
                  <pre className=" max-w-[100%] whitespace-pre-wrap text-center">
                    {user?.bio}
                  </pre>
                </div>
                <div className=" text-zinc-600 flex items-center gap-4 w-[1005]">
                  <div className=" flex gap-1">
                    <span>{user?.followers.length}</span> followers
                  </div>
                  {current?.data?.data?.username == username ? (
                    <button
                      className=" bg-zinc-800 text-white rounded-lg py-2 px-4 flex justify-center items-center"
                      onClick={() => {
                        setUpdate(true);
                      }}
                    >
                      Edit profile
                    </button>
                  ) : (
                    <button
                      className={`${
                        user?.followers?.includes(current?.data?.data?._id)
                          ? "bg-zinc-800 text-white"
                          : "bg-white w-[40%]"
                      } text-black rounded-lg py-2 px-4 flex justify-center items-center`}
                      onClick={follow}
                    >
                      {user?.followers?.includes(current?.data?.data?._id)
                        ? "Unfollow"
                        : "Follow"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className=" flex-[2] flex flex-col overflow-scroll hide-scrollbar">
            {thread?.map((thread, index) => {
              return (
                <Thread
                  key={index}
                  thread={thread}
                  like={makeLike}
                  comment={makeComment}
                  userId={user?._id}
                  deleteThread={deleteThread}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
