var string = "CSE 494 Data Viz: Work in Progress";
var array = string.split("");
var timer;

let violence_data;

document.addEventListener("DOMContentLoaded", function () {
    plotScatterBubblePlot();
    plotSlopeGraph()
    parallelCoordinateChartSetUp();
    gigaChartSetUp();
    plotMultipleBarCharts();
    plotScatterPlot();
});

//Functions used for plotting charts
function plotScatterPlot() {
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 900 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

// parse the date / time
// var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

// define the line
    var valueline = d3.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.close);
        });

    var svg = d3.select("#scatterplot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// Get the data
    d3.csv("data/barplot_data.csv").then(function (data) {

        // format the data
        data.forEach(function (d) {
            d["Violence in Life Time"] = +d["Violence in Life Time"];
            d["Attitude towards Violence"] = +d["Attitude towards Violence"];
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function (d) {
            return d["Violence in Life Time"];
        }));
        y.domain([0, d3.max(data, function (d) {
            return d["Attitude towards Violence"]
        })]);

        // // Add the valueline path.
        // svg.append("path")
        //     .data([data])
        //     .attr("class", "line")
        //     .attr("d", valueline);

        // Add the scatterplot
        svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr('fill', '#D9534F')
            .attr("r", 5)
            .attr("cx", function (d) {
                return x(d["Violence in Life Time"]);
            })
            .attr("cy", function (d) {
                return y(d["Attitude towards Violence"]);
            });

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .style("stroke-width", "2px");

        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y))
            .style("stroke-width", "2px");
        data = getScatterPlotData(data);
        console.log(data);
        var line = d3.line()
            .x(function (d) {
                return x(d["Violence in Life Time"]);
            })
            .y(function (d) {
                return y(d.yhat);
            });

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2.5)
            .attr("d", d3.line()
                .x(function (d) {
                    return x(d["Violence in Life Time"])
                })
                .y(function (d) {
                    return y(d.yhat)
                })
            )
    });


    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .style("font-size", "15px")
        .text("Violence in Life Time");

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .style("font-size", "15px")
        .attr("transform", "rotate(-90)")
        .text("Attitude towards Violence");
}

function getScatterPlotData(data) {
    var n = data.length;
    var x_mean = 0;
    var y_mean = 0;
    var term1 = 0;
    var term2 = 0;


    data.forEach(function (d) {
        x_mean += d["Violence in Life Time"]
        y_mean += d["Attitude towards Violence"]
    })
    x_mean /= n;
    y_mean /= n;

    var xr = 0;
    var yr = 0;

    data.forEach(function (d) {
        xr = d["Violence in Life Time"] - x_mean;
        yr = d["Attitude towards Violence"] - y_mean;
        term1 += xr * yr;
        term2 += xr * xr;
    })

    var b1 = term1 / term2;
    var b0 = y_mean - (b1 * x_mean);

    data.forEach(function (d) {
        d.yhat = b0 + (d["Violence in Life Time"] * b1)
    })

    return (data);
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function parallelCoordinateChartSetUp() {
    let margin = {top: 30, right: 30, bottom: 100, left: 50},
        width = 1100 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    let svg = d3
        .select("#parallelCoordinates")
        .append("svg")
        .attr(
            "width",
            width +
            margin.left +
            margin.right
        )
        .attr(
            "height",
            height +
            margin.top +
            margin.bottom
        )
        .append("g")
        .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
        );

    d3.csv("data/Parallel_Coordinates_Chart_Data.csv").then(function (data) {
        console.log(data)

        const color = d3.scaleOrdinal()
            .domain(["Afghanistan", "Angola", "Colombia", "India", "Malawi", "Mozambique", "Myanmar", "Tanzania", "Zimbabwe"])
            .range(["#F36034", "#5D8F7D", "#E4832D", "#326B60", "#7A80BB", "#4980AF", "#AA7DB8", "#FFA17A", "#A5E1D4",])

        dimensions = ["No education", "Primary", "Secondary", "Higher"]

        const y = {}
        for (i in dimensions) {
            name = dimensions[i]
            y[name] = d3.scaleLinear()
                .domain([0, 100]) // --> Same axis range for each group
                // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
                .range([height, 0])
        }

        // Build the X scale -> it find the best position for each Y axis
        x = d3.scalePoint()
            .range([0, width])
            .domain(dimensions);


        // Highlight the specie that is hovered
        const highlight = function (event, d) {

            selected_specie = d.Country

            // first every group turns grey
            d3.selectAll(".line")
                .transition().duration(200)
                .style("stroke", "lightgrey")
                .style("opacity", "0.2")
            // Second the hovered specie takes its color
            d3.selectAll("." + selected_specie)
                .transition().duration(200)
                .style("stroke", color(selected_specie))
                .style("opacity", "1")
        }

        // Unhighlight
        const doNotHighlight = function (event, d) {
            d3.selectAll(".line")
                .transition().duration(200).delay(500)
                .style("stroke", function (d) {
                    return (color(d.Country))
                })
                .style("opacity", "1")
        }


        function path(d) {
            return d3.line()(dimensions.map
            (function (p) {
                console.log(p)
                console.log(d[p]);
                return [x(p), y[p](d[p])];
            }));
        }

        svg
            .selectAll("myPath")
            .data(data)
            .join("path")
            .attr("class", function (d) {
                return "line " + d.Country
            }) // 2 class for each line: 'line' and the group name
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", function (d) {
                return (color(d.Country))
            })
            .style("opacity", 1)
            .style("stroke-width", 2)
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight)


        svg.selectAll("myAxis")
            .data(dimensions).enter()
            .append("g")
            .attr("transform", function (d) {
                return "translate(" + x(d) + ")";
            })
            .each(function (d) {
                d3.select(this).call(
                    d3.axisLeft().scale(y[d])).style("stroke-width", "2px");
            })
            // Add axis title
            .append("text")
            .style("text-anchor", "middle")
            .style("font-size", "15px")
            .attr("y", -9)
            .text(function (d) {
                return d;
            })
            .style("fill", "black")


    })
}

function gigaChartSetUp() {
    const countries = [
        "Afghanistan",
        "Albania",
        "Angola",
        "Armenia",
        "Azerbaijan",
        "Bangladesh",
        "Benin",
        "Bolivia",
        "Burkina Faso",
        "Burundi",
        "Cambodia",
        "Cameroon",
        "Chad",
        "Colombia",
        "Comoros",
        "Congo",
        "Congo Democratic Republic",
        "Cote d'Ivoire",
        "Dominican Republic",
        "Egypt",
        "Eritrea",
        "Eswatini",
        "Ethiopia",
        "Gabon",
        "Gambia",
        "Ghana",
        "Guatemala",
        "Guinea",
        "Guyana",
        "Haiti",
        "Honduras",
        "India",
        "Indonesia",
        "Jordan",
        "Kenya",
        "Kyrgyz Republic",
        "Lesotho",
        "Liberia",
        "Madagascar",
        "Malawi",
        "Maldives",
        "Mali",
        "Moldova",
        "Morocco",
        "Mozambique",
        "Myanmar",
        "Namibia",
        "Nepal",
        "Nicaragua",
        "Niger",
        "Nigeria",
        "Pakistan",
        "Peru",
        "Philippines",
        "Rwanda",
        "Sao Tome and Principe",
        "Senegal",
        "Sierra Leone",
        "South Africa",
        "Tajikistan",
        "Tanzania",
        "Timor-Leste",
        "Togo",
        "Turkey",
        "Turkmenistan",
        "Uganda",
        "Ukraine",
        "Yemen",
        "Zambia",
        "Zimbabwe"
    ];

    let country_selector = document.getElementById("country-selector");

    for (let i = 0; i < countries.length; i++) {
        let div = document.createElement("DIV");
        let label = document.createElement("LABEL");
        let input = document.createElement("INPUT");
        div.classList.add("form-check");
        div.classList.add("col-4");

        label.innerHTML = countries[i];
        label.setAttribute("for", countries[i]);
        label.className.add = "form-check-label";

        input.setAttribute("type", "radio");
        input.value = countries[i];
        input.id = countries[i] + "-radio";
        input.classList.add("form-check-input");
        input.setAttribute("onclick", "drawLolliPopChart()");
        input.setAttribute("name", "country")
        if (i == 0) {
            input.checked = true;
        }

        div.appendChild(label);
        div.appendChild(input);
        country_selector.appendChild(div)
    }

    Promise.all([d3.csv("data/violence_data.csv")])
        .then(function (values) {
            console.log(values[0])
            violence_data = values[0];
            drawLolliPopChart();
        });

}

function drawLolliPopChart() {

    d3.select("#gigagraph_canvas").remove();

    const selected_question = document.getElementById("question-selector").value;
    const selected_demographic = document.getElementById("demographic-selector").value;
    console.log(selected_demographic)
    const selected_country = document.querySelectorAll('input[type="radio"]:checked')[0].value;

    let margin = {top: 30, right: 30, bottom: 100, left: 30},
        width = 1100 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    let svg = d3
        .select("#gigagraph-visualization")
        .append("svg")
        .attr("id", "gigagraph_canvas")
        .attr(
            "width",
            width +
            margin.left +
            margin.right
        )
        .attr(
            "height",
            height +
            margin.top +
            margin.bottom
        )
        .append("g")
        .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
        );

    const filtered_data = violence_data.filter((item) => {
        //console.log(item["Demographics Question"] == selected_demographic)
        return selected_country == item.Country && item.Question == selected_question && item["Demographics Question"] == selected_demographic
    })

    const females_data = filtered_data.filter(data => {
        return data.Gender == 'F'
    });
    const males_data = filtered_data.filter(data => {
        return data.Gender == 'M'
    });
    const xLables = females_data.map(data => {
        return data["Demographics Response"];
    });

    const colorScale = d3.scaleOrdinal(d3.schemeSet2);

    let xScale = d3
        .scaleBand()
        .range([0, width])
        .domain(xLables.map(function (d) {
            return d
        }))
        .padding(1);

    let yScale = d3
        .scaleLinear()
        .domain([
            0, 100
        ])
        .range([height, 0]);

    svg
        .append("g")
        .attr(
            "transform",
            "translate(0," + height + ")"
        )
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr(
            "transform",
            "translate(12,0)"
        )
        .style(
            "text-anchor",
            "end"
        );
    svg.append("g").call(d3.axisLeft(yScale));

    // MALE
    svg
        .selectAll("circleMale")
        .data(males_data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xScale(d["Demographics Response"]) - 10;
        })
        .attr("cy", function (d) {
            return yScale(d.Value) - 6;
        })
        .attr("r", "8")
        .style("fill", "#5DA8AD")
        .attr("stroke", "black");
    svg
        .selectAll("lineMale")
        .data(males_data)
        .enter()
        .append("line")
        .attr("x1", function (d) {
            return xScale(d["Demographics Response"]) - 10;
        })
        .attr("x2", function (d) {
            return xScale(d["Demographics Response"]) - 10;
        })
        .attr("y1", function (d) {
            return yScale(d.Value);
        })
        .attr("y2", yScale(0))
        .attr("stroke", "grey");

    // FEMALE
    svg
        .selectAll("circleFemale")
        .data(females_data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xScale(d["Demographics Response"]) + 10;
        })
        .attr("cy", function (d) {
            return yScale(d.Value) - 6;
        })
        .attr("r", "8")
        .style("fill", "#FF8AAE")
        .attr("stroke", "black");
    svg
        .selectAll("lineFemale")
        .data(females_data)
        .enter()
        .append("line")
        .attr("x1", function (d) {
            return xScale(d["Demographics Response"]) + 10;
        })
        .attr("x2", function (d) {
            return xScale(d["Demographics Response"]) + 10;
        })
        .attr("y1", function (d) {
            return yScale(d.Value);
        })
        .attr("y2", yScale(0))
        .attr("stroke", "grey");
}

function drawLineChart(str, str2) {
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const svg = d3.select(str2)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.csv(str).then(function (data) {

        const subgroups = data.columns.slice(1)
        const groups = data.map(d => d.group)

        const x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickSize(0));

        const y = d3.scaleLinear()
            .domain([0, 60])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        const xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, x.bandwidth()])
            .padding([0.05])

        const color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#FF8AAE', '#5DA8AD'])

        svg.append("g")
            .selectAll("g")
            .data(data)
            .join("g")
            .attr("transform", d => `translate(${x(d.group)}, 0)`)
            .selectAll("rect")
            .data(function (d) {
                return subgroups.map(function (key) {
                    return {key: key, value: d[key]};
                });
            })
            .join("rect")
            .attr("x", d => xSubgroup(d.key))
            .attr("y", d => y(d.value))
            .attr("width", xSubgroup.bandwidth())
            .attr("height", d => height - y(d.value))
            .attr("fill", d => color(d.key));

    })
}

function plotMultipleBarCharts() {
    document.getElementById("my_dataviz").innerHTML = "";
    document.getElementById("my_dataviz2").innerHTML = "";
    document.getElementById("my_dataviz3").innerHTML = "";
    document.getElementById("my_dataviz4").innerHTML = "";
    document.getElementById("my_dataviz5").innerHTML = "";
    drawLineChart("/data/age.csv", "#my_dataviz");
    drawLineChart("/data/education.csv", "#my_dataviz2");
    drawLineChart("/data/employement.csv", "#my_dataviz3");
    drawLineChart("/data/maritalStatus.csv", "#my_dataviz4");
    drawLineChart("/data/residence.csv", "#my_dataviz5");
}

function plotScatterBubblePlot() {
    let margin = {top: 80, right: 30, bottom: 60, left: 100},
        width = 900 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    let svg = d3
        .select("#innovative-viz")
        .append("svg")
        .attr(
            "width",
            width +
            margin.left +
            margin.right
        )
        .attr(
            "height",
            height +
            margin.top +
            margin.bottom
        )
        .append("g")
        .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
        );

    d3.csv("data/innovative_viz_data.csv").then(function (data) {
        console.log(data)
        var x = d3
            .scalePoint()    //use scalePoint to utilize String values
            .domain(data.map(function (d) {
                return d["LOCATION"];
            }))
            .range([0, width]);

        var y = d3.scaleLinear().range([height, 0]);

        var z = d3.scaleLinear()
            .domain([0, 1])
            .range([2, 16]);


        data.forEach(function (d) {
            d["PREVVIOLLIFETIME"] = +d["PREVVIOLLIFETIME"];
            d["LAWDOMVIOL"] = +d["LAWDOMVIOL"];
            d["ATTITUDEVIOL"] = +d["ATTITUDEVIOL"];
        });


        var w = d3.scaleLinear()
            .domain(data.map(function (d) {
                return d["ATTITUDEVIOL"];
            }))
            .range(["#fff7ec", "#fff7eb", "#fff6ea", "#fff6e9", "#fff5e7", "#fff5e6", "#fff4e5", "#fff4e4", "#fff3e3", "#fff3e2", "#fff2e1", "#fff2e0", "#fff1de", "#fff1dd", "#fff0dc", "#fff0db", "#feefda", "#feefd9", "#feeed7", "#feeed6", "#feedd5", "#feedd4", "#feecd3", "#feecd2", "#feebd0", "#feebcf", "#feeace", "#feeacd", "#fee9cc", "#fee9ca", "#fee8c9", "#fee8c8", "#fee7c7", "#fee7c6", "#fee6c4", "#fee5c3", "#fee5c2", "#fee4c1", "#fee4bf", "#fee3be", "#fee3bd", "#fee2bc", "#fee1ba", "#fee1b9", "#fee0b8", "#fee0b7", "#fedfb5", "#fedeb4", "#fedeb3", "#fdddb2", "#fddcb1", "#fddcaf", "#fddbae", "#fddaad", "#fddaac", "#fdd9ab", "#fdd8a9", "#fdd8a8", "#fdd7a7", "#fdd6a6", "#fdd6a5", "#fdd5a4", "#fdd4a3", "#fdd4a1", "#fdd3a0", "#fdd29f", "#fdd29e", "#fdd19d", "#fdd09c", "#fdcf9b", "#fdcf9a", "#fdce99", "#fdcd98", "#fdcc97", "#fdcc96", "#fdcb95", "#fdca94", "#fdc994", "#fdc893", "#fdc892", "#fdc791", "#fdc690", "#fdc58f", "#fdc48e", "#fdc38d", "#fdc28c", "#fdc18b", "#fdc08a", "#fdbf89", "#fdbe88", "#fdbd87", "#fdbc86", "#fdbb85", "#fdba84", "#fdb983", "#fdb882", "#fdb781", "#fdb680", "#fdb57f", "#fdb47d", "#fdb27c", "#fdb17b", "#fdb07a", "#fdaf79", "#fdae78", "#fdac76", "#fdab75", "#fdaa74", "#fca873", "#fca772", "#fca671", "#fca46f", "#fca36e", "#fca26d", "#fca06c", "#fc9f6b", "#fc9e6a", "#fc9c68", "#fc9b67", "#fb9a66", "#fb9865", "#fb9764", "#fb9563", "#fb9462", "#fb9361", "#fb9160", "#fa905f", "#fa8f5e", "#fa8d5d", "#fa8c5c", "#f98b5b", "#f9895a", "#f98859", "#f98759", "#f88558", "#f88457", "#f88356", "#f78155", "#f78055", "#f77f54", "#f67d53", "#f67c52", "#f67b52", "#f57951", "#f57850", "#f4774f", "#f4754f", "#f4744e", "#f3734d", "#f3714c", "#f2704c", "#f26f4b", "#f16d4a", "#f16c49", "#f06b49", "#f06948", "#ef6847", "#ef6646", "#ee6545", "#ed6344", "#ed6243", "#ec6042", "#ec5f42", "#eb5d41", "#ea5c40", "#ea5a3f", "#e9593e", "#e8573c", "#e8563b", "#e7543a", "#e65339", "#e65138", "#e55037", "#e44e36", "#e44c35", "#e34b34", "#e24932", "#e14831", "#e04630", "#e0442f", "#df432e", "#de412d", "#dd402b", "#dc3e2a", "#dc3c29", "#db3b28", "#da3927", "#d93826", "#d83624", "#d73423", "#d63322", "#d53121", "#d43020", "#d32e1f", "#d22c1e", "#d12b1d", "#d0291b", "#cf281a", "#ce2619", "#cd2518", "#cc2317", "#cb2216", "#ca2015", "#c91f14", "#c81d13", "#c71c12", "#c61b11", "#c51911", "#c31810", "#c2170f", "#c1150e", "#c0140d", "#bf130c", "#be120c", "#bc110b", "#bb100a", "#ba0e09", "#b80d09", "#b70c08", "#b60b07", "#b50b07", "#b30a06", "#b20906", "#b10805", "#af0705", "#ae0704", "#ac0604", "#ab0504", "#a90503", "#a80403", "#a60402", "#a50302", "#a40302", "#a20302", "#a00201", "#9f0201", "#9d0201", "#9c0101", "#9a0101", "#990101", "#970101", "#960100", "#940100", "#920000", "#910000", "#8f0000", "#8e0000", "#8c0000", "#8a0000", "#890000", "#870000", "#860000", "#840000", "#820000", "#810000", "#7f0000"]);
        // Scale the range of the data
        y.domain([0, d3.max(data, function (d) {
            return d["PREVVIOLLIFETIME"]
        })]);

        svg.append("g")
            .attr("transform", "translate(-15,0)")
            .call(d3.axisLeft(y))
            .style("stroke-width", "2px")


        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -70)
            .attr("x", 0 - (height / 2))
            .style("font-size", "20px")
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Prevalence of violence");

        data.forEach(function (d) {
            var div = d3.select("#innovative-plot").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            svg.append('g')
                .append("circle")
                .attr("class", "bubbles")
                .attr("cx", x(d["LOCATION"]))
                .attr("cy", y(d["PREVVIOLLIFETIME"]))
                .attr("r", z(d["LAWDOMVIOL"]))
                .style("fill", w(d["ATTITUDEVIOL"]))
                .on('mouseover', function (event) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html("Country: " + d["LOCATION"] + "\n Prevalence of violence: \n" + d["PREVVIOLLIFETIME"] + "/100")
                        .style("left", (event.pageX - 100) + "px")
                        .style("top", (event.pageY - 28) + "px");

                })
                .on('mousemove', function (event, e) {
                    div.html("Country: " + d["LOCATION"] + "\n Prevalence of violence: \n" + d["PREVVIOLLIFETIME"] + "/100")
                        .style("left", (event.pageX - 100) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on('mouseout', function (e) {
                    div.transition()
                        .duration(200)
                        .style("opacity", 0);
                });


        })

        var colorScale = svg.append("defs");

        var linearGradient = colorScale.append("linearGradient")
            .attr("id", "linear-gradient");
        linearGradient
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");

        linearGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#ffa474");

        linearGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#8b0000");


        svg.append("rect")
            .attr("width", 300)
            .attr("height", 20)
            .attr('x', 450)
            .attr('y', -50)
            .style("fill", "url(#linear-gradient)");

        svg.append("text")
            .attr("x", 580)
            .attr("y", -60)
            .style("font-size", "15px")
            .style("text-anchor", "middle")
            .text("Attitude towards violence");
    })
}

function plotSlopeGraph() {
    let margin = {top: 30, right: 30, bottom: 100, left: 50},
        width = 700 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    let svg = d3
        .select("#slope-viz")
        .append("svg")
        .attr(
            "width",
            width +
            margin.left +
            margin.right
        )
        .attr(
            "height",
            height +
            margin.top +
            margin.bottom
        )
        .append("g")
        .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
        );

    d3.csv("data/slope-graph.csv").then(function (data) {
        console.log(data)

        const color = d3.scaleOrdinal()
            .domain(["Attitude_Towards_Violence", "Law_Discrimination_Index", "Prevalence_of_Violence_in_Lifetime"])
            .range(["#F36034", "#5D8F7D", "#E4832D"])

        dimensions = ["Unites States", "India"]

        const y = {}
        for (i in dimensions) {
            name = dimensions[i]
            y[name] = d3.scaleLinear()
                .domain([0, 60]) // --> Same axis range for each group
                // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
                .range([height, 0])
        }

        // Build the X scale -> it find the best position for each Y axis
        x = d3.scalePoint()
            .range([0, width])
            .domain(dimensions);


        // Highlight the specie that is hovered
        const highlight = function (event, d) {

            selected_specie = d.Attribute

            // first every group turns grey
            d3.selectAll(".line")
                .transition().duration(200)
                .style("stroke", "lightgrey")
                .style("opacity", "0.2")
            // Second the hovered specie takes its color
            d3.selectAll("." + selected_specie)
                .transition().duration(200)
                .style("stroke", color(selected_specie))
                .style("opacity", "1")
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("Attribute: " + d["Output"] + "\n")
                .style("left", (event.pageX - 100) + "px")
                .style("top", (event.pageY - 28) + "px");
        }

        // Unhighlight
        const doNotHighlight = function (event, d) {
            d3.selectAll(".line")
                .transition().duration(200).delay(500)
                .style("stroke", function (d) {
                    return (color(d.Attribute))
                })
                .style("opacity", "1")

            div.transition()
                .duration(200)
                .style("opacity", 0);
        }


        function path(d) {
            return d3.line()(dimensions.map
            (function (p) {
                console.log(p)
                console.log(d[p]);
                return [x(p), y[p](d[p])];
            }));
        }

        var div;
        svg
            .selectAll("myPath")
            .data(data)
            .join("path")
            .attr("class", function (d) {
                div = d3.select("#innovative-plot").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);
                return "line " + d.Attribute
            }) // 2 class for each line: 'line' and the group name
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", function (d) {
                return (color(d.Attribute))
            })
            .style("opacity", 1)
            .style("stroke-width", 4)
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight)




        svg.selectAll("myAxis")
            .data(dimensions).enter()
            .append("g")
            .attr("transform", function (d) {
                return "translate(" + x(d) + ")";
            })
            .each(function (d) {
                d3.select(this).call(
                    d3.axisLeft().scale(y[d])).style("stroke-width", "2px");
            })
            // Add axis title
            .append("text")
            .style("text-anchor", "middle")
            .style("font-size", "15px")
            .attr("y", -9)
            .text(function (d) {
                return d;
            })
            .style("fill", "black")


    })
}

//This function gives a typing effect to the header
function type() {

    // document.getElementById("info").innerHTML = "";


    var typed = new Typed('#typed', {
        stringsElement: '#typed-strings',
        typeSpeed: 15,
        fadeOut: true
    });

}

//Functions for scrollytelling
function scroll(n, offset, func1, func2) {
    return new Waypoint({
        element: document.getElementById(n),
        handler: function (direction) {
            direction == 'down' ? func1() : func2();
        },
        //start 75% from the top of the div
        offset: offset
    });
};

//place holder animation
function grid() {
    var position = [50, 100, 150, 200, 250, 300, 350]
    d3.select("#viz")
        .selectAll("mycircles")
        .data(position)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return d + 250
        })
        .attr("cy", 40)
        .attr("r", 10)

    d3.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("cy", 300)
        .delay(function (i) {
            return (i * 10)
        })
}

function grid2() {
    d3.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("cy", 40)
        .delay(function (i) {
            return (i * 10)
        })
}

function placeholderFunctionDown() {

}

function placeholderFunctionUp() {

}
