// implementation based on: https://observablehq.com/@d3/parallel-sets, https://bl.ocks.org/micahstubbs/3c0cb0c0de021e0d9653032784c035e9


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
 * @{param} graph nodes and linkes
 * @{param} data initial data
 */
function chart(graph, data, divID, tabId, tabName) {

    // set the dimensions and margins of the graph
    var sankey_margin = {top: 0, right: 0, bottom: 0, left: 0};
    var sankey_width = document.getElementById(divID).offsetWidth - sankey_margin.left - sankey_margin.right;
    var sankey_height = document.getElementById(divID).offsetHeight - sankey_margin.top - sankey_margin.bottom;
    var node_width = sankey_width/20;

    let svg_alluvial = d3.select("#" + divID)
        .append("div")
        // Container class to make it responsive.
        .classed("svg-container", false)
        .append("svg")
        .attr("id", "sankey_svg_" + divID)
        // Responsive SVG needs these 2 attributes and no width and height attr.
        //.attr("preserveAspectRatio", "xMinYMin meet")
        .attr("preserveAspectRatio", "xMinYMin meet")
        //.attr("preserveAspectRatio", "none")
        .attr("viewBox", "0 0 " + sankey_width + " " + sankey_height)
        // Class to make it responsive.
        .classed("svg-content-responsive", false)
        // Fill with a rectangle for visualization.
        .append("g")
        // .attr("transform",
        //     "translate(" + sankey_margin.left + "," + sankey_margin.top + ")");

    //init
    updateAlluvial(graph, data, divID, tabId, svg_alluvial, tabName);
}


/**
  * 
  * @param{} graph
  * @param{} data
  * @param{} divId
  * @param{int} tabId
  * @param{} svgSankey
  * @param{} tabName
  */
function updateAlluvial(graph, data, divID, tabId, svgSankey, tabName){

    // set the dimensions and margins of the graph
    var sankey_margin = {top: 0, right: 0, bottom: 0, left: 0};
    var sankey_width = document.getElementById(divID).offsetWidth - sankey_margin.left - sankey_margin.right;
    var sankey_height = document.getElementById(divID).offsetHeight - sankey_margin.top - sankey_margin.bottom;
    var node_width = sankey_width/10;

    sankey = d3.sankey()
        .nodeSort(null)
        .linkSort(null)
        .nodeWidth(node_width)
        .nodePadding(10)
        .extent([[0, 5], [sankey_width, sankey_height - 5]]);

    // TODO: automatically assign color
    var color = d3.scaleOrdinal()
        .domain(["exp1_1", "exp1_2", "exp1_3", "exp1_4", "exp1_5", "exp1_6", "exp2_1", "exp2_2", "exp2_3","exp2_4", "exp2_5", "exp2_6"])
        .range(["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02","#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02"]);

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

    let nodeSankey = svgSankey.append("g")
        .selectAll("rect")
        .data(filtered_nodes)
        .join("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        //.attr("fill", d => (tabId === TabId.matrix) ? "lightgrey" : color(d.name))
        .attr("fill", d => color(d.name))
        .attr("id", d => "node_" + d.name + "_" + divID)
        .attr("class", "alluvial_nodes")
        .classed("fixed_nodes", false)

    let defs = svgSankey.append('defs');

    if(tabId !== TabId.matrix){

        nodeSankey
            .on("mouseover", function (d) {

                d3.select(this).style("cursor", "pointer"); 

                let comparison = comparisonFromTabDivId(tabName);
                
                let tabId = tabIdFromTabDivId(tabName);

                let activeNodes = getAllActiveNodes(d);

                let inverseSelection = getInverseClusterSelectionNode(activeNodes, comparison, tabId);

                updatePlotByNode(d, tabName, tabId);
                
                highlightLinksByNode(d);

                

                removeActivityFromDetailDiagram(inverseSelection, comparison, tabId);

                removeActivityFromNodes(inverseSelection, comparison, tabId);



        })

        .on("click", function (d) {

            let comparison = comparisonFromTabDivId(tabName);
                
            let tabId = tabIdFromTabDivId(tabName);

            openSelectionAccordion(comparison + "_" + tabId);

            let activeNodes = getAllActiveNodes(d);

            let currentlyClickedGenes = currentlyClickedGenesByNode(activeNodes, comparison, tabId, globalData[comparison][tabId]['data']);

            let currentGlobalDataSelection = JSON.parse(JSON.stringify(globalData[comparison][tabId]['selection']));

            globalData[comparison][tabId]['selection'] = updateSelection(currentlyClickedGenes, currentGlobalDataSelection);

            let combinations = getDatasetCombinations(globalData[comparison][tabId]['selection']);

            createTable(tabId + "-information-controls-table-" + comparison + "_" + tabId, combinations, comparison, tabId);
            
            //globalData[comparison][tabId]['selection'] = activeNodesToSelection(activeNodes, comparison, tabId, currentGlobalDataSelection);
        })

            .on("mouseout", function (d) {

                let comparison = comparisonFromTabDivId(tabName);

                let tabId = tabIdFromTabDivId(tabName);

                let activeNodes = getAllActiveNodes(d);

                let inverseSelection = getInverseClusterSelectionNode(activeNodes, comparison, tabId);

                restoreCentroidByNode(d, tabName, tabId);
                
                unHighlightLinksByNode(d);

                addActivityToDetailDiagram(inverseSelection, comparison, tabId);

                addActivityToNodes(inverseSelection, comparison, tabId);
        })
    }

    nodeSankey
        .append("title")
        .text(d => `${d.name}\n${d.value.toLocaleString()}`);


    let linkSankey = svgSankey.append("g")
        .selectAll('.link')
        .data(filtered_links)
        .join("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("id", d => "link_" + d.names[0] + "_" + d.names[1] + "_" + divID)
        //.attr("stroke", d => (tabId === TabId.matrix) ? "lightgrey" : alluvialColoring(d))
        .attr("stroke", d => alluvialColoring(d))
        .attr('fill', 'none')
        .attr("stroke-width", d => d.width)
        .classed('from', d => d.names[0] + "_" + divID)
        .classed('to', d => d.names[1] + "_" + divID)
        .classed('hovered-links', false)
        .classed('fixed_links', false)
        .attr("class", "alluvial_links")
        //.on("click", d => fixHighlightedLink(d))
        

        if(tabId !== TabId.matrix){

        linkSankey
                .on("click", function(d){

                    let comparison = comparisonFromTabDivId(tabName);

                    let tabId = tabIdFromTabDivId(tabName);

                    openSelectionAccordion(comparison + "_" + tabId);

                    let currentGlobalDataData = JSON.parse(JSON.stringify(globalData[comparison][tabId]['data']));

                    currentGlobalDataData = currentGlobalDataData.filter(d => d.highlighted === true);

                    let currentlyClickedGenes = genesByLink(d, currentGlobalDataData);

                    let currentGlobalDataSelection = JSON.parse(JSON.stringify(globalData[comparison][tabId]['selection']));

                    currentGlobalDataSelection = currentGlobalDataSelection.filter(d => d.highlighted === true);

                    globalData[comparison][tabId]['selection'] = updateSelection(currentlyClickedGenes, currentGlobalDataSelection);

                    let combinations = getDatasetCombinations(globalData[comparison][tabId]['selection']);

                    createTable(tabId + "-information-controls-table-" + comparison + "_" + tabId, combinations, comparison, tabId);
                


                    // alert("provide information about selection! numbers?")

                    //d => fixHighlightedLink(d, divID)
                })

                .on("mouseover", function(d) {

                    d3.select(this).style("cursor", "pointer"); 

                    let comparison = comparisonFromTabDivId(tabName);

                    let tabId = tabIdFromTabDivId(tabName);


                    highlightHoveredLink(d, this);

                    let inverseSelection = getInverseClusterSelectionLinks(d, comparison, tabId)

                    removeActivityFromDetailDiagram(inverseSelection, comparison, tabId);

                    removeActivityFromNodes(inverseSelection, comparison, tabId);




                    // get all non-hovered links and decrease opacity
                    // d3.select(this)
                    // .classed('hovered_links', true);

                    // highlightHoveredLink(d);
                    updatePlot(d, tabName, tabId);
                })

                .on("mouseout", function (d) {

                    let comparison = comparisonFromTabDivId(tabName);

                    let tabId = tabIdFromTabDivId(tabName);


                    unhighlightHoveredLink(d, this);
            
                    // unHighlightHoveredLink(d);
                    restoreCentroid(tabName, tabId);

                    let inverseSelection = getInverseClusterSelectionLinks(d, comparison, tabId)

                    addActivityToDetailDiagram(inverseSelection, comparison, tabId)

                    addActivityToNodes(inverseSelection, comparison, tabId)
                })
    }
        
        

    linkSankey
        .style("mix-blend-mode", "multiply")
        .append("title")
        .text(d => `${d.names.slice(1).join(" → ")}\n${d.value.toLocaleString()}`)




        

/**
  * 
  * @param{} d
  */
function alluvialColoring(d){

        const startColor = color(d.target.name);
        const endColor = color(d.source.name);

        var linearGradient = defs.append('linearGradient')
         .attr('id',  "gradient_" + d.names[0] + "_" + d.names[1] + "_" + divID)
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

                    return "url(#gradient_" + d.names[0] + "_" + d.names[1] + "_" + divID + ")";
    }
}


/**
  * 
  * @param{} data
  * @param{} divId
  * @param{} tabId
  * @param{int} tabName
  */
function render(data, divID, tabId, tabName) {

    d3.select("#sankey_svg_" + divID).remove();

    //keys = ['highlighted', 'exp1_cluster', 'exp2_cluster']
    keys = ['exp1_cluster', 'exp2_cluster']

    let graph1 = new graph(keys, data);
    let chart1 = new chart(graph1, data, divID, tabId, tabName);

}
