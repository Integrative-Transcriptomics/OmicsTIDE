
// /**
//  * 
//  * @param {ObjectArray} data 
//  * @param {String} comparison 
//  * @param {String} tabId 
//  */
// function getCentroidMinMax(data, comparison, tabId){

//     // let uniqueClusters = [... new Set(combinedData[comparison][tabId]['data'].map(d => d.ds1_cluster.split("_")[1])
//     // .concat(combinedData[comparison][tabId]['data'].map(d => d.ds2_cluster.split("_")[1])))]

// }



/**
 * 
 * @param {ObjectArray} data 
 */
function updateYScalesMinMax(data, comparison, tabId){

    let copy = JSON.parse(JSON.stringify(data));

    copy.data = combineLinkSpecificGlobalData2(copy.data);
    
    let yRangesCentroids = createYRangesCentroid(copy);
    
    let yRangesProfiles = createYRangesProfile(copy, comparison, tabId);

    let yRangesBox = createYRangesBox(copy, comparison, tabId);  

    //return "test";

    return {
        'centroidMinMax' : yRangesCentroids,
        'profilesMinMax' : yRangesProfiles,
        'boxesMinMax' : yRangesBox
        //,
        // 'profilesMinMax' : yRangesProfiles,
        // 'boxesMinMax' : yRangesBox
    }

}


/**
 * 
 * @param {ObjectArray} data 
 * @param {String} comparison 
 * @param {String} tabId 
 */
//function createYRangesCentroid(data, comparison, tabId){
function createYRangesCentroid(data){    

    let mins = [];
    let maxs = [];

    for(let ds of ['ds1', 'ds2']){
        //let centroidsNested = getDataForCentroidDiagram(data[comparison][tabId], ds)
        let centroidsNested = getDataForCentroidDiagram(data, ds);

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
        'centroidMin' : d3.min(mins),
        'centroidMax' : d3.max(maxs),
    };
}




function createYRangesProfile(data, comparison, tabId){    

    console.log(data);


    let ds1Cluster = data['data'].map(d => d.ds1_cluster !== null ? d.ds1_cluster : "");
    let ds2Cluster = data['data'].map(d => d.ds2_cluster !== null ? d.ds2_cluster : "");

    let clusters = ds1Cluster.concat(ds2Cluster);
    clusters = clusters.map(d => d.startsWith("ds") ? d.split("_")[1] : null)
    clusters = [... new Set(clusters)];
    clusters = clusters.filter(d => d !== null);

    console.log(clusters);

    let values = [];

    for(let ds of ['ds1', 'ds2']){
        //let centroidsNested = getDataForCentroidDiagram(data[comparison][tabId], ds)

        for(let cluster of clusters){

            let profilesNestedSelected = getDataForProfileDiagram(data, ds, cluster, true);
            let profilesNested = getDataForProfileDiagram(data, ds, cluster, false);

            for(let row of profilesNestedSelected){
                for(let xValue of row.values){
                    values.push(xValue.value);
                }
            }

            for(let row of profilesNested){
                for(let xValue of row.values){
                    values.push(xValue.value);
                }
            }
        }
    }

    return{
        'profilesMin' : d3.min(values),
        'profilesMax' : d3.max(values),
    };

}



function createYRangesBox(data, comparison, tabId){ 

    let mins = [];
    let maxs = [];

    for(let ds of ['ds1', 'ds2']){
        //let centroidsNested = getDataForCentroidDiagram(data[comparison][tabId], ds)

            let boxes = getDataForBoxDiagram(data, ds);

            for(let xValue of boxes){
                if (xValue.value.outlierUpper.length > 0){
                    maxs.push(d3.max(xValue.value.outlierUpper));
                }

                if (xValue.value.outlierUpper.length === 0){
                    maxs.push(xValue.value.upper);
                }

                if (xValue.value.outlierLower.length > 0){
                    mins.push(d3.max(xValue.value.outlierLower));
                }

                if (xValue.value.outlierLower.length === 0){
                    mins.push(xValue.value.lower);
                }
            }
    }

    return{
        'boxesMin' : d3.min(mins),
        'boxesMax' : d3.max(maxs)
    };


}