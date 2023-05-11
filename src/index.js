import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import BarChart from './chart';
// import WordCloud from './word_cloud';
import APP from './APP';
import { BrowserRouter } from "react-router-dom";

// localStorage.setItem("authenticated", JSON.stringify(false));
// console.log("index authenticated", localStorage.getItem("authenticated"));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // StriceMode 不知道為什麼讓 APP 跑了兩次
  // <React.StrictMode>
  <BrowserRouter>
    <APP />
  </BrowserRouter>
  // </React.StrictMode>
);