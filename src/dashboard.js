import GridLayout from "react-grid-layout";
import React from "react";
import "./ChartContainer.css";
import "./grid-adjust.css";
import BarChart from "./chart";
import Donut from "./donut";
import StreamGraph from "./stream";
import './dashboard.css';
import { callApi } from "./utils.js";

const Info = (props) => {
  return (
    <div className="info">
      <h2>{props.title}</h2>
      <text>{props.content}</text>
    </div>
  )
}

const RepeatIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-repeat" viewBox="0 0 16 16">
      <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z" />
    </svg>
  )
}

const Dashboard = () => {
  const [InfoData, setInfoData] = React.useState({});
  React.useEffect(() => {
    callApi("http://127.0.0.1:8000/info", "GET")
      .then(data => {
        // console.log("info raw data", data);
        setInfoData(data);
      });
  }, []);

  const screenWidth = window.innerWidth;
  // const screenHeight = window.innerHeight;
  const colNum = 25;
  const rowHeight = 30;
  const Static = true;
  // layout is an array of objects, see the demo for more complete usage
  const layout = [
    { i: "title", x: 0, y: 0, w: 25, h: 4, static: Static },
    { i: "stream", x: 1, y: 8, w: 13, h: 16, static: Static },
    { i: "bar", x: 14, y: 8, w: 10, h: 16, static: Static },
    { i: "MaxEmotion", x: 1, y: 4, w: 5, h: 4, static: Static },
    { i: "MsgNum", x: 6, y: 4, w: 6, h: 4, static: Static },
    { i: "Peak", x: 12, y: 4, w: 6, h: 4, static: Static },
    { i: "Person", x: 18, y: 4, w: 6, h: 4, static: Static },
  ];
  const getH = (i) => {
    const h = layout.find(obj => obj.i === i).h;
    return 30 + (h - 1) * (rowHeight + 10);
  };
  const getW = (i) => {
    const w = layout.find(obj => obj.i === i).w;
    return w * (screenWidth / colNum);
  };
  const [bar_donut, setBarDonut] = React.useState("donut");
  // let bar_donut = "donut";
  const toggleBarDonut = () => {
    setBarDonut(bar_donut === "bar" ? "donut" : "bar");
  };

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={colNum}
      rowHeight={rowHeight}
      width={screenWidth}
    >
      <div key="title" id="title">
        <h1>Dashboard</h1>
      </div>
      <div key="bar" className='ChartContainer'>
        <button className="button" onClick={toggleBarDonut}>
          <RepeatIcon />
        </button>
        {bar_donut === "bar" ? <BarChart height={getH("bar")} width={getW("bar")} /> : null}
        {bar_donut === "donut" ? <Donut height={getH("bar")} width={getW("bar")} /> : null}
      </div>
      <div key="stream" className='ChartContainer'>
        <StreamGraph height={getH("stream")} width={getW("stream")} />
      </div>
      <div key="MaxEmotion" className='ChartContainer'>
        <Info title="Top Emotion" content={InfoData['MaxEmotion']} />
      </div>
      <div key="MsgNum" className='ChartContainer'>
        <Info title="Sent Messages" content={InfoData['MsgNum']} />
      </div>
      <div key="Peak" className='ChartContainer'>
        <Info title="Messages in Peak Month" content={InfoData['Peak']} />
      </div>
      <div key="Person" className='ChartContainer'>
        <Info title="Top Contact" content={InfoData['Person']} />
      </div>
    </GridLayout>
  );
}

export default Dashboard;