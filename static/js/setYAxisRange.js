
// function getProfileMinMax(data, comparison, tabId){

//     for(let ds of data[comparison][tabId]['data']){
        
//     }
// }


function getCentroidMinMax(data, comparison, tabId){

    // let uniqueClusters = [... new Set(combinedData[comparison][tabId]['data'].map(d => d.ds1_cluster.split("_")[1])
    // .concat(combinedData[comparison][tabId]['data'].map(d => d.ds2_cluster.split("_")[1])))]

    let mins = [];
    let maxs = [];

    for(let ds of ['ds1', 'ds2']){
        let centroidsNested = getDataForCentroidDiagram(data[comparison][tabId], ds)

        for(let clusters of centroidsNested){
            for(let xValues of clusters.values){
                mins.push(xValues.value.lower);
            }
        }

        for(let clusters of centroidsNested){
            for(let xValues of clusters.values){
                maxs.push(xValues.value.upper);
            }
        }
    }

    return{
        'min' : d3.min(mins),
        'max' : d3.max(maxs)
    }
}



// function getBoxMinMax(data, comparison, tabId){

//     for(let ds of data[comparison][tabId]['data']){
        
//     }

// }