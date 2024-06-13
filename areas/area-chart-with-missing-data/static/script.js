// Load the data
d3.csv("../data/aapl.csv", d => ({
  date: d3.utcParse("%Y-%m-%d")(d.date),
  close: +d.close
})).then(data => {
  // Declare the chart dimensions and margins
  const width = 928;
  const height = 500;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 30;
  const marginLeft = 40;

  // Declare the x (horizontal position) scale
  const x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([marginLeft, width - marginRight]);

  // Declare the y (vertical position) scale
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.close)])
    .range([height - marginBottom, marginTop]);

  // Declare the area generator
  const area = d3.area()
    .x(d => x(d.date))
    .y0(y(0))
    .y1(d => y(d.close));

  // Create the SVG container
  const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  // Append the area path
  svg.append("path")
    .attr("fill", "steelblue")
    .attr("d", area(data));

  // Add the x-axis
  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

  // Add the x-axis title
  // svg.append("text")
  //   .attr("x", width / 2)
  //   .attr("y", height - 1)
  //   .attr("text-anchor", "middle")
  //   .attr("fill", "currentColor") // Set the same font color as the axis
  //   .style("font-size", "12px") // Set the same font size as the axis
  //   .style("font-family", "Arial, sans-serif") // Set the same font style as the axis
  //   .text("Date");

  // Add the y-axis, remove the domain line, add grid lines and a label
  const yAxis = svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(height / 40));

  yAxis.select(".domain").remove();
  yAxis.selectAll(".tick line")
    .clone()
    .attr("x2", width - marginLeft - marginRight)
    .attr("stroke-opacity", 0.1);

  yAxis.append("text")
    .attr("x", -marginLeft)
    .attr("y", 10)
    .attr("fill", "currentColor") // Set the same font color as the axis
    .attr("text-anchor", "start")
    .style("font-size", "14px") // Set the same font size as the axis
    .style("font-family", "Arial, sans-serif") // Set the same font style as the axis
    .text("↑ Daily close ($)");

  // Append the y-axis label and center it
  // yAxis.append("text")
  //   .attr("x", -marginLeft + 10)
  //   .attr("y", (height - marginTop - marginBottom - 12) / 2)
  //   .attr("fill", "currentColor") // Set the same font color as the axis
  //   .attr("text-anchor", "middle")
  //   .attr("transform", `rotate(-90, -${marginLeft - 10}, ${(height - marginTop - marginBottom) / 2})`)
  //   .attr("dominant-baseline", "central")
  //   .style("font-size", "12px") // Set the same font size as the axis
  //   .style("font-family", "Arial, sans-serif") // Set the same font style as the axis
  //   .text("Closing Price ($)");

  //     yAxis.append("text")
  // .attr("x", -marginLeft)
  // .attr("y", 10)
  // .attr("fill", "currentColor")
  // .attr("text-anchor", "start")
  // .text("Closing Price ($)");

});
