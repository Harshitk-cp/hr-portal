import { useEffect, useState } from "react";
import {
  Button,
  createStyles,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

import apiList from "../lib/apiList.js";
import isAuth from "../lib/isAuth.js";

const useStyles = createStyles((theme) => ({
  body: {
    width: "100%",
  },

  loginMainDiv: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "400px",
    background: theme.colors.dark[5],
    padding: "40px",
    borderRadius: "8px",
  },
  inputBox: {
    width: "300px",
  },
  submitButton: {
    width: "300px",
    color: "white",
    marginTop: "20px",
    background: theme.colors.blue[7],
  },
}));

const Login = (props) => {
  useEffect(() => {
    // eslint-disable-next-line react/prop-types
    props.funcNav(false);
  }, []);
  const { classes } = useStyles();
  const navigate = useNavigate();

  const [loggedin, setLoggedin] = useState(isAuth());

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      error: false,
      message: "",
    },
    password: {
      error: false,
      message: "",
    },
  });

  const handleInput = (key, value) => {
    setLoginDetails({
      ...loginDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        error: status,
        message: message,
      },
    });
  };

  const handleLogin = () => {
    const verified = !Object.keys(inputErrorHandler).some((obj) => {
      return inputErrorHandler[obj].error;
    });
    if (verified) {
      axios
        .post(apiList.login, loginDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.user.token);
          localStorage.setItem("userId", response.data.user.id);
          localStorage.setItem("name", response.data.user.name);
          localStorage.setItem("email", response.data.user.email);
          setLoggedin(isAuth());
          notifications.show({
            title: "success",
            message: "Logged in successfully",
          });
        })
        .catch((err) => {
          notifications.show({
            title: "error",
            message: err.response.data.message,
          });
        });
    }
  };

  return loggedin ? (
    <Navigate to="/" />
  ) : (
    <div className={classes.loginMainDiv}>
      <div className={classes.formContainer}>
        <TextInput
          label="Email"
          placeholder="Enter email"
          value={loginDetails.email}
          onChange={(event) => handleInput("email", event.target.value)}
          onBlur={(event) => {
            if (event.target.value === "") {
              handleInputError("email", true, "Email is required");
            } else {
              const re =
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              if (re.test(String(event.target.value).toLowerCase())) {
                handleInputError("email", false, "");
              } else {
                handleInputError("email", true, "Incorrect email format");
              }
            }
          }}
          error={inputErrorHandler.email.message}
          className={classes.inputBox}
        />

        <PasswordInput
          label="Password"
          value={loginDetails.password}
          onChange={(event) => handleInput("password", event.target.value)}
          onBlur={(event) => {
            if (event.target.value === "") {
              handleInputError("password", true, "Password is required");
            } else {
              if (event.target.value.length > 6) {
                handleInputError("password", false, "");
              } else {
                handleInputError("passsword", true, "Cannot be less than 6.");
              }
            }
          }}
          error={inputErrorHandler.password.message}
          className={classes.inputBox}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleLogin()}
          className={classes.submitButton}
        >
          Login
        </Button>

        <Text sx={{ cursor: "pointer" }} onClick={() => navigate("/signup")}>
          Don&apos;t have an account? Sign Up
        </Text>
      </div>
    </div>
  );
};

export default Login;
