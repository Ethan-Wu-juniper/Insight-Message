import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./login";
import Home from "./home";
import WelcomePage from "./welcome";

function APP() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="home" element={<Home />} />
      <Route path="login" element={<Login />} />
    </Routes>
  );
}

export default APP;
