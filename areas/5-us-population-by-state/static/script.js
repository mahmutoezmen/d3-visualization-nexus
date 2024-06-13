function loadData() {
  const regionByStateUrl = "https://raw.githubusercontent.com/cphalpert/census-regions/7bdc6aa1cb0892361e90ce9ad54983041c2ad015/us%20census%20bureau%20regions%20and%20divisions.csv";
  const populationUrl = "../data/population.tsv"; // Update this path to your actual population.tsv file

  return Promise.all([
    d3.csv(regionByStateUrl),
    d3.tsv(populationUrl)
  ]);
}

function processData([regions, tsvData]) {
  const regionByState = new Map(regions.map(d => [d.State, d.Division]));

  const regionRank = [
    "New England",
    "Middle Atlantic",
    "South Atlantic",
    "East South Central",
    "West South Central",
    "East North Central",
    "West North Central",
    "Mountain",
    "Pacific"
  ];

  const years = d3.range(1790, 2000, 10);
  const states = tsvData.map((d, i) => i === 0 ? null : ({
    name: d[""],
    values: years.map(y => +d[y].replace(/,/g, "") || 0)
  })).filter(d => d !== null);

  states.sort((a, b) => 
    d3.ascending(regionRank.indexOf(regionByState.get(a.name)), regionRank.indexOf(regionByState.get(b.name))) ||
    d3.descending(d3.sum(a.values), d3.sum(b.values))
  );

  const data = years.map((y, i) => Object.fromEntries(
    [["date", new Date(Date.UTC(y, 0, 1))]].concat(states.map(s => [s.name, s.values[i]]))
  ));
  data.columns = ["date", ...states.map(s => s.name)];

  const series = d3.stack()
    .keys(data.columns.slice(1))
    .offset(d3.stackOffsetExpand)(data);

  return { data, series, regionByState, regionRank };
}

function createChart({ data, series, regionByState, regionRank }) {
  // Chart dimensions
  const width = 928;
  const height = 720;
  const marginTop = 10;
  const marginRight = 10;
  const marginBottom = 30;
  const marginLeft = 40;

  // Scales
  const x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([marginLeft, width - marginRight]);

  const y = d3.scaleLinear()
    .range([height - marginBottom, marginTop]);

  const color = d3.scaleOrdinal()
    .domain(regionRank)
    .range(d3.schemeCategory10)
    .unknown("gray");

  // Create SVG container
  const svg = d3.select("svg.chart")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("style", "max-width: 100%; height: auto;");

  // Create areas
  const area = d3.area()
    .x(d => x(d.data.date))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]));

  svg.append("g")
    .attr("fill-opacity", 0.8)
    .selectAll("path")
    .data(series)
    .join("path")
    .attr("fill", ({ key }) => color(regionByState.get(key)))
    .attr("d", area)
    .append("title")
    .text(({ key }) => key);

  // Create lines
  const midline = d3.line()
    .curve(d3.curveBasis)
    .x(d => x(d.data.date))
    .y(d => y((d[0] + d[1]) / 2));

  svg.append("g")
    .attr("fill", "none")
    .attr("stroke-width", 0.75)
    .selectAll("path")
    .data(series)
    .join("path")
    .attr("stroke", ({ key }) => d3.lab(color(regionByState.get(key))).darker())
    .attr("d", area.lineY1());

  // Append paths for text labels
  const paths = svg.append("defs")
    .selectAll("path")
    .data(series)
    .join("path")
    .attr("id", (d, i) => `path-${i}`)
    .attr("d", midline);

  // Append labels
  svg.append("g")
    .style("font", "10px sans-serif")
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(series)
    .join("text")
    .attr("dy", "0.35em")
    .append("textPath")
    .attr("href", (d, i) => `#path-${i}`)
    .attr("startOffset", d => `${Math.max(0.05, Math.min(0.95, d.offset = d3.maxIndex(d, d => d[1] - d[0]) / (d.length - 1))) * 100}%`)
    .text(d => d.key);

  // Append axes
  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(10, "%"))
    .call(g => g.select(".domain").remove());
}

loadData()
  .then(processData)
  .then(createChart)
  .catch(error => console.error(error));
