import GridLayout from "react-grid-layout";
import React from "react";
import "./ChartContainer.css";
import "./grid-adjust.css";
import BarChart from "./chart";
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
  const colNum = 12;
  const rowHeight = 30;
  const Static = true;
  // layout is an array of objects, see the demo for more complete usage
  const layout = [
    { i: "title", x: 0, y: 0, w: 11, h: 4, static: Static },
    { i: "bar", x: 6, y: 8, w: 5, h: 16, static: Static },
    { i: "stream", x: 0, y: 8, w: 6, h: 16, static: Static },
    { i: "MaxEmotion", x: 0, y: 4, w: 2, h: 4, static: Static },
    { i: "MsgNum", x: 2, y: 4, w: 3, h: 4, static: Static },
    { i: "Peak", x: 5, y: 4, w: 3, h: 4, static: Static },
    { i: "Person", x: 8, y: 4, w: 3, h: 4, static: Static },
  ];
  const getH = (i) => {
    const h = layout.find(obj => obj.i === i).h;
    return 30 + (h - 1) * (rowHeight + 10);
  };
  const getW = (i) => {
    const w = layout.find(obj => obj.i === i).w;
    return w * (screenWidth / colNum);
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
        <BarChart height={getH("bar")} width={getW("bar")} />
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