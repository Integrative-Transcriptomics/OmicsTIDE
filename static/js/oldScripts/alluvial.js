// implementation based on: https://observablehq.com/@d3/parallel-sets, https://bl.ocks.org/micahstubbs/3c0cb0c0de021e0d9653032784c035e9

// set the dimensions and margins of the graph
var sankey_margin = {top: 10, right: 10, bottom: 10, left: 10};

var sankey_width = document.getElementById("my_dataviz_wrapper").offsetWidth - sankey_margin.left - sankey_margin.right;
var sankey_height = document.getElementById("my_dataviz_wrapper").offsetHeight - sankey_margin.top - sankey_margin.bottom;

var node_width = 20;

sankey = d3.sankey()
    .nodeSort(null)
    .linkSort(null)
    .nodeWidth(node_width)
    .nodePadding(10)
    .extent([[0, 5], [sankey_width, sankey_height - 5]]);


// TODO: automatically assign color
var color = d3.scaleOrdinal()
    .domain(["exp1_1", "exp1_2", "exp1_3", "exp1_4", "exp1_5", "exp1_6", "exp2_1", "exp2_2", "exp2_3","exp2_4", "exp2_5", "exp2_6"])
    .range(["#9bbdd9", "#9cc2a6", "#d1b2db", "#f7ce74", "#cf9b42", "#7371f5", "#9bbdd9", "#9cc2a6", "#d1b2db", "#f7ce74", "#cf9b42", "#7371f5"]);

/**
 * creates nodes and links for the Alluvial diagram based on the input data
 * @param {Array} keys array of nodes
 * @param {Object} data initial data
 * @returns {{nodes: [], links: []}} calculated width and positions of nodes and links
 */
function graph(keys, data) {

    this.keys = keys;
    index = -1;
    nodes = [];
    nodeByKey = new Map;
    indexByKey = new Map;
    links = [];

    for (const k of keys) {
        for (const d of data) {
            const key = JSON.stringify([k, d[k]]);
            if (nodeByKey.has(key)) continue;
            const node = {name: d[k]};
            nodes.push(node);
            nodeByKey.set(key, node);
            indexByKey.set(key, ++index);
        }
    }

    for (let i = 1; i < keys.length; ++i) {
        const a = keys[i - 1];
        const b = keys[i];
        const prefix = keys.slice(0, i + 1);
        const linkByKey = new Map;
        for (const d of data) {
            const names = prefix.map(k => d[k]);
            const key = JSON.stringify(names);
            const value = +d.value || 1;
            let link = linkByKey.get(key);
            if (link) {
                link.value += value;
                continue;
            }

            link = {
                source: indexByKey.get(JSON.stringify([a, d[a]])),
                target: indexByKey.get(JSON.stringify([b, d[b]])),
                names,
                value
            };

            links.push(link);
            linkByKey.set(key, link);

        }
    }

    return {nodes, links};
}

/**
 * renders chart from node/link information and data
 * @param graph nodes and linkes
 * @param data initial data
 */
function chart(graph, data) {

    var sankey_margin = {top: 0, right: 0, bottom: 10, left: 10};

    var sankey_width = document.getElementById("my_dataviz_wrapper").offsetWidth - sankey_margin.left - sankey_margin.right;
    var sankey_height = document.getElementById("my_dataviz_wrapper").offsetHeight - sankey_margin.top - sankey_margin.bottom;

    sankey = d3.sankey()
        .nodeSort(null)
        .linkSort(null)
        .nodeWidth(node_width)
        .nodePadding(10)
        .extent([[0, 5], [sankey_width, sankey_height - 5]]);

    svg_alluvial = d3.select("#my_dataviz_wrapper")
        .append("div")
        // Container class to make it responsive.
        .classed("svg-container", false)
        .append("svg")
        .attr("id", "sankey_svg")
        // Responsive SVG needs these 2 attributes and no width and height attr.
        .attr("preserveAspectRatio", "xMinYMin meet")
        //.attr("preserveAspectRatio", "none")
        .attr("viewBox", "0 0 " + sankey_width + " " + sankey_height)
        // Class to make it responsive.
        .classed("svg-content-responsive", false)
        // Fill with a rectangle for visualization.
        .append("g")
        .attr("transform",
            "translate(" + sankey_margin.left + "," + sankey_margin.top + ")");

        //init
        updateAlluvial(graph, data);
}




function updateAlluvial(graph, data){

    this.nodes = graph.nodes;
    this.links = graph.links;

    const {nodes, links} = sankey({
        nodes: this.nodes.map(d => Object.assign({}, d)),
        links: this.links.map(d => Object.assign({}, d))
    });

    filtered_nodes = nodes;
    filtered_links = links;

    //filtered_nodes = removeFilterInformation(data, nodes, links).filtered_nodes;
    //filtered_links = removeFilterInformation(data, nodes, links).filtered_links;

    var defs = svg_alluvial.append('defs');

    svg_alluvial.append("g")
        .selectAll("rect")
        .data(filtered_nodes)
        .join("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("fill", d => color(d.name))
        .attr("id", d => "node_" + d.name)
        .attr("class", "alluvial_nodes")
        .classed("fixed_nodes", false)
        .on("mouseover", function (d) {
            updatePlotByNode(d);
            highlightLinksByNode(d);
        })

        .on("click", function (d) {
            fixNode(d);
        })

        .on("mouseout", function (d) {
            restoreCentroidByNode(d)
            unHighlightLinksByNode(d);
        })

        .append("title")
        .text(d => `${d.name}\n${d.value.toLocaleString()}`);


    var link = svg_alluvial.append("g")
        .selectAll('.link')
        .data(filtered_links)
        .join("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("id", d => "link_" + d.names[0] + "_" + d.names[1])
        .attr("stroke", d => alluvialColoring(d))
        .attr('fill', 'none')
        .attr("stroke-width", d => d.width)
        .attr("class", "alluvial_links")
        .classed('hovered_links', false)
        .classed('fixed_links', false)
        .on("click", d => fixHighlightedLink(d))
        .on("mouseover", d => {
            highlightHoveredLink(d);
            updatePlot(d);
        })

        .on("mouseout", function (d) {
            unHighlightHoveredLink(d);
            restoreCentroid(d);
        })

        .style("mix-blend-mode", "multiply")
        .append("title")
        .text(d => `${d.names.slice(1).join(" → ")}\n${d.value.toLocaleString()}`);


    function alluvialColoring(d){
        var coloring = document.getElementsByName('coloring');

        const startColor = color(d.target.name);
        const endColor = color(d.source.name);

         var linearGradient = defs.append('linearGradient')
         .attr('id',  "gradient_" + d.names[0] + "_" + d.names[1])
         .attr("gradientUnits", "userSpaceOnUse");

        linearGradient.selectAll('stop')
        .data([
            {offset: '10%', color: startColor},
            {offset: '90%', color: endColor},
                        ])
                        .enter()
                        .append('stop')
                        .attr('offset', d => {
                            return d.offset;
                        })
                        .attr('stop-color', d => {
                            return d.color;
                        });

                    return "url(#gradient_" + d.names[0] + "_" + d.names[1] + ")";
    }
}

// should work on-click
function fixedToGlobalSelection() {

    all_fixed_links = []
    for (flows of flowsInCurrentlyFixed()) {
        all_fixed_links.push(getCurrentSelectionGenes(flows, global_data.data));
    }

    updateGlobalSelection(all_fixed_links.flat());
}

function currentlyFixed() {
    current_fixed = Array.prototype.slice.call(document.getElementsByClassName('fixed_links'));
    current_fixed_string = []
    for (entry of current_fixed) {
        current_fixed_string.push(entry.id);
    }

    return current_fixed_string;
}

function currentlyFixedNodes() {
    current_fixed = Array.prototype.slice.call(document.getElementsByClassName('fixed_nodes'));
    current_fixed_string = []
    for (entry of current_fixed) {
        current_fixed_string.push(entry.id);
    }

    return current_fixed_string;
}

function flowsInCurrentlyFixed() {
    tmp = [];

    for (entry of currentlyFixed()) {
        split_string = entry.split("_")
        tmp.push([split_string[1] + "_" + split_string[2], split_string[3] + "_" + split_string[4]])
    }
    return tmp;
}


function nodesInCurrentlyFixed() {
    tmp = [];

    for (entry of currentlyFixedNodes()) {
        split_string = entry.split("_")
        tmp.push(split_string[1] + "_" + split_string[2])
    }

    return tmp;
}


/**
 * renders Alluvial diagram
 * @param data
 */
function render(data) {
    d3.select("#sankey_svg").remove();

    //keys = ['highlighted', 'exp1_cluster', 'exp2_cluster']
    keys = ['exp1_cluster', 'exp2_cluster']

    let graph1 = new graph(keys, data);
    let chart1 = new chart(graph1, data);

}


/**
 * ################
 * ### OLD CODE ###
 * ################
 */

    // text
     // svg_alluvial.append("g")
    //     .style("font", "10px sans-serif")
    //     .selectAll("text")
    //     .data(filtered_nodes)
    //     .join("text")
    //     .attr("x", d => d.x0 < sankey_width / 2 ? d.x1 + 6 : d.x0 - 6)
    //     .attr("y", d => (d.y1 + d.y0) / 2)
    //     .attr("dy", "0.35em")
    //     .attr("text-anchor", d => d.x0 < sankey_width / 2 ? "start" : "end")
    //     .text(d => d.name)
    //     .append("tspan")
    //     .attr("fill-opacity", 0.7)
    //     .text(d => `${d.value.toLocaleString()}`);



//
// function fixHighlightingNodes(current_d) {
//
//     alluvial_links = Array.prototype.slice.call(document.getElementsByClassName('alluvial_links'));
//     alluvial_links_ids = []
//     for (entry of alluvial_links) {
//         alluvial_links_ids.push(entry.id);
//     }
//
//
//     // already fixed -> unfix!
//     if (currentlyFixedNodes().includes("node_" + current_d.name)) {
//         // if contained in list: change to fixed
//         for (alluvial_link of alluvial_links_ids) {
//             if (current_d.name.split("_")[0] === "exp1") {
//
//                 if (alluvial_link.split("_")[2] + "_" + alluvial_link.split("_")[3] === current_d.name.split("_")[0] + "_" + current_d.name.split("_")[1]) {
//                     d3.selectAll("#" + alluvial_link)
//                         .classed('fixed_flows', false);
//                 }
//             } else {
//                 if (alluvial_link.split("_")[4] + "_" + alluvial_link.split("_")[5] === current_d.name.split("_")[0] + "_" + current_d.name.split("_")[1]) {
//                     d3.selectAll("#" + alluvial_link)
//                         .classed('fixed_flows', false);
//                 }
//             }
//         }
//
//
//
//         d3.selectAll("#" + "node_" + current_d.name)
//             .classed('fixed_nodes', false);
//
//     } else {
//         // already fixed -> unfix!
//
//         // if contained in list: change to fixed
//         for (alluvial_link of alluvial_links_ids) {
//             if (current_d.name.split("_")[0] === "exp1") {
//
//                 if (alluvial_link.split("_")[2] + "_" + alluvial_link.split("_")[3] === current_d.name.split("_")[0] + "_" + current_d.name.split("_")[1]) {
//                     d3.selectAll("#" + alluvial_link)
//                         .classed('fixed_flows', true);
//                 }
//             } else {
//                 if (alluvial_link.split("_")[4] + "_" + alluvial_link.split("_")[5] === current_d.name.split("_")[0] + "_" + current_d.name.split("_")[1]) {
//                     d3.selectAll("#" + alluvial_link)
//                         .classed('fixed_flows', true);
//                 }
//             }
//         }
//
//         d3.selectAll("#" + "node_" + current_d.name)
//             .classed('fixed_nodes', true);
//     }
//
// }