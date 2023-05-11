import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { callApi } from "./utils.js";
import cmap from "./variables.js";

function DonutChart(svg, data, {
  name,
  value,
  title, 
  width = 640,
  height = 400, 
  innerRadius = Math.min(width, height) / 3, 
  outerRadius = Math.min(width, height) / 2, 
  labelRadius = (innerRadius + outerRadius) / 2, 
  format = ",", 
  names, 
  colors, 
  stroke = innerRadius > 0 ? "none" : "white", 
  strokeWidth = 1, 
  strokeLinejoin = "round", 
  padAngle = stroke === "none" ? 1 / outerRadius : 0, 
} = {}) {
  
  const N = d3.map(data, name);
  const V = d3.map(data, value);
  const I = d3.range(N.length).filter(i => !isNaN(V[i]));

  
  if (names === undefined) names = N;
  names = new d3.InternSet(names);

  // console.log(d3.schemeSpectral[names.size]);
  // if (colors === undefined) colors = d3.schemeSpectral[names.size];
  // if (colors === undefined) colors = d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), names.size);

  const color = d3.scaleOrdinal()
    .domain(Object.keys(colors))
    .range(Object.values(colors));

  
  if (title === undefined) {
    // const formatValue = d3.format(format);
    // title = i => `${N[i]}\n${formatValue(V[i])}`;
    title = i => `${N[i]}`;
  } else {
    const O = d3.map(data, d => d);
    const T = title;
    title = i => T(O[i], i, data);
  }

  
  const arcs = d3.pie().padAngle(padAngle).sort(null).value(i => V[i])(I);
  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
  const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

  const mouseover = function (event, d) {
    // Tooltip.style("opacity", 1)
    d3.selectAll(".DonutArea").style("opacity", .2)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  const mousemove = function (event, d, i) {
    // let grp = d.key
    // Tooltip.text(grp)
  }
  const mouseleave = function (event, d) {
    // Tooltip.style("opacity", 0)
    d3.selectAll(".DonutArea").style("opacity", 1).style("stroke", "none")
  }
  
  svg
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg.append("g")
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-linejoin", strokeLinejoin)
    .selectAll("path")
    .data(arcs)
    .join("path")
      .attr("class", "DonutArea")
      .attr("fill", d => color(N[d.data]))
      .attr("d", arc)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
    .append("title")
      .text(d => title(d.data));

  svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
    .selectAll("text")
    .data(arcs)
    .join("text")
      .style("pointer-events", "none")
      .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
    .selectAll("tspan")
    .data(d => {
      const lines = `${title(d.data)}`.split(/\n/);
      return (d.endAngle - d.startAngle) > 0.25 ? lines : lines.slice(0, 1);
    })
    .join("tspan")
      .attr("x", 0)
      .attr("y", (_, i) => `${i * 1.1}em`)
      .attr("font-weight", (_, i) => i ? null : "bold")
      .attr("font-size", "1.5em")
      .text(d => d);



  return Object.assign(svg.node(), {scales: {color}});
}

function Donut(props) {
  const svgRef = useRef(null);
  const [data_obj, setDataObj] = useState(null);
  const marginRef = useRef({ top: 30, right: 35, bottom: 30, left: 50 });
  const width = useRef(props.width);
  const height = useRef(props.height);



  useEffect(() => {
    if(!data_obj) {
      return;
    }
    const data = Object.entries(data_obj).map(([name, value]) => ({
      name,
      value,
    })).sort((a, b) => b.value - a.value);
    const svg = d3.select(svgRef.current);
    const margin = marginRef.current;
    const InnerWidth = width.current - margin.left - margin.right;
    const InnerHeight = height.current - margin.top - margin.bottom; 

    svg.selectAll('*').remove();

    DonutChart(svg, data, {
      name: d => d.name,
      value: d => d.value,
      height: InnerHeight,
      width: InnerWidth,
      colors: cmap,
    });

    svg.attr("transform", `translate(${margin.left}, ${margin.top})`);
  }, [data_obj]);

  useEffect(() => {
    
    callApi("http://127.0.0.1:8000/emotion", "GET")
      .then(data => {
        setDataObj(data)
      });
  }, []);

  return (
    <svg  width={width} height={height} ref={svgRef}></svg>
  )
}

export default Donut;