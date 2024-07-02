import React, { useEffect, useState } from "react";
import defaultImg from "../constant.js";
import { Link } from "react-router-dom";
import New from "../pages/New.jsx";

const Thread = ({
  thread,
  like,
  comment,
  userId,
  deleteThread,
  updateThread,
}) => {
  const profileImg = thread?.user?.profileImg || defaultImg;
  const username = thread?.user?.username;
  const content = thread?.content;
  const [liked, setLiked] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    if (thread?.likes) {
      for (let userLiked of thread?.likes) {
        if (userLiked == userId) {
          setLiked(true);
          return;
        }
      }
    }
    setLiked(false);
  });

  if (editMode) {
    return (
      <New
        username={thread.user?.username}
        close={setEditMode}
        profileImg={thread?.user?.profileImg || defaultImg}
        threadOld={thread.content}
        countOld={thread.content.length}
        update={true}
        updateThread={updateThread}
        threadId={thread._id}
      />
    );
  }
  return (
    <div className=" w-[100%]  px-6 border-b border-zinc-700 flex py-6">
      <img
        className=" w-10 h-10 object-cover rounded-full"
        src={profileImg}
        alt=""
      />
      <div className=" flex flex-col gap-4 px-4 w-[100%]">
        <div className=" flex justify-between w-[100%]">
          <h2 className=" flex items-center gap-1">
            <Link to={`/${username}`} className="cursor-pointer">
              {username}
            </Link>
            {username == "prathamesh_94" ? (
              <img className=" size-5" src="./assets/verified.png" />
            ) : (
              <></>
            )}
          </h2>
          {
            <div className=" flex flex-col relative items-center">
              {thread?.user?._id == userId && (
                <img
                  className=" cursor-pointer"
                  src="./assets/more.svg"
                  alt=""
                  onClick={() => {
                    setShowMore(!showMore);
                  }}
                />
              )}
              {showMore && (
                <div className=" absolute top-6 bg-zinc-800 p-4 rounded-lg cursor-pointer flex flex-col gap-4">
                  <img
                    className=" min-w-4 min-h-4"
                    src="./assets/delete.svg"
                    alt=""
                    onClick={() => {
                      deleteThread(thread._id);
                      setShowMore(!showMore);
                    }}
                  />
                  <img
                    onClick={() => {
                      setEditMode(true);
                      setShowMore(!showMore);
                    }}
                    src="/assets/edit.svg"
                    alt=""
                  />
                </div>
              )}
            </div>
          }
        </div>
        <div>{content && content[0]}</div>

        <div className=" flex gap-3">
          <span
            className=" cursor-pointer flex  items-center"
            onClick={() => {
              if (!userId) {
                return;
              }
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
            {thread?.likes?.length}
          </span>
          <span className=" cursor-pointer flex items-center">
            <div className=" size-7 flex items-center">
              <img src="./assets/reply.svg" alt="" />{" "}
            </div>
            {thread?.comments?.length}{" "}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Thread;
