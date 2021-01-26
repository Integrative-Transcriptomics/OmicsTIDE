/*
#########################
### GENE HIGHLIGHTING ###
#########################

- TASK1: Highlighting of one to many gene-profiles in red color in the first-level analysis tab.
- TASK2: Unhighlighting of one to many gene-profiles.
- TASK3: Informing the user about genes asked to be highlighted but not found in the current data.

- INPUT OPTION1: Comma-separated text input
- INPUT OPTION2: Linebreak-separated text file

*/



/**
 * TASK 2
 * sets all 'profile_selected'-Parameter in globalDataCopy to false
 * @param {*} data globalDataCopy
 * @param {*} comparison current comparison
 * @param {*} tabId current tabId, used to distinguish between the link-separated intersecting genes and non-intersecting genes
 */
function removeAllHighlightingFromData(data, comparison, tabId){

    // link-separated data (intersecting)
    if(tabId === TabId.intersecting){
        for(let link of Object.keys(data[comparison][tabId]['data'])){

            console.log(link);

            for(let row of data[comparison][tabId]['data'][link]){
                row.profile_selected = false;
            }
        }
    }

    // non-intersecting genes
    else{
        for(let row of data[comparison][tabId]['data']){
            row.profile_selected = false;
        }
    }

    return data;
}



/**
 * removes highlighting or adds highlighting depending in highlighting state
 * updates globalData
 * @param {*} current buttonId
 */
function updateGeneHighlightingByTextInput(current){

    // alert("refactoring ... currently disabled");
    // return;

    let tabName = tabDivIdFromElement(current);

    let geneString = geneStringFromTextInput(tabName);

    let comparison = comparisonFromTabDivId(tabName);

    let tabId = tabIdFromTabDivId(tabName);

    let geneList = geneArrayFromGeneString(geneString, ',');

    let globalDataCopy = createDeepCopyofData(document.getElementById("data-json").value);

    if(globalDataCopy[comparison][tabId]['gene_highlight_active']){

        if(geneString === ""){
            alert("Input is empty!");
        }
        
        globalDataCopy = removeAllHighlightingFromData(globalDataCopy, comparison, tabId);

        globalDataCopy[comparison][tabId]['gene_highlight_active'] = false;
    }

    else{

        globalDataCopy = addHighlightingByGeneList(globalDataCopy, comparison, tabId, geneList);

        globalDataCopy[comparison][tabId]['gene_highlight_active'] = true;
    }

    // updating the globalData
    bindDataToDiv(globalDataCopy);

    updateHighlightingInProfileDiagrams(comparison, tabId, tabName);

    //filter globalDataCopy
    // globalDataCopy[comparison][tabId]['data'] = combineLinkSpecificGlobalData(globalDataCopy)[comparison][tabId]['data'].filter(d => d.highlighted);


    // if(tabId === "intersecting"){

    //     detailDiagramsPerCluster(DiagramId.profile, 
    //         globalDataCopy[comparison][tabId], 
    //         "clustered-data-information-data-profiles-left-" + tabName, 
    //         "clustered-data-information-data-profiles-right-" + tabName,
    //         tabName,
    //         TabId.intersecting);
    // }

    // if(tabId === "nonIntersecting"){

    //     detailDiagramsPerCluster(DiagramId.profile, 
    //         globalDataCopy[comparison][tabId], 
    //         "non-intersecting-information-data-left-" + tabName, 
    //         "non-intersecting-information-data-right-" + tabName, 
    //         tabName,
    //         TabId.nonIntersecting);
    
    // }   

}



function updateHighlightingInProfileDiagrams(comparison, tabId, tabName){

    //filter globalDataCopy
    let globalDataCopy = createDeepCopyofData(document.getElementById("data-json").value);
    globalDataCopy[comparison][tabId]['data'] = combineLinkSpecificGlobalData(globalDataCopy)[comparison][tabId]['data'].filter(d => d.highlighted);


    if(tabId === "intersecting"){

        detailDiagramsPerCluster(DiagramId.profile, 
            globalDataCopy[comparison][tabId], 
            "clustered-data-information-data-profiles-left-" + tabName, 
            "clustered-data-information-data-profiles-right-" + tabName,
            tabName,
            TabId.intersecting);
    }

    if(tabId === "nonIntersecting"){

        detailDiagramsPerCluster(DiagramId.profile, 
            globalDataCopy[comparison][tabId], 
            "non-intersecting-information-data-left-" + tabName, 
            "non-intersecting-information-data-right-" + tabName, 
            tabName,
            TabId.nonIntersecting);
    
    }   


}




/**
 * TASK1
 * extracts all genes in the globalDataCopy based on comparison and tabId and returns an array of gene IDs
 * @param {*} data 
 * @param {*} comparison 
 * @param {*} tabId 
 */
function getAllGenesInCurrentData(data, comparison, tabId){

    console.log(data);

    let allGenes = [];

    if(tabId === TabId.intersecting){
        
        for(let link of Object.keys(data[comparison][tabId]['data'])){
            console.log(link);
            for(let row of data[comparison][tabId]['data'][link]){
                allGenes.push(row.gene);
            }
        }
    }

    else{
        for(let row of data[comparison][tabId]['data']){
            allGenes.push(row.gene);
        }
    }

    return allGenes;
}


/**
 * TASK1
 * sets profile_selected to true for all genes in globalDataCopy appearing in the input
 * @param {*} data 
 * @param {*} comparison 
 * @param {*} tabId 
 * @param {*} geneIntersection 
 */
function updateGeneEntries(data, comparison, tabId, geneIntersection){

        // link-separated data (intersecting)
    if(tabId === TabId.intersecting){
        for(let link of Object.keys(data[comparison][tabId]['data'])){
            for(let row of data[comparison][tabId]['data'][link]){
                if(geneIntersection.includes(row.gene)){
                    console.log(row.gene);
                    row.profile_selected = true;
                }
            }
        }
    }

    // non-intersecting genes
    else{
        for(let row of data[comparison][tabId]['data']){
            if(geneIntersection.includes(row.gene)){
                row.profile_selected = true;
            }
        }
    }

    return data;
}




/**
 * TASK1 
 * sets all 'profile_selected'-Parameter in globalDataCopy to true if they appear in the geneList
 * @param {*} data 
 * @param {*} comparison 
 * @param {*} tabId 
 * @param {*} geneList 
 */
function addHighlightingByGeneList(data, comparison, tabId, geneList){

    let trimmedGeneNames = geneList.map(d => d.trim());

    let allGenesInDataset = getAllGenesInCurrentData(data, comparison, tabId)

    let geneIntersection = trimmedGeneNames.filter(d => allGenesInDataset.includes(d));

    let genesNotFound = trimmedGeneNames.filter(d => !allGenesInDataset.includes(d));

    if(genesNotFound.length > 0){
        alert("Genes not Found: " + genesNotFound);
    }

    return updateGeneEntries(data, comparison, tabId, geneIntersection);

}









function loadGeneFilterFile(current){

    let tabName = tabDivIdFromElement(current);

    let comparison = comparisonFromTabDivId(tabName);

    let tabId = tabIdFromTabDivId(tabName);

    let globalDataCopy = createDeepCopyofData(document.getElementById("data-json").value);

    if(document.getElementById('file_goi-' + tabName).files.length === 0) {
            alert("No file selected!");
            return;
    }

    if(globalDataCopy[comparison][tabId]['gene_highlight_active']){
        
        globalDataCopy = removeAllHighlightingFromData(globalDataCopy, comparison, tabId);

        globalDataCopy[comparison][tabId]['gene_highlight_active'] = false;

        bindDataToDiv(globalDataCopy)

        updateHighlightingInProfileDiagrams(comparison, tabId, tabName);
    }

    else{

        // https://www.nature.com/articles/ja201719/tables/1 (shows genes related to PhoP operon)

        const reader = new FileReader();
        
        reader.onload = function fileReadCompleted(){
            
            let geneString = reader.result;
            
            let geneList = geneString.split("\n");

            globalDataCopy = addHighlightingByGeneList(globalDataCopy, comparison, tabId, geneList);

            globalDataCopy[comparison][tabId]['gene_highlight_active'] = true; 

            bindDataToDiv(globalDataCopy)

            updateHighlightingInProfileDiagrams(comparison, tabId, tabName);

        };

        reader.readAsText(document.getElementById('file_goi-' + tabName).files[0]);
    }


    // updating the globalData

    //filter globalDataCopy
    // globalDataCopy[comparison][tabId]['data'] = combineLinkSpecificGlobalData(globalDataCopy)[comparison][tabId]['data'].filter(d => d.highlighted);


    // if(tabId === "intersecting"){

    //     detailDiagramsPerCluster(DiagramId.profile, 
    //         globalDataCopy[comparison][tabId], 
    //         "clustered-data-information-data-profiles-left-" + tabName, 
    //         "clustered-data-information-data-profiles-right-" + tabName,
    //         tabName,
    //         TabId.intersecting);
    // }

    // if(tabId === "nonIntersecting"){

    //     detailDiagramsPerCluster(DiagramId.profile, 
    //         globalDataCopy[comparison][tabId], 
    //         "non-intersecting-information-data-left-" + tabName, 
    //         "non-intersecting-information-data-right-" + tabName, 
    //         tabName,
    //         TabId.nonIntersecting);
    
    // }     
}


//var geneFilterActivated = false;




// function filteredDataSubset(data, comparison, tabId){

//     // create deep copy 
//     let filteredData = JSON.parse(JSON.stringify(data));
    
//     // keep filtered data only
//     filteredData[comparison][tabId]['data'] = filteredData[comparison][tabId]['data'].filter(function(d) { return d.highlighted === true});

//     return filteredData;
// }


// function updateAllDetailDiagramsByFilteredData(data, comparison, tabId, diagramId){
    
//     let filteredData = filteredDataSubset(data, comparison, tabId)   

//     for(let ds of ['ds1', 'ds2']){
//         for(let cluster = 1; cluster <= filteredData[comparison][tabId]['cluster_count']; cluster++ ){
//             updateDetailDiagram(diagramId, filteredData[comparison][tabId], ds, cluster, comparison + "_" + tabId, tabId);
//         }
//     }

// }










function updateHighlightLines(geneList, tabName){

    let comparison = tabName.split("_")[0] + "_" + tabName.split("_")[1] + "_" + tabName.split("_")[2] + "_" + tabName.split("_")[3];

    let tabId = tabName.split("_")[4];

    let diagramId = getActiveRadioButton(tabName);

    let filteredData = JSON.parse(JSON.stringify(globalData));

    for(let ds of ['ds1', 'ds2']){
        for(let cluster = 1; cluster <= filteredData[comparison][tabId]['cluster_count']; cluster++){
            updateDetailDiagram(diagramId, filteredData[comparison][tabId], ds, cluster, tabName, tabId);
        }
    }
}