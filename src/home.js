import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import WordCloud from "./word_cloud";
// import BarChart from "./chart";

function Home(props) {
  const location = useLocation();
  // console.log("Home state", location);
  const authenticated = JSON.parse(localStorage.getItem("authenticated"));
  // console.log("outer authenticated", authenticated);

  if (!authenticated) {
    return <Navigate replace to="/login" />;
  } else {
    return (
      <div>
        <WordCloud data={location.state.data} />
        {/* <BarChart /> */}
      </div>
    );
  }
}

export default Home;
