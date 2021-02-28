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
    let comparison = tabName.split("_")[0];
    let allGenes = getGenesByClusterId(data, d.name, comparison, tabId)
    let filteredData = deepCopyOfGlobalDataSubSet(currentlyChosenGlobalData, comparison, tabId);

    filteredData['data'] = combineLinkSpecificGlobalData2(filteredData['data']);
    filteredData['data'] = filteredData['data'].filter(function(d) { return allGenes.includes(d.gene) && d.highlighted === true });

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
        updateDetailDiagram(currentDetailDiagram, filteredData, link.split("_")[0], link.split("_")[1], tabName, TabId.intersecting);
    }
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
    let comparison = tabName.split("_")[0];
    let filteredData = deepCopyOfGlobalDataSubSet(currentlyChosenGlobalData, comparison, tabId);

    // combine the link specific data
    filteredData['data'] = combineLinkSpecificGlobalData2(filteredData['data']);

    // keep currently hovered genes only
    filteredData['data'] = filteredData['data'].filter(function(d) { return d.highlighted === true});
 
    let ds1Cluster = Array.from(new Set(filteredData['data'].map(d => d.ds1_cluster)));
    let ds2Cluster = Array.from(new Set(filteredData['data'].map(d => d.ds2_cluster)));

    for(let cluster of ds1Cluster){
        updateDetailDiagram(currentDetailDiagram, filteredData, "ds1", cluster.split("_")[1], tabName, TabId.intersecting);
    }

    for(let cluster of ds2Cluster){
        updateDetailDiagram(currentDetailDiagram, filteredData, "ds2", cluster.split("_")[1], tabName, TabId.intersecting);
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
    //let ds1Cluster = Array.from(new Set(filteredData[comparison][tabId]['data'].map(d => d.ds1_cluster)));
    //let ds2Cluster = Array.from(new Set(filteredData[comparison][tabId]['data'].map(d => d.ds2_cluster)));
    let ds1Cluster = Array.from(new Set(filteredData['data'].map(d => d.ds1_cluster)));
    let ds2Cluster = Array.from(new Set(filteredData['data'].map(d => d.ds2_cluster)));

    for(let cluster of ds1Cluster){
        //updateDetailDiagram(currentDetailDiagram, filteredData[comparison][tabId], "ds1", cluster.split("_")[1], tabName, TabId.intersecting);
        updateDetailDiagram(currentDetailDiagram, filteredData, "ds1", cluster.split("_")[1], tabName, TabId.intersecting);
    }

    for(let cluster of ds2Cluster){
        //updateDetailDiagram(currentDetailDiagram, filteredData[comparison][tabId], "ds2", cluster.split("_")[1], tabName, TabId.intersecting);
        updateDetailDiagram(currentDetailDiagram, filteredData, "ds2", cluster.split("_")[1], tabName, TabId.intersecting);
    }
}
