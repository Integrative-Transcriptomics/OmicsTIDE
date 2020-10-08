
var svg_box={}
var margin_boxplot = {top: 20, right: 5, bottom: 30, left: 30};

function boxplot(data, exp, cluster_count, tabDivId){

    curr_width =  document.getElementById(exp + "_" + cluster_count + "_" + tabDivId).offsetWidth;
    curr_height = document.getElementById(exp + "_" + cluster_count + "_" + tabDivId).offsetHeight;

    svg_box["svg_box_" + exp + "_" + cluster_count + "_" + tabDivId] = d3.select("#" + exp + "_" + cluster_count + "_" + tabDivId)

        .append("div")
        // Container class to make it responsive.
        .classed("svg-container", false)
        .append("svg")
        // Responsive SVG needs these 2 attributes and no width and height attr.
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + curr_width + " " + curr_height)
        // Class to make it responsive.
        .classed("svg-content-responsive", false)
        // Fill with a rectangle for visualization.
        .attr("id",exp + "_" + cluster_count)


    svg_box["x_box_" + exp + "_" + cluster_count + "_" + tabDivId] = d3.scalePoint()
        .range([margin_boxplot.left, curr_width-margin_boxplot.right])
    var x_axis = svg_box["svg_box_" + exp + "_" + cluster_count + "_" + tabDivId].append("g")
        .attr("class","x_axis")

    svg_box["y_box_" + exp + "_" + cluster_count + "_" + tabDivId] = d3.scaleLinear()
        .range([curr_height - margin_boxplot.bottom, 0])
    var y_axis = svg_box["svg_box_" + exp + "_" + cluster_count + "_" + tabDivId].append("g")
        .attr("class","y_axis")

    updateBoxplots(data, exp, cluster_count, tabDivId);
}


    // // Show the X scale
    // var x = d3.scaleBand()
    //     .range([ margin.left, curr_width - margin.right ])
    //     .domain(x_values)
    //     .paddingInner(2)
    //     .paddingOuter(.5)
    // svg.append("g")
    //     .attr("transform", "translate(0," + (curr_height-margin.bottom+10) + ")")
    //     .call(d3.axisBottom(x))

    // // Show the Y scale
    // var y = d3.scaleLinear()
    //     .domain([min_value, max_value+max_value*1.1])
    //     .range([curr_height-margin.bottom, margin.top])
    //     //.range([margin.top, curr_height-margin.bottom])
    // svg.append("g")
    //     .attr("transform", "translate(" + margin.left + ")")
    //     .call(d3.axisLeft(y))


function getMinMaxValues(object){
    
    outliers = []

    // get all upper and lower
    all_upper = object.map(d => d.value.upper)
    all_lower = object.map(d => d.value.lower)

    // get all outliers
    for(row of object){
        if(row.value.outlier.length === 0){
            continue;
        }

        else{
            for(value of row.value.outlier){
                outliers.push(value);
            }
        }
    }

    // merge all
    all = outliers.concat(all_upper.concat(all_lower))

    return {lower: d3.min(all), upper: d3.max(all)}
}


// get single data points
// function getSingleOutliers(object){
//     output = [];

//     for(row of object){
//         for(value of row.value.outlier){
//             output.push({'key': row.key, 'exp_cluster':row.value.exp_cluster, 'outlier': value})
//         }
//     }

//     return output
// }


function updateBoxplots(data_input, exp, cluster_count, tabDivId){

    var color = d3.scaleOrdinal()
       .domain(["exp1_1", "exp1_2", "exp1_3", "exp1_4", "exp1_5", "exp1_6", "exp2_1", "exp2_2", "exp2_3","exp2_4", "exp2_5", "exp2_6"])
       .range(["#9bbdd9", "#9cc2a6", "#d1b2db", "#f7ce74", "#cf9b42", "#7371f5", "#9bbdd9", "#9cc2a6", "#d1b2db", "#f7ce74", "#cf9b42", "#7371f5"]);

    curr_svg = svg_box["svg_box_" + exp + "_" + cluster_count + "_" + tabDivId]

    tmp_data = data_input.data;

    data = tmp_data.filter(function (d) {
            return (d[exp+"_cluster"] === (exp + "_" + cluster_count)) && (d.highlighted === true)
    });

    data = wideToLong(data, exp, true)

    x_values = [];
    for(row of data){
        x_values.push(row.x);
    }

    x_values = Array.from([... new Set(x_values)]);

    all_values = [];
    min = 0;
    max = 0;

    for(row of data){
        all_values.push(+row.value);
    }

    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d.x;})
        .rollup(function(d) {
            q1 = d3.quantile(d.map(function(g) { return +g.value;}).sort(d3.ascending),.25)
            median = d3.quantile(d.map(function(g) { return +g.value;}).sort(d3.ascending),.5)
            q3 = d3.quantile(d.map(function(g) { return +g.value;}).sort(d3.ascending),.75)
            interQuantileRange = q3 - q1
            lower = q1 - (1.5 * interQuantileRange)
            upper = q3 + (1.5 * interQuantileRange)
            exp_cluster = [...new Set(d.map(function(g) {return g.exp}))][0]
            outlier = d.filter(function(g) {return (+g.value > upper) || (+g.value < lower)} ).map(function(h) {return h.value})
            return({exp_cluster: exp_cluster, q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, lower: lower, upper: upper, outlier:outlier})
        })
        .entries(data)

    svg_box["x_box_" + exp + "_" + cluster_count + "_" + tabDivId].domain(x_values)
        //.paddingInner(1)
    curr_svg.selectAll(".x_axis")
        //.attr("transform", "translate(0," + (curr_height+margin_boxplot.bottom) + ")")
        .attr("transform", "translate(0, " + (curr_height-margin_boxplot.bottom) + ")")
        .transition()
        .duration(500)
        .call(d3.axisBottom(svg_box["x_box_" + exp + "_" + cluster_count + "_" + tabDivId]));

    svg_box["y_box_" + exp + "_" + cluster_count + "_" + tabDivId].domain([(getMinMaxValues(sumstat).lower-0.5), (getMinMaxValues(sumstat).upper+0.5)])
    curr_svg.selectAll(".y_axis")
        .attr("transform", "translate(" + (margin_boxplot.left*0.75) + ", 0)")
        .transition()
        .duration(500)
        //.attr("transform", "translate(" + margin_boxplot.left + ",0)")
        .call(d3.axisLeft(svg_box["y_box_" + exp + "_" + cluster_count + "_" + tabDivId]));

    // curr_width =  document.getElementById(exp + "_plot" + cluster_count).offsetWidth;
    // curr_height = document.getElementById(exp + "_plot" + cluster_count).offsetHeight;

    // // add SVG
    // var svg = d3.select("#" + exp + "_plot" + cluster_count)
    //     .append("div")
    //     // Container class to make it responsive.
    //     .classed("svg-container", false)
    //     .append("svg")
    //     // Responsive SVG needs these 2 attributes and no width and height attr.
    //     .attr("preserveAspectRatio", "xMinYMin meet")
    //     .attr("viewBox", "0 0 " + curr_width + " " + curr_height)
    //     // Class to make it responsive.
    //     .classed("svg-content-responsive", false)
    //     // Fill with a rectangle for visualization.
    //     .attr("id",exp + "_plot" + cluster_count);

    // // Show the X scale
    // var x = d3.scaleBand()
    //     .range([ margin.left, curr_width - margin.right ])
    //     .domain(x_values)
    //     .paddingInner(2)
    //     .paddingOuter(.5)
    // svg.append("g")
    //     .attr("transform", "translate(0," + (curr_height-margin.bottom+10) + ")")
    //     .call(d3.axisBottom(x))

    // // Show the Y scale
    // var y = d3.scaleLinear()
    //     .domain([min_value, max_value+max_value*1.1])
    //     .range([curr_height-margin.bottom, margin.top])
    //     //.range([margin.top, curr_height-margin.bottom])
    // svg.append("g")
    //     .attr("transform", "translate(" + margin.left + ")")
    //     .call(d3.axisLeft(y))

    var vertLines = curr_svg.selectAll(".vertLines")
        .data(sumstat)

    // Show the main vertical line
    vertLines
        .enter()
        .append("line")
        .attr("class", "vertLines")
        .merge(vertLines)
        .transition()
        .duration(500)
        .attr("x1", function(d){ return( svg_box["x_box_" + exp + "_" + cluster_count + "_" + tabDivId](d.key) )})
        .attr("x2", function(d){ return( svg_box["x_box_" + exp + "_" + cluster_count + "_" + tabDivId](d.key) )})
        .attr("y1", function(d){ return( svg_box["y_box_" + exp + "_" + cluster_count + "_" + tabDivId](d.value.lower) )})
        .attr("y2", function(d){ return( svg_box["y_box_" + exp + "_" + cluster_count + "_" + tabDivId](d.value.upper) )})
        .attr("stroke", "grey")

    // rectangle for the main box
    var boxWidth = 5;

    var boxes = curr_svg.selectAll(".boxes")
        .data(sumstat)

    boxes
        .enter()
        .append("rect")
        .attr("class", "boxes")
        .merge(boxes)
        .transition()
        .duration(500)
        .attr("x", function(d){ return(svg_box["x_box_" + exp + "_" + cluster_count + "_" + tabDivId](d.key) - boxWidth/2)})
        .attr("y", function(d){ return(svg_box["y_box_" + exp + "_" + cluster_count + "_" + tabDivId](d.value.q3)) })
        .attr("height", function(d){ return((svg_box["y_box_" + exp + "_" + cluster_count + "_" + tabDivId](d.value.q1)) - (svg_box["y_box_" + exp + "_" + cluster_count + "_" + tabDivId](d.value.q3))) })
        .attr("width", boxWidth )
        .attr("stroke", "grey")
        .attr("fill", d => color(d.value.exp_cluster))

    var medianLines = curr_svg.selectAll(".medianLines")
        .data(sumstat)

    medianLines
        .enter()
        .append("line")
        .attr("class", "medianLines")
        .merge(medianLines)
        .transition()
        .duration(500)
        .attr("x1", function(d){return(svg_box["x_box_" + exp + "_" + cluster_count + "_" + tabDivId](d.key)-boxWidth/2) })
        .attr("x2", function(d){return(svg_box["x_box_" + exp + "_" + cluster_count + "_" + tabDivId](d.key)+boxWidth/2) })
        .attr("y1", function(d){return(svg_box["y_box_" + exp + "_" + cluster_count + "_" + tabDivId](d.value.median))})
        .attr("y2", function(d){return(svg_box["y_box_" + exp + "_" + cluster_count + "_" + tabDivId](d.value.median))})
        .attr("stroke", "grey")
        .style("width", 80)



    var outliers = getSingleOutliers(sumstat)

    var jitter = curr_svg.selectAll(".jitter")
        .data(outliers)

    jitter
        .enter()
        .append("circle")
        .attr("class", "jitter")
        .merge(jitter)
        .attr("cx", function(d){return(svg_box["x_box_" + exp + "_" + cluster_count + "_" + tabDivId](d.key) - boxWidth/2 + Math.random()*boxWidth )})
        //.attr("cx", function(d){ return(svg_box["x_box_" + exp + "_" + cluster_count](d.key)) })
        .transition()
        .duration(500)
        .attr("cy", function(d){ return(svg_box["y_box_" + exp + "_" + cluster_count + "_" + tabDivId](+d.outlier)) })
        .attr("r", 2)
        .attr("fill", d => color(d.exp_cluster))
        .attr("opacity", 0.5)



    // curr_svg
    //     .selectAll("boxes")
    //     .data(sumstat)
    //     .enter()
    //     .append("rect")

    // Add individual points with jitter
    // var jitterWidth = 50
    // var dots = svg
    //     .selectAll("indPoints")
    //     .data(data)
    //     .enter()
    //     .append("circle")
    //     //.attr("cx", function(d){return(x(d.x) - jitterWidth/2 + Math.random()*jitterWidth )})
    //     .attr("cx", function(d){return(x(d.x))})
    //     .attr("cy", function(d){return(y(+d.value))})
    //     .attr("r", 4)
    //     .attr('class', function(d) { return "dot_" + exp + "_" + d.gene; })
    //     .attr("stroke", "black")
    //     .attr("stroke-opacity", function(d) {return d.highlighted === "1" ? 1 : non_selected_opacity})
    //     .attr("opacity", function(d) {return d.highlighted === "1" ? 1 : non_selected_opacity})
    //     //.attr("class", "non_brushed")
    //     // .on("mouseover" ,function (d) {
    //     //     highlightDots([d.gene]);
    //     // })
    //     // .on("mouseout" ,function (d) {
    //     //     unhighlightDots([d.gene]);
    //     // })
    //     .on("dblclick", function(d){
    //         updateGlobalSelectionLine(d.gene);
    //         getTabularOutput(global_selection);
    //     })
    //     .style("fill", function(d) {return color(d.exp_cluster)})




    // // Show the median
    // curr_svg
    //     .selectAll("medianLines")
    //     .data(sumstat)
    //     .enter()
    //     .append("line")
    //     .attr("x1", function(d){return(svg["x_" + exp + "_" + cluster_count](d.key)-boxWidth/2) })
    //     .attr("x2", function(d){return(svg["x_" + exp + "_" + cluster_count](d.key)+boxWidth/2) })
    //     .attr("y1", function(d){return(svg["y_" + exp + "_" + cluster_count](d.value.median))})
    //     .attr("y2", function(d){return(svg["y_" + exp + "_" + cluster_count](d.value.median))})
    //     .attr("stroke", "grey")
    //     .style("width", 80)

    }




// Add individual points with jitter
    // var jitterWidth = 50
    // var dots = svg
    //     .selectAll("indPoints")
    //     .data(data)
    //     .enter()
    //     .append("circle")
    //     //.attr("cx", function(d){return(x(d.x) - jitterWidth/2 + Math.random()*jitterWidth )})
    //     .attr("cx", function(d){return(x(d.x))})
    //     .attr("cy", function(d){return(y(+d.value))})
    //     .attr("r", 4)
    //     .attr('class', function(d) { return "dot_" + exp + "_" + d.gene; })
    //     .attr("stroke", "black")
    //     .attr("stroke-opacity", function(d) {return d.highlighted === "1" ? 1 : non_selected_opacity})
    //     .attr("opacity", function(d) {return d.highlighted === "1" ? 1 : non_selected_opacity})
    //     //.attr("class", "non_brushed")
    //     // .on("mouseover" ,function (d) {
    //     //     highlightDots([d.gene]);
    //     // })
    //     // .on("mouseout" ,function (d) {
    //     //     unhighlightDots([d.gene]);
    //     // })
    //     .on("dblclick", function(d){
    //         updateGlobalSelectionLine(d.gene);
    //         getTabularOutput(global_selection);
    //     })
    //     .style("fill", function(d) {return color(d.exp_cluster)})


// TODO: Refactor this -> removal and redrawing of divs is stupid!
function boxplotPerCluster(data, parentLeftDivId, parentRightDivId, tabDivId) {

    cluster_count = data.cluster_count;

    // remove old entries
    var exp1_old = document.getElementById(parentLeftDivId);
    while (exp1_old.firstChild) exp1_old.removeChild(exp1_old.firstChild);
    var exp2_old = document.getElementById(parentRightDivId);
    while (exp2_old.firstChild) exp2_old.removeChild(exp2_old.firstChild);

    // add new
    //createDivs(cluster_count);
    createChildDivs(cluster_count, parentLeftDivId, 'exp1_', tabDivId);
    createChildDivs(cluster_count, parentRightDivId, 'exp2_', tabDivId);

    //plot counts might be adjusted when NAs are involved
    plot_counts = document.getElementById(parentLeftDivId).childElementCount;

    for (i = 1; i <= plot_counts; i++) {

        boxplot(data, "exp1", i, tabDivId);
        boxplot(data, "exp2", i, tabDivId);
    }
}



// brushing 

    // Add brushing
    // svg
    //     .call( d3.brush()                 // Add the brush feature using the d3.brush function
    //         .extent( [ [0,0], [curr_width, curr_height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    //         .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
    //     )

// Function that is triggered when brushing is performed
    // function updateChart() {
    //     unhighlightDots(selected_genes);
    //     selected_genes = [];

    //     extent = d3.event.selection
    //     dots.classed("selected", function(d){
    //         if(isBrushed(extent, x(d.x), y(+d.value))){
    //             selected_genes.push(d.gene);
    //         }});

    //     highlightDots(selected_genes)

    //     for(gene of selected_genes){
    //         updateGlobalSelectionLine(gene);
    //     }

    //     getTabularOutput(global_selection);
    // }

    // // A function that return TRUE or FALSE according if a dot is in the selection or not
    // function isBrushed(brush_coords, cx, cy) {
    //     var x0 = brush_coords[0][0],
    //         x1 = brush_coords[1][0],
    //         y0 = brush_coords[0][1],
    //         y1 = brush_coords[1][1];
    //     return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
    // }