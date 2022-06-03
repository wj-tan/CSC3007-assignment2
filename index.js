 // set the dimensions and margins of the graph
 const margin = { top: 30, right: 30, bottom: 70, left: 60 },
 width = 460 - margin.left - margin.right,
 height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
 .append("svg")
 .attr("width", width + margin.left + margin.right)
 .attr("height", height + margin.top + margin.bottom)
 .append("g")
 .attr("transform", `translate(${margin.left},${margin.top})`);

// 2020 crime rate data
d3.csv("2020_crimes.csv").then(function (data) {
    console.log(data)
})