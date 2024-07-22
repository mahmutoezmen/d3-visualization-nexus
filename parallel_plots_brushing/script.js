// Define the margin, width, and height
const margin = {top: 20, right: 10, bottom: 20, left: 10};
const width = 928;
const keysHeight = 120;
const colorLegendHeight = 50;

// Create the SVG container
const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, 0]) // Adjust height later based on keys
    .attr("width", width);

console.log("SVG created");

// Load the CSV data
d3.csv('cars.csv', d3.autoType).then(data => {
    console.log("Data loaded", data);
    const keys = data.columns.slice(1);
    console.log("Keys", keys);
    const height = keys.length * keysHeight;
    svg.attr("height", height).attr("viewBox", [0, 0, width, height]);

    // Populate dropdown menu
    const dropdown = d3.select("#colorKey");
    dropdown.selectAll("option")
        .data(keys)
        .enter()
        .append("option")
        .text(d => d);

    // Create an horizontal scale for each key
    const x = new Map(Array.from(keys, key => [key, d3.scaleLinear(d3.extent(data, d => d[key]), [margin.left, width - margin.right])]));
    console.log("Scales created", x);

    // Create the vertical scale
    const y = d3.scalePoint(keys, [margin.top, height - margin.bottom]);

    // Initial color key
    let colorKey = keys[0];

    // Create the color scale
    let color = d3.scaleSequential(x.get(colorKey).domain(), t => d3.interpolateBrBG(1 - t));

    // Append the lines
    const line = d3.line()
        .defined(([, value]) => value != null)
        .x(([key, value]) => x.get(key)(value))
        .y(([key]) => y(key));

    const path = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("stroke-opacity", 0.4)
        .selectAll("path")
        .data(data.slice().sort((a, b) => d3.ascending(a[colorKey], b[colorKey])))
        .join("path")
        .attr("stroke", d => color(d[colorKey]))
        .attr("d", d => line(d3.cross(keys, [d], (key, d) => [key, d[key]])))
        .call(path => path.append("title").text(d => d.name));

    console.log("Lines appended");

    // Append the axis for each key
    const axes = svg.append("g")
        .selectAll("g")
        .data(keys)
        .join("g")
        .attr("transform", d => `translate(0,${y(d)})`)
        .each(function(d) {
            d3.select(this).call(d3.axisBottom(x.get(d)));
        })
        .call(g => g.append("text")
            .attr("x", margin.left)
            .attr("y", -6)
            .attr("text-anchor", "start")
            .attr("fill", "currentColor")
            .text(d => d))
        .call(g => g.selectAll("text")
            .clone(true).lower()
            .attr("fill", "none")
            .attr("stroke-width", 5)
            .attr("stroke-linejoin", "round")
            .attr("stroke", "white"));

    console.log("Axes appended");

    // Create the brush behavior
    const deselectedColor = "#ddd";
    const brushHeight = 50;
    const brush = d3.brushX()
        .extent([[margin.left, -(brushHeight / 2)], [width - margin.right, brushHeight / 2]])
        .on("start brush end", brushed);

    axes.call(brush);

    const selections = new Map();

    function brushed({selection}, key) {
        if (selection === null) selections.delete(key);
        else selections.set(key, selection.map(x.get(key).invert));
        const selected = [];
        path.each(function(d) {
            const active = Array.from(selections).every(([key, [min, max]]) => d[key] >= min && d[key] <= max);
            d3.select(this).style("stroke", active ? color(d[colorKey]) : deselectedColor);
            if (active) {
                d3.select(this).raise();
                selected.push(d);
            }
        });
        svg.property("value", selected).dispatch("input");
    }

    console.log("Brush behavior added");

    // Function to update the color scale and legend
    function updateColorScale() {
        colorKey = dropdown.node().value;
        color = d3.scaleSequential(x.get(colorKey).domain(), t => d3.interpolateBrBG(1 - t));
        path.attr("stroke", d => color(d[colorKey]));

        // Update the color legend
        d3.select("#colorLegend").selectAll("*").remove();
        d3.select("#colorLegend").call(legend, color);
    }

    // Attach event listener to dropdown menu
    dropdown.on("change", updateColorScale);

    // Initial legend setup
    updateColorScale();
});

// Legend function
function legend(selection, scale) {
    const legendWidth = 260;
    const legendHeight = 10;
    const ticks = scale.ticks(5);
    const tickFormat = scale.tickFormat(5);
    
    const legendSvg = selection.append("svg")
        .attr("width", legendWidth)
        .attr("height", colorLegendHeight)
        .style("overflow", "visible");

    const gradient = legendSvg.append("defs")
        .append("linearGradient")
        .attr("id", "legendGradient")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");

    gradient.selectAll("stop")
        .data(scale.ticks().map((t, i, n) => ({offset: `${100 * i / n.length}%`, color: scale(t)})))
        .enter().append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);

    legendSvg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#legendGradient)");

    const legendAxis = d3.axisBottom(d3.scaleLinear().domain(scale.domain()).range([0, legendWidth]))
        .ticks(5)
        .tickFormat(tickFormat);

    legendSvg.append("g")
        .attr("transform", `translate(0,${legendHeight})`)
        .call(legendAxis);
}
