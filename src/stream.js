import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { callApi } from "./utils.js";
import './ChartContainer.css'
import cmap from './variables.js';

function StreamGraph(props) {
  // const margin = { top: 10, right: 35, bottom: 20, left: 40 };
  const svgRef = useRef(null);


  const [data_obj, setDataObj] = useState(null);
  const marginRef = useRef({ top: 10, right: 35, bottom: 20, left: 40 });
  const width = useRef(props.width - marginRef.current.left - marginRef.current.right);
  const height = useRef(props.height - marginRef.current.top - marginRef.current.bottom);
  // let mouseX = useRef(0);
  // let mouseY = useRef(0);

  useEffect(() => {
    if (!data_obj) {
      return;
    }
    const margin = marginRef.current;
    const InnerWidth = width.current;
    const InnerHeight = height.current;
    // let mouseX, mouseY;

    // const data = data_obj;
    const data = data_obj['data'].slice(Math.max(0, data_obj['data'].length - 12));
    const xOffset = InnerWidth / data.length;

    data.columns = data_obj['columns'];
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // append the svg object to the body of the page
    svg
      .attr("width", InnerWidth + margin.left + margin.right)
      .attr("height", InnerHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        `translate(${margin.left}, ${margin.top})`);

    // Parse the Data
    // List of groups = header of the csv files
    const keys = data.columns.slice(1)
    // console.log("keys", keys);

    // console.log("data month extent", data.map(d => d.month));

    // Add X axis
    const x = d3.scaleOrdinal()
      .domain(data.map(d => d.month))
      .range(d3.range(0, InnerWidth, InnerWidth / data.length));
    svg.append("g")
      .attr("transform", `translate(${xOffset}, ${InnerHeight * 0.9})`)
      .call(d3.axisBottom(x).tickSize(-InnerHeight * .8).tickValues(data.map(d => d.month)))
      .select(".domain").remove()
    // Customization
    svg.selectAll(".tick line").attr("stroke", "#b8b8b8")

    // Add X axis label:
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", InnerWidth)
      .attr("y", InnerHeight - 10)
      .text("Time (month)");

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([-300, 300])
      .range([InnerHeight, 0]);

    // color palette
    const color = d3.scaleOrdinal()
      .domain(Object.keys(cmap))
      .range(Object.values(cmap));

    //stack the data?
    const stackedData = d3.stack()
      .offset(d3.stackOffsetSilhouette)
      .keys(keys)
      (data)

    // Tooltip
    const Tooltip = svg
      .append("text")
      .style("opacity", 0)
      .style("font-size", 27)
      .attr("x", 20)
      .attr("y", InnerHeight)

    // handle mouse events
    // function handleMouseMove(event) {
    //   [mouseX.current, mouseY.current] = d3.pointer(event);
    //   Tooltip
    //     .attr("x", mouseX.current)
    //     .attr("y", mouseY.current)
    // };
    // svg.on('mousemove', handleMouseMove);

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function (event, d) {
      Tooltip.style("opacity", 1)
      d3.selectAll(".myArea").style("opacity", .2)
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
    const mousemove = function (event, d, i) {
      let grp = d.key
      Tooltip.text(grp)
    }
    const mouseleave = function (event, d) {
      Tooltip.style("opacity", 0)
      d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
    }

    // Area generator
    const area = d3.area()
      .x(function (d) { return x(d.data.month) + xOffset; })
      .y0(function (d) { return y(d[0]); })
      .y1(function (d) { return y(d[1]); })

    // Show the areas
    svg
      .selectAll("mylayers")
      .data(stackedData)
      .join("path")
      .attr("class", "myArea")
      .style("fill", function (d) { return color(d.key); })
      .attr("d", area)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)

    // })
  }, [data_obj]);

  useEffect(() => {
    // Load data from API
    callApi("http://127.0.0.1:8000/stream", "GET")
      .then(data => {
        console.log("stream raw data", data);
        setDataObj(data);
      });
  }, []);


  return (
    <svg ref={svgRef} width={width} height={height}></svg>
  );
}

export default StreamGraph;