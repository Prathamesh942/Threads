import axios from "axios";
import React, { useState, useRef } from "react";

const Edit = ({ nameOld, usernameOld, bioOld, close }) => {
  const [name, setName] = useState(nameOld);
  const [username, setUsername] = useState(usernameOld);
  const [bio, setBio] = useState(bioOld);

  const updateProfile = async () => {
    const res = await axios.put(`/api/v1/users/${username}`, {
      name,
      bio,
    });
    console.log(res);
    close(false);
  };

  const textareaRef = useRef(null);

  const autoGrow = (element) => {
    element.style.height = "5px";
    element.style.height = element.scrollHeight + "px";
  };

  const handleInput = (e) => {
    autoGrow(e.target);
  };

  const handleChange = (e) => {
    setBio(e.target.value);
  };

  return (
    <div
      onClick={() => {
        close(false);
      }}
      className="flex justify-center items-center py-4 w-full bg-[rgba(0,0,0,0.7)] h-screen z-10 absolute flex-col gap-5"
    >
      <h2
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        Edit profile
      </h2>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="flex flex-col justify-center items-center w-[40vw] bg-zinc-800 p-8 rounded-2xl border border-zinc-700 gap-5"
      >
        <input
          className="bg-transparent outline-none w-full p-2"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <textarea
          onChange={(e) => {
            handleChange(e);
            handleInput(e);
          }}
          ref={textareaRef}
          value={bio}
          type="text"
          placeholder="Bio"
          className="bg-transparent outline-none overflow-hidden resize-none w-full"
        />
        <button
          className="bg-white w-full p-2 rounded-md text-black"
          onClick={updateProfile}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default Edit;
