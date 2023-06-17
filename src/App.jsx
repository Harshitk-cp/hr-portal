import { createContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Grid } from '@mantine/core';

import Welcome, { ErrorPage } from "./components/Welcome.jsx";
import isAuth from "./lib/isAuth.js";
import { createStyles } from "@mantine/core";
import Login from "./components/Login.jsx";
import MessagePopup from "./lib/MessagePopup.jsx";

const useStyles = createStyles((theme) => ({
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "98vh",
    paddingTop: "64px",
    boxSizing: "border-box",
    width: "100%",
  },
}));

export const SetPopupContext = createContext();

function App() {
  const classes = useStyles();
  const [popup, setPopup] = useState({
    open: false,
    severity: "",
    message: "",
  });
  return (
    <BrowserRouter>
      <SetPopupContext.Provider value={setPopup}>
        <Grid container direction="column">
          <Grid item className={classes.body}>
            <Routes>
              <Route exact path="/"
              element={<Welcome/>}>
              </Route>
              <Route exact path="/login" element={<Login/>}>
              </Route>
              <Route element={<ErrorPage/>}>
              </Route>
            </Routes>
          </Grid>
        </Grid>
        <MessagePopup
          open={popup.open}
          setOpen={(status) =>
            setPopup({
              ...popup,
              open: status,
            })
          }
          severity={popup.severity}
          message={popup.message}
        ></MessagePopup>
      </SetPopupContext.Provider>
    </BrowserRouter>
  );
}

export default App;