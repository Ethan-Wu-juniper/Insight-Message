import GridLayout from "react-grid-layout";
import React from "react";
import "./ChartContainer.css";
import "./grid-adjust.css";
import BarChart from "./chart";
import StreamGraph from "./stream";

class Dashboard extends React.Component {
  render() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // layout is an array of objects, see the demo for more complete usage
    const layout = [
      { i: "bar", x: 6, y: 1, w: 5, h: 16 },
      { i: "stream", x: 0, y: 1, w: 6, h: 16 },
      { i: "text", x: 0, y: 0, w: 11, h: 8 }
    ];
    return (
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={screenWidth}
        height={screenHeight}
      >
        <div key="bar" className='ChartContainer'>
          <BarChart />
        </div>
        <div key="stream" className='ChartContainer'>
          <StreamGraph />
        </div>
        <div key="text" className='ChartContainer'>c</div>
      </GridLayout>
    );
  }
}

export default Dashboard;