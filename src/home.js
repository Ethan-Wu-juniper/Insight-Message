import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import WordCloud from "./word_cloud";
import BarChart from "./chart";
import ReactFullpage from '@fullpage/react-fullpage';

const Home = () => (
  <ReactFullpage
    //fullpage options
    licenseKey={'gplv3-license'}
    scrollingSpeed={1000} /* Options here */
    navigation={true} // 顯示導行列
    navigationPosition="right" // 導行列位置

    render={({ state, fullpageApi }) => {
      const authenticated = JSON.parse(localStorage.getItem("authenticated"));
      if (!authenticated) {
        return <Navigate replace to="/login" />;
      } else {
        return (
          <ReactFullpage.Wrapper>
            <div className="section">
              <WordCloud />
              {/* <BarChart /> */}
            </div>
            <div className="section">
              <BarChart />
            </div>
          </ReactFullpage.Wrapper>
        );
      }
    }}
  />
);

export function _Home(props) {
  const location = useLocation();
  const authenticated = JSON.parse(localStorage.getItem("authenticated"));

  if (!authenticated) {
    return <Navigate replace to="/login" />;
  } else {
    return (
      <div>
        <WordCloud data={location.state.data} />
        <BarChart />
      </div>
    );
  }
}

export default Home;
