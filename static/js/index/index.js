
var non_selected_opacity = 0.1;
var currentlyChosenGlobalData = {};

/**
 * 
 * @param {Object} row 
 */
function geneInDatasetOneOnly(row){
        return row.ds1_median !== null && row.ds2_median === null;
}

/**
 * 
 * @param {Object} row 
 */
function geneInBothDatasets(row){
    return row.ds1_median !== null && row.ds2_median !== null;
}

/**
 * 
 * @param {Object} row 
 */
function geneInNeitherDatasets(row){
    return row.ds1_median !== null && row.ds2_median !== null;
}

// /**
//  * 
//  * @param {Object} row 
//  * @param {float} ds1Min 
//  * @param {float} ds1Max 
//  * @param {float} ds2Min 
//  * @param {float} ds2Max 
//  */
// function checkNonIntersecting(row, ds1Min, ds1Max, ds2Min, ds2Max){

//     // should not happend
//     if(geneInBothDatasets(row) || geneInNeitherDatasets(row)){
//         console.log("should not happen!")

//         return;
//     }

//     // gene only in experiment 1
//     if(row.ds1_median !== null && row.ds2_median === null){
//         console.log("ds1 only!")

//         return (parseFloat(row.ds1_median) >= ds1Min) && (parseFloat(row.ds1_median) <= ds1Max) ? true : false;
//     }

//     // gene only in experiment 2
//     if(row.ds1_median === null && row.ds2_median !== null){
//         console.log("ds2 only!")

//         return (parseFloat(row.ds2_median) >= ds2Min) && (parseFloat(row.ds2_median) <= ds2Max) ? true : false;
//     }
// }

/**
 * 
 * @param {Element} current 
 * @param {String} tabId 
 */
function updateDiagram(current, tabId){

    let data = createDeepCopyofData(document.getElementById("data-json").value);
    data = combineLinkSpecificGlobalData(data);

    let value = current.value;

    let tabName = current.id.split("-")[2];
    let comparison = tabName.split("_")[0];

    data[comparison][tabId]['data'] = data[comparison][tabId]['data'].filter(function(d) { return d.highlighted });

    if(tabId === "intersecting"){

        detailDiagramsPerCluster(DiagramId[value], 
            data[comparison][tabId], 
            "first-level-intersecting-information-data-profiles-left-" + tabName, 
            "first-level-intersecting-information-data-profiles-right-" + tabName,
            tabName,
            TabId.intersecting,
            comparison);
    }

    if(tabId === "nonIntersecting"){

        detailDiagramsPerCluster(DiagramId[value], 
            data[comparison][tabId], 
            "first-level-non-intersecting-information-data-left-" + tabName, 
            "first-level-non-intersecting-information-data-right-" + tabName, 
            tabName,
            TabId.nonIntersecting,
            comparison);
    
    }   
}

/**
 * radio buttons - data loading
 * @param {Element} element 
 */
function changeActivityOfInput(element){

    if(element.id === "own-radio-button"){
        document.getElementById("dropdownMenuButton").classList.add("disabled");

        if(document.getElementById("files").disabled){
            document.getElementById("files").removeAttribute("disabled");
            document.getElementById("study-selected-value").innerHTML = "";
        }
    }

    if(element.id === "test-radio-button"){
        document.getElementById("files").disabled = true;

        if(document.getElementById("dropdownMenuButton").classList.contains("disabled")){
            document.getElementById("dropdownMenuButton").classList.remove("disabled");

            document.getElementById("files").value = "";
        }
    }
}