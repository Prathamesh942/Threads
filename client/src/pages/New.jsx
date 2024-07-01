import axios from "axios";
import React, { useState, useRef } from "react";

const Single = ({
  username,
  profileImg,
  index,
  thread,
  setThread,
  count,
  setCount,
}) => {
  const handleChange = (e) => {
    const updatedThread = [...thread];
    updatedThread[index] = e.target.value;
    setThread(updatedThread);
  };

  const textareaRef = useRef(null);

  const autoGrow = (element) => {
    element.style.height = "5px";
    element.style.height = element.scrollHeight + "px";
  };

  const handleInput = (e) => {
    autoGrow(e.target);
  };
  return (
    <div className=" flex justify-between items-center py-4 w-[100%] ">
      <div className=" flex w-[100%]">
        <div className=" h-[100%] flex flex-col items-center gap-1">
          <img src={profileImg} alt="" className=" rounded-full size-10" />
          <div className=" h-[100%] w-[2px] rounded-full bg-zinc-700"></div>
        </div>
        <div className=" flex flex-col gap-2  w-[100%] px-6 ">
          <h3>{username}</h3>
          <textarea
            onChange={(e) => {
              handleChange(e);
            }}
            ref={textareaRef}
            onInput={handleInput}
            value={thread[index]}
            type="text"
            placeholder="Say more.."
            className=" bg-transparent outline-none overflow-hidden resize-none w-[100%] "
          />
        </div>
      </div>
      <button
        onClick={() => {
          if (count == 1) {
            return;
          }
          const updatedThread = thread.filter((item, ind) => ind != index);
          console.log(updatedThread);
          setThread(updatedThread);
          setCount(count - 1);
        }}
      >
        Close
      </button>
    </div>
  );
};

const New = ({ username, profileImg, close }) => {
  username = "angela";
  const [thread, setThread] = useState([]);
  const [count, setCount] = useState(1);

  const postThread = async () => {
    try {
      const response = await axios.post("api/v1/posts", { content: thread });
      console.log(response);
      close(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className=" w-screen h-screen flex justify-center items-center gap-4   text-white flex-col bg-[rgba(0,0,0,0.5)] absolute top-0"
      onClick={() => {
        close(false);
      }}
    >
      <h2
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        New thread
      </h2>
      <div
        className=" flex flex-col justify-center items-center w-[40vw] bg-zinc-800 p-8 rounded-2xl border border-zinc-700"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {new Array(count).fill(0).map((num, index) => {
          return (
            <Single
              username={username}
              profileImg={profileImg}
              index={index}
              thread={thread}
              setThread={setThread}
              setCount={setCount}
              count={count}
            />
          );
        })}
        <div className=" w-[100%] flex items-center justify-between gap-4">
          <div className=" flex items-center">
            <div className=" size-10 flex justify-center items-center">
              <img src={profileImg} alt="" className=" rounded-full size-5" />
            </div>
            <h3
              className=" text-zinc-700 px-6"
              onClick={() => setCount(count + 1)}
            >
              Add to thread
            </h3>
          </div>
        </div>
        <div className=" w-[100%] pt-8 flex justify-end">
          <button onClick={postThread}>Post</button>
        </div>
      </div>
    </div>
  );
};

export default New;
