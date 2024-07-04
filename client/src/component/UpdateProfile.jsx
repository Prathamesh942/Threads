import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileImg, setProfileImg] = useState(null);

  const { user } = useAuth();

  console.log(user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profile", e.target.profile.files[0]);
    formData.append("bio", bio);

    try {
      setLoading(true);
      const response = await axios.put(
        `/api/v1/users/${user?.username}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      login(response.data.data);
      setLoading(false);
      navigate("/");
      console.log(response.data);
    } catch (error) {
      setLoading(false);
      console.error("Error uploading profile image:", error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImg(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  return (
    <div className=" w-screen h-screen bg-zinc-950 flex justify-center items-center text-white">
      <div className=" flex flex-col gap-6 justify-center items-center">
        <h2>Complete your profile</h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 justify-center items-center"
        >
          {profileImg && (
            <img
              src={profileImg}
              alt="Profile Preview"
              className="w-32 h-32 rounded-full object-cover"
            />
          )}
          <input
            name="profile"
            className="w-[100%] py-4 px-4 rounded-lg bg-zinc-800"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <textarea
            className=" w-[100%] py-4 px-4 rounded-lg bg-zinc-800"
            name="bio"
            id=""
            placeholder="Add cool Bio"
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
          <button className=" w-[100%] py-4 px-4 rounded-lg  bg-white text-zinc-700 font-medium flex justify-center items-center">
            {loading ? (
              <img
                className="size-6"
                src="https://media.tenor.com/I6kN-6X7nhAAAAAi/loading-buffering.gif"
              />
            ) : (
              <span>Save</span>
            )}
          </button>
          <button className=" text-center">
            {loading ? (
              <img
                className="size-6"
                src="https://media.tenor.com/I6kN-6X7nhAAAAAi/loading-buffering.gif"
              />
            ) : (
              <span>Skip</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
