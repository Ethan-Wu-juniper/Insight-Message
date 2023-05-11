import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import { callApi } from "./utils.js";
import './ChartContainer.css'
// import cmap from './variables.js';

function BarChart(props) {
  // const margin = { top: 10, right: 35, bottom: 20, left: 40 };
  const svgRef = useRef(null);

  
  const [data_obj, setDataObj] = useState(null);
  const marginRef = useRef({ top: 30, right: 35, bottom: 30, left: 50 });
  const width = useRef(props.width);
  const height = useRef(props.height);

  useEffect(() => {
    if(!data_obj) {
      return;
    }
    const data = Object.values(data_obj);
    const labels = Object.keys(data_obj);
    const svg = d3.select(svgRef.current);
    const margin = marginRef.current;
    const InnerWidth = width.current;
    const InnerHeight = height.current;
    svg.selectAll('*').remove();

    // Tooltip

    let tooltip = d3Tip().attr('class', 'd3-tip').html(
      d => 
        `
          <div>${d.target.__data__}</div>
        `
    )
    svg.call(tooltip);

    // Data
    // const data = [30, 86, 168, 281, 303];

    // Scales
    const xScale = d3.scaleBand()
      .domain(d3.range(data.length))
      .range([margin.left, InnerWidth - margin.right])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([InnerHeight - margin.bottom, margin.top])
      .nice();

    // const color = d3.scaleOrdinal()
    //   .domain(Object.keys(cmap))
    //   .range(Object.values(cmap));

    const data_list = Object.entries(data_obj).map(([name, value]) => ({
        name,
        value,
      }));

    // Bars
    svg.selectAll('rect')
      .data(data_list)
      .enter()
      .append('rect')
      .attr('x', (d, i) => xScale(i))
      .attr('y', (d) => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => InnerHeight - margin.bottom - yScale(d.value))
      // .attr('fill', d => color(d.name))
      .attr('fill', 'steelblue')
      .on('mouseover', tooltip.show)
      .on('mouseout', tooltip.hide);

    // add the x Axis
    svg
      .append('g')
      .attr('transform', `translate(0, ${InnerHeight - margin.bottom})`)
      .attr('class', 'xaxis')
      .style("font-size","20px")
      .call(d3.axisBottom(xScale).tickSizeOuter(0).tickFormat((d) => labels[d]))

    // add the y Axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .attr('class', 'yaxis')
      .style("font-size","20px")
      .call(d3.axisLeft(yScale).ticks(5))  
  }, [data_obj]);

  useEffect(() => {
    // Load data from API
    callApi("http://127.0.0.1:8000/emotion", "GET")
      .then(data => {
        setDataObj(data)
      });
  }, []);


  return (
    <svg ref={svgRef} width={width} height={height}></svg>
  );
}

export default BarChart;
