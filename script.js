// set the dimensions and margins of the graph
const margin = { top: 30, right: 30, bottom: 150, left: 60 },
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
    .style("text-anchor", "end")
    .style("font-size", "15px")
    .style("color", "white");

  // Y axis, number of times occured
  const y = d3.scaleLinear().domain([0, 20000]).range([height, 0]);
  svg
    .append("g")
    .call(d3.axisLeft(y))
    .style("color", "white")
    .style("font-size", "15px");

  // create a tooltip
  // var Tooltip = d3
  //   .select("#my_dataviz")
  //   .append("div")
  //   .style("opacity", 0)
  //   .attr("class", "tooltip")
  //   .style("position", "absolute")
  //   .style("background-color", "white")
  //   .style("border", "solid")
  //   .style("border-width", "2px")
  //   .style("border-radius", "5px")
  //   .style("padding", "5px");

  var tip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function (d,i) {
      return (
        "<strong>" + i.level_2 + ": </strong>" + "<span style='color:red'>" +
        i.value +
        "</span>"
      );
    });
  svg.call(tip);

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function (d) {
    Tooltip.style("opacity", 1);
    d3.select(this)
      .style("stroke", "red")
      .style("opacity", 1)
      .style("stroke-width", 3);
  };
  var mousemove = function (d, i) {
    var pos = d3.select(this).node().getBoundingClientRect(); // get moouse postion
    Tooltip.html("Total Crimes: " + i.value)
      .style("left", `${window.pageXOffset + pos["x"] - 50}px`)
      .style("right", `${window.pageyOffset + pos["x"] - 50}px`);
    // .style("left", d3.mouse(this)[0] + 70 + "px")
    // .style("top", d3.mouse(this)[1] + "px");
  };
  var mouseleave = function (d) {
    Tooltip.style("opacity", 0);
    d3.select(this).style("stroke", "none").style("opacity", 0.8);
  };

  // Bars
  svg
    .selectAll("mybar")
    .data(data)
    .join("rect")
    .attr("x", (d) => x(d.level_2)) // X axis, types of crime
    .attr("y", (d) => y(d.value)) // Y axis, number of times crime occured
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d.value))
    .attr("fill", "#FFBF00")
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    // .on("mouseover", mouseover)
    // .on("mousemove", mousemove)
    // .on("mouseleave", mouseleave);
});
