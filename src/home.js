import React from "react";
import { Navigate } from "react-router-dom";
import WordCloud from "./word_cloud";
import ReactFullpage from '@fullpage/react-fullpage';
import Dashboard from "./dashboard";
import "./fullpage.css"
import "./home.css"

const Home = () => (
  <ReactFullpage
    //fullpage options
    licenseKey={'gplv3-license'}
    scrollingSpeed={1000} /* Options here */
    navigation={true} // 顯示導行列
    navigationPosition="right" // 導行列位置

    render={({ state, fullpageApi }) => {
      const authenticated = JSON.parse(localStorage.getItem("authenticated"));
      if (!authenticated)
        console.log();
      if (false) {
        return <Navigate replace to="/login" />;
      } else {
        return (
          <ReactFullpage.Wrapper>
            <div className="section" id="cloud">
              <WordCloud />
            </div>
            <div className="section">
              <Dashboard />
            </div>
            <div className="section">
            </div>
          </ReactFullpage.Wrapper>
        );
      }
    }}
  />
);

export function _Home(props) {
  // const location = useLocation();
  const authenticated = JSON.parse(localStorage.getItem("authenticated"));
  if(!authenticated)
    console.log();
  if (false) {
    return <Navigate replace to="/login" />;
  } else {
    return (
      <div>
        <Dashboard />
      </div>
    );
  }
}

export default Home;
