// Data for the bar chart
const data = [
  { skill: "SQL", level: 9, color: "#04abf3", icon: "images/sql.png" },
  { skill: "dbt", level: 4, color: "#f15e49", icon: "images/dbt.png" },
  { skill: "Tableau", level: 8, color: "#1f447e", icon: "images/tableau.png" },
  { skill: "Python", level: 7, color: "#3e7aab", icon: "images/python.png" },
  { skill: "Excel", level: 5, color: "#1D6F42", icon: "images/excel.png" }
];

// Define the dimensions of the chart
// the chart will be responsive to the size of the container
const container = d3.select("#chart-container");
// get the margin of the container
left_margin = parseInt(container.style("margin-left").replace("px", ""));
right_margin = parseInt(container.style("margin-right").replace("px", ""));
top_margin = parseInt(container.style("margin-top").replace("px", ""));
bottom_margin = parseInt(container.style("margin-bottom").replace("px", ""));

const width = 400 - left_margin - right_margin;
const height = 400 - top_margin - bottom_margin;

// Create the SVG container
const svg = d3.select("#chart-container")
  .append("svg")
  .attr("width", width + left_margin + right_margin)
  .attr("height", height + top_margin + bottom_margin)
  .append("g")
  .attr("transform", `translate(${left_margin},${top_margin})`);

// Create the x and y scales
const x = d3.scaleBand()
  .domain(data.map(d => d.skill))
  .range([0, width])
  .padding(0.1);

const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.level)])
  .nice()
  .range([height, 0]);

// Add the bars to the chart with hover effect
svg.selectAll(".bar")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", d => x(d.skill))
  .attr("width", x.bandwidth())
  .attr("y", height)
  .attr("height", 0)
  .style("fill", d => d.color) // Use the color from the data
  .on("mouseover", function() {
    d3.select(this)
      .transition()
      .duration(200)
      .style("fill", "#60C0FD"); // Change the color on hover
  })
  .on("mouseout", function(d) {
    d3.select(this)
      .transition()
      .duration(200)
      .style('fill',d => d.color); // Revert to original color on mouseout
  })
  .transition()
  .duration(2000)
  .delay((d, i) => i * 200)
  .attr("y", d => y(d.level))
  .attr("height", d => height - y(d.level));

// Add icons to the bars
svg.selectAll(".icon")
  .data(data)
  .enter()
  .append("image")
  .attr("class", "popup-icon")
  .attr("x", d => x(d.skill) + x.bandwidth() / 2 - 25) // Adjust the x-position to center the icon
  .attr("y", d => {
    const iconY = y(d.level) - 50; // Adjust the y-position to place the icon above the bar
    if (iconY < top_margin) {
      return top_margin;
    }
    return iconY;
  })
  .attr("width", 50) // Set the width of the icon to 50px
  .attr("height", 50) // Set the height of the icon to 50px
  .attr("xlink:href", d => d.icon); // Path to the SVG icon

// Add animation at loading
svg.transition()
  .delay(100)
  .attr("opacity", 1);

// Add axes
svg.append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x));

svg.append("g")
  .attr("class", "y-axis");
// Remove x and y axes lines
svg.selectAll(".domain").remove();