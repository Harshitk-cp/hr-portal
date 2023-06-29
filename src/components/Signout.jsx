import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Signout = (props) => {
  props.funcNav(false);
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    notifications.show({
      title: "Success",
      message: "Logged out successfully.",
    });
  }, []);
  return <Navigate to="/login" />;
};

export default Signout;
