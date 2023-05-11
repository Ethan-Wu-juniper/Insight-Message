import { useRef, useEffect, useState } from "react";
// import { useState } from "react";
import * as d3 from "d3";
import './ChartContainer.css'
import { callApi } from "./utils.js";

function legend(svg, {
  offsetX,
  offsetY,
  color,
  title,
  tickSize = 6,
  width = 320,
  height = 44 + tickSize,
  marginTop = 18,
  marginRight = 0,
  marginBottom = 16 + tickSize,
  marginLeft = 0,
  ticks = width / 64,
  tickFormat,
  tickValues
} = {}) {

  let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
  let x;
  const imgOffetY = offsetY - height + marginTop + tickSize;

  // Continuous
  if (color.interpolate) {
    const n = Math.min(color.domain().length, color.range().length);

    x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));

    svg.append("image")
      .attr("transform", `translate(${offsetX - width},${imgOffetY})`)
      .attr("x", marginLeft)
      .attr("y", marginTop)
      .attr("width", width - marginLeft - marginRight)
      .attr("height", height - marginTop - marginBottom)
      .attr("preserveAspectRatio", "none")
      .attr("xlink:href", ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
  }

  // Sequential
  else if (color.interpolator) {
    x = Object.assign(color.copy()
      .interpolator(d3.interpolateRound(marginLeft, width - marginRight)), {
        range() {
          return [marginLeft, width - marginRight];
        }
      });

    svg.append("image")
      .attr("transform", `translate(${offsetX - width},${imgOffetY})`)
      .attr("x", marginLeft)
      .attr("y", marginTop)
      .attr("width", width - marginLeft - marginRight)
      .attr("height", height - marginTop - marginBottom)
      .attr("preserveAspectRatio", "none")
      .attr("xlink:href", ramp(color.interpolator()).toDataURL());

    // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
    if (!x.ticks) {
      if (tickValues === undefined) {
        const n = Math.round(ticks + 1);
        tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
      }
      if (typeof tickFormat !== "function") {
        tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
      }
    }
  }

  // Threshold
  else if (color.invertExtent) {
    const thresholds = color.thresholds ? color.thresholds() // scaleQuantize
      :
      color.quantiles ? color.quantiles() // scaleQuantile
      :
      color.domain(); // scaleThreshold

    const thresholdFormat = tickFormat === undefined ? d => d :
      typeof tickFormat === "string" ? d3.format(tickFormat) :
      tickFormat;

    x = d3.scaleLinear()
      .domain([-1, color.range().length - 1])
      .rangeRound([marginLeft, width - marginRight]);

    svg.append("g")
      .selectAll("rect")
      .data(color.range())
      .join("rect")
      .attr("x", (d, i) => x(i - 1))
      .attr("y", marginTop)
      .attr("width", (d, i) => x(i) - x(i - 1))
      .attr("height", height - marginTop - marginBottom)
      .attr("fill", d => d);

    tickValues = d3.range(thresholds.length);
    tickFormat = i => thresholdFormat(thresholds[i], i);
  }

  // Ordinal
  else {
    x = d3.scaleBand()
      .domain(color.domain())
      .rangeRound([marginLeft, width - marginRight]);

    svg.append("g")
      .selectAll("rect")
      .data(color.domain())
      .join("rect")
      .attr("x", x)
      .attr("y", marginTop)
      .attr("width", Math.max(0, x.bandwidth() - 1))
      .attr("height", height - marginTop - marginBottom)
      .attr("fill", color);

    tickAdjust = () => {};
  }

  svg.append("g")
    .attr("transform", `translate(${offsetX - width},${offsetY})`)
    .call(d3.axisBottom(x)
      .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
      .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
      .tickSize(tickSize)
      .tickValues(tickValues))
    .call(tickAdjust)
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
      .attr("x", marginLeft)
      .attr("y", marginTop + marginBottom - height - 6)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text(title));

  return svg.node();
}

function ramp(color, n = 256) {
  var canvas = document.createElement('canvas');
  canvas.width = n;
  canvas.height = 1;
  const context = canvas.getContext("2d");
  for (let i = 0; i < n; ++i) {
    context.fillStyle = color(i / (n - 1));
    context.fillRect(i, 0, 1, 1);
  }
  return canvas;
}


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

    // const colorMap = d3.scaleSequential(d3.interpolateSpectral).domain([0, 0.8])
    legend(svg, {
      offsetX: width.current,
      offsetY: height.current, 
      color: d3.scaleSequential([0, 0.8], d3.interpolateSpectral),
      title: "Social Score"
    })
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