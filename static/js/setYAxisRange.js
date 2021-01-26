
function getProfileMinMax(data, comparison, tabId){

    for(let ds of data[comparison][tabId]['data']){
        
    }
}


function getCentroidMinMax(data, comparison, tabId){

    let combinedData = combineLinkSpecificGlobalData(data);

    let uniqueClusters = [... new Set(combinedData[comparison][tabId]['data'].map(d => d.ds1_cluster.split("_")[1])
    .concat(combinedData[comparison][tabId]['data'].map(d => d.ds2_cluster.split("_")[1])))]

    let mins = [];
    let maxs = [];

    for(let ds of ['ds1', 'ds2']){
        let centroidsNested = getDataForCentroidDiagram(combinedData[comparison][tabId], ds)

        console.log(centroidsNested);

        mins.push(getAbsoluteValues(centroidsNested, "lower"));
        maxs.push(getAbsoluteValues(centroidsNested, "upper"));
    
    }

    console.log(mins);
    console.log(maxs);

    return{
        'min' : d3.min(mins),
        'max' : d3.min(maxs)
    }
}



function getBoxMinMax(data, comparison, tabId){

    for(let ds of data[comparison][tabId]['data']){
        
    }

}