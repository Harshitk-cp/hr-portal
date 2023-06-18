import { BrowserRouter, Routes, Route } from "react-router-dom";

import Welcome, { ErrorPage } from "./components/Welcome.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Home from "./components/Home.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Welcome />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/signup" element={<Signup />}></Route>
        <Route exact path="/home" element={<Home />}></Route>
        <Route element={<ErrorPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
