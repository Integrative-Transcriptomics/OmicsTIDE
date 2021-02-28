

/**
 * @param {ObjectArray} data 
 * @param {String} experimentId 
 * @param {int} clusterNumber 
 * @param {SvgObject} currentSvg 
 * @param {ScaleFunction} currentXScale 
 * @param {ScaleFunction} currentYScale 
 * @param {String} tabId 
 */
 function renderCentroidDiagram(data, experimentId, clusterNumber, currentSvg, currentXScale, currentYScale, tabId){

    let centroidsNested = getDataForCentroidDiagram(data, experimentId, clusterNumber)

    // updating domains
    let currentXDomain = getCurrentXDomain(DiagramId.centroid, centroidsNested, experimentId);

    // calling axis
    currentXScale.domain(currentXDomain);

    let minValue = data.yScales.centroidMinMax.centroidMin;
    let maxValue = data.yScales.centroidMinMax.centroidMax;

    currentYScale.domain([minValue, maxValue]);

    let tickRange = createTickRange(minValue, maxValue, 0.5, -6, 6);

    if(tabId !== "matrix"){

        currentSvg.selectAll(".x_axis")
        .attr("transform", "translate(0," + (curr_height - marginRelative.bottom) + ")")
        //.transition()
        //.duration(durationTransition)
        .call(d3.axisBottom(currentXScale));
    
        currentSvg.selectAll(".y_axis")
        //.transition()
        //.duration(durationTransition)
        .call(d3.axisLeft(currentYScale)
        .tickValues(tickRange) 
        );

    }


    if(tabId === "matrix"){
        currentSvg.selectAll(".x_axis").selectAll("text").remove();
    }


	let centroid = currentSvg.selectAll(".centroid")
            .data(centroidsNested);

        // append path, bind data, call line generator
        centroid
            .enter()
            .append("path")
            .attr("class", "centroid")
            .merge(centroid)
            .attr("fill", "none")
            .attr("stroke", d => color(d.key))
            .attr("stroke-opacity", 1)
            .attr("stroke-width", 2)
            .attr("id", d => "centroid_" + d.key.split(/_(.+)/)[1])
            .transition()
            .duration(durationTransition)
            .attr("d", function(d) {
                return d3.line()
                        .x(function(d) {
                            return currentXScale(d.key.split(/_(.+)/)[1]) })
                        .y(function(d) {
                            return currentYScale(Math.round((d.value.avg + Number.EPSILON) * 100) / 100); })
                        (d.values)
            });

        centroid
            .exit()
            .transition()
            .duration(durationTransition)
            .style("stroke-opacity", 0)
            .remove();


        let upper = currentSvg.selectAll(".upper")
            .data(centroidsNested);

        upper
            .enter()
            .append("path")
            .attr("class", "upper")
            .merge(upper)
            .attr("fill", "none")
            .attr("stroke", d => color(d.key))
            .attr("stroke-opacity", 0.3)
            .attr("stroke-width", 2)
            .attr("id", function(d){
                return "centroid_upper_" + d.key.split(/_(.+)/)[1];
            })
            .transition()
            .duration(durationTransition)
            .attr("d", function(d) {
                return d3.line()
                        .x(function(d) {
                            return currentXScale(d.key.split(/_(.+)/)[1]) })
                        .y(function(d) {
                            return currentYScale(d.value.upper);})
                        (d.values)
            })

        upper
            .exit()
            .transition()
            .duration(durationTransition)
            .style("stroke-opacity", 0)
            .remove();


        let lower = currentSvg.selectAll(".lower")
            .data(centroidsNested);

        lower
            .enter()
            .append("path")
            .attr("class", "lower")
            .merge(lower)
            .attr("fill", "none")
            .attr("stroke", d => color(d.key))
            .attr("stroke-opacity", 0.3)
            .attr("stroke-width", 2)
            .attr("id", function(d){
                return "centroid_lower_" + d.key.split(/_(.+)/)[1];
            })
            .transition()
            .duration(durationTransition)
            .attr("d", function(d) {
                return d3.line()
                        .x(function(d) {
                            return currentXScale(d.key.split(/_(.+)/)[1]) })
                        .y(function(d) {
                            return currentYScale(Math.round((d.value.lower + Number.EPSILON) * 100) / 100);})
                        (d.values)
            })

        lower
            .exit()
            .transition()
            .duration(durationTransition)
            .style("stroke-opacity", 0)
            .remove();



        let area = currentSvg.selectAll(".area")
            .data(centroidsNested);

        area
            .enter()
            .append("path")
            .attr("class", "area")
            .merge(area)
            .attr("fill", d => color(d.key))
            .attr("fill-opacity", 0.3)
            .attr("stroke", "none")
            .attr("id", function(d){
                return "centroid_area_" + d.key.split(/_(.+)/)[1];
            })
            .transition()
            .duration(durationTransition)
            .attr("d", function(d) {
                return d3.area()
                    .x(function(d) {return currentXScale(d.key.split(/_(.+)/)[1]) })
                    .y0(function(d) {return currentYScale(Math.round((d.value.lower + Number.EPSILON) * 100) / 100 ); })
                    .y1(function(d) {return currentYScale(Math.round((d.value.upper + Number.EPSILON) * 100) / 100 ); })
                    (d.values)
            })

        area
            .exit()
            .transition()
            .duration(durationTransition)
            .style("stroke-opacity", 0)
            .remove();
	

}


/**
 * creates a range with equal stepSize based on the min and max value. 
 * @param {float} min 
 * @param {float} max 
 * @param {float} stepSize 
 * @param {float} lowerBoundary 
 * @param {float} upperBoundary 
 */
function createTickRange(min, max, stepSize, lowerBoundary, upperBoundary){

    if(min % 1 === 0){
        min = min - 0.1;
    }

    if(max % 1 === 0){
        max = max + 0.1;
    }

    let range = [];
    let indexLower;
    let indexUpper;

    // lower
    for(let i=lowerBoundary; i<=0; i+=stepSize){  

        
        if(min === lowerBoundary){
            indexLower = min;
            break;
        }

        else if(min < lowerBoundary){
        }

        else if(min > (i + stepSize)){
            continue;
        }

        else if( (min > i) && (min < (i + stepSize))){
            indexLower = i+stepSize;
            break;
        }
    }

    // upper
    for(let i=0; i<=upperBoundary; i+=stepSize){  

        if(max === upperBoundary){
            indexUpper = max;
            break;
        }

        else if(max > upperBoundary){
        }

        else if(max > (i + stepSize)){
            continue;
        }

        else if( (max > i) && (max < (i + stepSize))){
            indexUpper = i+stepSize;
            break;
        }
    }

    // creating range
    for(let i=indexLower; i<indexUpper; i+=stepSize){
        range.push(i);
    }

    return range;

}


/**
 * extracts the min and max values of the current data
 * @param {ObjectArray} data 
 * @param {String} lowerOrUpper 
 */
function getAbsoluteValues(data, lowerOrUpper){

    let combinedValues = [];

    for(let value of data[0].values){
        combinedValues.push(value.value[lowerOrUpper]);
    }

    if(lowerOrUpper === "lower"){
        return d3.min(combinedValues);
    }

    if(lowerOrUpper === "upper"){
        return d3.max(combinedValues);
    }
}



// // https://stackoverflow.com/questions/8273047/javascript-function-similar-to-python-range


// function range(start, stop, step) {
//     if (typeof stop == 'undefined') {
//         // one param defined
//         stop = start;
//         start = 0;
//     }

//     if (typeof step == 'undefined') {
//         step = 1;
//     }

//     if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
//         return [];
//     }

//     var result = [];
//     for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
//         result.push(i);
//     }

//     return result;
// };


/**
 * transforms data for centroid diagrams
 * @param {ObjectArray} data 
 * @param {String} experimentId 
 * @param {int} clusterNumber 
 */
function getDataForCentroidDiagram(data, experimentId){

	let dataSubsetLong = wideToLong(data.data, experimentId, false);

	let dataSubsetNested = calcCentroid(dataSubsetLong);

	return dataSubsetNested;
}
/**
 * @param {ObjectArray} data 
 * @param {String} experimentId 
 * @param {int} clusterNumber 
 */
function yMinMaxPerExperimentCluster(data, experimentId, clusterNumber){

    let filteredData;

    if(experimentId == "ds1"){
        filteredData = data.data.filter(d => d.ds1_cluster === experimentId + "_" + clusterNumber)
    }

    else if(experimentId == "ds2"){
        filteredData = data.data.filter(d => d.ds2_cluster === experimentId + "_" + clusterNumber)
    }

    else{
        return;
    }

    let allValues = [];

    for(let row of filteredData){
        for(let col of Object.keys(filteredData)){
            if(col !== "ds1_cluster" && col !== "ds2_cluster" && col !== "ds1_median" && col !== "ds2_median" && col !== "gene" && col !== "ds1_var" && col !== "ds2_var"){
                allValues.push(row[col]);
            }
        }
    }

    return{
        'min' : d3.min(allValues),
        'max' : d3.max(allValues)
    }

}




/**
 * transforms the data by using a rollup
 * inspired: https://stackoverflow.com/questions/29131627/how-to-group-multiple-values-in-nested-d3-to-create-multiple-rollup-sum-chart
 * @param {ObjectArray} data 
 */
function calcCentroid(data){

    return d3.nest()
        .key(function(d) {return d.experimentAndCluster; })
        .key(function(d) {return d.x; })
        .rollup(function(v) {

            return{
                avg: d3.mean(v, function (d){return Math.round( d.value  * 100 + Number.EPSILON ) / 100 }),
                //std: d3.deviation(v, function (d){return +d.value}),
                std: calcDeviation(v, function(d) {return Math.round( d.value  * 100 + Number.EPSILON ) / 100 }),
                upper: d3.mean(v, function (d){return Math.round( d.value  * 100 + Number.EPSILON ) / 100 }) + calcDeviation(v, function (d){return Math.round( d.value  * 100 + Number.EPSILON ) / 100 }),
                //upper: d3.mean(v, function (d){return +d.value}) + d3.deviation(v, function (d){return +d.value}),
                lower: d3.mean(v, function (d){return Math.round( d.value  * 100 + Number.EPSILON ) / 100 }) - calcDeviation(v, function (d){ return Math.round( d.value  * 100 + Number.EPSILON ) / 100 })
                //lower: d3.mean(v, function (d){return +d.value}) - d3.deviation(v, function (d){return +d.value})
            }})

        //.rollup(function(v) {return d3.deviation(v, function (d){return +d.value})})
        .entries(data);

}


/**
 * @param {float} v 
 * @param {float} d 
 */
function calcDeviation(v, d){
    return (typeof d3.deviation(v, function (d){return +d.value}) === "undefined") ? 0 : d3.deviation(v, function (d){return +d.value});
}


/**
 * @param {ObjectArray} data 
 */
function getMinValueLowerBoundCentroid(data){
    return getAllCentroidValues(data, "min");
}


/**
 * @param {ObjectArray} data 
 */
function getMaxValueUpperBoundCentroid(data){
    return getAllCentroidValues(data, "max");
}


/**
 * extracts all centroid values -> fixed y scales
 * @param {ObjectArray} data 
 * @param {String} minOrMax 
 */
function getAllCentroidValues(data, minOrMax){

    let values = [];

    for(let row of data[0].values){
        if(minOrMax === "min"){
            values.push(row.value["lower"])
        }

        if(minOrMax === "max"){
            values.push(row.value["upper"])
        }
    }

    if(minOrMax === "min"){
        return d3.min(values);
    }

    if(minOrMax === "max"){
        return d3.max(values);
    }    
}