import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Activity = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const [showFollowers, setShowFollowers] = useState(false);
  const [activity, setActivity] = useState();
  const getActivity = async () => {
    const res = await axios.get(`/api/v1/users/${user?.username}/activity`);
    setActivity(res.data.data);
    // console.log(res);
  };
  useEffect(() => {
    getActivity();
  }, []);

  return (
    <div className=" w-screen h-screen flex justify-center">
      <div className=" w-[40%] h-screen bg-zinc-900 max-md:w-[80vw]">
        <div className=" w-[100%] flex justify-between  border-b border-zinc-600 cursor-pointer">
          <span
            className={` flex justify-center flex-grow border-r border-zinc-600 cursor-pointer p-2 ${
              showFollowers ? "bg-zinc-800" : ""
            }`}
            onClick={() => {
              setShowFollowers(true);
            }}
          >
            Followers
          </span>
          <span
            className={` flex justify-center flex-grow  p-2 ${
              !showFollowers ? "bg-zinc-800" : ""
            }`}
            onClick={() => {
              setShowFollowers(false);
            }}
          >
            Likes
          </span>
        </div>
        <div className=" p-2">
          {showFollowers ? (
            <div className=" flex flex-col gap-5 p-5">
              {activity?.followersDetails?.map((f) => {
                return (
                  <div>
                    <h4 className=" flex gap-2  items-center">
                      <img
                        className=" size-8 rounded-full object-cover"
                        src={f.profileImg}
                      />
                      {f.username} started following you
                    </h4>
                  </div>
                );
              })}
              {!activity?.followersDetails?.length && (
                <div className=" w-[100%]  flex justify-center items-center h-[400px]">
                  <img
                    src="/assets/empty.png"
                    className=" w-[200px] h-[200px] aspect-square"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className=" flex flex-col gap-5 p-5">
              {activity?.likeDetailsSorted?.map((f) => {
                return (
                  <div>
                    <h4 className=" flex gap-2  items-center">
                      <img
                        className=" size-8 rounded-full object-cover"
                        src={f.profileImg}
                      />
                      {f.username} Liked your{" "}
                      <Link
                        to={`/twine/${f.postId}`}
                        className=" text-blue-200"
                      >
                        Twine
                      </Link>{" "}
                    </h4>
                  </div>
                );
              })}
              {!activity?.likeDetailsSorted?.length && (
                <div className=" w-[100%] h-[100%] flex justify-center items-center">
                  <img
                    src="/assets/empty.png"
                    className=" w-[200px] h-[200px] aspect-square"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Activity;
