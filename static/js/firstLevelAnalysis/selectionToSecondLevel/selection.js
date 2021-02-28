
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
  * @param {ObjectArray} data 
  * @param {String} comparison 
  * @param {String} tabId 
  */
 function filterHighlightedGenesOnly2(data, comparison, tabId){

    //let filteredData = createDeepCopyofData(data);

    let filtered = [];

    for(let link of Object.keys(data['data'])){

        if(isJson(data['data'][link])){
            //data[comparison][tabId]['data'][link] = JSON.parse(data[comparison][tabId]['data'][link]);
            data['data'][link] = JSON.parse(data['data'][link]);
        }

        //data[comparison][tabId]['data'][link] = data[comparison][tabId]['data'][link].filter(d => d.highlighted);
        //filteredData[comparison][tabId]['data'][link] = data[comparison][tabId]['data'][link].filter(d => d.highlighted);
        filtered = filtered.concat(data['data'][link].filter(d => d.highlighted));
    }

    return filtered
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

    return data[linkId];
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

    let ds1Clusters = data['data'].map(d => d.ds1_cluster);
    let ds2Clusters = data['data'].map(d => d.ds2_cluster);

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

    let ds1Clusters = data['data'].map(d => d.ds1_cluster);
    let ds2Clusters = data['data'].map(d => d.ds2_cluster);

    let inverse = [];


    for(cluster of Array.from(new Set(ds1Clusters.concat(ds2Clusters)))){
        if(!nodeSelection.includes(cluster)){
            inverse.push(cluster)
        }
    }

    return inverse;
}






// /**
//  * 
//  * @param {Object} activeNodes 
//  * @param {String} comparison 
//  * @param {String} tabId 
//  * @param {ObjectArray} globalDataData 
//  */
// function currentlyClickedGenesByNode(activeNodes, comparison, tabId, globalDataData){

//     let ds1Nodes = activeNodes.filter( d => d.startsWith("ds1"));
//     let ds2Nodes = activeNodes.filter( d => d.startsWith("ds2"));

//     let globalDataDataFiltered = globalDataData.filter( d => d.highlighted === true);

//     return globalDataDataFiltered.filter( d => ds1Nodes.includes(d.ds1_cluster) && ds2Nodes.includes(d.ds2_cluster))

// }



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

    //for(row of data[comparison][tabId]['data']){
    for(row of data['data']){
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


// /**
//  * 
//  */
// function exportGeneList(){

//     selected_genes = global_selection.map(d => d.gene)

//     $.ajax({
//         url: '/', 
//         type: 'POST', 
//         data: selected_genes,
//         contentType: "application/json",
//         dataType: "JSON",
//         success: function(response){
//             console.log("downloaded file")
//         }})

// }


/*
* ################
* ### PROFILES ###
* ################
*/


// /**
//  * 
//  * @param {Array} selection 
//  */
// function getInverseGeneSelection(selection){

//     init_genes = work_data.map(function (d) { return d.gene; });

//     // find set differnce
//     genes_not_in_selection = init_genes.filter(function(x){ return selection.indexOf(x) < 0});

//     return genes_not_in_selection;
// }


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


// /**
//  * 
//  * @param {Object} d 
//  */
// function fixNode(d){
//         alluvial_links = Array.prototype.slice.call(document.getElementsByClassName('alluvial_links'));

//         // node already fixed -> unfix
//         if(document.getElementById("node_" + d.name).className.baseVal.includes("fixed_nodes")) {
//             d3.select("#node_" + d.name)
//                 .classed('fixed_nodes', false)

//                 for (let entry of alluvial_links) {

//                     if (linkIsConnectedToCurrentNode(d, entry)) {

//                         d3.select("#" + entry.id)
//                             .classed('fixed_links', false)

//                         d3.select("#" + entry.id)
//                             .transition().duration(durationTransition)
//                             .style('opacity', non_selected_opacity)
//                     }
//             }
//         }

//         // node not yet fixed -> fix
//         else{
//             d3.select("#node_" + d.name)
//                 .classed('fixed_nodes', true)

//                 for (let entry of alluvial_links) {

//                     if (linkIsConnectedToCurrentNode(d, entry)) {

//                         d3.select("#" + entry.id)
//                             .classed('fixed_links',true)

//                         d3.select("#" + entry.id)
//                             .transition().duration(durationTransition)
//                             .style('opacity', 1)
//                     }
//                 }
//         }
// }


// /**
//  * updates global selection by adding or removing the selection (one line!)
//  * @param {Object} selection one line of an object
//  */
// function updateGlobalSelectionLine(selection) {
//     //current_gene = selection.key;
//     current_gene = selection;
//     gene_line = work_data.filter(function(d) {return d.gene === current_gene});

//     // global selection still empty -> add complete current selection
//     if (global_selection.length === 0) {
//         global_selection.push(gene_line[0]);
//     }

//     // check if gene entry already in global selection (not considering the selected 0/1)
//     else {
//         for (k = 0; k < global_selection.length; k++) {
//             // gene already in global selection -> remove entry
//             if (current_gene === global_selection[k].gene) {
//                 global_selection.splice(k, 1);
//                 break;
//             }

//             // gene not in global selection -> add entry
//             if (current_gene !== global_selection[k].gene && k === global_selection.length - 1) {
//                 global_selection.push(gene_line[0]);
//                 break;
//             }
//         }
//     }
// }



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

    return tabDivId.split("_")[0];
}



/**
 * 
 * @param {String} tabName
 */
function comparisonFromTabName(tabName){

    return tabName.split("_")[0];
}



/**
 * 
 * @param {String} tabDivId 
 */
function tabIdFromTabDivId(tabDivId){

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




// function selectAllGenes(newSelection, currentSelection){
// 	return updateSelection(newSelection, currentSelection);

// }


// function deselectAll(newSelection, currentSelection){
// 	return [];
// }


// function ptcfEntryByGeneId(gene, ptcf){
	
// 	for(let row of ptcf){
// 		if(row.gene === gene){
// 			return row;
// 		}
// 	}
// }


// /**
//  * 
//  * @param {String} gene 
//  * @param {Array} selection 
//  */
// function geneAlreadyInSelection(gene, selection){

// 	let currentSelectionGenes = selection.map(d => d.gene);

// 	return currentSelectionGenes.includes(gene);
// }



/**
 * updates the selection array of a given globalData by adding new objects to it
 * @param {Array} geneList
 * @param {Array} globalData
 * @param {String} comparison
 * @param {String} tabId
 */
function updateSelection(newSelection, currentSelection){

	//currentSelection = currentSelection.filter(d => d.highlighted);

	// trivial case: empty selection -> current genes will be selection
	if(currentSelection.length === 0){

		return newSelection;
	}


	else{

		let newSelectionGenes = new Set(newSelection.map(d => d.gene));
		
		let currentSelectionGenes = new Set(currentSelection.map(d => d.gene));

		let newSelectionGenesOnly = Array.from(new Set([...newSelectionGenes].filter(d => !currentSelectionGenes.has(d))))

		let currentSelectionGenesOnly = Array.from(new Set([...currentSelectionGenes].filter(d => !newSelectionGenes.has(d))))

		newSelectionGenesOnly = newSelection.filter(d => newSelectionGenesOnly.includes(d.gene));

		currentSelectionGenesOnly = currentSelection.filter(d => currentSelectionGenesOnly.includes(d.gene));

		return newSelectionGenesOnly.concat(currentSelectionGenesOnly);
	}	
}

