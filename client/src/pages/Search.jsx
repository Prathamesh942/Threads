import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Search = () => {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const getUsers = async () => {
    try {
      const response = await axios.get(`/api/v1/users/search/${username}`);
      setUsers(response.data.data);
    } catch (error) {
      setUsers([]);
    }
  };
  useEffect(() => {
    getUsers();
  }, [username]);
  return (
    <div className=" w-screen h-screen flex justify-center">
      <div className=" w-[40%] h-screen bg-zinc-900 max-md:w-[100vw]">
        <div className=" w-[100%] flex p-4">
          <input
            type="text"
            className=" bg-transparent flex-grow p-4 border rounded-lg outline-none"
            placeholder="Search user"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div className=" w-[100%] flex p-4 flex-col gap-5">
          {users.map((user) => {
            return (
              <Link to={`/${user.username}`}>
                <div className="flex items-center gap-3">
                  <img
                    src={user?.profileImg}
                    alt=""
                    className=" rounded-full size-10 object-cover"
                  />
                  <span>{user?.username}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Search;
