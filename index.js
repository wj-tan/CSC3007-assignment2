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

// X axis, types of crime
const x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(d => d.level_2))
  .padding(0.2);
svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");


// Y axis, 
const y = d3.scaleLinear()
  .domain([0, 20000])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));
})

