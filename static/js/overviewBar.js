// parse globalData to as javascript object

function barChartFromGlobalDataInfo(data) {

    let barChartData = [];

    for (let comparison of Object.keys(data).reverse()) {

        barChartData.push({
            'comparison': comparison,
            'i_concordant': data[comparison]['info']['barChart']['absolute']['concordant_count'],
            'i_discordant': data[comparison]['info']['barChart']['absolute']['discordant_count'],
            'ni_firstOnly': data[comparison]['info']['barChart']['absolute']['first_non_intersecting_genes_count'],
            'ni_secondOnly': data[comparison]['info']['barChart']['absolute']['second_non_intersecting_genes_count'],
            'file_1': data[comparison]['info']['file_1']['filename'],
            'file_2': data[comparison]['info']['file_2']['filename'],
        })
    }

    return barChartData
}

function extractInputParameters(data, datasetDiv, varianceDiv, kDiv) {

    let datasetElement = document.getElementById(datasetDiv);
    let varianceElement = document.getElementById(varianceDiv);
    let kElement = document.getElementById(kDiv);


    let k = data.Comparison1.k;
    let lower = data.Comparison1.lower_variance_percentile;
    let upper = data.Comparison1.upper_variance_percentile;
    let files = [];

    for (let comparison of Object.keys(data)) {
        files.push(data[comparison]['info']['file_1']['filename'])
        files.push(data[comparison]['info']['file_2']['filename'])
    }

    files = [... new Set(files)];

    for (let dataset of files) {
        datasetElement.appendChild(document.createTextNode(dataset))
        datasetElement.appendChild(document.createElement("br"))
        datasetElement.appendChild(document.createElement("br"))
        datasetElement.appendChild(document.createElement("br"))
    }

    if(lower === undefined || upper === undefined){
        varianceElement.appendChild(document.createTextNode("not determined for PTCF"))
    }

    else{
        varianceElement.appendChild(document.createTextNode(lower + "-" + upper + "%"))
    }
    

    kElement.appendChild(document.createTextNode(k))

}

function initButton(id, buttonName, functionCall) {
    let button = document.createElement("BUTTON");
    button.innerHTML = buttonName;

    let parent = document.getElementById(this);


}


function isPtcf(data){

    return ( (Object.keys(data).length === 1) && 
    (data[Object.keys(data)[0]]['info']['file_1']['filename'] === data[Object.keys(data)[0]]['info']['file_2']['filename']) )
}


function comparisonTable(data, tableDiv) {

    console.log(data);

    // http://bl.ocks.org/jonahwilliams/cc2de2eedc3896a3a96d

    // overview-table-comparisons-content

    let transformedObject = [];

    if(isPtcf(data)){
        transformedObject.push({
            'comparison': 'Comparison1',
            'PTCF': data['Comparison1']['info']['file_1']['filename'],
            'intersecting': 'Analyze!',
            'non-intersecting' : 'Analyze!'
        })
    }

    else{
        for (let comparison of Object.keys(data)) {

            transformedObject.push({
                'comparison': comparison,
                'first_dataset': data[comparison]['info']['file_1']['filename'],
                'second_dataset': data[comparison]['info']['file_2']['filename'],
                'intersecting': 'Analyze!',
                'non-intersecting' : 'Analyze!'
            })
        }
    }
    

    let table = d3.select("#" + tableDiv)
        .append("table")
        .attr("class", "table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    let columns = Object.keys(transformedObject[0]);

    let header = thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function (d) { return d; })

    var rows = tbody.selectAll("tr")
        .data(transformedObject)
        .enter()
        .append("tr")
        .on("mouseover", function (d) {
            d3.select(this)
            .transition()
            .duration(100)
                .style("background-color", "lightgrey");

            linkTableWithBars(d);



            removePreview("matrix-information-preview-content")
                .then(setPreview("matrix-information-preview-content", "matrix-information-preview-content-wrapper"))
                .then(render(combineLinkSpecificGlobalData(data), "matrix-information-preview-content-intersecting-content-sankey", TabId.matrix, d.comparison + "_intersecting"))
                .then(
                    detailDiagramsPerCluster(
                        DiagramId.centroid,
                        data[d.comparison]['intersecting'],
                        "matrix-information-preview-content-intersecting-content-left",
                        "matrix-information-preview-content-intersecting-content-right",
                        d.comparison + "_intersecting",
                        TabId.intersecting)
                )
                .then(
                    detailDiagramsPerCluster(
                        DiagramId.centroid,
                        data[d.comparison]['nonIntersecting'],
                        "matrix-information-preview-content-nonIntersecting-content-left",
                        "matrix-information-preview-content-nonIntersecting-content-right",
                        d.comparison + "_nonIntersecting",
                        TabId.nonIntersecting)
                );

            // set preview

            //render(combineLinkSpecificGlobalData(data), "matrix-information-preview", TabId.matrix, d.comparison + "_intersecting");
        })
        .on("mouseout", function (d) {
            d3.select(this)
            .transition()
            .duration(100)
                .style("background-color", "transparent");

            unHighlightFiles();

            removePreview("matrix-information-preview-content")
                .then(setPreview("matrix-information-preview-content", "matrix-information-preview-content-text"));
        });

    var cells = rows.selectAll("td")
        .data(function (row) {
            return columns.map(function (d, i) {
                return { i: d, value: row[d] };
            });
        })
        .enter()
        .append("td")
        .attr("class", function(d){return "tablecells " + d.i + "_" + d.value.split(".")[0]})
        .html(function (d) { 
            return d.value; })
        .on("mouseover", function(d){
            if(d.i === "intersecting" || d.i === "non-intersecting"){
                d3.select(this)
                .style("cursor", "pointer")         
                .transition()
                .duration(100)
                .style("background-color", "red");  

                if(d.i === "intersecting"){
                    $("#matrix-information-preview-content-intersecting-content").css('border-color', "red").fadeIn(100)
                    $("#matrix-information-preview-content-nonIntersecting-content").css('border-color', "transparent").fadeIn(100)
                    
                }

                else{
                    $("#matrix-information-preview-content-nonIntersecting-content").css('border-color', "red").fadeIn(100)
                    $("#matrix-information-preview-content-intersecting-content").css('border-color', "transparent").fadeIn(100)
                }
                
                
            }
        })
        .on("mouseout", function(d){

            if(d.i === "intersecting" || d.i === "non-intersecting"){
                d3.select(this)
                .style("cursor", "default")         
                .transition()
                .duration(100)
                .style("background-color", "transparent");  

                if(d.i === "intersecting"){
                    $("#matrix-information-preview-content-intersecting-content").css('border-color', "transparent").fadeIn(100)
                }

                else{
                    $("#matrix-information-preview-content-nonIntersecting-content").css('border-color', "transparent").fadeIn(100)
                }
            }
        })
        .on("click", function(d){

            if(d.i === "intersecting"){

                let comparison= $(this).siblings()[0].innerHTML;
                addTab(comparison , true, TabId.intersecting);

            }

            if(d.i === "non-intersecting"){

                let comparison = $(this).siblings()[0].innerHTML;
                addTab(comparison, true, TabId.nonIntersecting);

            }

        })
        ;

}


async function removePreview(parentDivId){

    let parentDiv = document.getElementById(parentDivId);
    while (parentDiv.firstChild) {
        parentDiv.firstChild.remove();
    } 
}

async function setPreview(parentDivId, previewDivId){
    
    //let parentDiv = document.getElementById(parentDivId);
    let previewDiv = document.getElementById(previewDivId).cloneNode(true);

    if(previewDivId === "matrix-information-preview-content-text"){
        previewDiv.style.display = "block";
    }

    else{
        previewDiv.style.display = "flex";
    }
    

    //parentDiv.appendChild(previewDiv);

    $("#" + parentDivId).append(previewDiv).fadeIn(500);
}




function linkTableWithBars(hovered) {

    let bars = Array.prototype.slice.call(document.getElementsByClassName("bars"));

    for (let bar of bars) {
        if (!bar.classList.contains(hovered.comparison)) {
            d3.select("#" + bar.id)
                .transition()
                .duration(100)
                .style("opacity", 0.1)

            //bar.style.opacity = 0.3;
        }
    }
}




// start implementing here:

// mainly inspired by: https://bl.ocks.org/ricardo-marino/ca2db3457f82dbb10a8753ecba8c0029

function comparisonOverview(globalDataCopy) {

    //let globalDataCopy = JSON.parse(JSON.stringify(flaskGlobalData));
    
    let barChartData = barChartFromGlobalDataInfo(globalDataCopy);
    
    let copyBarChartData = JSON.parse(JSON.stringify(barChartData));

    // extract input information
    extractInputParameters(globalDataCopy,
        "overview-analysis-dataset-content",
        "overview-analysis-variance-content",
        "overview-analysis-k-content");

    comparisonTable(globalDataCopy, "overview-table-comparisons-content");

    // percentages as numbers
    let input = { 'data': copyBarChartData, 'globalDataCopy': globalDataCopy, 'width': 100, 'height': 80 };
    let canvas = setUpSvgCanvas(input, "matrix-information");

    drawBars(input, canvas);

    // update preview
    removePreview("matrix-information-preview-content")
        .then(setPreview("matrix-information-preview-content", "matrix-information-preview-content-text"));

}


function drawBars(input, canvas) {

    let params = { 'input': input, 'canvas': canvas };
    initialize(params);
    update(params);

}


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

    // initialize bars
    // let bar = params.bar = svg.selectAll('.bar')
    //     .data(blockData)
    //     .enter().append('g')
    //     .attr('class', 'bar');

    // bar.append('rect')
    //     // .attr('x', function(d) { return x(d.x);})
    //     // .attr('y', function(d) {return y(0);})
    //     // .attr('width', x.bandwidth())
    //     // .attr('height', 0)
    //     .attr('x', function (d) { return x(0); })
    //     .attr('y', function (d) { return y(d.x); })
    //     .attr('width', 0)
    //     .attr('height', y.bandwidth())
    //     .attr('fill', function (d) { return color(d.cluster); });

    // heights is a dictionary to store bar height by cluster
    // this hierarchy is important for animation purposes
    // each bar above the chosen bar must collapse to the top of the
    // selected bar, this function defines this top
    // params.heights = setUpHeights(clusterNames, blockData);

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
        .attr('transform', 'translate(' + document.getElementById("matrix-information-controls").offsetWidth/4 + ',' + 0 + ')');

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
        // .on('mouseover', function (d) { d3.select(this).style("cursor", "pointer") })
        // .on('mouseout', function (d) { d3.select(this).style("cursor", "default") })
        // .on('click', function (d) {

        //     if (chosen.cluster.includes(d)) {
        //         let index = chosen.cluster.indexOf(d);
        //         if (index !== -1) {
        //             chosen.cluster.splice(index, 1);
        //         }

        //         d3.select(this)
        //             .attr('fill', color(d));
        //     }

        //     else {

        //         chosen.cluster.push(d);

        //         d3.select(this)
        //             .attr('fill', 'transparent');
        //     }

        //     update(params);
        // });



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

    // legend
    //    .append("text")
    //    .filter(function(d) { 
    //         console.log(d);
    //         return !categories.includes(d)})
    //         .attr("x", 35)
    //             .attr("y", function(d,i){ return 100 + i*25})
    //             .style("fill", "black")
    //             .text(function(d){ return d})
    //             .attr("text-anchor", "left")
    //             .style("alignment-baseline", "middle")






    //let color = setUpColors().domain(clusterNames);

    //initialize legend
    // let legend = params.legend = svg.selectAll('.legend')
    //     .data(clusterNames)
    //     .enter().append('g')
    //     .attr('class', 'legend');

    // legend.append('rect')
    //     .attr('x', width + margin.right + 35)
    //     .attr('y', function (d, i) { return 20 * (clusterNames.length - 1 - i); })
    //     .attr('height', 18)
    //     .attr('width', 18)
    //     .attr('stroke', function (d) { return color(d); })
    //     .classed('selected', true)
    //     .attr('fill', function (d) { return color(d); })
    //     .on('mouseover', function (d) { d3.select(this).style("cursor", "pointer") })
    //     .on('mouseout', function (d) { d3.select(this).style("cursor", "default") })
    //     .on('click', function (d) {

    //         if (chosen.cluster.includes(d)) {
    //             let index = chosen.cluster.indexOf(d);
    //             if (index !== -1) {
    //                 chosen.cluster.splice(index, 1);
    //             }

    //             d3.select(this)
    //                 .attr('fill', color(d));
    //         }

    //         else {
    //             chosen.cluster.push(d);

    //             d3.select(this)
    //                 .attr('fill', 'transparent');
    //         }

    //         update(params);
    //     });

    // legend.append('text')
    //     .attr('x', width + margin.right + 28)
    //     .attr('y', function (d, i) { return 20 * (clusterNames.length - 1 - i); })
    //     .text(function (d) { return d; })
    //     .attr('dy', '.95em')
    //     .style('text-anchor', 'end');

    // // initialize checkbox options
    d3.select("#myCheckbox").on("change", function () { update(params); });

    //params.view = false;
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
    //params.view = newView;


    // update X Axis (always use max of blockData

    x.domain([0, d3.max(blockData, function (d) { return d.y1; })]);

    if (newView) {
        //y.domain([0, 1]);
        x.domain([0, 1]);
    }

    // let axisY = d3.axisLeft(y)
    //     .tickSize(-width);

    let axisX = d3.axisBottom(x)
    //.tickSize(-width);

    if (newView) {
        axisX.tickFormat(d3.format(".0%"));
    }

    // svg.selectAll('.axisY')
    //     .transition()
    //     .duration(transDuration)
    //     .call(axisY);

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
        .on('mouseover', function (d) {

            highlightFiles(d);
        })
        .on('mouseout', function (d) {

            unHighlightFiles()
        })
        .transition()
        .duration(transDuration)
        //.attr('y', function(d) {
        .attr('x', function (d) {
            return x(d.y0);
        })
        //.attr('height', function(d) { 
        .attr('width', function (d) {
            return x(d.height);
        })
        .attr('y', function (d) { return y(d.x); })
        .attr('stroke', 'white')
        .attr('height', y.bandwidth())
        .attr('fill', function (d) { return color(d.cluster); })



    // let intersectingButton = svg.selectAll(".intersectingButton")
    //     .data(blockData, function (d) { return d.key })

    // intersectingButton
    //     .enter()
    //     .append("rect")
    //     .attr("class", "intersectingButton")
    //     .merge(intersectingButton)
    //     .attr('x', width + 20)
    //     .attr('width', 20)
    //     .attr('y', function (d) {
    //         return y(d.x) + y.bandwidth() / 2
    //     })
    //     .attr('height', y.bandwidth() / 3)
    //     .attr('fill', 'red')
    //     .on('click', function (d) {

    //         //addTab(globalDataCopy, d.x, true, TabId.intersecting);
    //         addTab(d.x, true, TabId.intersecting);
    //         //return alert("intersecting! " + d.x) 
    //     })
    //     .on('mouseover', function (d) { d3.select(this).style("cursor", "pointer") })
    //     .on('mouseout', function (d) { d3.select(this).style("cursor", "default") })



    // let nonIntersectingButton = svg.selectAll(".nonIntersectingButton")
    //     .data(blockData, function (d) { return d.key });

    // nonIntersectingButton
    //     .enter()
    //     .append("rect")
    //     .attr("class", "nonIntersectingButton")
    //     .merge(nonIntersectingButton)
    //     .attr('x', width + 100)
    //     .attr('width', 20)
    //     .attr('y', function (d) {
    //         return y(d.x) + y.bandwidth() / 2
    //     })
    //     .attr('height', y.bandwidth() / 3)
    //     .attr('fill', 'blue')
    //     .on('click', function (d) {
    //         //addTab(globalDataCopy, d.x, true, TabId.nonIntersecting)
    //         addTab(d.x, true, TabId.nonIntersecting)
    //     })
    //     .on('mouseover', function (d) { d3.select(this).style("cursor", "pointer") })
    //     .on('mouseout', function (d) { d3.select(this).style("cursor", "default") })

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

// custom function to provide correct animation effect
// bars should fade into the top of the remaining bar
function myHeight(chosen, d, clusterNames, binNames, x, heights) {

    // if (chosen.cluster == null) {
    //     return 0;
    // }

    // case deselected clusters are empty
    if (chosen.cluster.length === 0) {
        return 0;
    }


    if (clusterNames.indexOf(chosen.cluster) > clusterNames.indexOf(d.cluster)) {
        return x(0);
    }


    else {
        return x(heights[chosen.cluster][binNames.indexOf(d.x)]);
    }
}


// handy function to play the update game with the bars and legend
function choice(variable, target, nullCase, targetCase, notTargetCase) {

    if (variable.length === 0) {
        return nullCase;
    }

    else if (variable.includes(target)) {
        return targetCase;
    }

    else {
        return notTargetCase;
    }
}


function initializeScales(width, height) {
    // let x = d3.scaleBand()
    // .rangeRound([0, width])
    // .padding(0.5);

    // let y = d3.scaleLinear()
    //     .range([height, 0]);

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

    // let svg = d3.select('#' + div)
    //     .append('svg')
    //     .attr('width', width + margin.left + margin.right)
    //     .attr('height', height + margin.top + margin.bottom)
    //     .append('g')
    //     .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

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


// formatting Data to a more d3-friendly
// extracting binNames and clusterNames
function formatData(data) {


    let clusterNames = d3.keys(data[0]).filter(function (key) { return (key !== 'comparison' && key !== 'file_1' && key !== 'file_2'); });
    let binNames = [];

    let blockData = [];


    for (let i = 0; i < data.length; i++) {
        let y = 0;
        binNames.push(data[i].comparison);
        for (let j = 0; j < clusterNames.length; j++) {

            let height = data[i][clusterNames[j]];
            let y0 = y;
            let y1 = y + height;
            let x = data[i].comparison;
            let cluster = clusterNames[j];
            let key = data[i].comparison + "_" + clusterNames[j];


            let block = {};

            block['y0'] = y0;
            block['y1'] = y1;
            block['height'] = height;
            block['x'] = x;
            block['cluster'] = cluster;
            block['key'] = key;
            block['file_1'] = data[i]['file_1'];
            block['file_2'] = data[i]['file_2'];

            y += data[i][clusterNames[j]];
            blockData.push(block);
        }
    }
    return {
        blockData: blockData,
        binNames: binNames,
        clusterNames: clusterNames
    };

}



// $(document).on('click', '.non-intersecting-wrapper', function(event) {

//     // get clicked div id
//     var currentDiv = jQuery(this).attr("id");

//     // get comparison id
//     var clickedComparison = currentDiv.split("_")[1] + "_" + 
//     currentDiv.split("_")[2] + "_" + 
//     currentDiv.split("_")[3] + "_" + 
//     currentDiv.split("_")[4];

//     clickedComparison = clickedComparison.split("-")[0];

//     addTab(clickedComparison, true, TabId.nonIntersecting);
// });


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

                if(current === "ni_firstOnly"){
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

                if(current === "ni_secondOnly"){
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