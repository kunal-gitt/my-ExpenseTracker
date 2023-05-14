import { useContext, useRef, useState } from "react";
import classes from "./Update.module.css";
import AuthContext from "../Store/AuthContext";

const Update = () => {
  const fullnameInputref = useRef();
  const ProfileInputref = useRef();

  const ctx = useContext(AuthContext);

  const onsubmithandler = async (e) => {
    e.preventDefault();
    const enteredfullName = fullnameInputref.current.value;
    const enteredprofile = ProfileInputref.current.value;

    const usertoken = localStorage.getItem("token");

    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDh-JLvSHEIkF6rSIkR_9XM2CiPw0HApho",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: usertoken,
          displayName: enteredfullName,
          photoUrl: enteredprofile,
          returnSecureToken: true,
        }),
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className={classes.container}>
      <h3>Contact Details</h3>
      <form className={classes.form} onSubmit={onsubmithandler}>
        <label>Full Name:</label>
        <input
          type="text"
          ref={fullnameInputref}
          defaultValue={
            ctx.userdetails.displayName === undefined
              ? ""
              : ctx.userdetails.displayName
          }
        />
        <label>Profile Photo URL:</label>
        <input
          type="text"
          ref={ProfileInputref}
          defaultValue={
            ctx.userdetails.photoUrl === undefined
              ? ""
              : ctx.userdetails.photoUrl
          }
        />

        <button className={classes.btn}>Update</button>
      </form>
    </div>
  );
};

export default Update;
