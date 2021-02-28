
/**
 * @param {ObjectArray} data 
 * @param {String} experimentId 
 * @param {int} clusterNumber 
 * @param {SvgObject} currentSvg 
 * @param {ScaleObject} currentXScale 
 * @param {ScaleObject} currentYScale 
 */
 function renderBoxDiagram(data, experimentId, clusterNumber, currentSvg, currentXScale, currentYScale){

  let boxNested = getDataForBoxDiagram(data, experimentId, clusterNumber);
  //let boxAxes = getDataForBoxDiagram(data, experimentId, clusterNumber);
  
  //let dataForAxes = getDataForBoxDiagram(totalData, experimentId, clusterNumber);

	let currentXDomain = getCurrentXDomain(DiagramId.box, boxNested, experimentId)
	//let currentYDomain = getCurrentYDomain(DiagramId.box, boxAxes, experimentId)

	currentXScale.domain(currentXDomain);
    currentSvg.selectAll(".x_axis")
        .attr("transform", "translate(0," + (curr_height - marginRelative.bottom) + ")")
        //.transition()
        //.duration(durationTransition)
        .call(d3.axisBottom(currentXScale));

    let minValue = data.yScales.boxesMinMax.boxesMin;
    let maxValue = data.yScales.boxesMinMax.boxesMax;

    currentYScale.domain([minValue, maxValue]);   
    let tickRange = createTickRange(minValue, maxValue, 0.5, -6, 6);


    //currentYScale.domain(currentYDomain);
    currentSvg.selectAll(".y_axis")
        //.transition()
        //.duration(durationTransition)
        .call(d3.axisLeft(currentYScale)
        .tickValues(tickRange) 
        );

    let vertLines = currentSvg.selectAll(".vertLines")
        .data(boxNested)

    // Show the main vertical line
    vertLines
        .enter()
        .append("line")
        .attr("class", "vertLines")
        .merge(vertLines)
        .transition()
        .duration(durationTransition)
        .attr("x1", function(d){ 
          return currentXScale(d.key.split(/_(.+)/)[1]) })
        .attr("x2", function(d){ return currentXScale(d.key.split(/_(.+)/)[1]) })
        .attr("y1", function(d){ return currentYScale(d.value.lower) })
        .attr("y2", function(d){ return currentYScale(d.value.upper) })
        .attr("stroke", "grey")

    // rectangle for the main box
    let boxWidth = 5;

    let boxes = currentSvg.selectAll(".boxes")
        .data(boxNested)

    boxes
        .enter()
        .append("rect")
        .attr("class", "boxes")
        .merge(boxes)
        .transition()
        .duration(durationTransition)
        .attr("x", function(d){ return currentXScale(d.key.split(/_(.+)/)[1]) - (boxWidth/2) })
        .attr("y", function(d){ return currentYScale(d.value.q3) })
        .attr("height", function(d){ return currentYScale(d.value.q1) - currentYScale(d.value.q3) })
        .attr("width", boxWidth )
        .attr("stroke", "grey")
        .attr("fill", d => color(d.value.experimentAndCluster))

    let medianLines = currentSvg.selectAll(".medianLines")
        .data(boxNested)

    medianLines
        .enter()
        .append("line")
        .attr("class", "medianLines")
        .merge(medianLines)
        .transition()
        .duration(durationTransition)
        .attr("x1", function(d){ return currentXScale(d.key.split(/_(.+)/)[1]) - (boxWidth/2) })
        .attr("x2", function(d){ return currentXScale(d.key.split(/_(.+)/)[1]) + (boxWidth/2) })
        .attr("y1", function(d){ return currentYScale(d.value.median) })
        .attr("y2", function(d){ return currentYScale(d.value.median) })
        .attr("stroke", "grey")
        .style("width", 80)

    let outliers = getSingleOutliers(boxNested);

    let jitter = currentSvg.selectAll(".jitter")
        .data(outliers)

    jitter
        .enter()
        .append("circle")
        .attr("class", "jitter")
        .merge(jitter)
        .attr("cx", function(d){ return currentXScale(d.key.split(/_(.+)/)[1]) + Math.random()*boxWidth })
        .transition()
        .duration(durationTransition)
        .attr("cy", function(d){ return currentYScale(+ d.outlier) })
        .attr("r", 2)
        .attr("fill", d => color(d.experimentAndCluster))
        .attr("opacity", 0.5)

}


/**
 * transforms the data for the box plots
 * @param {Objectarray} data 
 * @param {String} experimentId 
 * @param {int} clusterNumber 
 */
function getDataForBoxDiagram(data, experimentId){

	let dataSubsetLong = wideToLong(data.data, experimentId, true);

	let dataSubsetNested = nestDataBox(dataSubsetLong, "x");

	return dataSubsetNested;

}


/**
 * nests the data for box plots
 * @param {ObjectArray} data 
 * @param {String} key 
 */
function nestDataBox(data, key){

	return d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d[key];})
        .rollup(function(d) {
            
            let q1 = d3.quantile(d.map(function(g) { return +g.value;}).sort(d3.ascending),.25)
            
            let median = d3.quantile(d.map(function(g) { return +g.value;}).sort(d3.ascending),.5)
            
            let q3 = d3.quantile(d.map(function(g) { return +g.value;}).sort(d3.ascending),.75)
            
            let interQuantileRange = q3 - q1
            
            let lower = q1 - (1.5 * interQuantileRange)
            
            let upper = q3 + (1.5 * interQuantileRange)
            
            let experimentAndCluster = [...new Set(d.map(function(g) {return g.experimentAndCluster}))][0]
            
            let outlierLower = d.filter(function(g) { return +g.value < lower } ).map(function(h) {return h.value})
            
            let outlierUpper = d.filter(function(g) { return +g.value > upper } ).map(function(h) {return h.value})
            
            return({experimentAndCluster: experimentAndCluster, q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, lower: lower, upper: upper, outlierLower : outlierLower, outlierUpper : outlierUpper})
        })
        .entries(data)
}


/**
 * extracts min value of all boxes (lower outlier)
 * @param {ObjectArray} data 
 */
function getMinValueBox(data){
	return d3.min(getAllBoxValues(data));
}


/**
 * extracts max value of all boxes (upper outlier)
 * @param {ObjectArray} data 
 */
function getMaxValueBox(data){
	return d3.max(getAllBoxValues(data));
}


/**
 * summarizes all values in the box plot
 * @param {ObjectArray} data 
 */
function getAllBoxValues(data){
	
	let allValues = [];

	for(row of data){

		allValues.push(row.value.lower);
		allValues.push(row.value.upper);
		allValues.concat(row.value.outlierLower);
		allValues.concat(row.value.outlierUpper);
	}

	return allValues;
}


/**
 * returns the all outliers (>1.5*IQR, < 1.5*IQR )
 * @param {ObjectArray} data 
 */
function getSingleOutliers(data){
    output = [];

    for(let row of data){
    	combinedOutliers = row.value.outlierLower.concat(row.value.outlierUpper);
    	for(let value of combinedOutliers){
            output.push({'key': row.key, 'experimentAndCluster':row.value.experimentAndCluster, 'outlier': value})
        }
    }

    return output
}