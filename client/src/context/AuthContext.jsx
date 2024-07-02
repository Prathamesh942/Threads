import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("twineuser"))?.data?.data
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/v1/auth/checkauth", {
          withCredentials: true,
        });
        if (response.data.loggedIn) {
          setIsLoggedIn(true);
          const storedUser = localStorage.getItem("twineuser");
          const parsedUser = JSON.parse(storedUser);
          setUser(
            await axios.get(`/api/v1/users/${parsedUser.username}
`)
          );
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    checkAuth();
  }, [isLoggedIn]);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem("twineuser", JSON.stringify(userData));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("twineuser");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
