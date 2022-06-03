// set the dimensions and margins of the graph
const margin = { top: 30, right: 30, bottom: 120, left: 60 },
  width = 720 - margin.left - margin.right,
  height = 720 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// 2020 crime rate data
d3.csv("2020_crimes.csv").then(function (data) {
  console.log(data);

  // X axis, types of crime
  const x = d3
    .scaleBand()
    .range([0, width])
    .domain(data.map((d) => d.level_2))
    .padding(0.2);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Y axis, number of times occured
  const y = d3.scaleLinear().domain([0, 20000]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // create a tooltip
  // var tooltip = d3.select("body")
  //     .append("div")
  //     .style("position", "absolute")
  //     .style("z-index", "10")
  //     .style("visibility", "hidden")
  //     .text("a simple tooltip");
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Bars
  svg
    .selectAll("mybar")
    .data(data)
    .join("rect")
    .attr("x", (d) => x(d.level_2)) // X axis, types of crime
    .attr("y", (d) => y(d.value)) // Y axis, number of times crime occured
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d.value))
    .attr("fill", "#69b3a2")
    .on("mouseover", (d, i) => {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html("Total cases: " + i.value)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
    })
    .on("mouseout", (d) => {
      tooltip.transition().duration(500).style("opacity", 0);
    });
  // .on("mouseover", function(){tooltip.text(d.value); return tooltip.style("visibility", "visible");})
  // .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
  // .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
});
