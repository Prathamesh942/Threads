import React from "react";
import defaultImg from "../constant.js";

const Thread = ({ thread, like, comment }) => {
  const profileImg = thread.user.profileImg || defaultImg;
  const username = thread.user.username;
  const content = thread.content;
  return (
    <div className=" w-[100%]  px-6 border-b border-zinc-700 flex py-6">
      <img
        className=" w-10 h-10 object-cover rounded-full"
        src={profileImg}
        alt=""
      />
      <div className=" flex flex-col gap-4 px-4">
        <h2>{username}</h2>
        <div>
          {content[0]}
          {/* {content.map((item) => {
            return (
              <div className=" w-[100%]">
                <p className=" w-[100%]">{item}</p>
                <div className=" w-[1px] bg-zinc-700 h-2"></div>
              </div>
            );
          })} */}
        </div>
        <div className=" flex gap-3">
          <span
            className=" cursor-pointer"
            onClick={() => {
              like(thread._id);
            }}
          >
            Likes: {thread.likes.length}
          </span>
          <span>Comments: {thread.comments.length}</span>
        </div>
      </div>
    </div>
  );
};

export default Thread;
