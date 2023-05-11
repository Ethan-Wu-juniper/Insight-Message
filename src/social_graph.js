import { useRef, useEffect, useState } from "react";
// import { useState } from "react";
import * as d3 from "d3";
import './ChartContainer.css'
import { callApi } from "./utils.js";

function SocialGraph(props) {
  const svgRef = useRef(null);
  const [data_obj, setDataObj] = useState(null);
  const margin = useRef({ top: 10, right: 30, bottom: 30, left: 40 });
  const width = useRef(props.width - margin.current.left - margin.current.right);
  const height = useRef(props.height - margin.current.top - margin.current.bottom);

  useEffect(() => {
    if (!data_obj) {
      return;
    }
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg
      .attr("width", width.current + margin.current.left + margin.current.right)
      .attr("height", height.current + margin.current.top + margin.current.bottom)
      .append("g")
      .attr("transform",
        `translate(${margin.left}, ${margin.top})`);

    // const data = {
    //   "nodes": [
    //     { "id": 1, "name": "A" },
    //     { "id": 2, "name": "B" },
    //     { "id": 3, "name": "C" },
    //     { "id": 4, "name": "D" },
    //     { "id": 5, "name": "E" },
    //     { "id": 6, "name": "F" },
    //     { "id": 7, "name": "G" },
    //     { "id": 8, "name": "H" },
    //     { "id": 9, "name": "I" },
    //     { "id": 10, "name": "J" }
    //   ],
    //   "links": [
    //     { "source": 1, "target": 2 },
    //     { "source": 1, "target": 3 },
    //     { "source": 1, "target": 4 },
    //     { "source": 1, "target": 5 },
    //     { "source": 1, "target": 6 },
    //     { "source": 1, "target": 7 },
    //     { "source": 1, "target": 8 },
    //     { "source": 1, "target": 9 },
    //     { "source": 1, "target": 10 }
    //   ]
    // }

    const data = {
      "nodes": [],
      "links": []
    };
    const recipientNum = Object.keys(data_obj).length - 1;

    data.nodes.push({ "id": 0, "name": data_obj["myself"] });
    delete data_obj["myself"];
    // Add nodes
    for (let i = 1; i <= recipientNum; i++) {
      data.nodes.push({ "id": i, "name": Object.keys(data_obj)[i-1] + "" });
    }
    
    // Add links
    for (let i = 1; i <= recipientNum; i++) {
      data.links.push({ "source": 0, "target": i });
    }

    // normalized TotalScore
    let maxTotalScore = 0;
    let minTotalScore = 100000000;
    for (let i = 0; i < Object.keys(data_obj).length; i++) {
      if (data_obj[Object.keys(data_obj)[i]].TotalScore > maxTotalScore) {
        maxTotalScore = data_obj[Object.keys(data_obj)[i]].TotalScore;
      }
      if (data_obj[Object.keys(data_obj)[i]].TotalScore < minTotalScore) {
        minTotalScore = data_obj[Object.keys(data_obj)[i]].TotalScore;
      }
    }

    const normalizedTotalScore = (Score) => 1 - ((Score - minTotalScore) / (maxTotalScore - minTotalScore)) + 0.5;

    const link = svg
      .selectAll("line")
      .data(data.links)
      .join("line")
      .style("stroke", "#aaa")

    const node = svg
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .attr("class", "node");

    const colorMap = d3.scaleSequential(d3.interpolateSpectral).domain([0, 0.8])
    node.append("circle")
      .attr("r", d => {
        if (d.id === 0) {
          return 30;
        }
        return (data_obj[Object.keys(data_obj)[d.id-1]].MsgPropotion + 0.1) * 50;
      })
      .style("fill", d => {
        if (d.id === 0) {
          return "#aaaaaa";
        }
        return colorMap(data_obj[Object.keys(data_obj)[d.id-1]].EmotionScore);
      })
      .style("stroke", "black");
    
    node.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("font-size", 20)
      // .style("stroke", "white")
      // .style("stroke-width", 0.5)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text(d => d.name);

    // const node = svg
    //   .selectAll("circle")
    //   .data(data.nodes)
    //   .join("circle")
    //   .attr("r", 20)
    //   .style("fill", "#69b3a2")

    d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink()
        .id(function (d) { return d.id; })
        .links(data.links)
        .distance(function(d) { return 400 * normalizedTotalScore(data_obj[d.target.name].TotalScore);})
      )
      .force("charge", d3.forceManyBody().strength(-4000))
      .force("center", d3.forceCenter(width.current / 2, height.current / 2))
      .force('y', d3.forceY().strength(0.25))
      // .force('x', d3.forceX().strength(-0.25))
      .on("tick", ticked);

    function ticked() {
      link
        .attr("x1", function (d) { 
          if(d.source.id === 0)
            return width.current / 2;
          return d.source.x; 
        })
        .attr("y1", function (d) { 
          if(d.source.id === 0)
            return height.current / 2;
          return d.source.y; 
        })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; })
        .lower();

      // node
      //   .attr("fixed", function (d) { return d.id === 0 ? true : false; })
      //   .attr("x", width.current / 2)
      //   .attr("y", height.current / 2);

      node.selectAll("circle")
        .attr("cx", function (d) { 
          if(d.id === 0)
            return width.current / 2;
          return d.x; 
        })
        .attr("cy", function (d) { 
          if(d.id === 0)
            return height.current / 2;
          return d.y; 
        });
      
      node.selectAll("text")
        .attr("x", function (d) { 
          if(d.id === 0)
            return width.current / 2;
          return d.x; 
        })
        .attr("y", function (d) { 
          if(d.id === 0)
            return height.current / 2;
          return d.y - 25; 
        });
    }
  },
    // [data_obj]
  );
  // TODO : MsgCnt -> size, Emotion -> color, Total -> distance
  useEffect(() => {
    callApi("http://127.0.0.1:8000/social", "GET").then(res => {
      setDataObj(res);
    })
  }, []);
  return (
    <div className="ChartContainer" style={{ width: props.width, height: props.height }} >
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
}

export default SocialGraph;