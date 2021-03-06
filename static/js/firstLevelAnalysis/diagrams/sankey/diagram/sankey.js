// implementation based on: https://observablehq.com/@d3/parallel-sets, https://bl.ocks.org/micahstubbs/3c0cb0c0de021e0d9653032784c035e9


var divSankey = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

/**
 * creates nodes and links for the Alluvial diagram based on the input data
 * @param {Array} keys array of nodes
 * @param {Object} data initial data
 * @returns {{nodes: [], links: []}} calculated width and positions of nodes and links
 */
function graph(keys, data, tabName) {

    // let comparisonId = tabName.split("_")[0];
    // let comparisonType = tabName.split("_")[1];

    this.keys = keys;
    index = -1;
    nodes = [];
    nodeByKey = new Map;
    indexByKey = new Map;
    links = [];

    for (const k of keys) {
        //for (const d of data[comparisonId][comparisonType]['data']) {
        for (const d of data['data']) {
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
        //for (const d of data[comparisonId][comparisonType]['data']) {
        for (const d of data['data']) {
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
 * 
 * @param {Object} graph 
 * @param {ObjectArray} data 
 * @param {String} divID 
 * @param {String} tabId 
 * @param {String} tabName 
 */
function chart(graph, data, divID, tabId, tabName) {

    // let comparisonId = tabName.split("_")[0];
    // let comparisonType = tabName.split("_")[1];

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
    updateSankey(graph, data, divID, tabId, svg_alluvial, tabName);
}


/**
 * 
 * @param {Object} graph 
 * @param {ObjectArray} data 
 * @param {String} divID 
 * @param {String} tabId 
 * @param {SvgObject} svgSankey 
 * @param {String} tabName 
 */
function updateSankey(graph, data, divID, tabId, svgSankey, tabName){

    let comparison = tabName.split("_")[0];
    //let comparisonType = tabName.split("_")[1];
    
    // update info
    if(tabId === "intersecting"){
        getConAndDiscordanceInfo(data, comparison)
    }
    

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
        .extent([[0, 5], [sankey_width, sankey_height - 5]])

    // TODO: automatically assign color
    var color = d3.scaleOrdinal()
        .domain(["ds1_1", "ds1_2", "ds1_3", "ds1_4", "ds1_5", "ds1_6", "ds2_1", "ds2_2", "ds2_3","ds2_4", "ds2_5", "ds2_6", "null", null])
        .range(["#1b9e77", "#eb914d", "#7570b3", "#e6ab02", "#735363", "#66a61e", "#1b9e77", "#eb914d", "#7570b3", "#e6ab02", "#735363", "#66a61e", "d3d3d3", "d3d3d3"]);

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
        .attr("fill", d => color(d.name))
        .attr("id", d => "node_" + d.name + "_" + divID)
        .attr("class", "sankey-nodes")
        .classed("fixed_nodes", false)

    let defs = svgSankey.append('defs');

    if(tabId !== TabId.matrix){

        nodeSankey
            .on("mouseover", function (d) {

                getLinksConnectedToNode(this.__data__.name, filtered_links);

                d3.select(this).style("cursor", "pointer"); 

                let comparison = comparisonFromTabName(tabName);
                
                let tabId = tabIdFromTabDivId(tabName);

                let activeNodes = getAllActiveNodes(d);

                let inverseSelection = getInverseClusterSelectionNode(data, activeNodes, comparison, tabId);

                updatePlotByNode(data, d, tabName, tabId);
                
                highlightLinksByNode(d);

                getLinksConnectedToNode(this.__data__.name, filtered_links);

                removeActivityFromDetailDiagram(inverseSelection, comparison, tabId);

                removeActivityFromNodes(inverseSelection, comparison, tabId);

                // tooltip
                divSankey.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                divSankey.html(extractNodeInformationForToolTip(this))	
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mousemove", function(d){
            // tooltip
            divSankey.transition()		
            .duration(200)		
            .style("opacity", .9);		
            divSankey.html(extractNodeInformationForToolTip(this))	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");
        })

        .on("click", function (d) {

            // refactore name
            let comparison = comparisonFromTabName(tabName);
                
            let tabId = tabIdFromTabDivId(tabName);

            openSelectionAccordion(comparison + "_" + tabId);

            let globalDataCopy = deepCopyOfGlobalDataSubSet(currentlyChosenGlobalData, comparison, tabId);

            let linkIds = getLinkIdsConnectedToNode(this);

            let currentlyClickedNodes = getGenesOfLinkIds(linkIds, globalDataCopy, comparison, tabId);

            let currentSelection = globalDataCopy['selection'].filter(d => d.highlighted);

            globalDataCopy['selection'] = updateSelection(currentlyClickedNodes, currentSelection);
           
            let combinations = getDatasetCombinations(globalDataCopy['selection']);

            createTable(tabId + "-information-controls-table-" + comparison + "_" + tabId, combinations, comparison, tabId);

            updateGlobalDataSubset(currentlyChosenGlobalData, comparison, tabId, "selection", globalDataCopy['selection']);
        })


            .on("mouseout", function (d) {

                let comparison = comparisonFromTabName(tabName);

                let tabId = tabIdFromTabDivId(tabName);

                let activeNodes = getAllActiveNodes(d);

                let inverseSelection = getInverseClusterSelectionNode(data, activeNodes, comparison, tabId);

                restoreCentroidByNode(data, d, tabName, tabId);
                
                unHighlightLinksByNode(d);

                addActivityToDetailDiagram(inverseSelection, comparison, tabId);

                addActivityToNodes(inverseSelection, comparison, tabId);

                // tooltip
                divSankey.transition()		
                        .duration(200)		
                        .style("opacity", 0);	
        })
    }

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
                    
                    let comparison = comparisonFromTabName(tabName);

                    let tabId = tabIdFromTabDivId(tabName);

                    openSelectionAccordion(comparison + "_" + tabId);

                    let globalDataCopy = deepCopyOfGlobalDataSubSet(currentlyChosenGlobalData, comparison, tabId);

                    let currentlyClickedData = getGenesInLink(d, globalDataCopy['data'], comparison, tabId);

                    //globalDataCopy['data'] = filterHighlightedGenesOnly2(globalDataCopy, comparison, tabId)

                    let currentSelection = globalDataCopy['selection'].filter(d => d.highlighted)

                    globalDataCopy['selection'] = updateSelection(currentlyClickedData, currentSelection);

                    let combinations = getDatasetCombinations(globalDataCopy['selection'].filter(d => d.highlighted));

                    createTable(tabId + "-information-controls-table-" + comparison + "_" + tabId, combinations, comparison, tabId);

                    updateGlobalDataSubset(currentlyChosenGlobalData, comparison, tabId, "selection", globalDataCopy['selection']);

                })

                .on("mouseover", function(d) {


                    d3.select(this).style("cursor", "pointer"); 

                    let comparison = comparisonFromTabName(tabName);

                    let tabId = tabIdFromTabDivId(tabName);

                    highlightHoveredLink(d, this);

                    let inverseSelection = getInverseClusterSelectionLinks(data, d, comparison, tabId)

                    removeActivityFromDetailDiagram(inverseSelection, comparison, tabId);

                    removeActivityFromNodes(inverseSelection, comparison, tabId);

                    updateDetailDiagramsOnMouseOver(comparison, d);

                    // tooltip
                    divSankey.transition()		
                        .duration(200)		
                         .style("opacity", .9);		
                    divSankey.html(extractLinkInformationForToolTip(this))	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 28) + "px");

                })

                .on("mousemove", function(d){
                    divSankey.transition()		
                        .duration(200)		
                         .style("opacity", .9);		
                    divSankey.html(extractLinkInformationForToolTip(this))	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 28) + "px");	
                })

                

                .on("mouseout", function (d) {

                    let comparison = comparisonFromTabName(tabName);

                    let tabId = tabIdFromTabDivId(tabName);

                    unhighlightHoveredLink(d, this);
            
                    let inverseSelection = getInverseClusterSelectionLinks(data, d, comparison, tabId);

                    addActivityToDetailDiagram(inverseSelection, comparison, tabId);

                    addActivityToNodes(inverseSelection, comparison, tabId);

                    restoreDetailDiagramsOnMouseOut(comparison, d);

                    // tool tip
                    divSankey.transition()		
                        .duration(200)		
                        .style("opacity", 0);	
                })
    }
        
     
/**
 * 
 * @param {ObjectArray} data 
 * @param {String} comparison 
 */
function getConAndDiscordanceInfo(data, comparison){

    let totalNumberIntersecting = data['data'].filter(d => d.highlighted).length;
    let concordant = data['data'].filter(d => (d.ds1_cluster.split("_")[1] === d.ds2_cluster.split("_")[1]) && d.highlighted).length;
    let discordant = data['data'].filter(d => (d.ds1_cluster.split("_")[1] !== d.ds2_cluster.split("_")[1]) && d.highlighted).length;

    let concordantString = "Genes following concordant trends: " + concordant + " (" + Math.round((((concordant/totalNumberIntersecting)*100) + Number.EPSILON) * 100) / 100 + "%)"
    let discordantString = "Genes following discordant trends: " + discordant + " (" + Math.round((((discordant/totalNumberIntersecting)*100) + Number.EPSILON) * 100) / 100 + "%)"

    let header = document.getElementById("first-level-intersecting-information-data-header-sankey-" + comparison + "_intersecting");

    if(header.hasChildNodes){
        header.innerHTML = "";
    }

    header.appendChild(document.createElement("br"))
    header.appendChild(document.createTextNode(concordantString))
    header.appendChild(document.createElement("br"))
    header.appendChild(document.createTextNode(discordantString))
}



/**
 * 
 * @param {Element} node 
 */
function getLinkIdsConnectedToNode(node){

    let linkIds;

    if(node.__data__.sourceLinks.length === 0){
        linkIds = node.__data__.targetLinks.map(d => d.names[0] + "-" + d.names[1])
    }

    if(node.__data__.targetLinks.length === 0){
        linkIds = node.__data__.sourceLinks.map(d => d.names[0] + "-" + d.names[1])
    }

    return linkIds;    
}


/**
 * 
 * @param {Array} arrayOfLinkIds 
 * @param {ObjectArray} data 
 * @param {String} comparison 
 * @param {String} tabId 
 */
function getGenesOfLinkIds(arrayOfLinkIds, data, comparison, tabId){

    let genes = [];

    for(let linkId of arrayOfLinkIds){
        //genes = genes.concat(data[comparison][tabId]['data'][linkId]);
        genes = genes.concat(data['data'][linkId]);
    }

    return genes;
}


/**
 * 
 * @param {element} element 
 */
function extractNodeInformationForToolTip(element){

    let nodeInformation = element.__data__;
    
    return "Trend: " +  nodeInformation.name + "\nGenes: " + nodeInformation.value;
}


/**
 * 
 * @param {element} element 
 */
function extractLinkInformationForToolTip(element){

    let linkInformation = element.__data__;
    
    return "Trend ds1: " + linkInformation.names[0] + "\nTrend ds2: " + linkInformation.names[1] + "\nGenes: " + linkInformation.value;
}
      

/**
 * 
 * @param {Object} d 
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
 * @param {ObjectArray} data 
 * @param {String} divID 
 * @param {String} tabId 
 * @param {String} tabName 
 */
function render(data, divID, tabId, tabName) {

    d3.select("#sankey_svg_" + divID).remove();

    //keys = ['highlighted', 'ds1_cluster', 'ds2_cluster']
    keys = ['ds1_cluster', 'ds2_cluster']

    let graph1 = new graph(keys, data, tabName);
    let chart1 = new chart(graph1, data, divID, tabId, tabName);

}



/**
 * 
 * @param {Object} nodeData 
 */
function isSourceNode(nodeData){

    return nodeData.targetLinks.length === 0;
}


/**
 * 
 * @param {String} link 
 */
function linkIdToString(link){

    return link.names[0] + "-" + link.names[1];
}


/**
 * 
 * @param {String} nodeId 
 * @param {ObjectArray} linkData
 * @param {boolean} isSourceNode
 */
function getLinksConnectedToNode(nodeId, linkData){

    let connectedLinks = [];

    for(let link of linkData){
        if(link.names.includes(nodeId)){
            connectedLinks.push(linkIdToString(link));
        }
    }

    return connectedLinks;
}


// /**
//  * 
//  * @param {ObjectArray} data 
//  */
// function getDatasetAndTrendFromPTCF(data){

//     let ds1 = [... new Set(data.map(function(d){ return d.ds1_cluster}))];
//     let ds2 = [... new Set(data.map(function(d){ return d.ds2_cluster}))];

//     return {
//         ds1Trends : ds1.map(function(d) {return parseInt(d.split("_")[1])}),
//         ds2Trends : ds2.map(function(d) {return parseInt(d.split("_")[1])})
//     }    

// }


// /**
//  * 
//  * @param {Object} link 
//  * @param {ObjectArray} data 
//  */
// function getAllLinksWithSameSourceTarget(link, data){

//     let sourceHoveredLink = link.names[0];
//     let targetHoveredLink = link.names[1];
//     let reconstituted = {};
    
//     // get data from globalData correlating to link id

//     for(let link of Object.keys(data)){
//         if(link.startsWith(sourceHoveredLink) || link.endsWith(targetHoveredLink)){
//             reconstituted[link] = data[link];
//         }
//     }

//     return reconstituted;
// }


// /**
//  * 
//  * @param {ObjectArray} data 
//  */
// function collapseGlobalData(data){

//     let collapsedData = [];

//     for(let link of Object.keys(data)){

//         if(link.startsWith("ds")){
//             collapsedData = collapsedData.concat(JSON.parse(data[link]));
//         }
//     }

//     return collapsedData;
// }


/**
 * updates detail diagrams when hovering a link in the Sankey diagram
 * @param {String} comparison 
 * @param {String} currentLink 
 */
function updateDetailDiagramsOnMouseOver(comparison, currentLink){

    let linkId = currentLink.names[0] + "-" + currentLink.names[1];

    let ds1Cluster = currentLink.names[0].split("_")[1];
    let ds2Cluster = currentLink.names[1].split("_")[1];

    let filtered =[];

    let globalDataCopy = deepCopyOfGlobalDataSubSet(currentlyChosenGlobalData, comparison, "intersecting");

    for(let link of Object.keys(globalDataCopy['data'])){

        if(isJson(globalDataCopy['data'][link])){
            globalDataCopy['data'][link] = JSON.parse(globalDataCopy['data'][link]);
        }

        if(link === linkId){
            filtered = filtered.concat(globalDataCopy['data'][link]);
        }
    }

    globalDataCopy['data'] = filtered;

    let firstDiagramData = deepCopyOfGlobalDataSubSet(currentlyChosenGlobalData, comparison, "intersecting")
    let secondDiagramData = deepCopyOfGlobalDataSubSet(currentlyChosenGlobalData, comparison, "intersecting")

    firstDiagramData['data'] = globalDataCopy['data'].filter(d => d.ds1_cluster === currentLink.names[0] && d.highlighted);
    secondDiagramData['data'] = globalDataCopy['data'].filter(d => d.ds2_cluster === currentLink.names[1] && d.highlighted);

    let currentDetailDiagram = getActiveRadioButton(comparison + "_intersecting");

    updateDetailDiagram(currentDetailDiagram, firstDiagramData, "ds1", ds1Cluster, comparison+"_intersecting", "intersecting", comparison)
    updateDetailDiagram(currentDetailDiagram, secondDiagramData, "ds2", ds2Cluster, comparison+"_intersecting", "intersecting", comparison)   
}


/**
 * restores detail diagrams when unhovering a link in the Sankey diagram
 * @param {String} comparison 
 * @param {String} linkId 
 */
function restoreDetailDiagramsOnMouseOut(comparison, linkId){

    let filtered = [];

    let globalDataCopy = deepCopyOfGlobalDataSubSet(currentlyChosenGlobalData, comparison, "intersecting");

    let firstDatasetCluster = linkId.names[0];
    let secondDatasetCluster = linkId.names[1];

    let ds1Cluster = linkId.names[0].split("_")[1];
    let ds2Cluster = linkId.names[1].split("_")[1];

    for(let link of Object.keys(globalDataCopy['data'])){

        if(isJson(globalDataCopy['data'][link])){
            globalDataCopy['data'][link] = JSON.parse(globalDataCopy['data'][link]);
        }

        if(link.startsWith(firstDatasetCluster) || link.endsWith(secondDatasetCluster)){
            filtered = filtered.concat(globalDataCopy['data'][link]);
        }
    }

    globalDataCopy['data'] = filtered;

    let firstDiagramData = deepCopyOfGlobalDataSubSet(currentlyChosenGlobalData, comparison, 'intersecting')
    let secondDiagramData = deepCopyOfGlobalDataSubSet(currentlyChosenGlobalData, comparison, 'intersecting')

    firstDiagramData['data'] = globalDataCopy['data'].filter(d => d.ds1_cluster === linkId.names[0] && d.highlighted);
    secondDiagramData['data'] = globalDataCopy['data'].filter(d => d.ds2_cluster === linkId.names[1] && d.highlighted);

    let currentDetailDiagram = getActiveRadioButton(comparison + "_intersecting");

    updateDetailDiagram(currentDetailDiagram, firstDiagramData, "ds1", ds1Cluster, comparison+"_intersecting", "intersecting", comparison)
    updateDetailDiagram(currentDetailDiagram, secondDiagramData, "ds2", ds2Cluster, comparison+"_intersecting", "intersecting", comparison)
}






