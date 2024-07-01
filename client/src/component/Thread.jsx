import React, { useEffect, useState } from "react";
import defaultImg from "../constant.js";

const Thread = ({ thread, like, comment, userId }) => {
  const profileImg = thread.user.profileImg || defaultImg;
  const username = thread.user.username;
  const content = thread.content;
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    for (let userLiked of thread.likes) {
      console.log(userLiked, userId);
      if (userLiked == userId) {
        setLiked(true);
        return;
      }
    }
    setLiked(false);
  }, []);
  return (
    <div className=" w-[100%]  px-6 border-b border-zinc-700 flex py-6">
      <img
        className=" w-10 h-10 object-cover rounded-full"
        src={profileImg}
        alt=""
      />
      <div className=" flex flex-col gap-4 px-4">
        <h2 className=" flex items-center gap-1">
          {username}
          {username == "prathamesh_94" ? (
            <img className=" size-5" src="./assets/verified.png" />
          ) : (
            <></>
          )}
        </h2>
        <div>{content[0]}</div>
        <div className=" flex gap-3">
          <span
            className=" cursor-pointer flex  items-center"
            onClick={() => {
              setLiked(!liked);
              like(thread._id);
            }}
          >
            <div className=" size-7 flex items-center">
              <img
                className={` size-${liked ? "6" : "5"}`}
                src={`./assets/heart${liked ? "-filled" : ""}.svg`}
                alt=""
              />
            </div>{" "}
            {thread.likes.length}
          </span>
          <span className=" cursor-pointer flex items-center">
            <div className=" size-7 flex items-center">
              <img src="./assets/reply.svg" alt="" />{" "}
            </div>
            {thread.comments.length}{" "}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Thread;
