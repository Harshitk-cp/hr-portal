import { useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";

const Logout = (props) => {
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    notifications.show({
      title: "Success",
      message: "Logged out successfully.",
    });
  }, []);
  return <Redirect to="/login" />;
};

export default Logout;
