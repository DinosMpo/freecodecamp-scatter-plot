import { useState, useEffect } from 'react'
import './App.css'
import * as d3 from 'd3'

function App() {
  const [myData, setMyData] = useState("");
  const [load, setLoad] = useState(false);
  const w = 1300;
  const h = 600;
  const padding = 60;

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
      .then(res => res.json())
      .then(data => {
        let newData = data.map((data) => {
          let minutes = data.Time.substring(0, 2);
          let seconds = data.Time.substring(3, 5);
          let newDate = new Date(2025, 3, 1, 0, minutes, seconds);
          return { ...data, Time: newDate }
        });
        setMyData(newData);
      })
      .then(load => setLoad(true));
  }, [0]);

  useEffect(() => {
    if (load) {
      const container = d3.select("#chart")
        .append("div")
        .attr("id", "container");

      const minYear = d3.min(myData, (d) => d.Year);
      console.log("minYear ", minYear);
      const maxYear = d3.max(myData, (d) => d.Year);
      console.log("maxYear ", maxYear);
      const maxTime = d3.max(myData, (d) => d.Seconds);
      console.log("maxTime ", maxTime);
      const minTime = d3.min(myData, (d) => d.Seconds);

      // const dates = myData.map((data) => {
      //   let minutes = data.Time.substring(0, 2);
      //   let seconds = data.Time.substring(3, 5);
      //   let newDate = new Date(2025, 3, 1, 0, minutes, seconds);
      //   // console.log(newDate)
      //   return newDate;
      // });

      const xScale = d3.scaleLinear()
        .domain([minYear - 1, maxYear])
        .range([padding, w - padding]);

      const yScale = d3.scaleTime()
        .domain(d3.extent(myData, (d) => d.Time))
        .range([h - padding, padding]);

      // const yScale = d3.scaleTime()
      //   .domain([maxTime, minTime])
      //   .range([h - padding, padding]);

      const xAxis = d3.axisBottom(xScale);
      xAxis.tickFormat((d) => d);
      const timeFormat = d3.timeFormat('%M:%S');
      const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

      const handleMouseOver = (e, d) => {
        console.log(e);
        container
          .style("left", e.pageX + 10 + "px")
          .style("top", e.pageY - 30 + "px")
          .style("display", "block")
          .html(() => {
            return '<div id="tooltip" data-year=' + d.Year + '>' + '<div> Name: ' + d.Name + '</div>' +
              '<div> Year: ' + d.Year + ', Time: ' + d.Time + '</div>' +
              '<div>' + (d.Doping ? d.Doping : '') + '</div></div>';
          });
      };

      const handleMouseOut = (e, d) => {
        container
          .style("display", "none");
      }

      const svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("id", "mySvg");

      svg.append("g")
        .attr("transform", "translate(0, " + (h - padding) + ")")
        .attr("id", "x-axis")
        .call(xAxis);

      svg.append("g")
        .attr("transform", "translate(" + padding + ", 0)")
        .attr("id", "y-axis")
        .call(yAxis);

      svg.selectAll("circle")
        .data(myData)
        .enter()
        .append('circle')
        .attr("class", "dot")
        .attr("data-xvalue", (d) => d.Year)
        .attr("data-yvalue", (d) => d.Time)
        .attr("cx", (d, i) => xScale(d.Year))
        .attr("cy", (d, i) => yScale(d.Time))
        .attr("r", 7)
        .attr("stroke", "black")
        .attr("fill", (d) => {
          return d.Doping ? "red" : "blue"
        })
        .on("mouseover", (e, d) => handleMouseOver(e, d))
        .on("mouseout", (e, d) => handleMouseOut(e, d));

      // svg.selectAll("rect")
      //   .data(myData)
      //   .enter()
      //   .append("rect")
      //   .attr("x", (d) => xScale(d.Year))
      //   .attr("y", (d) => yScale(d.Seconds))
      //   .attr("width", 5)
      //   .attr("height", (d) => d.Seconds)
      const axis = document.querySelector('#y-axis');

      // console.log(axis);
      console.log(axis.querySelectorAll('.tick'));
    }

  }, [load]);

  console.log(myData)

  return (
    <div id="App">
      <h1 id="title">Scatter Plot</h1>
      <div id="chart"></div>

      <div id="legend-container">
        <legend id="legend">
          <div id="allegations">Riders with doping allegations <div id="red-color"></div></div>
          <div id="no-allegations">No doping allegations<div id="blue-color"></div></div>
        </legend>
      </div>

    </div>
  )
}

export default App
