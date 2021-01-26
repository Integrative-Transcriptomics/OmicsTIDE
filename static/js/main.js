
// global variables
//var global_data = [];
var global_selection = [];
var non_selected_opacity = 0.1;
var clusteredDataTemplate = null;
var matrixCellSelected = false;





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

    let data = createDeepCopyofData(document.getElementById("data-json").value);
    data = combineLinkSpecificGlobalData(data);

    let value = current.value;
    //let filteredData = JSON.parse(JSON.stringify(globalData))

    let tabName = current.id.split("-")[2];
    let comparison = tabName.split("_")[0];

    data[comparison][tabId]['data'] = data[comparison][tabId]['data'].filter(function(d) { return d.highlighted});

    console.log(comparison);

    if(tabId === "intersecting"){

        detailDiagramsPerCluster(DiagramId[value], 
            data[comparison][tabId], 
            "clustered-data-information-data-profiles-left-" + tabName, 
            "clustered-data-information-data-profiles-right-" + tabName,
            tabName,
            TabId.intersecting,
            comparison);
    }

    if(tabId === "nonIntersecting"){

        detailDiagramsPerCluster(DiagramId[value], 
            data[comparison][tabId], 
            "non-intersecting-information-data-left-" + tabName, 
            "non-intersecting-information-data-right-" + tabName, 
            tabName,
            TabId.nonIntersecting,
            comparison);
    
    }   
}

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