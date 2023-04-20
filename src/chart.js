import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import { callApi } from "./utils.js";
import './ChartContainer.css'

function BarChart(props) {
  // const margin = { top: 10, right: 35, bottom: 20, left: 40 };
  const svgRef = useRef(null);

  const width = 600;
  const height = 400;

  const [data_obj, setDataObj] = useState([0,0,0,0,0]);
  const marginRef = useRef({ top: 10, right: 35, bottom: 20, left: 40 });

  useEffect(() => {
    console.log("data", data_obj);
    const data = Object.values(data_obj);
    const labels = Object.keys(data_obj);
    const svg = d3.select(svgRef.current);
    const margin = marginRef.current;
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
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([height - margin.bottom, margin.top])
      .nice();

    // Bars
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => xScale(i))
      .attr('y', (d) => yScale(d))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - margin.bottom - yScale(d))
      .attr('fill', 'steelblue')
      .on('mouseover', tooltip.show)
      .on('mouseout', tooltip.hide);

    // add the x Axis
    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .attr('class', 'xaxis')
      .call(d3.axisBottom(xScale).tickSizeOuter(0).tickFormat((d) => labels[d]))

    // add the y Axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .attr('class', 'yaxis')
      .call(d3.axisLeft(yScale).ticks(5))  
  }, [data_obj]);

  useEffect(() => {
    // Load data from API
    callApi("http://127.0.0.1:8000/emotion", "GET")
      .then(data => {
        console.log("fetched data", data);
        setDataObj(data)
      });
  }, []);


  return (
    <div className='ChartContainer' style={{ width, height }}>
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
}

export default BarChart;