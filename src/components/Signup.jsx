import { useState, useContext, useEffect } from "react";
import { Button, createStyles, PasswordInput, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { Navigate } from "react-router-dom";

import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";

const useStyles = createStyles((theme) => ({
  body: {
    width: "100%",
  },

  signupMainDiv: {
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

const Signup = (props) => {
  useEffect(() => {
    props.funcNav(false);
  }, []);
  const { classes } = useStyles();

  const [loggedin, setLoggedin] = useState(isAuth());

  const [signupDetails, setSignupDetails] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    isEmployer: true,
  });

  const [phone, setPhone] = useState("");

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    password: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    name: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
  });

  const handleInput = (key, value) => {
    setSignupDetails({
      ...signupDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        required: true,
        untouched: false,
        error: status,
        message: message,
      },
    });
  };

  const handleRegister = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    let updatedDetails = {
      ...signupDetails,
    };
    if (phone !== "") {
      updatedDetails = {
        ...signupDetails,
        contactNumber: `+${phone}`,
      };
    } else {
      updatedDetails = {
        ...signupDetails,
        contactNumber: "",
      };
    }

    setSignupDetails(updatedDetails);

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });

    if (verified) {
      axios
        .post(apiList.signup, updatedDetails)
        .then((response) => {
          notifications.show({
            title: "success",
            message: "Logged in successfully",
          });
          window.location.pathname = "/login";
        })
        .catch((err) => {
          notifications.show({
            title: "error",
            message: err.response.data.message,
          });
        });
    } else {
      setInputErrorHandler(tmpErrorHandler);
      notifications.show({
        title: "error",
        message: "Incorrect Input",
      });
    }
  };

  return !loggedin ? (
    <div className={classes.signupMainDiv}>
      <div className={classes.formContainer}>
        <TextInput
          label="Name"
          placeholder="Enter Name"
          value={signupDetails.name}
          onChange={(event) => handleInput("name", event.target.value)}
          className={classes.inputBox}
          error={inputErrorHandler.name.message}
          onBlur={(event) => {
            if (event.target.value === "") {
              handleInputError("name", true, "Name is required");
            } else {
              handleInputError("name", false, "");
            }
          }}
        />

        <TextInput
          label="Email"
          placeholder="Enter Email"
          value={signupDetails.email}
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
          value={signupDetails.password}
          onChange={(event) => handleInput("password", event.target.value)}
          className={classes.inputBox}
          error={inputErrorHandler.password.message}
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
        />

        <TextInput
          label="Phone Number(optional)"
          className={classes.inputBox}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />

        <Button
          variant="contained"
          onClick={() => {
            handleRegister();
          }}
          className={classes.submitButton}
        >
          Signup
        </Button>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default Signup;
