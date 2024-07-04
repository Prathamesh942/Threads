import React, { useEffect, useState } from "react";
import defaultImg from "../constant.js";
import { Link } from "react-router-dom";
import New from "../pages/New.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Thread = ({
  thread,
  like,
  comment,
  userId,
  deleteThread,
  updateThread,
}) => {
  const { isLoggedIn, logout, user: current } = useAuth();
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
            <span className=" font-light text-zinc-400">
              · {formatDate(thread?.createdAt)}
            </span>
          </h2>
          {
            <div className=" flex flex-col relative items-center">
              {isLoggedIn && String(thread?.user?._id) == String(userId) && (
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
        <Link to={`/twine/${thread?._id}`}>
          <img src={thread?.image} className=" pb-4"></img>
          <div className=" cursor-pointer">{content && content[0]}</div>
        </Link>

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
          <Link to={`/twine/${thread?._id}`}>
            <span className=" cursor-pointer flex items-center">
              <div className=" size-7 flex items-center">
                <img src="./assets/reply.svg" alt="" />{" "}
              </div>
              {thread?.comments?.length}{" "}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

function formatDate(dateString) {
  const inputDate = new Date(dateString);
  const currentDate = new Date();
  const timeDifference = currentDate - inputDate;
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day

  if (timeDifference > oneDay) {
    // More than 24 hours old, return date and month
    const day = inputDate.getDate();
    const month = inputDate.toLocaleString("default", { month: "short" }); // e.g., 'Jul'
    return `${day} ${month}`;
  } else {
    // Within the last 24 hours
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours} h`;
    } else if (minutes > 0) {
      return `${minutes} mins`;
    } else {
      return `${seconds} secs`;
    }
  }
}

export default Thread;
