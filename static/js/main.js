
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

    let ds1Min = +document.getElementById('ds1_slider-' + tabName).noUiSlider.get()[0];
    let ds1Max = +document.getElementById('ds1_slider-' + tabName).noUiSlider.get()[1];
    let ds2Min = +document.getElementById('ds2_slider-' + tabName).noUiSlider.get()[0];
    let ds2Max = +document.getElementById('ds2_slider-' + tabName).noUiSlider.get()[1];

    if (tabId === TabId.intersecting){
        for(let d of data){
            d.highlighted =
                ((parseFloat(d.ds1_median) >= ds1Min) && (parseFloat(d.ds1_median) <= ds1Max)) &&
                ((parseFloat(d.ds2_median) >= ds2Min) && (parseFloat(d.ds2_median) <= ds2Max))
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
                    ( ( (parseFloat(d.ds1_median) >= ds1Min) && (parseFloat(d.ds1_median) <= ds1Max) ) ? true : false) :
                            // case: genes only in dataset2
                            ( ( (parseFloat(d.ds2_median) >= ds2Min) && (parseFloat(d.ds2_median) <= ds2Max) ) ? true : false))
            )
        }
        
    }


    return data;
}



function geneInDatasetOneOnly(row){
        return row.ds1_median !== null && row.ds2_median === null;
}

function geneInBothDatasets(row){
    return row.ds1_median !== null && row.ds2_median !== null;
}

function geneInNeitherDatasets(row){
    return row.ds1_median !== null && row.ds2_median !== null;
}


function checkNonIntersecting(row, ds1Min, ds1Max, ds2Min, ds2Max){

    // should not happend
    if(geneInBothDatasets(row) || geneInNeitherDatasets(row)){
        console.log("should not happen!")

        return;
    }

    // gene only in experiment 1
    if(row.ds1_median !== null && row.ds2_median === null){
        console.log("ds1 only!")

        return (parseFloat(row.ds1_median) >= ds1Min) && (parseFloat(row.ds1_median) <= ds1Max) ? true : false;
    }

    // gene only in experiment 2
    if(row.ds1_median === null && row.ds2_median !== null){
        console.log("ds2 only!")

        return (parseFloat(row.ds2_median) >= ds2Min) && (parseFloat(row.ds2_median) <= ds2Max) ? true : false;
    }
}




function updateXY(current){

    let tabName = current.id.split("-")[1];

    let tabId = tabName.split("_")[4];

    let diagramId = current.value;

    let comparison = tabName.split("_")[0] + "_" + tabName.split("_")[1] + "_" + tabName.split("_")[2] + "_" + tabName.split("_")[3];

    for(let ds of ["ds1", "ds2"]){
        for(let i=1; i <= globalData[comparison][tabId]['cluster_count']; i++){
        
            updateDetailDiagram(diagramId, globalData[comparison][tabId], ds, i, tabName, tabId);
        }
    }
}




/**
  *
  * @param{element} current
  * @param{String} tabId
  */
function updateDiagram(current, tabId){

    let value = current.value;
    let filteredData = JSON.parse(JSON.stringify(globalData))
    let tabDivId = current.id.split("-")[current.id.split("-").length-1];
    let comparisonId = tabDivId.split("_")[0] + "_" + tabDivId.split("_")[1] + "_" + tabDivId.split("_")[2] + "_" + tabDivId.split("_")[3];

    filteredData[comparisonId][tabId]['data'] = filteredData[comparisonId][tabId]['data'].filter(function(d) { return d.highlighted === true});

    // 15/10/20 commented to testing update instead
    // if(tabId === "intersecting"){

    //     detailDiagramsPerCluster(DiagramId[value], 
    //         filteredData[comparisonId][tabId], 
    //         "clustered-data-information-data-profiles-left-" + tabDivId, 
    //         "clustered-data-information-data-profiles-right-" + tabDivId,
    //         tabDivId,
    //         TabId.intersecting);
    // }

    // if(tabId === "nonIntersecting"){
    //     detailDiagramsPerCluster(DiagramId[value], 
    //         filteredData[comparisonId][tabId], 
    //         "non-intersecting-information-data-left-" + tabDivId, 
    //         "non-intersecting-information-data-right-" + tabDivId, 
    //         tabDivId,
    //         TabId.nonIntersecting);
    // }

    
    //detailDiagram(diagramId, data, experimentId, clusterNumber, tabDivId, tabId)
    //updateDetailDiagram(diagramId, data, experimentId, clusterNumber, tabDivId, tabId)

    // --> update all!

    


    if(tabId === "intersecting"){

        detailDiagramsPerCluster(DiagramId[value], 
            filteredData[comparisonId][tabId], 
            "clustered-data-information-data-profiles-left-" + tabDivId, 
            "clustered-data-information-data-profiles-right-" + tabDivId,
            tabDivId,
            TabId.intersecting);

        //updateAllDetailDiagrams(DiagramId[value], comparisonId, filteredData[comparisonId][tabId], tabDivId, TabId.intersecting);
    }

    if(tabId === "nonIntersecting"){

        detailDiagramsPerCluster(DiagramId[value], 
            filteredData[comparisonId][tabId], 
            "non-intersecting-information-data-left-" + tabDivId, 
            "non-intersecting-information-data-right-" + tabDivId, 
            tabDivId,
            TabId.nonIntersecting);
        
        //updateAllDetailDiagrams(DiagramId[value], comparisonId, filteredData[comparisonId][tabId], tabDivId, TabId.nonIntersecting);
    }
          

    
}



//function updateAllDetailDiagrams(diagramId, data, experimentId, clusterNumber, tabDivId, tabId)

// function updateAllDetailDiagrams(diagramId, comparisonId, data, tabDivId, tabId){

//     let currentTrendsDsOne = Array.from(new Set(globalData[comparisonId][tabId]['data'].map(d => d.ds1_cluster)));
//     let currentTrendsDsTwo = Array.from(new Set(globalData[comparisonId][tabId]['data'].map(d => d.ds2_cluster)));

//     let experiments = [];
//     let trends = [];
//     for(let trend of currentTrendsDsOne){
//         experiments.push(trend.split("_")[0]);
//         trends.push(trend.split("_")[1]);
//     }

//     for(let trend of currentTrendsDsTwo){
//         experiments.push(trend.split("_")[0]);
//         trends.push(trend.split("_")[1]);
//     }

//     experiments = Array.from(new Set(experiments));
//     trends = Array.from(new Set(trends));

//     for(let exp of experiments){
//         for(let trend of trends){
//             updateDetailDiagram(diagramId, data, exp, trend, tabDivId, tabId)
//         }
//     }

    

// }