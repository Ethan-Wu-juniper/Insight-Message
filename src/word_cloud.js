import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import * as cloud from "d3-cloud";

function WordCloud(props) {
  // console.log("WordCloud props", props);
  const svgRef = useRef(null);
  // d3.select(svgRef.current).selectAll('*').remove();

  useEffect(() => {
    // d3.csv("word_cnt.csv").then(function (data) {
    //   data.forEach(function (d) {
    //     d.size = +d.size;
    //   });

    //   data.sort((a, b) => {
    //     if (a.size < b.size) {
    //       return 1;
    //     }
    //     if (a.size > b.size) {
    //       return -1;
    //     }
    //     return 0;
    //   });

    //   // Call the function to create the word cloud
    //   createWordCloud(data);
    // });
    let data = JSON.parse(JSON.stringify(props.data)); // 不用 deep copy 也可以跑，但是 data 會被改變
    createWordCloud(data);
  });

  function createWordCloud(data) {
    var w = 1024,
      h = 512,
      maxFont = 96,
      maxSize = data[0].size || 1,
      sizeOffset = maxFont / maxSize;
    // Use the data to create the word cloud
    // ...
    // var fill = d3.scale.category20b(),
    let layout = cloud()
      .size([w, h])
      .words(data)
      .spiral("rectangular")
      .rotate(function () {
        return ~~(Math.random() * 2) * -30 || 60;
      })
      //.text(function (d) { return d.text; })
      .font("Impact")
      .fontSize(function (d) {
        return Math.max(20, Math.min(d.size * sizeOffset, maxFont));
      })
      .on("end", onDraw);
    layout.start();
    function onDraw() {
      var svg = d3
        .select(svgRef.current)
        .append("svg")
        .attr('width', w)
        .attr('height', h) 
        .attr('id', "svg-node")
      var vis = svg
          .append("g")
          .attr(
            "transform",
            "translate(" + [w >> 1, (h >> 1) - 10] + ")scale(2)"
          );
      var text = vis.selectAll("text").data(data);
      text
        .enter()
        .append("text")
        .style("font-family", function (d) {
          return d.font;
        })
        .style("font-size", function (d) {
          return d.size + "px";
        })
        // .style("fill", function (d, i) { return fill(i); })
        .style('cursor', "pointer")
        .style('opacity', 1e-6)
        .attr("text-anchor", "middle")
        .attr("transform", function (d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function (d) {
          return d.text;
        })
        .transition()
        .duration(1000)
        .style("opacity", 1);
      vis
        .transition()
        .delay(450)
        .duration(750)
        .attr(
          "transform",
          "translate(" + [w >> 1, (h >> 1) + 10] + ")scale(1)"
        );
    }
  }

  return (
    <div>
      <section ref={svgRef} id="tag-cloud-wrapper"></section>
    </div>
  );
}

export default WordCloud;
