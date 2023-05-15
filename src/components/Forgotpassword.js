import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const emailInputRef = useRef();

  const passwordresethandler = async (e) => {
    e.preventDefault();

    const enteredemail = emailInputRef.current.value;
    console.log(enteredemail);

    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDh-JLvSHEIkF6rSIkR_9XM2CiPw0HApho",
        {
          method: "POST",
          body: JSON.stringify({
            requestType: "PASSWORD_RESET",
            email: enteredemail,
          }),
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <form onSubmit={passwordresethandler}>
        <label>Enter the email with which you have registered. </label>
        <input type="email" ref={emailInputRef} />
        <button>Send link</button>
      </form>
    </>
  );
};

export default ForgotPassword;
