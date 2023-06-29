import { BrowserRouter, Routes, Route } from "react-router-dom";

import Welcome, { ErrorPage } from "./components/Welcome.jsx";

import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Home from "./components/Home.jsx";
import { NavbarNested } from "./components/navbar_components/Navbar.jsx";
import Jobs from "./components/Jobs.jsx";
import "./App.css";
import Signout from "./components/Signout.jsx";
import { useState } from "react";
import Applications from "./components/Applications.jsx";

function App() {
  const [showNav, setShowNav] = useState(true);
  return (
    <div className="routeDiv">
      <BrowserRouter>{showNav && <NavbarNested></NavbarNested>}</BrowserRouter>
      <div className="subDiv">
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Welcome />}></Route>
            <Route
              exact
              path="/login"
              element={<Login funcNav={setShowNav} />}
            ></Route>
            <Route
              exact
              path="/signup"
              element={<Signup funcNav={setShowNav} />}
            ></Route>
            <Route
              exact
              path="/signout"
              element={<Signout funcNav={setShowNav} />}
            ></Route>
            <Route exact path="/home" element={<Home />}></Route>
            <Route exact path="/jobs" element={<Jobs />}></Route>
            <Route
              exact
              path="/applications"
              element={<Applications />}
            ></Route>
            <Route element={<ErrorPage />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
