import React, { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token");

  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const [userdetails, setuserdetails] = useState({});

  useEffect(() => {
    const fetchuserdata = async () => {
      try {
        const response = await fetch(
          "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDh-JLvSHEIkF6rSIkR_9XM2CiPw0HApho",
          {
            method: "POST",
            body: JSON.stringify({
              idToken: token,
            }),
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setuserdetails(data.users[0]);
      } catch (err) {
        console.log(err);
      }
    };
    if (initialToken !== null) {
      fetchuserdata();
    }
  }, []);
  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  const contextValue = {
    token: token,
    userdetails: userdetails,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
