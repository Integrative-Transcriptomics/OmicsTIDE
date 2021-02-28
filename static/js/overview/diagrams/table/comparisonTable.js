/**
 * 
 * @param {ObjectArray} data 
 */
function isPtcf(data) {

    return ((Object.keys(data).length === 1) &&
        (data[Object.keys(data)[0]]['info']['file_1']['filename'] === data[Object.keys(data)[0]]['info']['file_2']['filename']))
}


/**
 * create an interactive table for the comparison information
 * inspired: http://bl.ocks.org/jonahwilliams/cc2de2eedc3896a3a96d
 * @param {ObjectArray} data 
 * @param {String} tableDiv 
 */
function comparisonTable(data, tableDiv) {

    let transformedObject = [];

    if (isPtcf(data)) {
        transformedObject.push({
            'comparison': 'Comparison1',
            'PTCF': data['Comparison1']['info']['file_1']['filename'],
            'intersecting': 'Analyze!',
            'non-intersecting': 'Analyze!'
        })
    }

    else {
        for (let comparison of Object.keys(data)) {

            transformedObject.push({
                'comparison': comparison,
                'first_dataset': data[comparison]['info']['file_1']['filename'],
                'second_dataset': data[comparison]['info']['file_2']['filename'],
                'intersecting': 'Analyze!',
                'non-intersecting': 'Analyze!'
            })
        }
    }

    let currentWidth = document.getElementById(tableDiv).offsetWidth;
    let currentHeight = document.getElementById(tableDiv).offsetHeight;


    let svgTable = d3.select("#" + tableDiv)
        .append("div")
        // Container class to make it responsive.
        .classed("svg-container", false)
        .append("svg")
        .attr("id", "svgTable_" + tableDiv)
        // Responsive SVG needs these 2 attributes and no width and height attr.
        //.attr("preserveAspectRatio", "xMinYMin meet")
        .attr("preserveAspectRatio", "xMinYMin meet")
        //.attr("preserveAspectRatio", "none")
        .attr("viewBox", "0 0 " + currentWidth + " " + currentHeight)
        // Class to make it responsive.
        .classed("svg-content-responsive", false)
        // Fill with a rectangle for visualization.
        .append("g")

    // let table = d3.select("#" + "svgTable_" + tableDiv)
    //     .append("table")
    //     .attr("class", "table"),
    //     thead = table.append("thead"),
    //     tbody = table.append("tbody");

    // https://stackoverflow.com/questions/39581663/problems-displaying-table-inside-a-shape-in-d3-js
    let table = svgTable
        .append("foreignObject")
        .attr("width", currentWidth)
        .attr("height", currentHeight)
        .append("xhtml:body")
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
            
            let currentData = combineLinkSpecificGlobalData(data);
            let currentDataIntersecting = currentData[d.comparison]['intersecting'];
            let currentDataNonIntersecting = currentData[d.comparison]['nonIntersecting'];

            removePreview("matrix-information-preview-content")
                .then(setPreview("matrix-information-preview-content", "matrix-information-preview-content-wrapper"))
                //.then(render(combineLinkSpecificGlobalData(data), "matrix-information-preview-content-intersecting-content-sankey", TabId.matrix, d.comparison + "_intersecting"))
                .then(render(currentDataIntersecting, "matrix-information-preview-content-intersecting-content-sankey", TabId.matrix, d.comparison + "_intersecting"))
                .then(
                    detailDiagramsPerCluster(
                        DiagramId.centroid,
                        //data[d.comparison]['intersecting'],
                        currentDataIntersecting,
                        "matrix-information-preview-content-intersecting-content-left",
                        "matrix-information-preview-content-intersecting-content-right",
                        d.comparison + "_intersecting",
                        TabId.intersecting)
                )
                .then(
                    detailDiagramsPerCluster(
                        DiagramId.centroid,
                        //data[d.comparison]['nonIntersecting'],
                        currentDataNonIntersecting,
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
        .attr("class", function (d) { return "tablecells " + d.i + "_" + d.value.split(".")[0] })
        .html(function (d) {
            return d.value;
        })
        .on("mouseover", function (d) {
            if (d.i === "intersecting" || d.i === "non-intersecting") {
                d3.select(this)
                    .style("cursor", "pointer")
                    .transition()
                    .duration(100)
                    .style("background-color", "red");

                if (d.i === "intersecting") {
                    $("#matrix-information-preview-content-intersecting-content").css('border-color', "red").fadeIn(100)
                    $("#matrix-information-preview-content-nonIntersecting-content").css('border-color', "transparent").fadeIn(100)

                }

                else {
                    $("#matrix-information-preview-content-nonIntersecting-content").css('border-color', "red").fadeIn(100)
                    $("#matrix-information-preview-content-intersecting-content").css('border-color', "transparent").fadeIn(100)
                }


            }
        })
        .on("mouseout", function (d) {

            if (d.i === "intersecting" || d.i === "non-intersecting") {
                d3.select(this)
                    .style("cursor", "default")
                    .transition()
                    .duration(100)
                    .style("background-color", "transparent");

                if (d.i === "intersecting") {
                    $("#matrix-information-preview-content-intersecting-content").css('border-color', "transparent").fadeIn(100)
                }

                else {
                    $("#matrix-information-preview-content-nonIntersecting-content").css('border-color', "transparent").fadeIn(100)
                }
            }
        })
        .on("click", function (d) {


            if (d.i === "intersecting") {

                let comparison = $(this).siblings()[0].innerHTML;

                let currentData = createDeepCopyofData(document.getElementById("data-json").value)[comparison][TabId.intersecting];

                addComparisonToChosenGlobalData(comparison, TabId.intersecting, currentData);

                addTab(comparison, true, TabId.intersecting);
            }

            if (d.i === "non-intersecting") {

                let comparison = $(this).siblings()[0].innerHTML;

                let currentData = createDeepCopyofData(document.getElementById("data-json").value)[comparison][TabId.nonIntersecting];

                addComparisonToChosenGlobalData(comparison, TabId.nonIntersecting, currentData);

                addTab(comparison, true, TabId.nonIntersecting);

            }

        })
        ;

}



/**
 * highlights selected bars
 * @param {Array} hovered 
 */
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


