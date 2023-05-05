import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./login";
import Home from "./home";

function APP() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="home" element={<Home />} />
      <Route path="login" element={<Login />} />
    </Routes>
  );
}

export default APP;
