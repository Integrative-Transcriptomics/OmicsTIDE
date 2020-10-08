
function medianTrend(divID, data){
	//https://www.d3-graph-gallery.com/graph/line_several_group.html

	var svgMedianTrend = d3.select("#" + divID);

	var rightValue = document.getElementById(divID).offsetWidth * 0.05;
	var leftValue = document.getElementById(divID).offsetWidth * 0.05;
	var topValue = document.getElementById(divID).offsetHeight * 0.05;
	var bottomValue = document.getElementById(divID).offsetHeight * 0.15;

	var marginMedianTrend = {top: topValue, right: rightValue, bottom: bottomValue, left: leftValue},
	widthMedianTrend = document.getElementById(divID).offsetWidth - marginMedianTrend.left - marginMedianTrend.right,
	heightMedianTrend = document.getElementById(divID).offsetHeight - marginMedianTrend.bottom - marginMedianTrend.top;

	svgMedianTrend = svgMedianTrend
        .append("div")
        // Container class to make it responsive.
        .classed("svg-container", false)
        .append("svg")
        // Responsive SVG needs these 2 attributes and no width and height attr.
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + widthMedianTrend + " " + heightMedianTrend)
        // Class to make it responsive.
        .classed("svg-content-responsive", false)
        // Fill with a rectangle for visualization.
        .append("g")
     //    .attr("transform",
			  // "translate(" + marginMedianTrend.left + "," + marginMedianTrend.top + ")");


	// svgMedianTrend = svgMedianTrend
	// 	.append("div")
	// 	.classed("svg-container", false)
	// 	.append("svg")
	// 	.attr("height", heightMedianTrend)
	// 	.attr("width", widthMedianTrend)
	// 	.append("g")
		

	var xMedianTrend = d3.scalePoint()
		.range([marginMedianTrend.left, widthMedianTrend - marginMedianTrend.right])
		.domain(d3.map(data, function(d){return d.x}).keys());
	
	svgMedianTrend.append("g")
		.attr("transform", "translate(0," + (heightMedianTrend - marginMedianTrend.bottom) + ")")
		.call(d3.axisBottom(xMedianTrend))

	var yMedianTrend = d3.scaleLinear()
		.range([heightMedianTrend - marginMedianTrend.bottom, marginMedianTrend.top])
		.domain([d3.min(data.map(function(d){return d.value})), d3.max(data.map(function(d){return d.value}))]);

	svgMedianTrend.append("g")
		.attr("transform", "translate(" + marginMedianTrend.left + ", 0)")
		.call(d3.axisLeft(yMedianTrend))

	var colorScaleMedianTrend = d3.scaleOrdinal()
		.domain([0,1,2,3,4,5,6,7])
		.range(["#9bbdd9", "#9cc2a6", "#d1b2db", "#f7ce74", "#cf9b42", "#7371f5", "#9bbdd9", "#9cc2a6"])

	var sumstat = d3.nest()
    .key(function(d) { return d.cluster;})
    .entries(data);	

	svgMedianTrend
		.selectAll(".line")
		.data(sumstat)
		.enter()
		.append("path")
			.attr("fill", "none")
			.attr("stroke",
				function(d) {
					return colorScaleMedianTrend(d.values[0].cluster);
			})
			.attr("stroke-width", 2.5)
			.attr("d", function(d){
				return d3.line()
					.x(function(d) { 
						return xMedianTrend(d.x) })
					.y(function(d) { 
						return yMedianTrend(+d.value) })
					(d.values)
			})

}