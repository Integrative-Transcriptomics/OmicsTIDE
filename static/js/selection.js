
/**
 * ####################
 * ### HIGHLIGHTING ###
 * ####################
 */


 var durationTransition = 1000;


 /**
  * 
  * @param {ObjectArray} data 
  * @param {String} comparison 
  * @param {String} tabId 
  */
function filterHighlightedGenesOnly(data, comparison, tabId){

    let filteredData = createDeepCopyofData(data);

    for(let link of Object.keys(data[comparison][tabId]['data'])){

        if(isJson(data[comparison][tabId]['data'][link])){
            //data[comparison][tabId]['data'][link] = JSON.parse(data[comparison][tabId]['data'][link]);
            filteredData[comparison][tabId]['data'][link] = JSON.parse(data[comparison][tabId]['data'][link]);
        }

        //data[comparison][tabId]['data'][link] = data[comparison][tabId]['data'][link].filter(d => d.highlighted);
        filteredData[comparison][tabId]['data'][link] = data[comparison][tabId]['data'][link].filter(d => d.highlighted);
    }

    console.log(filteredData);

    return filteredData
}


/**
 * 
 * @param {Object} link 
 * @param {ObjectArray} data 
 * @param {String} comparison 
 * @param {String} tabId 
 */
function getGenesInLink(link, data, comparison, tabId){

    let linkId = link.names[0] + "-" + link.names[1];

    return data[comparison][tabId]['data'][linkId];
}


/**
 * 
 * @param {Object} node 
 * @param {Object} link 
 */
function linkIsConnectedToCurrentNode(node, link){

    return ((link.id.split("_")[1] + "_" + link.id.split("_")[2]) === (node.name.split("_")[0] + "_" + node.name.split("_")[1]) ||
        (link.id.split("_")[3] + "_" + link.id.split("_")[4]) === (node.name.split("_")[0] + "_" + node.name.split("_")[1]))
}


/**
 * 
 * @param {Object} d 
 */
function isSourceNode(d){
    return d.sourceLinks.length !== 0;
}


/**
 * 
 * @param {Object} d 
 */
function linksByNode(d){
    return (isSourceNode(d) ? d.sourceLinks : d.targetLinks);
}


/**
 * 
 * @param {Object} d 
 */
function highlightLinksByNode(d){
    alluvial_links = Array.prototype.slice.call(document.getElementsByClassName('alluvial_links'));

        for(let entry of alluvial_links){
            if(!linkIsConnectedToCurrentNode(d, entry)){

                d3.select("#" + entry.id)
                    .transition().duration(durationTransition)
                    .style('opacity', non_selected_opacity)
            }
        }

    }


/**
 * 
 * @param {Object} d 
 */
function unHighlightLinksByNode(d){
    alluvial_links = Array.prototype.slice.call(document.getElementsByClassName('alluvial_links'));

        for(let entry of alluvial_links){
            if(!linkIsConnectedToCurrentNode(d, entry)){

                d3.select("#" + entry.id)
                    .transition().duration(300)
                    .style('opacity', 1)

            }
        }
}


/**
 * 
 * @param {ObjectArray} data 
 * @param {Object} d 
 * @param {String} comparison 
 * @param {String} tabId 
 */
function getInverseClusterSelectionLinks(data, d, comparison, tabId){

    let ds1Clusters = data[comparison][tabId]['data'].map(d => d.ds1_cluster);

    let ds2Clusters = data[comparison][tabId]['data'].map(d => d.ds2_cluster);

    let inverse = [];

    for(cluster of Array.from(new Set(ds1Clusters.concat(ds2Clusters)))){
        if(cluster !== d.source.name && cluster !== d.target.name){
            inverse.push(cluster)
        }
    }

    return inverse

}

/**
 * 
 * @param {Object} d 
 */
function getAllActiveNodes(d){

    let hoveredNode = d.name;

    let connectedNodes = [];

    // source node
    if(d.sourceLinks.length !== 0){
        for(let targetNode of d.sourceLinks){
            connectedNodes.push(targetNode.target.name);
        }
    }

    // target node
    else{
        for(let sourceNode of d.targetLinks){
            connectedNodes.push(sourceNode.source.name);
        }
    }

    connectedNodes.push(hoveredNode);

    return connectedNodes;
}


/**
 * 
 * @param {ObjectArray} data 
 * @param {Array} nodeSelection 
 * @param {String} comparison 
 * @param {String} tabId 
 */
function getInverseClusterSelectionNode(data, nodeSelection, comparison, tabId){

    let ds1Clusters = data[comparison][tabId]['data'].map(d => d.ds1_cluster);

    let ds2Clusters = data[comparison][tabId]['data'].map(d => d.ds2_cluster);

    let inverse = [];


    for(cluster of Array.from(new Set(ds1Clusters.concat(ds2Clusters)))){
        if(!nodeSelection.includes(cluster)){
            inverse.push(cluster)
        }
    }

    return inverse;
}


/**
 * 
 * @param {Array} inverseSelection 
 * @param {String} comparison 
 * @param {String} tabId 
 */
function removeActivityFromDetailDiagram(inverseSelection, comparison, tabId){

    // get all ids not containing currently hovered from/to

    for(let inv of inverseSelection){
        d3.select("#centroid_" + inv + "_" + comparison + "_" + tabId)
        .transition()
        .duration(durationTransition)
        .style('opacity', 0.2)

    d3.select("#profile_" + inv + "_" + comparison + "_" + tabId)
        .transition()
        .duration(durationTransition)
        .style('opacity', 0.2)

    d3.select("#box_" + inv + "_" + comparison + "_" + tabId)
        .transition()
        .duration(durationTransition)
        .style('opacity', 0.2)
    }
}


/**
 * 
 * @param {Array} inverseSelection 
 * @param {String} comparison 
 * @param {String} tabId 
 */
function addActivityToDetailDiagram(inverseSelection, comparison, tabId){

    for(let inv of inverseSelection){
        d3.select("#centroid_" + inv + "_" + comparison + "_" + tabId)
        .transition()
        .duration(durationTransition)
        .style('opacity', 1)

    d3.select("#profile_" + inv + "_" + comparison + "_" + tabId)
        .transition()
        .duration(durationTransition)
        .style('opacity', 1)

    d3.select("#box_" + inv + "_" + comparison + "_" + tabId)
        .transition()
        .duration(durationTransition)
        .style('opacity', 1)
    }
}


/**
 * 
 * @param {Array} inverseSelection 
 * @param {String} comparison 
 * @param {String} tabId 
 */
function removeActivityFromNodes(inverseSelection, comparison, tabId){

    for(let inv of inverseSelection){

        d3.select("#node_" + inv + "_clustered-data-information-data-sankey-" + comparison + "_" + tabId)
        .transition()
        .duration(durationTransition)
        .style('opacity', 0.2)
    }
    //node_ds1_1_clustered-data-information-data-sankey-file_1_file_2_intersecting
}


/**
 * 
 * @param {Array} inverseSelection 
 * @param {String} comparison 
 * @param {String} tabId 
 */
function addActivityToNodes(inverseSelection, comparison, tabId){

    for(let inv of inverseSelection){
        d3.select("#node_" + inv + "_clustered-data-information-data-sankey-" + comparison + "_" + tabId)
        .transition()
        .duration(durationTransition)
        .style('opacity', 1)
    }
    
}


/**
 * 
 * @param {Object} activeNodes 
 * @param {String} comparison 
 * @param {String} tabId 
 * @param {ObjectArray} globalDataData 
 */
function currentlyClickedGenesByNode(activeNodes, comparison, tabId, globalDataData){

    let ds1Nodes = activeNodes.filter( d => d.startsWith("ds1"));
    let ds2Nodes = activeNodes.filter( d => d.startsWith("ds2"));

    let globalDataDataFiltered = globalDataData.filter( d => d.highlighted === true);

    return globalDataDataFiltered.filter( d => ds1Nodes.includes(d.ds1_cluster) && ds2Nodes.includes(d.ds2_cluster))

}


/**
 * 
 * @param {Object} d 
 * @param {String} id 
 */
function highlightHoveredLink(d, id){

    d3.select(id)
        .classed('hovered-links', true)

    // get all alluvial link SVGs
    alluvial_links = Array.prototype.slice.call(document.getElementsByClassName('alluvial_links'));

        for (let entry of alluvial_links) {

            if(!entry.className.baseVal.includes("hovered-links")){
                d3.select("#" + entry.id)
                    .transition().duration(durationTransition)
                    .style('opacity', 0.2)
            }
        }

}


/**
 * 
 * @param {Object} d 
 * @param {String} id 
 */
function unhighlightHoveredLink(d, id){

    d3.select(id)
        .classed('hovered-links', false);

    // get all alluvial link SVGs
    alluvial_links = Array.prototype.slice.call(document.getElementsByClassName('alluvial_links'));

    for (let entry of alluvial_links) {

        if(!entry.className.baseVal.includes("hovered-links")){
            d3.select("#" + entry.id)
                .transition()
                .duration(durationTransition)
                .style('opacity', 1)
        }
    }
}

/**
 * uses information from the Alluvial diagram to get the corresponding genes from initial data
 * @param {array} names_list array of nodes
 * @param {Object} data initial data
 * @returns {Array} genes corresponding to the input nodes
 */
function getCurrentSelectionGenes(data, names_list, comparison, tabId){

    genes = [];
    curr_selection = data[comparison][tabId]['data'].filter(function(d) {return (names_list[0] === d.ds1_cluster && names_list[1] === d.ds2_cluster)});

    for(row of curr_selection){
        genes.push(row.gene)
    }

    return genes;
}


/**
 * updates the global selection (after click)
 * @param {Object} current_selection_info current selection
 */
function updateGlobalSelection(current_selection_info){
    filtered_data = global_data.data.filter(function(d) { return current_selection_info.includes(d.gene) && d.highlighted === true });
    global_selection = filtered_data
    //global_selection = global_data.data.filter(function(d) {return current_selection_info.includes(d.gene)});
}



/**
 * returns the genes assigned to a given cluster
 * @param {String} cluster cluster of interest
 * @returns {Array} list of genes assigned to cluster
 */
function getGenesByClusterId(data, cluster, comparison, tabId){
    genes = [];

    for(row of data[comparison][tabId]['data']){
        if(row.ds1_cluster === cluster || row.ds2_cluster === cluster){
            genes.push(row.gene);
        }
    }

    return genes;
}


/*
* ########################
* ### EXPORT GENE LIST ###
* ########################
*/


/**
 * 
 */
function exportGeneList(){

    selected_genes = global_selection.map(d => d.gene)

    $.ajax({
        url: '/', 
        type: 'POST', 
        data: selected_genes,
        contentType: "application/json",
        dataType: "JSON",
        success: function(response){
            console.log("downloaded file")
        }})

}


/*
* ################
* ### PROFILES ###
* ################
*/


/**
 * 
 * @param {Array} selection 
 */
function getInverseGeneSelection(selection){

    init_genes = work_data.map(function (d) { return d.gene; });

    // find set differnce
    genes_not_in_selection = init_genes.filter(function(x){ return selection.indexOf(x) < 0});

    return genes_not_in_selection;
}


/**
 * 
 * @param {Object} d 
 * @param {String} divId 
 */
function fixHighlightedLink(d, divId){

    // change class of currently hovered element
    d3.select("#link_" + d.source.name + "_" + d.target.name + "_" + divId)
        .classed('fixed_links', (!document.getElementById("link_" + d.source.name + "_" + d.target.name + "_" + divId).className.baseVal.includes("fixed_links")))
}


/**
 * 
 * @param {Object} d 
 */
function fixNode(d){
        alluvial_links = Array.prototype.slice.call(document.getElementsByClassName('alluvial_links'));

        // node already fixed -> unfix
        if(document.getElementById("node_" + d.name).className.baseVal.includes("fixed_nodes")) {
            d3.select("#node_" + d.name)
                .classed('fixed_nodes', false)

                for (let entry of alluvial_links) {

                    if (linkIsConnectedToCurrentNode(d, entry)) {

                        d3.select("#" + entry.id)
                            .classed('fixed_links', false)

                        d3.select("#" + entry.id)
                            .transition().duration(durationTransition)
                            .style('opacity', non_selected_opacity)
                    }
            }
        }

        // node not yet fixed -> fix
        else{
            d3.select("#node_" + d.name)
                .classed('fixed_nodes', true)

                for (let entry of alluvial_links) {

                    if (linkIsConnectedToCurrentNode(d, entry)) {

                        d3.select("#" + entry.id)
                            .classed('fixed_links',true)

                        d3.select("#" + entry.id)
                            .transition().duration(durationTransition)
                            .style('opacity', 1)
                    }
                }
        }
}


/**
 * updates global selection by adding or removing the selection (one line!)
 * @param {Object} selection one line of an object
 */
function updateGlobalSelectionLine(selection) {
    //current_gene = selection.key;
    current_gene = selection;
    gene_line = work_data.filter(function(d) {return d.gene === current_gene});

    // global selection still empty -> add complete current selection
    if (global_selection.length === 0) {
        global_selection.push(gene_line[0]);
    }

    // check if gene entry already in global selection (not considering the selected 0/1)
    else {
        for (k = 0; k < global_selection.length; k++) {
            // gene already in global selection -> remove entry
            if (current_gene === global_selection[k].gene) {
                global_selection.splice(k, 1);
                break;
            }

            // gene not in global selection -> add entry
            if (current_gene !== global_selection[k].gene && k === global_selection.length - 1) {
                global_selection.push(gene_line[0]);
                break;
            }
        }
    }
}


/**
 * inspired: http://bl.ocks.org/godds/6550889
 * @param {ObjectArray} data 
 * @param {Object} d 
 * @param {String} tabName 
 * @param {String} tabId 
 */
function updatePlot(data, d, tabName, tabId){

    let currentDetailDiagram = getActiveRadioButton(tabName);
    //let comparison = tabName.split("_")[0] + "_" + tabName.split("_")[1] + "_" + tabName.split("_")[2] + "_" + tabName.split("_")[3];
    let comparison = tabName.split("_")[0];

    //all_genes = getCurrentSelectionGenes(d.names, init_data)
    let allGenes = getCurrentSelectionGenes(data, d.names, comparison, tabId);

    let filteredData = JSON.parse(JSON.stringify(data));

    filteredData[comparison][tabId]['data'] = filteredData[comparison][tabId]['data'].filter(function(d) { return allGenes.includes(d.gene) && d.highlighted === true })

    let ds1Cluster = Array.from(new Set(filteredData[comparison][tabId]['data'].map(function(d) { return d.ds1_cluster })))[0].split("_")[1];
    let ds2Cluster = Array.from(new Set(filteredData[comparison][tabId]['data'].map(function(d) { return d.ds2_cluster })))[0].split("_")[1];

    updateDetailDiagram(currentDetailDiagram, filteredData[comparison][tabId], "ds1", ds1Cluster, tabName, TabId.intersecting);
    updateDetailDiagram(currentDetailDiagram, filteredData[comparison][tabId], "ds2", ds2Cluster, tabName, TabId.intersecting);

}


/**
 * 
 * @param {ObjectArray} data 
 * @param {Object} d 
 * @param {String} tabName 
 * @param {String} tabId 
 */
function updatePlotByNode(data, d, tabName, tabId){

    let currentDetailDiagram = getActiveRadioButton(tabName);
    //let comparison = tabName.split("_")[0] + "_" + tabName.split("_")[1] + "_" + tabName.split("_")[2] + "_" + tabName.split("_")[3];
    let comparison = tabName.split("_")[0];

    //all_genes = getCurrentSelectionGenes(d.names, init_data)
    let allGenes = getGenesByClusterId(data, d.name, comparison, tabId)

    let filteredData = JSON.parse(JSON.stringify(data));

    filteredData[comparison][tabId]['data'] = filteredData[comparison][tabId]['data'].filter(function(d) { return allGenes.includes(d.gene) && d.highlighted === true });

    let ds1Cluster = Array.from(new Set(filteredData[comparison][tabId]['data'].map(function(d) { return d.ds1_cluster })))[0].split("_")[1];
    let ds2Cluster = Array.from(new Set(filteredData[comparison][tabId]['data'].map(function(d) { return d.ds2_cluster })))[0].split("_")[1];

    // update hovered diagram
    // updateDetailDiagram(currentDetailDiagram, filteredData[comparison][tabId], d.name.split("_")[0], d.name.split("_")[1], tabName, TabId.intersecting);

    let connectedLinks = [];

    if(d.name.startsWith("ds1")){
        for(let sourceTarget of d.sourceLinks){
            connectedLinks.push(sourceTarget.target.name)
        }
    }

    if(d.name.startsWith("ds2")){
        for(let sourceTarget of d.targetLinks){
            connectedLinks.push(sourceTarget.source.name)
        }
    }


    for(let link of connectedLinks){
        updateDetailDiagram(currentDetailDiagram, filteredData[comparison][tabId], link.split("_")[0], link.split("_")[1], tabName, TabId.intersecting);
    }
    
}


/**
 * 
 * @param {String} tabName 
 */
function getActiveRadioButton(tabName){

    // get current diagram
    let currentRadioButtons = document.getElementById("btn-group btn-group-toggle-" + tabName);
    let currentDetailDiagram = "";

    for(let label of currentRadioButtons.children){
        if(label.className.includes("active")){
            currentDetailDiagram = label.children[0].value;
        }
    }
    return currentDetailDiagram;
}


/**
 * 
 * @param {ObjectArray} data 
 * @param {Object} d 
 * @param {String} tabName 
 * @param {String} tabId 
 */
function restoreCentroidByNode(data, d, tabName, tabId){


    let currentDetailDiagram = getActiveRadioButton(tabName);

    //let comparison = tabName.split("_")[0] + "_" + tabName.split("_")[1] + "_" + tabName.split("_")[2] + "_" + tabName.split("_")[3];
    let comparison = tabName.split("_")[0];

    let filteredData = JSON.parse(JSON.stringify(data));
    filteredData[comparison][tabId]['data'] = filteredData[comparison][tabId]['data'].filter(function(d) { return d.highlighted === true});
 
    // get clusters of diagram 
    let ds1Cluster = Array.from(new Set(filteredData[comparison][tabId]['data'].map(d => d.ds1_cluster)));
    let ds2Cluster = Array.from(new Set(filteredData[comparison][tabId]['data'].map(d => d.ds2_cluster)));

    for(let cluster of ds1Cluster){
        updateDetailDiagram(currentDetailDiagram, filteredData[comparison][tabId], "ds1", cluster.split("_")[1], tabName, TabId.intersecting);
    }

    for(let cluster of ds2Cluster){
        updateDetailDiagram(currentDetailDiagram, filteredData[comparison][tabId], "ds2", cluster.split("_")[1], tabName, TabId.intersecting);
    }
}


/**
 * 
 * @param {ObjectArray} data 
 * @param {String} tabName 
 * @param {String} tabId 
 */
function restoreCentroid(data, tabName, tabId){

    let currentDetailDiagram = getActiveRadioButton(tabName);

    //let comparison = tabName.split("_")[0] + "_" + tabName.split("_")[1] + "_" + tabName.split("_")[2] + "_" + tabName.split("_")[3];
    let comparison = tabName.split("_")[0];

    let filteredData = JSON.parse(JSON.stringify(data));
    filteredData[comparison][tabId]['data'] = filteredData[comparison][tabId]['data'].filter(function(d) { return d.highlighted === true});
 
    // get clusters of diagram 
    let ds1Cluster = Array.from(new Set(filteredData[comparison][tabId]['data'].map(d => d.ds1_cluster)));
    let ds2Cluster = Array.from(new Set(filteredData[comparison][tabId]['data'].map(d => d.ds2_cluster)));

    for(let cluster of ds1Cluster){
        updateDetailDiagram(currentDetailDiagram, filteredData[comparison][tabId], "ds1", cluster.split("_")[1], tabName, TabId.intersecting);
    }

    for(let cluster of ds2Cluster){
        updateDetailDiagram(currentDetailDiagram, filteredData[comparison][tabId], "ds2", cluster.split("_")[1], tabName, TabId.intersecting);
    }
}

/**
 * 
 * @param {element} element 
 */
function tabDivIdFromElement(element){
    return element.id.split('-')[1];
}


/**
 * 
 * @param {String} tabDivId 
 */
function comparisonFromTabDivId(tabDivId){

    //return tabDivId.split("_")[0] + "_" + tabDivId.split("_")[1] + "_" + tabDivId.split("_")[2] + "_" + tabDivId.split("_")[3];

    return tabDivId.split("_")[0];
}


/**
 * 
 * @param {String} tabDivId 
 */
function tabIdFromTabDivId(tabDivId){

    //return tabDivId.split("_")[4];

    return tabDivId.split("_")[1];
}


/**
 * 
 * @param {String} tabDivId 
 */
function geneStringFromTextInput(tabDivId){
    return document.getElementById('goi-' + tabDivId).value;
}


/**
 * 
 * @param {String} geneString 
 * @param {String} separator 
 */
function geneArrayFromGeneString(geneString, separator){
    return geneString.split(separator);
}













/*
* ###############
* ### BOXPLOT ###
* ###############
*/

// function highlightDots(sel){
//     inverse_selection = getInverseGeneSelection(sel);

//     for (gene of inverse_selection) {

//         d3.selectAll(".dot_ds1"+"_"+gene)
//             .transition().duration(300)
//             .style('opacity', non_selected_opacity)

//         d3.selectAll(".dot_ds2"+"_"+gene)
//             .transition().duration(300)
//             .style('opacity', non_selected_opacity)
//     }
// }


// function unhighlightDots(sel){
//     inverse_selection = getInverseGeneSelection(sel);

//     for (gene of inverse_selection) {

//         d3.selectAll(".dot_ds1"+"_"+gene)
//             .transition().duration(1000)
//             .style('opacity', 1)

//         d3.selectAll(".dot_ds2"+"_"+gene)
//             .transition().duration(1000)
//             .style('opacity', 1)
//     }
// }



// * ###############
// * ### HEATMAP ###
// * ###############



// function highlightGeneInHeatmap(sel){
//     inverse_selection = getInverseGeneSelection(sel);

//     for (gene of inverse_selection) {

//         d3.selectAll(".heatmap_ds1_map"+"_"+gene)
//             .transition().duration(300)
//             .style('opacity', non_selected_opacity)

//         d3.selectAll(".heatmap_ds2_map"+"_"+gene)
//             .transition().duration(300)
//             .style('opacity', non_selected_opacity)
//     }
// }

// function unhighlightGeneInHeatmap(sel){
//     inverse_selection = getInverseGeneSelection(sel);

//     for (gene of inverse_selection) {

//         d3.selectAll(".heatmap_ds1_map"+"_"+gene)
//             .transition().duration(100)
//             .style('opacity', 1)

//         d3.selectAll(".heatmap_ds2_map"+"_"+gene)
//             .transition().duration(100)
//             .style('opacity', 1)
//     }
// }


/*
* ###################
* ### CHECK INPUT ###
* ###################
*/

// function isComparative(data){
//     colnames = Object.keys(data[0]);
//     condition_count = 0;
//     ds1_counter = 0;
//     ds2_counter = 0;

//     for(entry of colnames){
//         if(entry.includes("ds1_value")){
//             ds1_counter++;
//         }

//         if(entry.includes("ds2_value")){
//             ds2_counter++;
//         }
//     }

//     if(ds1_counter === 0 && ds2_counter === 0){
//         throw new Error("at least one conditions has to be set per experiment")
//     }


//     if(ds1_counter !== ds2_counter){
//         throw new Error("unequal numbers of conditions in the experiments not possible!")
//     }

//     if(ds1_counter === 2 && ds2_counter === 2){
//         return true;

//         // do boxplot
//     }

//     else{
//         return false;

//         // do line plot
//     }
// }



/*
 * highlights given genes, sends alert if not found
 */

// function highlightGenes(geneList, tabName){
//     // https://50linesofco.de/post/2019-07-05-reading-local-files-with-javascript

//     // comparison
//     let comparison = tabName.split("_")[0] + "_" + tabName.split("_")[1] + "_" + tabName.split("_")[2] + "_" + tabName.split("_")[3];
//     let tabId = tabName.split("_")[4];

//     //try {
//     let genesNotFound = [];

//     let filteredData = globalData[comparison][tabId]['data'].filter(d => d.highlighted === true)
//     let allGenesInDataset = filteredData.map(d => d.gene)

//     let trimmedGeneNames = geneList.map(d => d.trim())

//     for(let gene of trimmedGeneNames){
        
//         if(!allGenesInDataset.includes(gene)){
//             genesNotFound.push(gene)
//         }

//         else{

//             for(row of globalData[comparison][tabId]['data']){
//                 if(row.gene === gene){
//                     row.profile_selected = true;
//                 }
//             }
//         }
//     }

// }