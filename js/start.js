let margin = {top: 20, right: 30, bottom: 140, left: 100},
  width = 1500 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

let xScale = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

let yScale = d3.scale.linear()
  .range([height, 0]);

let xAxis = d3.svg.axis()
  .scale(xScale)
  .orient("bottom");

let yAxis = d3.svg.axis()
  .scale(yScale)
  .orient("left")
  .ticks(10);

let svg = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("class", "chart");

let chart = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("US_Starbucks.csv", function(data) {
  let data1 = d3.map(data, function(d){return d["State/Province"]}).keys()

  let stateNumStores = [];
  let numStores =[];
  for (let i = 0; i < data1.length; i++) {
    stateNumStores.push({
      state: data1[i],
      value: data.map((row) => row["State/Province"]).filter(d => d == data1[i]).length
    })
    numStores.push(
      data.map((row) => row["State/Province"]).filter(d => d == data1[i]).length
    )
  }

  xScale.domain(data1);
  yScale.domain([0, d3.max(numStores)]);

  let div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)

  chart.selectAll(".bar")
    .data(stateNumStores)
    .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return xScale(d.state); })
      .attr("height", function(d) { return height - yScale(0); })
      .attr("y", function(d) { return yScale(0); })
      .attr("width", xScale.rangeBand())
    .on("mouseover", (d) => {
      div.transition()
      .duration(200)
      .style("opacity", .9)
      div.html("State - " + d.state + "<br>" + "Number Of Stores - " + d.value)
      .style("left", (d3.event.pageX + 15) + "px")
      .style("top", (d3.event.pageY - 28) + "px")
    })
    .on("mouseout", (d) => {
      div.transition()
      .duration(500)
      .style("opacity", 0);
    });

  chart.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function(d) { return yScale(d.value);})
    .attr("height", function(d) { return height - yScale(d.value); })
    .delay(function(d,i){return(i*100)})

  chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style('font-size', '12pt')
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  chart.append('text')
    .attr('x', 650)
    .attr('y', 570)
    .attr('id', "x-label")
    .style('font-size', '20pt')
    .text('State');

  chart.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append('text')
      .attr('transform', 'translate(-65, 290)rotate(-90)')
      .style('font-size', '18pt')
      .text('Number of Stores');
});
