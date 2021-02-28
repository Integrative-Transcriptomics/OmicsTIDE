$(document).on('click', '.first-level-non-intersecting-detail', function(event) {

    // get clicked div id
    let currentDiv = jQuery(this).attr("id");

    // get comparison id
    let comparison = currentDiv.split("_")[3];
    let tabId = currentDiv.split("_")[4];
    let completeId = comparison + "_" + tabId;

    openSelectionAccordion(completeId);
    GenesByDiagramClick(currentDiv);

    let globalDataCopy = deepCopyOfGlobalDataSubSet(currentlyChosenGlobalData, comparison, tabId);
    let combinations = getDatasetCombinations(globalDataCopy['selection']);

    createTable("first-level-non-intersecting-information-controls-table-" + comparison + "_" + tabId, combinations, comparison, tabId);
});


/**
* filters the data ObjectArray based on the clicked Id 
* @param {String} clickedId 
*/
function GenesByDiagramClick(clickedId) {

let dataset = clickedId.split("_")[1];
let cluster = clickedId.split("_")[2];
let comparison = clickedId.split("_")[3];
let tabId = clickedId.split("_")[4];

//let globalDataCopy = createDeepCopyofData(document.getElementById("data-json").value);
let globalDataCopy = deepCopyOfGlobalDataSubSet(currentlyChosenGlobalData, comparison, tabId);

//let currentSelection = globalDataCopy[comparison][tabId]['selection'];
let currentSelection = globalDataCopy['selection'];

//let data = globalDataCopy[comparison][tabId]['data'];
let data = globalDataCopy['data'];

let newSelection = data.filter(d => (d.ds1_cluster === dataset + "_" + cluster || d.ds2_cluster === dataset + "_" + cluster));

//globalDataCopy[comparison][tabId]['selection'] = updateSelection(newSelection, currentSelection);
globalDataCopy['selection'] = updateSelection(newSelection, currentSelection);

//document.getElementById("data-json").value = JSON.stringify(globalDataCopy);

updateGlobalDataSubset(currentlyChosenGlobalData, comparison, tabId, 'selection', globalDataCopy['selection']);
}