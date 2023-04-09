import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./login";
import Home from "./home";

function APP() {
  // console.log("test in APP")
  return (
    <div className="APP">
      {/* <h1>Welcome to React Router!</h1> */}
      <Routes>
        <Route path="home" element={<Home />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default APP;
