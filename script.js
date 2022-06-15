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

// Create X Axis
svg
  .append("g")
  .attr("transform", `translate(0, ${height})`)
  .attr("id", "x-axis")

svg
  .append("g")
  .attr("id", "y-axis")


// 2020 crime rate data
d3.csv("full_crimes.csv").then(function (data) {

  /* Create the dropdown list */
  const ddlYear = [];

  data.forEach(d => {
    if (ddlYear.includes(d["year"])) {
      return;
    }

    ddlYear.push(d["year"]);
  });

  // Append to dropdownlist
  var ddl = document.getElementById("dropdown");

  ddlYear.forEach(year => {
    var ddlOption = document.createElement('option');
    ddlOption.innerHTML = year;
    ddl.appendChild(ddlOption);
  })

  ddl.addEventListener('change', (event) => {
    var selectedOptions = event.target.value;
    updateBarGraph(selectedOptions);
  });

  // Intialise bargraph
  updateBarGraph(ddlYear[0])

  /* Update the bargraph upon ddl change */
  function updateBarGraph(year) {

    const barData = [];

    data.forEach(d => {

      if (parseInt(d["year"]) !== parseInt(year)) {
        return;
      }

      barData.push(d);
    });


    // X axis, types of crime
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(barData.map((d) => d.level_2))
      .padding(0.2);


    const xAxis = d3.select("#x-axis");

    xAxis.call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "15px")
      .style("color", "white");

    // Y axis, number of times occured
    const y = d3.scaleLinear().domain([0, 20000]).range([height, 0]);

    const yAxis = d3.select("#y-axis");
    yAxis
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
      .html(function (d, i) {
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
    // Create the u variable
    var rect = svg.selectAll("rect")
      .data(barData)

    rect
      .enter()
      .append("rect") // Add a new rect for each new elements
      .merge(rect) // get the already existing elements as well
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .transition() // and apply changes to all of them
      .duration(1000)
      .attr("x", (d) => x(d.level_2)) // X axis, types of crime
      .attr("y", (d) => y(d.value)) // Y axis, number of times crime occured
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", "#FFBF00")

    // .on("mouseover", mouseover)
    // .on("mousemove", mousemove)
    // .on("mouseleave", mouseleave);

    rect
      .exit()
      .remove()
  }

});
