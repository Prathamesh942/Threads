import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Authentication = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [haveAccount, setHaveAccount] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showUpdate, setShowUpdate] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (isLoggedIn) {
    navigate("/");
  }

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const validateInputs = () => {
    let valid = true;

    if (!name && !haveAccount) {
      setNameError("Name is required");
      valid = false;
    } else {
      setNameError("");
    }

    if (!email && !haveAccount) {
      setEmailError("Email is required");
      valid = false;
    } else if (!validateEmail(email) && !haveAccount) {
      setEmailError("Invalid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!username) {
      setUsernameError("Username is required");
      valid = false;
    } else {
      setUsernameError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;
    try {
      setError(false);
      setLoading(true);
      const response = await axios.post(
        "api/v1/auth/login",
        {
          username,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      const { accessToken, user } = response.data.data;
      setLoading(false);
      login(user);
      !showUpdate ? navigate("/") : navigate("/updateprofile");
    } catch (error) {
      setLoading(false);
      setError("Something went wrong, try again");
    }
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;
    try {
      setError(false);
      setLoading(true);
      const response = await axios.post("api/v1/auth/register", {
        name,
        username,
        email,
        password,
      });
      setLoading(false);
      setHaveAccount(true);
      setShowUpdate(true);
    } catch (error) {
      setLoading(false);
      setError("Something went wrong, try again");
    }
  };

  return (
    <div className="w-screen h-screen bg-zinc-950 text-white flex justify-center items-center">
      <img
        className="absolute top-0 h-auto object-contain twinebg"
        src="/assets/Twine.png"
        srcSet="/assets/twinemobile.png 700w, /assets/Twine.png 1200w"
        alt=""
      />
      <div className="w-[40%] min-w-[300px] max-w-[400px] flex flex-col justify-center items-center gap-6 z-10">
        {haveAccount ? (
          <h2 className="text-xl font-semibold bg-zinc-950 rounded-xl p-2">
            Login
          </h2>
        ) : (
          <h2 className="text-xl font-semibold bg-zinc-950 rounded-xl p-2">
            Register
          </h2>
        )}

        <div className="flex flex-col gap-2 w-[100%]">
          {!haveAccount && (
            <>
              <input
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Name"
                className="w-[screen] py-4 px-4 rounded-lg bg-zinc-800 outline-none"
              />
              {nameError && (
                <span className="text-sm text-red-400">{nameError}</span>
              )}
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="Email"
                className="w-[screen] py-4 px-4 rounded-lg bg-zinc-800 outline-none"
              />
              {emailError && (
                <span className="text-sm text-red-400">{emailError}</span>
              )}
            </>
          )}
          <input
            onChange={(e) => setUsername(e.target.value)}
            className="w-[screen] py-4 px-4 rounded-lg bg-zinc-800 outline-none"
            type="text"
            placeholder="Username"
          />
          {usernameError && (
            <span className="text-sm text-red-400">{usernameError}</span>
          )}
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="w-[screen] py-4 px-4 rounded-lg bg-zinc-800 outline-none"
            type="password"
            placeholder="Password"
          />
          {passwordError && (
            <span className="text-sm text-red-400">{passwordError}</span>
          )}

          {haveAccount ? (
            <>
              <button
                className="w-[screen] py-4 rounded-md bg-white text-zinc-700 font-medium flex justify-center items-center"
                onClick={handleLogin}
              >
                {loading ? (
                  <img
                    className="size-6"
                    src="https://media.tenor.com/I6kN-6X7nhAAAAAi/loading-buffering.gif"
                  />
                ) : (
                  <span>Log in</span>
                )}
              </button>
              {error && (
                <span className="text-sm text-center text-red-400">
                  {error}
                </span>
              )}
              <span className="text-sm text-center text-zinc-300">
                Don't have an account?{" "}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() => {
                    setHaveAccount(!haveAccount);
                    setError("");
                  }}
                >
                  Register
                </span>
              </span>
            </>
          ) : (
            <>
              <button
                onClick={handleRegister}
                className="w-[screen] py-4 rounded-md bg-white text-zinc-700 font-medium flex justify-center items-center"
              >
                {loading ? (
                  <img
                    className="size-6"
                    src="https://media.tenor.com/I6kN-6X7nhAAAAAi/loading-buffering.gif"
                  />
                ) : (
                  <span>Register</span>
                )}
              </button>
              {error && (
                <span className="text-sm text-center text-red-400">
                  {error}
                </span>
              )}
              <span className="text-sm text-center text-zinc-300">
                Already have an account?{" "}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() => {
                    setHaveAccount(!haveAccount);
                    setError("");
                  }}
                >
                  Login
                </span>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Authentication;
