
/**
 * 
 * @param {Array} inverseSelection 
 * @param {String} comparison 
 * @param {String} tabId 
 */
function removeActivityFromDetailDiagram(inverseSelection, comparison, tabId){

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

        d3.select("#node_" + inv + "_first-level-intersecting-information-data-sankey-" + comparison + "_" + tabId)
        .transition()
        .duration(durationTransition)
        .style('opacity', 0.2)
    }
    //node_ds1_1_first-level-intersecting-information-data-sankey-file_1_file_2_intersecting
}


/**
 * 
 * @param {Array} inverseSelection 
 * @param {String} comparison 
 * @param {String} tabId 
 */
function addActivityToNodes(inverseSelection, comparison, tabId){

    for(let inv of inverseSelection){
        d3.select("#node_" + inv + "_first-level-intersecting-information-data-sankey-" + comparison + "_" + tabId)
        .transition()
        .duration(durationTransition)
        .style('opacity', 1)
    }
    
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
