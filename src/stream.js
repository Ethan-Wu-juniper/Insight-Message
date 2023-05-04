import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { callApi } from "./utils.js";
import './ChartContainer.css'

function StreamGraph(props) {
  // const margin = { top: 10, right: 35, bottom: 20, left: 40 };
  const svgRef = useRef(null);

  const width = 600;
  const height = 400;

  const [data_obj, setDataObj] = useState(null);
  const marginRef = useRef({ top: 10, right: 35, bottom: 20, left: 40 });

  useEffect(() => {
    if (!data_obj) {
      return;
    }
    // const data = data_obj;
    const data = data_obj['data'];
    data.columns = data_obj['columns'];
    const svg = d3.select(svgRef.current);
    const margin = marginRef.current;
    svg.selectAll('*').remove();

    // Tooltip

    const width = 1000 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
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
      .range(d3.range(0, width, width / data.length));
    svg.append("g")
      .attr("transform", `translate(0, ${height * 0.8})`)
      .call(d3.axisBottom(x).tickSize(-height * .7).tickValues(data.map(d => d.month)))
      .select(".domain").remove()
    // Customization
    svg.selectAll(".tick line").attr("stroke", "#b8b8b8")

    // Add X axis label:
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height - 30)
      .text("Time (year)");

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([-200, 200])
      .range([height, 0]);

    // color palette
    const color = d3.scaleOrdinal()
      .domain(keys)
      .range(d3.schemeDark2);

    //stack the data?
    const stackedData = d3.stack()
      .offset(d3.stackOffsetSilhouette)
      .keys(keys)
      (data)

    // console.log("stackedData", stackedData);
    // for (let i = 0; i < data.length; i++) {
    //   console.log("month", data[i].month);
    //   console.log("month map", x(data[i].month));
    // }

    // create a tooltip
    const Tooltip = svg
      .append("text")
      .attr("x", 0)
      .attr("y", 0)
      .style("opacity", 0)
      .style("font-size", 17)

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
      .x(function (d) { return x(d.data.month); })
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
    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered_wide.csv").then(function (data) {
      console.log("online data", data);
      // setDataObj(data);
    });
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