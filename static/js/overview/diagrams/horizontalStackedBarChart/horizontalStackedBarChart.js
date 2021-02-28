/**
 * 
 * @param {Object} input 
 * @param {Object} canvas 
 */
function drawBars(input, canvas) {

    let params = { 'input': input, 'canvas': canvas };
    initialize(params);
    update(params);

}


/**
 * 
 * @param {Object} params 
 */
function initialize(params) {

    // unpacking params
    let canvas = params.canvas,
        input = params.input;

    // unpacking canvas
    let svg = canvas.svg,
        margin = canvas.margin,
        width = params.width = canvas.width,
        height = params.height = canvas.height;

    // processing Data and extracting binNames and clusterNames
    let formattedData = formatData(input.data),
        inputData = params.inputData = input.data,
        globalDataCopy = params.globalDataCopy = input.globalDataCopy,
        blockData = params.blockData = formattedData.blockData,
        binNames = params.binNames = formattedData.binNames,
        clusterNames = params.clusterNames = formattedData.clusterNames;

    // initialize color
    //let color = setUpColors().domain(clusterNames);

    // initialize scales and axis
    let scales = initializeScales(width, height),
        x = params.x = scales.x,
        y = params.y = scales.y;

    y.domain(binNames);
    x.domain([0, d3.max(blockData, function (d) { return d.y1; })]);

    initializeAxis(svg, x, y, height, width);

    // // defining max of each bin to convert later to percentage
    params.maxPerBin = setUpMax(clusterNames, blockData);


    // variable to store chosen cluster when bar is clicked
    let chosen = params.chosen = {
        cluster: []
    };

    let color = setUpColors();

    let labels = ["Genes following concordant trend in both datasets (intersecting)",
        "Genes following discordant trend in both datasets (intersecting)",
        "Genes only in one of the two datasets (non-intersecting)"];

    function legendColor() {
        return d3.scaleOrdinal()
            .domain(labels)
            .range(["#b4a7d6", "#ffd966", "#666666"]);
    }

    col = legendColor();

    let legendSvg = d3.select("#matrix-information-controls")
        .append("div")
        // Container class to make it responsive.
        .classed("svg-container", false)
        .append("svg")
        // Responsive SVG needs these 2 attributes and no width and height attr.
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + document.getElementById("matrix-information-controls").offsetWidth + " " + document.getElementById("matrix-information-controls").offsetHeight)
        // Class to make it responsive.
        .classed("svg-content-responsive", false)
        // Fill with a rectangle for visualization.
        .attr("id", "svg_legend")
        .append('g')
        .attr('transform', 'translate(' + document.getElementById("matrix-information-controls").offsetWidth / 4 + ',' + 0 + ')');

    let legend = legendSvg.selectAll(".shapes")
        .data(labels)
        .enter();

    legend
        .append("rect")
        //.filter(function(d) {return !categories.includes(d)})
        .attr("width", 18)
        .attr("height", 18)
        .attr("x", 10)
        .attr("y", function (d, i) {
            return i * 25
        })
        .style("fill", function (d) {
            return col(d)
        })

    legend
        .append("text")
        //.filter(function(d) {return !categories.includes(d)})
        .attr("x", 38)
        .attr("y", function (d, i) {
            return (i * 25) + 13
        })
        .style("fill", "black")
        .text(function (d) { return d })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

    // // initialize checkbox options
    d3.select("#myCheckbox").on("change", function () { update(params); });
}

function update(params) {

    // retrieving params to avoid putting params.x everywhere
    let svg = params.canvas.svg,
        margin = params.canvas.margin,
        y = params.y,
        x = params.x,
        blockData = params.blockData,
        inputData = params.inputData,
        heights = params.heights,
        chosen = params.chosen,
        width = params.width,
        globalDataCopy = params.globalDataCopy,
        height = params.height,
        bar = params.bar,
        clusterNames = params.clusterNames,
        binNames = params.binNames,
        //legend = params.legend,
        maxPerBin = params.maxPerBin,
        view = params.view;

    let transDuration = 100;

    // re-scaling data if view is changed to percentage
    // and re-scaling back if normal view is selected
    let newView = d3.select("#myCheckbox").property("checked");

    let newData = [];

    for (let comparison of inputData) {
        let tmpObject = {};
        for (let cluster of Object.keys(comparison)) {
            if (!chosen.cluster.includes(cluster)) {
                tmpObject[cluster] = comparison[cluster];
            }
        }
        newData.push(tmpObject);
    }

    blockData = formatData(newData).blockData;

    clusterNames = blockData.map(function (d) { return d.cluster })

    if (newView) {

        //heights = setUpHeights(clusterNames, blockData);

        //if (view != newView) {
        blockData.forEach(function (d) {
            d.y0 /= maxPerBin[d.x];
            d.y1 /= maxPerBin[d.x];
            d.height /= maxPerBin[d.x];

        });
        heights = setUpHeights(clusterNames, blockData);
        //}
    }

    else {

        heights = setUpHeights(clusterNames, blockData);
        //}
    }


    x.domain([0, d3.max(blockData, function (d) { return d.y1; })]);

    if (newView) {
        //y.domain([0, 1]);
        x.domain([0, 1]);
    }

    let axisX = d3.axisBottom(x)

    if (newView) {
        axisX.tickFormat(d3.format(".0%"));
    }

    svg.selectAll('.axisX')
        .transition()
        .duration(transDuration)
        .call(axisX);

    let color = setUpColors()

    let maxValue = d3.max(blockData, function (d) { return d.y1; })

    let tooltip = d3.select("#matrix-information")
        .append("div")
        .attr("id", "mytooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("test");


    let bars = svg.selectAll(".bars")
        .data(blockData, function (d) { return d.key });

    bars
        .exit()
        .remove();

    // update bars
    bars
        .enter()
        .append("rect")
        .attr("class", function (d) {
            return "bars " + d.key.split("_")[0] + " " + d.key.split("_")[2]
        })
        .attr("id", function (d) {
            return d.key;
        })
        .merge(bars)
        .transition()
        .duration(transDuration)
        .attr('x', function (d) {
            return x(d.y0);
        })
        .attr('width', function (d) {
            return x(d.height);
        })
        .attr('y', function (d) { return y(d.x); })
        .attr('stroke', 'white')
        .attr('height', y.bandwidth())
        .attr('fill', function (d) { return color(d.cluster); })
}


// heights is a dictionary to store bar height by cluster
// this hierarchy is important for animation purposes 
function setUpHeights(clusterNames, blockData) {

    let heights = {};
    clusterNames.forEach(function (cluster) {
        let clusterVec = [];
        blockData.filter(function (d) {
            return d.cluster == cluster;
        }).forEach(function (d) {
            clusterVec.push(d.height);
        });
        heights[cluster] = clusterVec;
    });
    return heights;
}

// getting the max value of each bin, to convert back and forth to percentage
function setUpMax(clusterNames, blockData) {
    let lastClusterElements = blockData.filter(function (d) { return d.cluster == clusterNames[clusterNames.length - 1] })
    let maxDict = {};
    lastClusterElements.forEach(function (d) {
        maxDict[d.x] = d.y1;
    });
    return maxDict;
}

// // custom function to provide correct animation effect
// // bars should fade into the top of the remaining bar
// function myHeight(chosen, d, clusterNames, binNames, x, heights) {


//     // case deselected clusters are empty
//     if (chosen.cluster.length === 0) {
//         return 0;
//     }


//     if (clusterNames.indexOf(chosen.cluster) > clusterNames.indexOf(d.cluster)) {
//         return x(0);
//     }


//     else {
//         return x(heights[chosen.cluster][binNames.indexOf(d.x)]);
//     }
// }


// // handy function to play the update game with the bars and legend
// function choice(variable, target, nullCase, targetCase, notTargetCase) {

//     if (variable.length === 0) {
//         return nullCase;
//     }

//     else if (variable.includes(target)) {
//         return targetCase;
//     }

//     else {
//         return notTargetCase;
//     }
// }


function initializeScales(width, height) {

    let y = d3.scaleBand()
        .rangeRound([height, 0])
        .padding(0.5);

    let x = d3.scaleLinear()
        .range([0, width]);

    return {
        x: x,
        y: y
    };
}


function initializeAxis(svg, x, y, height, width) {
    let yAxis = d3.axisLeft(y)
    //.tickSize(-width);

    svg.append('g')
        .attr('class', 'axisY')
        .call(yAxis);

    svg.append('g')
        .attr('class', 'axisX')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));
}


function setUpSvgCanvas(input, div) {

    let parentDiv = document.getElementById(div);

    // Set up the svg canvas
    let margin = { top: 20, right: 50, bottom: 5, left: 120 },
        width = (input.width * (parentDiv.offsetWidth / 100)) - margin.left - margin.right,
        height = (input.height * (parentDiv.offsetHeight / 100)) - margin.top - margin.bottom;

    let svg = d3.select("#" + div)
        .append("div")
        // Container class to make it responsive.
        .classed("svg-container", false)
        .append("svg")
        // Responsive SVG needs these 2 attributes and no width and height attr.
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + parentDiv.offsetWidth + " " + parentDiv.offsetHeight)
        // Class to make it responsive.
        .classed("svg-content-responsive", false)
        // Fill with a rectangle for visualization.
        .attr("id", "svg_example")
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    return {
        svg: svg,
        margin: margin,
        width: width,
        height: height
    };
}


function setUpColors() {
    return d3.scaleOrdinal()
        .domain(['i_concordant', 'i_discordant', 'ni_firstOnly', 'ni_secondOnly'])
        .range(["#b4a7d6", "#ffd966", "#666666", "#666666"]);
}


/**
 * highlights cells in the table corresponding to hovered first-level-non-intersecting bar chart
 * @param {String} rect 
 */
function highlightFiles(rect) {

    let currentFile1 = rect.file_1;
    let currentFile2 = rect.file_2;

    let bars = Array.prototype.slice.call(document.getElementsByClassName("bars"));

    if (rect.cluster === "ni_firstOnly") {

        for (let bar of bars) {


            if ((bar.__data__.file_1 !== currentFile1) || (bar.id.split("_")[2] !== "firstOnly")) {

                d3.select("#" + bar.id)
                    .transition()
                    .duration(100)
                    .style("opacity", 0.1)

                // bar.style.opacity = 0.3;

                let current = bar.__data__.cluster;

                console.log(current)

                if (current === "ni_firstOnly") {
                    console.log(".first_dataset" + "_" + currentFile1.split(".")[0])
                    d3.selectAll(".first_dataset" + "_" + currentFile1.split(".")[0])
                        .transition()
                        .duration(100)
                        .style("background-color", "lightgrey");
                }
            }
        }
    }

    if (rect.cluster === "ni_secondOnly") {

        for (let bar of bars) {

            if ((bar.__data__.file_2 !== currentFile2) || (bar.id.split("_")[2] !== "secondOnly")) {
                //bar.style.opacity = 0.3;

                d3.select("#" + bar.id)
                    .transition()
                    .duration(100)
                    .style("opacity", 0.1)


                let current = bar.__data__.cluster;

                if (current === "ni_secondOnly") {
                    console.log(".second_dataset" + "_" + currentFile2.split(".")[0])
                    d3.selectAll(".second_dataset" + "_" + currentFile2.split(".")[0])
                        .transition()
                        .duration(100)
                        .style("background-color", "lightgrey");
                }
            }
        }
    }
}


/**
 * unhighlightes connected table cells when hovering the single stacks in the bar chart
 */
function unHighlightFiles() {

    let bars = Array.prototype.slice.call(document.getElementsByClassName("bars"));

    for (let bar of bars) {
        d3.select("#" + bar.id)
            .transition()
            .duration(100)
            .style("opacity", 1)
        //bar.style.opacity = 1;
    }

    d3.selectAll(".tablecells")
        .transition()
        .duration(100)
        .style("background-color", "transparent");
}
