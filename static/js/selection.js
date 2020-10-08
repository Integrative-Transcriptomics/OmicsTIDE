
/**
 * ####################
 * ### HIGHLIGHTING ###
 * ####################
 */


function genesByLink(link, data){

    return data.filter(d => (d.exp1_cluster === link.source.name) && (d.exp2_cluster === link.target.name));
}


function linkIsConnectedToCurrentNode(node, link){

    return ((link.id.split("_")[1] + "_" + link.id.split("_")[2]) === (node.name.split("_")[0] + "_" + node.name.split("_")[1]) ||
        (link.id.split("_")[3] + "_" + link.id.split("_")[4]) === (node.name.split("_")[0] + "_" + node.name.split("_")[1]))
}


function isSourceNode(d){
    return d.sourceLinks.length !== 0;
}


function linksByNode(d){
    return (isSourceNode(d) ? d.sourceLinks : d.targetLinks);
}


function highlightLinksByNode(d){
    alluvial_links = Array.prototype.slice.call(document.getElementsByClassName('alluvial_links'));

        for(let entry of alluvial_links){
            if(!linkIsConnectedToCurrentNode(d, entry)){

                d3.select("#" + entry.id)
                    .transition().duration(1000)
                    .style('opacity', non_selected_opacity)
            }
        }

    }


function unHighlightLinksByNode(d){
    alluvial_links = Array.prototype.slice.call(document.getElementsByClassName('alluvial_links'));

        for(let entry of alluvial_links){
            if(!linkIsConnectedToCurrentNode(d, entry)){

                d3.select("#" + entry.id)
                    .transition().duration(1000)
                    .style('opacity', 1)

            }
        }
}



function getInverseClusterSelectionLinks(d, comparison, tabId){

    let exp1Clusters = globalData[comparison][tabId]['data'].map(d => d.exp1_cluster);

    let exp2Clusters = globalData[comparison][tabId]['data'].map(d => d.exp2_cluster);

    let inverse = [];

    for(cluster of Array.from(new Set(exp1Clusters.concat(exp2Clusters)))){
        if(cluster !== d.source.name && cluster !== d.target.name){
            inverse.push(cluster)
        }
    }

    return inverse

}

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


function getInverseClusterSelectionNode(nodeSelection, comparison, tabId){

    let exp1Clusters = globalData[comparison][tabId]['data'].map(d => d.exp1_cluster);

    let exp2Clusters = globalData[comparison][tabId]['data'].map(d => d.exp2_cluster);

    let inverse = [];


    for(cluster of Array.from(new Set(exp1Clusters.concat(exp2Clusters)))){
        if(!nodeSelection.includes(cluster)){
            inverse.push(cluster)
        }
    }

    return inverse;
}



function removeActivityFromDetailDiagram(inverseSelection, comparison, tabId){

    // get all ids not containing currently hovered from/to

    for(let inv of inverseSelection){
        d3.select("#centroid_" + inv + "_" + comparison + "_" + tabId)
        .transition()
        .duration(1000)
        .style('opacity', 0.2)

    d3.select("#profile_" + inv + "_" + comparison + "_" + tabId)
        .transition()
        .duration(1000)
        .style('opacity', 0.2)

    d3.select("#box_" + inv + "_" + comparison + "_" + tabId)
        .transition()
        .duration(1000)
        .style('opacity', 0.2)
    }
}

function addActivityToDetailDiagram(inverseSelection, comparison, tabId){

    for(let inv of inverseSelection){
        d3.select("#centroid_" + inv + "_" + comparison + "_" + tabId)
        .transition()
        .duration(1000)
        .style('opacity', 1)

    d3.select("#profile_" + inv + "_" + comparison + "_" + tabId)
        .transition()
        .duration(1000)
        .style('opacity', 1)

    d3.select("#box_" + inv + "_" + comparison + "_" + tabId)
        .transition()
        .duration(1000)
        .style('opacity', 1)
    }
}

function removeActivityFromNodes(inverseSelection, comparison, tabId){

    for(let inv of inverseSelection){

        d3.select("#node_" + inv + "_clustered-data-information-data-sankey-" + comparison + "_" + tabId)
        .transition()
        .duration(1000)
        .style('opacity', 0.2)
    }
    //node_exp1_1_clustered-data-information-data-sankey-file_1_file_2_intersecting
}

function addActivityToNodes(inverseSelection, comparison, tabId){

    for(let inv of inverseSelection){
        d3.select("#node_" + inv + "_clustered-data-information-data-sankey-" + comparison + "_" + tabId)
        .transition()
        .duration(1000)
        .style('opacity', 1)
    }
    
}


function currentlyClickedGenesByNode(activeNodes, comparison, tabId, globalDataData){

    console.log(activeNodes);
    console.log(comparison);
    console.log(tabId);
    console.log(globalDataData);

    let exp1Nodes = activeNodes.filter( d => d.startsWith("exp1"));

    let exp2Nodes = activeNodes.filter( d => d.startsWith("exp2"));

    console.log(exp1Nodes);
    console.log(exp2Nodes);

    let globalDataDataFiltered = globalDataData.filter( d => d.highlighted === true);

    return globalDataDataFiltered.filter( d => exp1Nodes.includes(d.exp1_cluster) && exp2Nodes.includes(d.exp2_cluster))

}




function highlightHoveredLink(d, id){

    d3.select(id)
        .classed('hovered-links', true)

    // get all alluvial link SVGs
    alluvial_links = Array.prototype.slice.call(document.getElementsByClassName('alluvial_links'));

        for (let entry of alluvial_links) {

            if(!entry.className.baseVal.includes("hovered-links")){
                d3.select("#" + entry.id)
                    .transition().duration(1000)
                    .style('opacity', 0.2)
            }
        }

}


function unhighlightHoveredLink(d, id){

    d3.select(id)
        .classed('hovered-links', false);

    // get all alluvial link SVGs
    alluvial_links = Array.prototype.slice.call(document.getElementsByClassName('alluvial_links'));

    for (let entry of alluvial_links) {

        if(!entry.className.baseVal.includes("hovered-links")){
            d3.select("#" + entry.id)
                .transition()
                .duration(1000)
                .style('opacity', 1)
        }
    }
}


/**
 * ###############
 * ### SLIDERS ###
 * ###############
 */






/*
* ################
* ### ALLUVIAL ###
* ################
*/

/**
 * (de)selects all genes in the initial data
 */
// function deselect_all(){
//     if(global_selection.length === 0){
//         global_selection = Array.from(global_data.data).filter(d => d.highlighted === true);
//         global_selection.columns = global_data.columns;
//     }

//     else{
//         global_selection = [];
//     }
// }



/**
 * uses information from the Alluvial diagram to get the corresponding genes from initial data
 * @param {array} names_list array of nodes
 * @param {Object} data initial data
 * @returns {Array} genes corresponding to the input nodes
 */
function getCurrentSelectionGenes(names_list, comparison, tabId){

    genes = [];
    curr_selection = globalData[comparison][tabId]['data'].filter(function(d) {return (names_list[0] === d.exp1_cluster && names_list[1] === d.exp2_cluster)});

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
function getGenesByClusterId(cluster, comparison, tabId){
    genes = [];

    for(row of globalData[comparison][tabId]['data']){
        if(row.exp1_cluster === cluster || row.exp2_cluster === cluster){
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

function getInverseGeneSelection(selection){

    init_genes = work_data.map(function (d) { return d.gene; });

    // find set differnce
    genes_not_in_selection = init_genes.filter(function(x){ return selection.indexOf(x) < 0});

    return genes_not_in_selection;
}


function fixHighlightedLink(d, divId){

    // change class of currently hovered element
    d3.select("#link_" + d.source.name + "_" + d.target.name + "_" + divId)
        .classed('fixed_links', (!document.getElementById("link_" + d.source.name + "_" + d.target.name + "_" + divId).className.baseVal.includes("fixed_links")))
}


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
                            .transition().duration(500)
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
                            .transition().duration(500)
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

//http://bl.ocks.org/godds/6550889
// mouse over link or node
function updatePlot(d, tabName, tabId){

    let currentDetailDiagram = getActiveRadioButton(tabName);
    let comparison = tabName.split("_")[0] + "_" + tabName.split("_")[1] + "_" + tabName.split("_")[2] + "_" + tabName.split("_")[3];

    //all_genes = getCurrentSelectionGenes(d.names, init_data)
    let allGenes = getCurrentSelectionGenes(d.names, comparison, tabId);

    let filteredData = JSON.parse(JSON.stringify(globalData));

    filteredData[comparison][tabId]['data'] = filteredData[comparison][tabId]['data'].filter(function(d) { return allGenes.includes(d.gene) && d.highlighted === true })

    let exp1Cluster = Array.from(new Set(filteredData[comparison][tabId]['data'].map(function(d) { return d.exp1_cluster })))[0].split("_")[1];
    let exp2Cluster = Array.from(new Set(filteredData[comparison][tabId]['data'].map(function(d) { return d.exp2_cluster })))[0].split("_")[1];

    updateDetailDiagram(currentDetailDiagram, filteredData[comparison][tabId], "exp1", exp1Cluster, tabName, TabId.intersecting);
    updateDetailDiagram(currentDetailDiagram, filteredData[comparison][tabId], "exp2", exp2Cluster, tabName, TabId.intersecting);




    //filtered_data = init_data.filter(function(d) { return all_genes.includes(d.gene) })
    

    // // if(currentDetailDiagram === "centroid" || value === "profiles"){
    // //     updateProfileCentroids(filtered_data, d.names[0].split("_")[0], d.names[0].split("_")[1])
    // //     updateProfileCentroids(filtered_data, d.names[1].split("_")[0], d.names[1].split("_")[1])
    // // }

    // // else if(value === "boxplot"){
    // //     updateBoxplots(filtered_data, d.names[0].split("_")[0], d.names[0].split("_")[1])
    // //     updateBoxplots(filtered_data, d.names[1].split("_")[0], d.names[1].split("_")[1])
    // // }


}


function updatePlotByNode(d, tabName, tabId){

    let currentDetailDiagram = getActiveRadioButton(tabName);
    let comparison = tabName.split("_")[0] + "_" + tabName.split("_")[1] + "_" + tabName.split("_")[2] + "_" + tabName.split("_")[3];

    //all_genes = getCurrentSelectionGenes(d.names, init_data)
    let allGenes = getGenesByClusterId(d.name, comparison, tabId)

    let filteredData = JSON.parse(JSON.stringify(globalData));

    filteredData[comparison][tabId]['data'] = filteredData[comparison][tabId]['data'].filter(function(d) { return allGenes.includes(d.gene) && d.highlighted === true });

    let exp1Cluster = Array.from(new Set(filteredData[comparison][tabId]['data'].map(function(d) { return d.exp1_cluster })))[0].split("_")[1];
    let exp2Cluster = Array.from(new Set(filteredData[comparison][tabId]['data'].map(function(d) { return d.exp2_cluster })))[0].split("_")[1];

    // update hovered diagram
    // updateDetailDiagram(currentDetailDiagram, filteredData[comparison][tabId], d.name.split("_")[0], d.name.split("_")[1], tabName, TabId.intersecting);

    let connectedLinks = [];

    if(d.name.startsWith("exp1")){
        for(let sourceTarget of d.sourceLinks){
            connectedLinks.push(sourceTarget.target.name)
        }
    }

    if(d.name.startsWith("exp2")){
        for(let sourceTarget of d.targetLinks){
            connectedLinks.push(sourceTarget.source.name)
        }
    }


    for(let link of connectedLinks){
        updateDetailDiagram(currentDetailDiagram, filteredData[comparison][tabId], link.split("_")[0], link.split("_")[1], tabName, TabId.intersecting);
    }
    




    // var selection = document.getElementById('plot_selection');
    // var value = selection.options[selection.selectedIndex].value;

    // all_genes = getGenesByClusterId(d.name)

    // work_data = global_data.data


    // first filtering
    //filtered_data = init_data.filter(function(d) { return all_genes.includes(d.gene) })
    // filtered_data = work_data.filter(function(d) { return all_genes.includes(d.gene) && d.highlighted === true})
    // filtered_data.column=work_data.column;

    // // second filtering
    // exp1 = [... new Set(filtered_data.map(function(d) { return d.exp1_cluster }))]
    // exp2 = [... new Set(filtered_data.map(function(d) { return d.exp2_cluster }))]

    // combined = exp1.concat(exp2);

    // for(let entry of combined){
    //     if(value === "centroid" || value === "profiles"){
    //         updateProfileCentroids(filtered_data, entry.split("_")[0], entry.split("_")[1])
    //     }

    //     else if(value === "boxplot"){
    //         updateBoxplots(filtered_data, entry.split("_")[0], entry.split("_")[1])
    //     }
        
    // }
}


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




function restoreCentroidByNode(d, tabName, tabId){

    let currentDetailDiagram = getActiveRadioButton(tabName);

    let comparison = tabName.split("_")[0] + "_" + tabName.split("_")[1] + "_" + tabName.split("_")[2] + "_" + tabName.split("_")[3];

    let filteredData = JSON.parse(JSON.stringify(globalData));
    filteredData[comparison][tabId]['data'] = filteredData[comparison][tabId]['data'].filter(function(d) { return d.highlighted === true});
 
    // get clusters of diagram 
    let exp1Cluster = Array.from(new Set(filteredData[comparison][tabId]['data'].map(d => d.exp1_cluster)));
    let exp2Cluster = Array.from(new Set(filteredData[comparison][tabId]['data'].map(d => d.exp2_cluster)));

    for(let cluster of exp1Cluster){
        updateDetailDiagram(currentDetailDiagram, filteredData[comparison][tabId], "exp1", cluster.split("_")[1], tabName, TabId.intersecting);
    }

    for(let cluster of exp2Cluster){
        updateDetailDiagram(currentDetailDiagram, filteredData[comparison][tabId], "exp2", cluster.split("_")[1], tabName, TabId.intersecting);
    }
}


// mouse out
function restoreCentroid(tabName, tabId){

    /*

    TODO: restore restore only 

    */

    let currentDetailDiagram = getActiveRadioButton(tabName);

    let comparison = tabName.split("_")[0] + "_" + tabName.split("_")[1] + "_" + tabName.split("_")[2] + "_" + tabName.split("_")[3];

    let filteredData = JSON.parse(JSON.stringify(globalData));
    filteredData[comparison][tabId]['data'] = filteredData[comparison][tabId]['data'].filter(function(d) { return d.highlighted === true});
 
    // get clusters of diagram 
    let exp1Cluster = Array.from(new Set(filteredData[comparison][tabId]['data'].map(d => d.exp1_cluster)));
    let exp2Cluster = Array.from(new Set(filteredData[comparison][tabId]['data'].map(d => d.exp2_cluster)));

    for(let cluster of exp1Cluster){
        updateDetailDiagram(currentDetailDiagram, filteredData[comparison][tabId], "exp1", cluster.split("_")[1], tabName, TabId.intersecting);
    }

    for(let cluster of exp2Cluster){
        updateDetailDiagram(currentDetailDiagram, filteredData[comparison][tabId], "exp2", cluster.split("_")[1], tabName, TabId.intersecting);
    }
}




/*
 * highlightling genes
*/

function loadGeneFilterFile(current){

    let tabDivId = tabDivIdFromElement(current);

    let comparison = comparisonFromTabDivId(tabDivId);

    let tabId = tabIdFromTabDivId(tabDivId);

    let diagramId = getActiveRadioButton(tabDivId);


    if(document.getElementById('file_goi-' + tabDivId).files.length === 0) {
            console.log("No file selected!");
            return;
        }

    if(geneFilterActivated){
        
        globalData[comparison][tabId]['data'] = removeAllHighlightingFromData(globalData, comparison, tabId);

        geneFilterActivated = false;

        updateAllDetailDiagramsByFilteredData(globalData, comparison, tabId, diagramId);
    }

    else{

        // https://www.nature.com/articles/ja201719/tables/1 (shows genes related to PhoP operon)

        const reader = new FileReader();
        
        reader.onload = function fileReadCompleted(){

            let diagramId = getActiveRadioButton(tabDivId);
            
            let geneString = reader.result;
            
            let geneList = geneString.split("\n");

            globalData[comparison][tabId]['data'] = updateHighlightingByGeneList(globalData, comparison, tabId, geneList);

            geneFilterActivated = true; 

            updateAllDetailDiagramsByFilteredData(globalData, comparison, tabId, diagramId);

        };

        reader.readAsText(document.getElementById('file_goi-' + tabDivId).files[0]);
    }

    
}


var geneFilterActivated = false;


function loadGeneFilter(current){

    let tabDivId = tabDivIdFromElement(current);

    let geneString = geneStringFromTextInput(tabDivId);

    let comparison = comparisonFromTabDivId(tabDivId);

    let tabId = tabIdFromTabDivId(tabDivId);

    let diagramId = getActiveRadioButton(tabDivId);

    let geneList = geneArrayFromGeneString(geneString, ',');

    if(geneFilterActivated){
        
        globalData[comparison][tabId]['data'] = removeAllHighlightingFromData(globalData, comparison, tabId);

        geneFilterActivated = false;
    }

    else{

        if(geneString === ""){
            alert("Input is empty!");
            return;
        }

        globalData[comparison][tabId]['data'] = updateHighlightingByGeneList(globalData, comparison, tabId, geneList);

        geneFilterActivated = true;
    }

    updateAllDetailDiagramsByFilteredData(globalData, comparison, tabId, diagramId);

}


function filteredDataSubset(data, comparison, tabId){

    // create deep copy 
    let filteredData = JSON.parse(JSON.stringify(data));
    
    // keep filtered data only
    filteredData[comparison][tabId]['data'] = filteredData[comparison][tabId]['data'].filter(function(d) { return d.highlighted === true});

    return filteredData;
}


function updateAllDetailDiagramsByFilteredData(data, comparison, tabId, diagramId){
    
    let filteredData = filteredDataSubset(data, comparison, tabId)   

    for(let exp of ['exp1', 'exp2']){
        for(let cluster = 1; cluster <= filteredData[comparison][tabId]['cluster_count']; cluster++ ){
            updateDetailDiagram(diagramId, filteredData[comparison][tabId], exp, cluster, comparison + "_" + tabId, tabId);
        }
    }

}


function removeAllHighlightingFromData(data, comparison, tabId){

    let tmpData = [];

    for(let row of data[comparison][tabId]['data']){
        row.profile_selected = false;

        tmpData.push(row);
    }

    return tmpData;
}


function updateHighlightingByGeneList(data, comparison, tabId, geneList){

    let filteredData = filteredDataSubset(data, comparison, tabId);

    let trimmedGeneNames = geneList.map(d => d.trim());

    let allGenesInDataset = filteredData[comparison][tabId]['data'].map(d => d.gene)

    let geneIntersection = trimmedGeneNames.filter(d => allGenesInDataset.includes(d));

    let genesNotFound = trimmedGeneNames.filter(d => !allGenesInDataset.includes(d));

    let tmpData = [];

    if(genesNotFound.length > 0){
        alert("Genes not Found: " + genesNotFound);
    }

    for(let row of filteredData[comparison][tabId]['data']){

        if(geneIntersection.includes(row.gene)){

            row.profile_selected = true;
        }

        tmpData.push(row);
    }

    return tmpData;
}


function updateHighlightLines(geneList, tabName){

    let comparison = tabName.split("_")[0] + "_" + tabName.split("_")[1] + "_" + tabName.split("_")[2] + "_" + tabName.split("_")[3];

    let tabId = tabName.split("_")[4];

    let diagramId = getActiveRadioButton(tabName);

    let filteredData = JSON.parse(JSON.stringify(globalData));

    for(let exp of ['exp1', 'exp2']){
        for(let cluster = 1; cluster <= filteredData[comparison][tabId]['cluster_count']; cluster++){
            updateDetailDiagram(diagramId, filteredData[comparison][tabId], exp, cluster, tabName, tabId);
        }
    }
}
    

function tabDivIdFromElement(element){
    return element.id.split('-')[1];
}


function comparisonFromTabDivId(tabDivId){

    return tabDivId.split("_")[0] + "_" + tabDivId.split("_")[1] + "_" + tabDivId.split("_")[2] + "_" + tabDivId.split("_")[3];
}


function tabIdFromTabDivId(tabDivId){
    return tabDivId.split("_")[4];
}


function geneStringFromTextInput(tabDivId){
    return document.getElementById('goi-' + tabDivId).value;
}


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

//         d3.selectAll(".dot_exp1"+"_"+gene)
//             .transition().duration(300)
//             .style('opacity', non_selected_opacity)

//         d3.selectAll(".dot_exp2"+"_"+gene)
//             .transition().duration(300)
//             .style('opacity', non_selected_opacity)
//     }
// }


// function unhighlightDots(sel){
//     inverse_selection = getInverseGeneSelection(sel);

//     for (gene of inverse_selection) {

//         d3.selectAll(".dot_exp1"+"_"+gene)
//             .transition().duration(1000)
//             .style('opacity', 1)

//         d3.selectAll(".dot_exp2"+"_"+gene)
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

//         d3.selectAll(".heatmap_exp1_map"+"_"+gene)
//             .transition().duration(300)
//             .style('opacity', non_selected_opacity)

//         d3.selectAll(".heatmap_exp2_map"+"_"+gene)
//             .transition().duration(300)
//             .style('opacity', non_selected_opacity)
//     }
// }

// function unhighlightGeneInHeatmap(sel){
//     inverse_selection = getInverseGeneSelection(sel);

//     for (gene of inverse_selection) {

//         d3.selectAll(".heatmap_exp1_map"+"_"+gene)
//             .transition().duration(100)
//             .style('opacity', 1)

//         d3.selectAll(".heatmap_exp2_map"+"_"+gene)
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
//     exp1_counter = 0;
//     exp2_counter = 0;

//     for(entry of colnames){
//         if(entry.includes("exp1_value")){
//             exp1_counter++;
//         }

//         if(entry.includes("exp2_value")){
//             exp2_counter++;
//         }
//     }

//     if(exp1_counter === 0 && exp2_counter === 0){
//         throw new Error("at least one conditions has to be set per experiment")
//     }


//     if(exp1_counter !== exp2_counter){
//         throw new Error("unequal numbers of conditions in the experiments not possible!")
//     }

//     if(exp1_counter === 2 && exp2_counter === 2){
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