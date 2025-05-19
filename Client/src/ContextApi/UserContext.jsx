import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({ email: "", password: "" ,token: ""});
  const [userLikedPosts, setuserlikedPosts] = useState([]);
  const [userSavedPosts, setuserSavedPosts] = useState([]);
  return (
    <UserContext.Provider value={{ userData, setUserData, userLikedPosts, setuserlikedPosts, userSavedPosts, setuserSavedPosts }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
