// -------------------------------PIE CHART------------------------------------------------------
// ----------------------------First pie chart-------------------------------------------------
// set the dimensions and margins of the graph
width = 450;
height = 500;
margin = 10;

let count = 0;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = 100;

// append the svg object to the div called 'my_dataviz'
var svg = d3
.select("#first-div")
  .select("#first-svg")
//   .append("svg")
   .attr("width", width)
   .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  let percent = []
  let cat = []
 

d3.csv("data/egypt.csv").then(function (data) {
  // console.log(data);

  data.forEach(function(d) {
    
    cat.push(d["Employment type"] )
    d["percentage"] = +d["percentage"]
    percent.push(d["percentage"] )
});

let maps = {}
sum1 = d3.sum(percent)

console.log("here" + sum1)
for(i = 0;i<3;i++)
{
    console.log(cat[i])
    maps[cat[i]] = percent[i]
}

console.log(maps)





  // set the color scale
  var color = d3.scaleOrdinal(d3.schemeDark2)

  // Compute the position of each group on the pie:
  const pie = d3.pie()
      .value(d=>d[1])
  const data_ready = pie(Object.entries(maps))

  console.log(data_ready)
  // Now I know that group A goes from 0 degrees to x degrees and so on.

  // shape helper to build arcs:
  var arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg.append("text")
        .attr("dy", "-7em")
        .attr("dx", "-1em")
        .style("font-size", 20)
        .style("fill", function(d,i){return "black";})
        .html("Egypt");
  svg
      .selectAll('.arc')
      .data(data_ready)
      .join('path')
      .attr('d', d3.arc()
          .innerRadius(50)
          .outerRadius(radius)
      )
      .attr('fill', d => color(d.data[0]))
      .attr("stroke", "black")
      .style("stroke-width", "0px")
      .style("opacity", 1)
      .on("mouseover", function(d, i) {  // function to view text at center of donut chart
          svg.append("text")
              .attr("dy", "-7em")
              .attr("dx", "-8em")
              .style("text-anchor", "middle")
              .style("font-size", 15)
              .attr("class","label")
              .style("fill", function(d,i){return "black";})
              .html(`${i.data[0]} ${(i.value*100/sum1).toFixed(2)}%`);
          d3.select(this)
              .attr("stroke", "black")
              .style("stroke-width", "1px")
      })
      .on("mouseout", function(d) { //function to remove the label
        svg.select(".label").remove();
        d3.select(this)
              .attr("stroke", "black")
              .style("stroke-width", "0px")
      })


});



// ----------------------------Second pie chart-------------------------------------------------

var svg1 = d3
.select("#second-div")
  .select("#second-svg")
   .attr("width", width)
   .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width/2 + "," + height / 2 + ")");

  percent1 = []

d3.csv("data/afghanistan.csv").then(function (data) {

  data.forEach(function(d) {
    
    cat.push(d["Employment type"] )
    d["percentage"] = +d["percentage"]
    percent1.push(d["percentage"] )
});

let maps = {}
sum2 = d3.sum(percent1)

for(i = 0;i<3;i++)
{
    console.log(cat[i])
    maps[cat[i]] = percent1[i]
}

console.log(maps)
  // set the color scale
  var color = d3.scaleOrdinal(d3.schemeDark2)

  // Compute the position of each group on the pie:
  const pie = d3.pie()
      .value(d=>d[1])
  const data_ready = pie(Object.entries(maps))

  console.log(data_ready)
  // Now I know that group A goes from 0 degrees to x degrees and so on.

  // shape helper to build arcs:
  var arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg1.append("text")
        .attr("dy", "-7em")
        .attr("dx", "-1em")
        .style("font-size", 20)
        .style("fill", function(d,i){return "black";})
        .html("Afghanistan");
  svg1
      .selectAll('.arc')
      .data(data_ready)
      .join('path')
      .attr('d', d3.arc()
          .innerRadius(50)         
          .outerRadius(radius)
      )
      .attr('fill', d => color(d.data[0]))
      .attr("stroke", "black")
      .style("stroke-width", "0px")
      .style("opacity", 1)
      .on("mouseover", function(d, i) {  // function to view text at center of donut chart
          svg1.append("text")
              .attr("dy", "-7.5em")
              .style("text-anchor", "middle")
              .style("font-size", 15)
              .attr("class","label")
              .style("fill", function(d,i){return "black";})
              .html(`${i.data[0]} ${(i.value*100/sum2).toFixed(2)}%`);
          d3.select(this)
              .attr("stroke", "black")
              .style("stroke-width", "1px")
      })
      .on("mouseout", function(d) { //function to remove the label
        svg1.select(".label").remove();
        d3.select(this)
              .attr("stroke", "black")
              .style("stroke-width", "0px")
      })


});



// ----------------------------third pie chart-------------------------------------------------

var svg2 = d3
.select("#third-div")
  .select("#third-svg")
//   .append("svg")
   .attr("width", width)
   .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width/2 + "," + height / 2 + ")");

  percent2 = []
    // cat = []

d3.csv("data/angola.csv").then(function (data) {
  // console.log(data);

  data.forEach(function(d) {
    
    cat.push(d["Employment type"] )
    d["percentage"] = +d["percentage"]
    percent2.push(d["percentage"] )
});

let maps = {}
sum3 = d3.sum(percent2)

for(i = 0;i<3;i++)
{
    console.log(cat[i])
    maps[cat[i]] = percent2[i]
}

console.log(maps)
  // set the color scale
  var color = d3.scaleOrdinal(d3.schemeDark2)

  // Compute the position of each group on the pie:
  const pie = d3.pie()
      .value(d=>d[1])
  const data_ready = pie(Object.entries(maps))

  console.log(data_ready)
  // Now I know that group A goes from 0 degrees to x degrees and so on.

  // shape helper to build arcs:
  var arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg2.append("text")
        .attr("dy", "-7em")
        .attr("dx", "-1em")
        .style("font-size", 20)
        .style("fill", function(d,i){return "black";})
        .html("Angola");
  svg2
      .selectAll('.arc')
      .data(data_ready)
      .join('path')
      .attr('d', d3.arc()
          .innerRadius(50)         
          .outerRadius(radius)
      )
      .attr('fill', d => color(d.data[0]))
      .attr("stroke", "black")
      .style("stroke-width", "0px")
      .style("opacity", 1)
      .on("mouseover", function(d, i) {  // function to view text at center of donut chart
          svg2.append("text")
              .attr("dy", "-7em")
              .attr("dx", "8em")
              .style("text-anchor", "middle")
              .style("font-size", 15)
              .attr("class","label")
              .style("fill", function(d,i){return "black";})
              .html(`${i.data[0]} ${(i.value*100/sum3).toFixed(2)}%`);
          d3.select(this)
              .attr("stroke", "black")
              .style("stroke-width", "1px")
      })
      .on("mouseout", function(d) { //function to remove the label
        svg2.select(".label").remove();
        d3.select(this)
              .attr("stroke", "black")
              .style("stroke-width", "0px")
      })


});

// ----------------------------forth pie chart-------------------------------------------------

var svg3 = d3
.select("#forth-div")
  .select("#forth-svg")
//   .append("svg")
   .attr("width", width)
   .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width/2 + "," + height / 2 + ")");

  percent3 = []
    // cat = []

d3.csv("data/niger.csv").then(function (data) {
  // console.log(data);

  data.forEach(function(d) {
    
    cat.push(d["Employment type"] )
    d["percentage"] = +d["percentage"]
    percent3.push(d["percentage"] )
});

let maps = {}
sum4 = d3.sum(percent3)

for(i = 0;i<3;i++)
{
    console.log(cat[i])
    maps[cat[i]] = percent3[i]
}

console.log(maps)
  // set the color scale
  var color = d3.scaleOrdinal(d3.schemeDark2)

  // Compute the position of each group on the pie:
  const pie = d3.pie()
      .value(d=>d[1])
  const data_ready = pie(Object.entries(maps))

  console.log(data_ready)
  // Now I know that group A goes from 0 degrees to x degrees and so on.

  // shape helper to build arcs:
  var arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
    svg3.append("text")
        .attr("dy", "-7em")
        .attr("dx", "-1em")
        .style("font-size", 20)
        .style("fill", function(d,i){return "black";})
        .html("Nigar");

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  svg3
      .selectAll('.arc')
      .data(data_ready)
      .join('path')
      .attr('d', d3.arc()
          .innerRadius(50)         
          .outerRadius(radius)
      )
      .attr('fill', d => color(d.data[0]))
      .attr("stroke", "black")
      .style("stroke-width", "0px")
      .style("opacity", 1)
      .on("mouseover", function(d, i) {  // function to view text at center of donut chart
          svg3.append("text")
              .attr("dy", "-7em")
              .attr("dx", "8em")
              .style("text-anchor", "middle")
              .style("font-size", 15)
              .attr("class","label")
              .style("fill", function(d,i){return "black";})
              .html(`${i.data[0]} ${(i.value*100/sum4).toFixed(2)}%`);
          d3.select(this)
              .attr("stroke", "black")
              .style("stroke-width", "1px")
      })
      .on("mouseout", function(d) { //function to remove the label
        svg3.select(".label").remove();
        d3.select(this)
              .attr("stroke", "black")
              .style("stroke-width", "0px")
      })


});


// ----------------------------fifth pie chart-------------------------------------------------

var svg4 = d3
.select("#fifth-div")
  .select("#fifth-svg")
//   .append("svg")
   .attr("width", width)
   .attr("height", height)
  .append("g")

  .attr("transform", "translate(" + width/2 + "," + height / 2 + ")");

  percent4 = []
    // cat = []

d3.csv("data/uganda.csv").then(function (data) {
  // console.log(data);

  data.forEach(function(d) {
    
    cat.push(d["Employment type"] )
    d["percentage"] = +d["percentage"]
    percent4.push(d["percentage"] )
});

let maps = {}
sum5 = d3.sum(percent4)

for(i = 0;i<3;i++)
{
    console.log(cat[i])
    maps[cat[i]] = percent4[i]
}

console.log(maps)
  // set the color scale
  var color = d3.scaleOrdinal(d3.schemeDark2)

  // Compute the position of each group on the pie:
  const pie = d3.pie()
      .value(d=>d[1])
  const data_ready = pie(Object.entries(maps))

  console.log(data_ready)
  // Now I know that group A goes from 0 degrees to x degrees and so on.

  // shape helper to build arcs:
  var arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
    svg4.append("text")
        .attr("dy", "-7em")
        .attr("dx", "-1em")
        .style("font-size", 20)
        .style("fill", function(d,i){return "black";})
        .html("Uganda");
  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  svg4
      .selectAll('.arc')
      .data(data_ready)
      .join('path')
      .attr('d', d3.arc()
          .innerRadius(50)         
          .outerRadius(radius)
      )
      .attr('fill', d => color(d.data[0]))
      .attr("stroke", "black")
      .style("stroke-width", "0px")
      .style("opacity", 1)
      .on("mouseover", function(d, i) {  // function to view text at center of donut chart
          svg4.append("text")
              .attr("dy", "-7em")
              .attr("dx", "8em")
              .style("text-anchor", "middle")
              .style("font-size", 15)
              .attr("class","label")
              .style("fill", function(d,i){return "black";})
              .html(`${i.data[0]} ${(i.value*100/sum4).toFixed(2)}%`);
          d3.select(this)
              .attr("stroke", "black")
              .style("stroke-width", "1px")
      })
      .on("mouseout", function(d) { //function to remove the label
        svg4.select(".label").remove();
        d3.select(this)
              .attr("stroke", "black")
              .style("stroke-width", "0px")
      })


});