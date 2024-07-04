import axios from "axios";
import React, { useState, useRef, useEffect } from "react";

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
    <div className="flex justify-between items-center py-4 w-[100%]">
      <div className="flex w-[100%]">
        <div className="h-[100%] flex flex-col items-center gap-1">
          <img
            src={profileImg}
            alt=""
            className="rounded-full size-10 min-h-10 min-w-10 aspect-square object-cover"
          />
          <div className="h-[100%] w-[2px] rounded-full bg-zinc-700"></div>
        </div>
        <div className="flex flex-col gap-2 w-[100%] px-6">
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
            className="bg-transparent outline-none overflow-hidden resize-none w-[100%]"
          />
        </div>
      </div>
      <button
        onClick={() => {
          if (count === 1) {
            return;
          }
          const updatedThread = thread.filter((item, ind) => ind !== index);
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

const New = ({
  username,
  profileImg,
  close,
  getPosts,
  threadOld = [],
  countOld = 1,
  update,
  updateThread,
  threadId,
}) => {
  const [thread, setThread] = useState(threadOld);
  const [count, setCount] = useState(countOld);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Disable scroll when component mounts
    document.body.style.overflow = "hidden";

    return () => {
      // Enable scroll when component unmounts
      document.body.style.overflow = "auto";
    };
  }, []);

  const postThread = async () => {
    const formData = new FormData();
    formData.append("content", thread);
    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "/api/v1/posts",
        { content: thread, image },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      close(false);
      getPosts();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div
      className="w-[100%] h-screen flex justify-center items-center gap-4 text-white flex-col bg-[rgba(0,0,0,0.7)] sticky top-0 bottom-0 right-0 z-10 max-md:left-0 max-md:right-0"
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
        className="flex flex-col justify-center items-center w-[40vw] bg-zinc-800 p-8 rounded-2xl border border-zinc-700 max-md:w-[80vw]"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {new Array(count).fill(0).map((num, index) => {
          return (
            <Single
              key={index}
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
        <div className="w-[100%] flex items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="size-10 flex justify-center items-center">
              <img
                src={profileImg}
                alt=""
                className="rounded-full size-5 aspect-square object-cover"
              />
            </div>

            <h3
              className="text-zinc-700 px-6"
              onClick={() => {
                if (!thread[count - 1]) {
                  return;
                }
                setCount(count + 1);
              }}
            >
              Add to thread
            </h3>
          </div>
        </div>
        <input
          type="file"
          onChange={(e) => {
            setImage(e.target.files[0]);
          }}
        />
        <div className="w-[100%] pt-8 flex justify-end">
          {update ? (
            <button
              onClick={() => {
                updateThread(threadId, thread);
                close(false);
              }}
            >
              Save
            </button>
          ) : (
            <button onClick={postThread}>
              {loading ? (
                <img
                  className="size-6"
                  src="https://media.tenor.com/I6kN-6X7nhAAAAAi/loading-buffering.gif"
                />
              ) : (
                <span>Post</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default New;
