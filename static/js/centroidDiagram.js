

/**
  *
  * @param{} data
  * @param{String} experimentId
  * @param{int} clusterNumber
  * @param{} currentSvg
  * @param{} currentXScale
  * @param{} currentYScale
  * @param{} tabDivId
  */
function renderCentroidDiagram(data, experimentId, clusterNumber, currentSvg, currentXScale, currentYScale, tabDivId){

	let centroidsNested = getDataForCentroidDiagram(data, experimentId, clusterNumber)

    // updating domains
    let currentXDomain = getCurrentXDomain(DiagramId.centroid, centroidsNested, experimentId);
    let currentYDomain = getCurrentYDomain(DiagramId.centroid, centroidsNested, experimentId);

    // calling axis
    currentXScale.domain(currentXDomain);
    currentSvg.selectAll(".x_axis")
        .attr("transform", "translate(0," + (curr_height - marginRelative.bottom) + ")")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(currentXScale));

    currentYScale.domain(currentYDomain);
    currentSvg.selectAll(".y_axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(currentYScale));

    let currentTabId = tabDivId.split("_")[4];

    console.log(tabDivId);

    if(currentTabId === "matrix"){
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
            .attr("id", d => "centroid_" + d.key)
            .transition()
            .duration(1000)
            .attr("d", function(d) {
                return d3.line()
                        .x(function(d) {
                            return currentXScale(d.key) })
                        .y(function(d) {
                            return currentYScale(d.value.avg); })
                        (d.values)
            });

        centroid
            .exit()
            .transition()
            .duration(1000)
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
                return "centroid_upper_" + d.key;
            })
            .transition()
            .duration(1000)
            .attr("d", function(d) {
                return d3.line()
                        .x(function(d) {
                            return currentXScale(d.key) })
                        .y(function(d) {
                            return currentYScale(d.value.upper);})
                        (d.values)
            })

        upper
            .exit()
            .transition()
            .duration(1000)
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
                return "centroid_lower_" + d.key;
            })
            .transition()
            .duration(1000)
            .attr("d", function(d) {
                return d3.line()
                        .x(function(d) {
                            return currentXScale(d.key) })
                        .y(function(d) {
                            return currentYScale(d.value.lower);})
                        (d.values)
            })

        lower
            .exit()
            .transition()
            .duration(1000)
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
                return "centroid_area_" + d.key;
            })
            .transition()
            .duration(1000)
            .attr("d", function(d) {
                return d3.area()
                    .x(function(d) {return currentXScale(d.key) })
                    .y0(function(d) {return currentYScale(d.value.lower); })
                    .y1(function(d) {return currentYScale(d.value.upper); })
                    (d.values)
            })

        area
            .exit()
            .transition()
            .duration(1000)
            .style("stroke-opacity", 0)
            .remove();
	

}


/**
  *
  * @param{} data
  * @param{String} experimentId
  * @param{int} clusterNumber
  */
function getDataForCentroidDiagram(data, experimentId, clusterNumber){

	let dataSubsetLong = wideToLong(data.data, experimentId, false);

	let dataSubsetNested = calcCentroid(dataSubsetLong);

	return dataSubsetNested;
}



/**
  *
  * https://stackoverflow.com/questions/29131627/how-to-group-multiple-values-in-nested-d3-to-create-multiple-rollup-sum-chart
  * @param{} data
  */
function calcCentroid(data){

    return d3.nest()
        .key(function(d) {return d.experimentAndCluster; })
        .key(function(d) {return d.x; })
        .rollup(function(v) {

            return{
                avg: d3.mean(v, function (d){return +d.value}),
                //std: d3.deviation(v, function (d){return +d.value}),
                std: calcDeviation(v, function(d) {return +d.value}),
                upper: d3.mean(v, function (d){return +d.value}) + calcDeviation(v, function (d){return +d.value}),
                //upper: d3.mean(v, function (d){return +d.value}) + d3.deviation(v, function (d){return +d.value}),
                lower: d3.mean(v, function (d){return +d.value}) - calcDeviation(v, function (d){return +d.value})
                //lower: d3.mean(v, function (d){return +d.value}) - d3.deviation(v, function (d){return +d.value})
            }})

        //.rollup(function(v) {return d3.deviation(v, function (d){return +d.value})})
        .entries(data);

}


/**
  *
  * @param{} v
  * @param{} d
  */
function calcDeviation(v, d){
    return (typeof d3.deviation(v, function (d){return +d.value}) === "undefined") ? 0 : d3.deviation(v, function (d){return +d.value});
}


/**
  *
  * @param{} data
  */
function getMinValueLowerBoundCentroid(data){
    return getAllCentroidValues(data, "min");
}


/**
  *
  * @param{} data
  */
function getMaxValueUpperBoundCentroid(data){
    return getAllCentroidValues(data, "max");
}


/**
  *
  * @param{} data
  * @param{String} minOrMax
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