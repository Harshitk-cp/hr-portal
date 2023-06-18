import { Text } from "@mantine/core";
import { useState } from "react";
import isAuth from "../lib/isAuth.js";
import { Navigate } from "react-router-dom";

const Welcome = (props) => {
  const [loggedin, setLoggedin] = useState(isAuth());
  return loggedin ? <Navigate to="/home" /> : <Navigate to="/login" />;
};

export const ErrorPage = (props) => {
  return <Text>hhhh</Text>;
};

export default Welcome;
