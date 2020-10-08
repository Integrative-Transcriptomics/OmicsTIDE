
// global variables
//var global_data = [];
var global_selection = [];
var non_selected_opacity = 0.1;

var clusteredDataTemplate = null;
var matrixCellSelected = false;

/**
 * updates data by altering the "selected" column to show the result of expression filtering
 * @param {Object} data wide data, e.g. loaded by d3.csv()
 * @returns {Object} adapted data
 */
function update(data, tabName, tabId){

    let exp1Min = +document.getElementById('exp1_slider-' + tabName).noUiSlider.get()[0];
    let exp1Max = +document.getElementById('exp1_slider-' + tabName).noUiSlider.get()[1];
    let exp2Min = +document.getElementById('exp2_slider-' + tabName).noUiSlider.get()[0];
    let exp2Max = +document.getElementById('exp2_slider-' + tabName).noUiSlider.get()[1];

    if (tabId === TabId.intersecting){
        for(let d of data){
            d.highlighted =
                ((parseFloat(d.exp1_median) >= exp1Min) && (parseFloat(d.exp1_median) <= exp1Max)) &&
                ((parseFloat(d.exp2_median) >= exp2Min) && (parseFloat(d.exp2_median) <= exp2Max))
                ? true
                : false;
        }
    }

    if (tabId === TabId.nonIntersecting){
        for(let d of data){
            d.highlighted = 
            (
                (geneInDatasetOneOnly(d) ? 
                    // case: genes only in dataset1 
                    ( ( (parseFloat(d.exp1_median) >= exp1Min) && (parseFloat(d.exp1_median) <= exp1Max) ) ? true : false) :
                            // case: genes only in dataset2
                            ( ( (parseFloat(d.exp2_median) >= exp2Min) && (parseFloat(d.exp2_median) <= exp2Max) ) ? true : false))
            )
        }
        
    }


    return data;
}



function geneInDatasetOneOnly(row){
        return row.exp1_median !== null && row.exp2_median === null;
}








function geneInBothDatasets(row){
    return row.exp1_median !== null && row.exp2_median !== null;
}

function geneInNeitherDatasets(row){
    return row.exp1_median !== null && row.exp2_median !== null;
}


function checkNonIntersecting(row, exp1Min, exp1Max, exp2Min, exp2Max){

    // should not happend
    if(geneInBothDatasets(row) || geneInNeitherDatasets(row)){
        console.log("should not happen!")

        return;
    }

    // gene only in experiment 1
    if(row.exp1_median !== null && row.exp2_median === null){
        console.log("exp1 only!")

        return (parseFloat(row.exp1_median) >= exp1Min) && (parseFloat(row.exp1_median) <= exp1Max) ? true : false;
    }

    // gene only in experiment 2
    if(row.exp1_median === null && row.exp2_median !== null){
        console.log("exp2 only!")

        return (parseFloat(row.exp2_median) >= exp2Min) && (parseFloat(row.exp2_median) <= exp2Max) ? true : false;
    }
}




function updateXY(current){

    let tabName = current.id.split("-")[1];

    let tabId = tabName.split("_")[4];

    let diagramId = current.value;

    let comparison = tabName.split("_")[0] + "_" + tabName.split("_")[1] + "_" + tabName.split("_")[2] + "_" + tabName.split("_")[3];

    for(let exp of ["exp1", "exp2"]){
        for(let i=1; i <= globalData[comparison][tabId]['cluster_count']; i++){
        
            updateDetailDiagram(diagramId, globalData[comparison][tabId], exp, i, tabName, tabId);
        }
    }
}




/**
  *
  * @param{element} current
  * @param{String} tabId
  */
function updateDiagram(current, tabId){

    console.log(current);

    let value = current.value;
    let filteredData = JSON.parse(JSON.stringify(globalData))
    let tabDivId = current.id.split("-")[current.id.split("-").length-1];
    let comparisonId = tabDivId.split("_")[0] + "_" + tabDivId.split("_")[1] + "_" + tabDivId.split("_")[2] + "_" + tabDivId.split("_")[3];

    filteredData[comparisonId][tabId]['data'] = filteredData[comparisonId][tabId]['data'].filter(function(d) { return d.highlighted === true});

    // if(value === "centroid" || value === "profiles"){
    //     profilePerCluster(filteredData, "clustered-data-information-data-profiles-left-" + tabDivId, "clustered-data-information-data-profiles-right-" + tabDivId, tabDivId)
    // }

    // else if(value === "boxplot"){
    //     boxplotPerCluster(filteredData, "clustered-data-information-data-profiles-left-" + tabDivId, "clustered-data-information-data-profiles-right-" + tabDivId, tabDivId)
    // }

    if(tabId === "intersecting"){

        detailDiagramsPerCluster(DiagramId[value], 
            filteredData[comparisonId][tabId], 
            "clustered-data-information-data-profiles-left-" + tabDivId, 
            "clustered-data-information-data-profiles-right-" + tabDivId,
            tabDivId,
            TabId.intersecting);
    }

    if(tabId === "nonIntersecting"){
        detailDiagramsPerCluster(DiagramId[value], 
            filteredData[comparisonId][tabId], 
            "non-intersecting-information-data-left-" + tabDivId, 
            "non-intersecting-information-data-right-" + tabDivId, 
            tabDivId,
            TabId.nonIntersecting);
    }
          
}