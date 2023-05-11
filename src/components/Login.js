import { useState, useRef, useContext } from "react";
import classes from "./Login.module.css";
import AuthContext from "../Store/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const emailInputRef = useRef();
  const passwordInputref = useRef();
  const confirmPasswordInputref = useRef();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputref.current.value;

    const enteredconfirmpassword = isLogin
      ? ""
      : confirmPasswordInputref.current.value;

    if (enteredPassword !== enteredconfirmpassword && isLogin === false) {
      setIsError("Confirm password should match with password");
    } else {
      setIsLoading(true);
      let url;
      if (isLogin) {
        url =
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDh-JLvSHEIkF6rSIkR_9XM2CiPw0HApho";
      } else {
        url =
          "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDh-JLvSHEIkF6rSIkR_9XM2CiPw0HApho";
      }
      fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          setIsLoading(false);
          if (res.ok) {
            return res.json();
          } else {
            return res.json().then((data) => {
              let errorMessage = "Authentication Failed";
              if (data && data.error && data.error.message) {
                errorMessage = data.error.message;
              }
              throw new Error(errorMessage);
            });
          }
        })
        .then((data) => {
          authCtx.login(data.idToken);
          console.log("user has successfully sign up");

          localStorage.setItem("email", JSON.stringify(data.email));
          navigate("/");
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  };
  // adding validation

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>

      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputref}
          />
        </div>
        {!isLogin && (
          <div className={classes.control}>
            <label htmlFor="confirmnewpassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmpassword"
              required
              ref={confirmPasswordInputref}
            />
          </div>
        )}
        {!isLogin && <div style={{ color: "red" }}>{isError}</div>}
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Sending request... </p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Login;
