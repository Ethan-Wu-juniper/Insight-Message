import { useRef, useEffect } from "react";
// import { useState } from "react";
import * as d3 from "d3";
// import { callApi } from "./utils.js";

function SocialGraph(props) {
  const svgRef = useRef(null);
  // const [data_obj, setDataObj] = useState(null);
  const margin = useRef({top: 10, right: 30, bottom: 30, left: 40});
  const width = useRef(props.width - margin.current.left - margin.current.right);
  const height = useRef(props.height - margin.current.top - margin.current.bottom);

  useEffect(() => {
    // if (!data_obj) {
      // return;
    // }
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg
      .attr("width", width.current + margin.current.left + margin.current.right)
      .attr("height", height.current + margin.current.top + margin.current.bottom)
      .append("g")
      .attr("transform",
        `translate(${margin.left}, ${margin.top})`);

    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json").then(function (data) {

      const link = svg
        .selectAll("line")
        .data(data.links)
        .join("line")
        .style("stroke", "#aaa")

      const node = svg
        .selectAll("circle")
        .data(data.nodes)
        .join("circle")
        .attr("r", 20)
        .style("fill", "#69b3a2")

      d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink()
          .id(function (d) { return d.id; })
          .links(data.links)
        )
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("end", ticked);

      function ticked() {
        link
          .attr("x1", function (d) { return d.source.x; })
          .attr("y1", function (d) { return d.source.y; })
          .attr("x2", function (d) { return d.target.x; })
          .attr("y2", function (d) { return d.target.y; });

        node
          .attr("cx", function (d) { return d.x + 6; })
          .attr("cy", function (d) { return d.y - 6; });
      }
    })
  }, 
  // [data_obj]
  );

  // useEffect(() => {
  //   callApi("http://127.0.0.1:8080/social_graph").then(res => {
  //     setDataObj(res);
  //   })
  // }, []);
  return (
    <svg ref={svgRef} width={width} height={height}></svg>
  );
}

export default SocialGraph;