import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import defaultImg from "../constant.js";

const SingleThread = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useAuth();
  const twineId = useParams();
  const [thread, setThread] = useState();
  const [liked, setLiked] = useState(false);
  const [me, setMe] = useState(JSON.parse(localStorage.getItem("twineuser")));
  const [reply, setReply] = useState("");
  const [comments, setComments] = useState([]);
  const getThread = async () => {
    const res = await axios.get(`/api/v1/posts/${twineId?.threadId}`);
    setThread(res.data.data);
    const user = await JSON.parse(localStorage.getItem("twineuser"));
    setMe(user);
    const comments = await axios.get(
      `/api/v1/posts/${twineId?.threadId}/comments`
    );
    setComments(comments.data.data);
    if (res.data?.data?.likes) {
      for (let userLiked of res.data?.data?.likes) {
        if (userLiked == me?._id) {
          setLiked(true);
          return;
        }
      }
    } else {
      setLiked(false);
    }
  };

  const makeLike = async (postId) => {
    const res = await axios.post(`/api/v1/posts/${thread?._id}/likes`);
    setLiked(!liked);
  };

  const makeReply = async () => {
    if (!isLoggedIn) {
      navigate("/auth");
      return;
    }
    await axios.post(`/api/v1/posts/${thread?._id}/comments`, {
      content: reply,
    });
    setReply("");
    getThread();
  };

  useEffect(() => {
    getThread();
  }, [twineId, liked]);
  return (
    <div className=" bg-zinc-950 w-[100%] flex justify-center items-center overflow-hidden">
      <div className=" w-[40vw] min-h-screen py-[6vh] bg-zinc-900 flex flex-col p-10 max-md:w-[100vw] max-md:p-2">
        <div>
          <img src={thread?.image} className=" pb-4"></img>
          {thread?.content &&
            thread?.content.map((twine, index) => {
              return (
                <div>
                  <div
                    className=" w-[100%]  px-6 flex  py-2 cursor-pointer ]

    "
                  >
                    <div className=" min-w-10 flex flex-col items-center">
                      <img
                        className=" w-10 h-10 object-cover rounded-full"
                        src={thread?.user?.profileImg || defaultImg}
                        alt=""
                      />
                      <div className=" h-[100%] bg-zinc-500 w-[1px] rounded-full"></div>
                    </div>

                    <div className=" flex flex-col gap-4 px-4 w-[100%]">
                      <div className=" flex justify-between w-[100%]">
                        <h2 className=" flex items-center gap-1 text-zinc-300">
                          <Link
                            to={`/${thread?.user?.username}`}
                            className="cursor-pointer"
                          >
                            {thread?.user?.username}
                          </Link>
                          {user?.username == "prathamesh_94" ? (
                            <img
                              className=" size-5"
                              src="/assets/verified.png"
                            />
                          ) : (
                            <></>
                          )}
                        </h2>
                        {
                          <div className=" flex flex-col relative items-center">
                            {thread?.user?._id == user?._id && (
                              <img
                                className=" cursor-pointer"
                                src="./assets/more.svg"
                                alt=""
                                onClick={() => {
                                  setShowMore(!showMore);
                                }}
                              />
                            )}
                          </div>
                        }
                      </div>
                      <div>{thread?.content && twine}</div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className=" flex">
          <div className=" w-20"></div>
          <div className=" flex gap-3">
            <span
              className=" cursor-pointer flex  items-center"
              onClick={() => {
                if (!user?._id) {
                  return;
                }
                setLiked(!liked);
              }}
            >
              <div className=" size-7 flex items-center">
                <img
                  className={` size-${liked ? "6" : "5"}`}
                  src={`/assets/heart${liked ? "-filled" : ""}.svg`}
                  alt=""
                  onClick={makeLike}
                />
              </div>{" "}
              {thread?.likes?.length}
            </span>
            <span className=" cursor-pointer flex items-center">
              <div className=" size-7 flex items-center">
                <img src="/assets/reply.svg" alt="" />{" "}
              </div>
              {thread?.comments?.length}{" "}
            </span>
          </div>
        </div>

        <div className=" px-6 py-8 flex flex-col gap-10">
          <div className="flex border-b border-t py-4 border-zinc-500 gap-4  w-[100%] justify-between items-center">
            <img
              src={me?.profileImg || defaultImg}
              alt=""
              className=" rounded-full w-10 h-10 object-cover"
            />
            <input
              type="text"
              placeholder="Post your reply"
              className=" bg-transparent outline-none flex-grow resize-none "
              onChange={(e) => {
                setReply(e.target.value);
              }}
              value={reply}
            />
            <button
              onClick={makeReply}
              className=" bg-white rounded-lg p-2 text-black "
            >
              Reply
            </button>
          </div>
          <div className=" flex flex-col gap-4">
            {comments.map((reply) => {
              console.log(me, reply);
              return (
                <div className=" w-[100%] border-b-[1px] border-zinc-800 pb-4">
                  <div
                    className=" w-[100%] flex cursor-pointer ]

    "
                  >
                    <div className=" min-w-10 flex flex-col items-center">
                      <img
                        className=" w-10 h-10 object-cover rounded-full"
                        src={reply?.user?.profileImg || defaultImg}
                        alt=""
                      />
                      <div className=" h-[100%] bg-zinc-500 w-[1px] rounded-full"></div>
                    </div>
                    <div className=" flex flex-col gap-4 px-4 w-[100%]">
                      <div className=" flex justify-between w-[100%]">
                        <h2 className=" flex items-center gap-1 text-zinc-300">
                          <Link
                            to={`/${reply?.user?.username}`}
                            className="cursor-pointer"
                          >
                            {reply?.user?.username}
                            {user?.username == "prathamesh_94" ? (
                              <img
                                className=" size-5"
                                src="/assets/verified.png"
                              />
                            ) : (
                              <></>
                            )}
                          </Link>
                        </h2>
                        {
                          <div className=" flex flex-col relative items-center">
                            {thread?.user?._id == user?._id && (
                              <img
                                className=" cursor-pointer"
                                src="./assets/more.svg"
                                alt=""
                                onClick={() => {
                                  setShowMore(!showMore);
                                }}
                              />
                            )}
                          </div>
                        }
                      </div>
                    </div>
                    {String(me?._id) == String(reply?.user?._id) && (
                      <img
                        src="/assets/delete.svg"
                        onClick={async () => {
                          const res = await axios.delete(
                            `/api/v1/comments/${reply?._id}`
                          );
                          getThread();
                        }}
                      ></img>
                    )}
                  </div>
                  <span className=" pl-14">{reply?.content}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleThread;
