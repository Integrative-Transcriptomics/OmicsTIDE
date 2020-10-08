//https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89

margin = {top: 20, right: 20, bottom: 40, left: 30};
svg = {}

var contextMenuShowing = false;


/**
 * Creates a profile diagram in the selected div
 * @param {Object} data wide data, e.g. loaded by d3.csv()
 * @param {string} exp ID of the experiment (determines parent div)
 * @param {string} cluster_count ID of the cluster (determines row of the child div)
 */
function profileDiagram(data, exp, cluster_count, tabDivId){

    curr_width =  document.getElementById(exp + "_" + cluster_count + "_" + tabDivId).offsetWidth;
    curr_height = document.getElementById(exp + "_" + cluster_count + "_" + tabDivId).offsetHeight;

    // add SVG
    //window["svg_" + exp + "_" + cluster_count] = d3.select("#" + exp + "_plot" + cluster_count)
    svg["svg_" + exp + "_" + cluster_count + "_" + tabDivId] = d3.select("#" + exp + "_" + cluster_count + "_" + tabDivId)
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
        .attr("id",exp + cluster_count)


    svg["x_" + exp + "_" + cluster_count + "_" + tabDivId] = d3.scalePoint()
        .range([margin.left, curr_width-margin.right])
    var x_axis = svg["svg_" + exp + "_" + cluster_count + "_" + tabDivId].append("g")
        .attr("class","x_axis")

    svg["y_" + exp + "_" + cluster_count + "_" + tabDivId] = d3.scaleLinear()
        .range([curr_height-margin.bottom, margin.top])
    var y_axis = svg["svg_" + exp + "_" + cluster_count + "_" + tabDivId].append("g")
        .attr("class","y_axis")
        .attr("transform", "translate(" + margin.left + ",0)")

    //init
    updateProfileCentroids(data, exp, cluster_count, tabDivId);
}


function updateProfileCentroids(data_input, exp, cluster_count, tabDivId){

    var color = d3.scaleOrdinal()
       .domain(["exp1_1", "exp1_2", "exp1_3", "exp1_4", "exp1_5", "exp1_6", "exp2_1", "exp2_2", "exp2_3","exp2_4", "exp2_5", "exp2_6"])
       .range(["#9bbdd9", "#9cc2a6", "#d1b2db", "#f7ce74", "#cf9b42", "#7371f5", "#9bbdd9", "#9cc2a6", "#d1b2db", "#f7ce74", "#cf9b42", "#7371f5"]);


    var selection = document.getElementById('clustered-data-information-controls-selection-dropdown-' + tabDivId);

    var value = selection.options[selection.selectedIndex].value;

    var curr_svg = svg["svg_" + exp + "_" + cluster_count + "_" + tabDivId];

    var tmp_data = data_input.data;

    var data = tmp_data.filter(function (d) {
        return (d[exp+"_cluster"] === (exp + "_" + cluster_count)) && (d.highlighted === true && d.profile_selected === false)
    });

    // remove NA?

    long = wideToLong(data, exp, false);

    console.log(long);



    centroid_data = calc_centroid(long);

    long_data = joinData(long, centroid_data);

    if(value === "centroid"){

        long_data = long.slice(0, data_input.time_points);

        for(row of long){
            row.gene = "avg";
            row.value = row.curr_centroid.avg;
        }
    }

    // nest data
    var nested = d3.nest()
        .key(function(d) {return d.gene})
        .entries(long_data);

    // ...
    // for the highlighted
    // ...

    data_highlighted = tmp_data.filter(function (d) {
        return (d[exp+"_cluster"] === (exp + "_" + cluster_count)) && (d.highlighted === true && d.profile_selected === true)
    });


    long_highlighted = wideToLong(data_highlighted, exp, false);

    centroid_data_highlighted = calc_centroid(long_highlighted);

    long_data_highlighted = joinData(long_highlighted, centroid_data_highlighted);

    if(value === "centroid"){

        long_data_highlighted = long_highlighted.slice(0, data_input.time_points);

        for(row of long_highlighted){
            row.gene = "avg";
            row.value = row.curr_centroid.avg;
        }
    }

    // nest data
    var nested_highlighted = d3.nest()
        .key(function(d) {return d.gene})
        .entries(long_data_highlighted);


    var y_offset = ( d3.min(long_data, function(d){ return +d.curr_centroid.lower}) < 0) ? d3.min(long_data, function(d){ return +d.curr_centroid.lower}) : 0;

    svg["x_" + exp + "_" + cluster_count + "_" + tabDivId].domain(d3.map(long_data, function(d){return d.x}).keys())
    curr_svg.selectAll(".x_axis")
        .attr("transform", "translate(0," + (curr_height - margin.bottom - y_offset*3) + ")")
        .transition()
        .duration(500)
        .call(d3.axisBottom(svg["x_" + exp + "_" + cluster_count + "_" + tabDivId]));


    svg["y_" + exp + "_" + cluster_count + "_" + tabDivId].domain([d3.min(long_data, function(d){ return (value === "centroid") ? Math.min(+d.curr_centroid.lower, +d.value) : +d.value }),
              d3.max(long_data, function(d){ return (value === "centroid") ? Math.max(+d.curr_centroid.upper, +d.value) : +d.value })])
    curr_svg.selectAll(".y_axis")
        .transition()
        .duration(500)
        .call(d3.axisLeft(svg["y_" + exp + "_" + cluster_count + "_" + tabDivId]));

    var test = [nested[0].values];


    if(value === "centroid"){

        var centroid = curr_svg.selectAll(".centroid")
            .data(test);

        // append path, bind data, call line generator
        centroid
            .enter()
            .append("path")
            .attr("class", "centroid")
            .merge(centroid)
            .attr("fill", "none")
            .attr("stroke", d => color(d[0].exp))
            .attr("stroke-opacity", 1)
            .attr("stroke-width", 2)
            .attr("id", function(d){
                return "centroid_" + d[0].exp;
            })
            .transition()
            .duration(500)
            .attr("d",
                d3.line()
                    .x(function(d) {
                        return svg["x_" + exp + "_" + cluster_count + "_" + tabDivId](d.x); })
                    .y(function(d) {
                        return svg["y_" + exp + "_" + cluster_count + "_" + tabDivId](d.value); }))

        centroid
            .exit()
            .transition()
            .duration(500)
            .style("stroke-opacity", 0)
            .remove();



        var upper = curr_svg.selectAll(".upper")
            .data(test);

        upper
            .enter()
            .append("path")
            .attr("class", "upper")
            .merge(upper)
            .attr("fill", "none")
            .attr("stroke", d => color(d[0].exp))
            .attr("stroke-opacity", 0.3)
            .attr("stroke-width", 2)
            .attr("id", function(d){
                return "centroid_upper_" + d[0].exp;
            })
            .transition()
            .duration(500)
            .attr("d",
                d3.line()
                    .x(function(d) {
                        return svg["x_" + exp + "_" + cluster_count + "_" + tabDivId](d.x); })
                    .y(function(d) {
                        return svg["y_" + exp + "_" + cluster_count + "_" + tabDivId](d.curr_centroid.upper); }))

        upper
            .exit()
            .transition()
            .duration(500)
            .style("stroke-opacity", 0)
            .remove();


        var lower = curr_svg.selectAll(".lower")
            .data(test);

        lower
            .enter()
            .append("path")
            .attr("class", "lower")
            .merge(lower)
            .attr("fill", "none")
            .attr("stroke", d => color(d[0].exp))
            .attr("stroke-opacity", 0.3)
            .attr("stroke-width", 2)
            .attr("id", function(d){
                return "centroid_lower_" + d[0].exp;
            })
            .transition()
            .duration(500)
            .attr("d",
                d3.line()
                    .x(function(d) {
                        return svg["x_" + exp + "_" + cluster_count + "_" + tabDivId](d.x); })
                    .y(function(d) {
                        return svg["y_" + exp + "_" + cluster_count + "_" + tabDivId](d.curr_centroid.lower); }))

        lower
            .exit()
            .transition()
            .duration(500)
            .style("stroke-opacity", 0)
            .remove();



        var area = curr_svg.selectAll(".area")
            .data(test);

        area
            .enter()
            .append("path")
            .attr("class", "area")
            .merge(area)
            .attr("fill", d => color(d[0].exp))
            .attr("fill-opacity", 0.3)
            .attr("stroke", "none")
            .attr("id", function(d){
                return "centroid_area_" + d[0].exp;
            })
            .transition()
            .duration(500)
            .attr("d",
                d3.area()
                    .x(function(d) {return svg["x_" + exp + "_" + cluster_count + "_" + tabDivId](d.x); })
                    .y0(function(d) {return svg["y_" + exp + "_" + cluster_count + "_" + tabDivId](d.curr_centroid.lower); })
                    .y1(function(d) {return svg["y_" + exp + "_" + cluster_count + "_" + tabDivId](d.curr_centroid.upper); }))

        area
            .exit()
            .transition()
            .duration(500)
            .style("stroke-opacity", 0)
            .remove();

    }

    else if (value === "profiles"){

        // Define the div for the tooltip
        // https://bl.ocks.org/d3noob/a22c42db65eb00d4e369
        var tip = d3.select("body").append("div")   
            .attr("class", "tooltip")               
            .style("opacity", 0);

        var popup = d3.select("body").append("div")
            .attr("class", "popup")
            .style("opacity", 0);

        var lines = curr_svg.selectAll(".lines")
            .data(nested);

        lines
            .enter()
            .append("path")
            .attr("class", "lines")
            .merge(lines)
            .attr("fill", "none")
            .attr("stroke", d => color(d.values[0].exp))
            .attr("stroke-width", 2)
            .attr("id", d => "lineplot_" + exp + "_" + d.key.toString())
            .on('contextmenu', function(d){ 
                // https://jsfiddle.net/thudfactor/T8hpd/

                d3.event.preventDefault();

                d3.select("#lineplot_exp1_" + d.key.toString())
                .raise()
                .attr("stroke", "red")
                .attr("stroke-width", 3)

                d3.select("#lineplot_exp2_" + d.key.toString())
                .raise()
                .attr("stroke", "red")
                .attr("stroke-width", 3)

                
                if (contextMenuShowing) {
                    d3.select("#popup").remove();
                }

                else{
                    var popup = d3.select("body")
                    .append("div")   
                    .attr("class", "popup")
                    .attr("id", "popup")
                    .style("opacity", 0.9)            
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .style("pointer-events","visible");

                    createChildDivs(3, 'popup', 'popup_part');

                    var part1 = d3.select("#popup_part1")
                        .append("svg")
                        .append("g")

                    part1
                        .append("rect")
                        .attr("width", document.getElementById("popup_part2").offsetWidth)
                        .attr("height", document.getElementById("popup_part2").offsetHeight)
                        .attr("fill", "lightsteelblue")

                    part1
                        .append("text")
                        .attr("dx", 10)
                        .attr("dy", 20)
                        .text(d.key)

                    var part2 = d3.select("#popup_part2")
                        .append("svg")

                    part2                    
                        .append("rect")
                        .attr("width", document.getElementById("popup_part2").offsetWidth)
                        .attr("height", document.getElementById("popup_part2").offsetHeight)
                        .attr("fill", "lightsteelblue")
                        .style("cursor", "pointer")
                        .on("click", function(){
                            window.open("https://www.ncbi.nlm.nih.gov/gene/?term=" + d.key);
                        })
                        .on("mouseover", function(){
                            d3.select(this)
                                .attr("fill", "lightgrey")
                        })
                        .on("mouseout", function(){
                            d3.select(this)
                                .attr("fill", "lightsteelblue")
                        })


                    part2
                        .append("text")
                            .attr("dx", 10)
                            .attr("dy", 20)
                            .text("NCBI")
                            .style("cursor", "pointer")
                            .on("click", function(){
                                window.open("https://www.ncbi.nlm.nih.gov/gene/?term=" + d.key);
                            })
                            .on("mouseover", function(){
                            d3.select("#popup_part2")
                                .attr("fill", "lightgrey")
                            })
                            .on("mouseout", function(){
                                d3.select("#popup_part2")
                                    .attr("fill", "lightsteelblue")
                            })


                    var part3 = d3.select("#popup_part3")
                        .append("svg")

                    part3
                        .append("rect")
                        .attr("width", document.getElementById("popup_part3").offsetWidth)
                        .attr("height", document.getElementById("popup_part3").offsetHeight)
                        .attr("fill", "lightsteelblue")
                        .style("cursor", "pointer")
                        .on("mouseover", function(){
                            d3.select(this)
                                .attr("fill", "lightgrey")
                        })
                        .on("mouseout", function(){
                            d3.select(this)
                                .attr("fill", "lightsteelblue")
                        })


                    part3
                        .append("text")
                        .attr("dx", 10)
                        .attr("dy", 20)
                        .text("Sub-Cluster")
                        
                }

                contextMenuShowing = !contextMenuShowing;        

            })

            .on("mouseover", function(d){

                d3.select("#lineplot_exp1_" + d.key.toString())
                .raise()
                .attr("stroke", "red")
                .attr("stroke-width", 3)

                d3.select("#lineplot_exp2_" + d.key.toString())
                .raise()
                .attr("stroke", "red")
                .attr("stroke-width", 3)

                tip
                    .transition()
                    .duration(200)
                    .style("opacity", 0.9)

                tip.html(d.key)
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px")
                     
            })
            .on("mouseout", function(d){                

                d3.select("#lineplot_exp1_" + d.key.toString())
                .lower()
                .attr("stroke", d => color(d.values[0].exp))
                .attr("stroke-width", 2)

                d3.select("#lineplot_exp2_" + d.key.toString())
                .lower()
                .attr("stroke", d => color(d.values[0].exp))
                .attr("stroke-width", 2)

                tip.transition()
                    .duration(500)
                    .style("opacity", 0)
            })

            .on("click", function(){
                d3.select("#popup").remove();
            })


            .transition()
            .duration(500)
            .attr("d", function(d){
                return d3.line()
                    .x(function(d) {return svg["x_" + exp + "_" + cluster_count + "_" + tabDivId](d.x); })
                    .y(function(d) {return svg["y_" + exp + "_" + cluster_count + "_" + tabDivId](d.value); })
                    (d.values)
            })

        // lines
        //     .exit()
        //     .transition()
        //     .duration(500)
        //     .remove();


        // profile_selected
        var lines_highlighted = curr_svg.selectAll(".lines_highlighted")
            .data(nested_highlighted);

        lines_highlighted
            .raise()
            .enter()
            .append("path")
            .attr("class", "lines_highlighted")
            .merge(lines_highlighted)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("id", function(d){
                return "lineplot_highlighted_" + exp + "_" + d.key;
            })
            .on('contextmenu', function(d){ 
                // https://jsfiddle.net/thudfactor/T8hpd/

                d3.event.preventDefault();

                d3.select("#lineplot_exp1_" + d.key.toString())
                .raise()
                .attr("stroke", "red")
                .attr("stroke-width", 3)

                d3.select("#lineplot_exp2_" + d.key.toString())
                .raise()
                .attr("stroke", "red")
                .attr("stroke-width", 3)

                
                if (contextMenuShowing) {
                    d3.select("#popup").remove();
                }

                else{
                    var popup = d3.select("body")
                    .append("div")   
                    .attr("class", "popup")
                    .attr("id", "popup")
                    .style("opacity", 0.9)            
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .style("pointer-events","visible");

                    createChildDivs(3, 'popup', 'popup_part');

                    var part1 = d3.select("#popup_part1")
                        .append("svg")
                        .append("g")

                    part1
                        .append("rect")
                        .attr("width", document.getElementById("popup_part2").offsetWidth)
                        .attr("height", document.getElementById("popup_part2").offsetHeight)
                        .attr("fill", "lightsteelblue")

                    part1
                        .append("text")
                        .attr("dx", 10)
                        .attr("dy", 20)
                        .text(d.key)

                    var part2 = d3.select("#popup_part2")
                        .append("svg")

                    part2                    
                        .append("rect")
                        .attr("width", document.getElementById("popup_part2").offsetWidth)
                        .attr("height", document.getElementById("popup_part2").offsetHeight)
                        .attr("fill", "lightsteelblue")
                        .style("cursor", "pointer")
                        .on("click", function(){
                            window.open("https://www.ncbi.nlm.nih.gov/gene/?term=" + d.key);
                        })
                        .on("mouseover", function(){
                            d3.select(this)
                                .attr("fill", "lightgrey")
                        })
                        .on("mouseout", function(){
                            d3.select(this)
                                .attr("fill", "lightsteelblue")
                        })


                    part2
                        .append("text")
                            .attr("dx", 10)
                            .attr("dy", 20)
                            .text("NCBI")
                            .style("cursor", "pointer")
                            .on("click", function(){
                                window.open("https://www.ncbi.nlm.nih.gov/gene/?term=" + d.key);
                            })
                            .on("mouseover", function(){
                            d3.select("#popup_part2")
                                .attr("fill", "lightgrey")
                            })
                            .on("mouseout", function(){
                                d3.select("#popup_part2")
                                    .attr("fill", "lightsteelblue")
                            })


                    var part3 = d3.select("#popup_part3")
                        .append("svg")

                    part3
                        .append("rect")
                        .attr("width", document.getElementById("popup_part3").offsetWidth)
                        .attr("height", document.getElementById("popup_part3").offsetHeight)
                        .attr("fill", "lightsteelblue")
                        .style("cursor", "pointer")
                        .on("mouseover", function(){
                            d3.select(this)
                                .attr("fill", "lightgrey")
                        })
                        .on("mouseout", function(){
                            d3.select(this)
                                .attr("fill", "lightsteelblue")
                        })


                    part3
                        .append("text")
                        .attr("dx", 10)
                        .attr("dy", 20)
                        .text("Sub-Cluster")
                        
                }

                contextMenuShowing = !contextMenuShowing;        

            })
            .on("mouseover", function(d){

                d3.select("#lineplot_highlighted_exp1_" + d.key.toString())
                .raise()
                .attr("stroke-width", 3)

                d3.select("#lineplot_highlighted_exp2_" + d.key.toString())
                .raise()
                .attr("stroke-width", 3)

                tip.transition()
                    .duration(200)
                    .style("opacity", 0.9)

                tip.html(d.key)
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px");  
            })
            .on("mouseout", function(d){

                d3.select("#lineplot_highlighted_exp1_" + d.key.toString())
                .raise()
                .attr("stroke", "red")
                .attr("stroke-width", 2)

                d3.select("#lineplot_highlighted_exp2_" + d.key.toString())
                .raise()
                .attr("stroke", "red")
                .attr("stroke-width", 2)

                tip.transition()
                    .duration(500)
                    .style("opacity", 0)
            })
            .transition()
            .duration(500)
            .attr("d", function(d){
                return d3.line()
                    .x(function(d) {return svg["x_" + exp + "_" + cluster_count + "_" + tabDivId](d.x); })
                    .y(function(d) {return svg["y_" + exp + "_" + cluster_count + "_" + tabDivId](d.value); })
                    (d.values)
            })

    

        
        // lines_highlighted
        //     .exit()
        //     .transition()
        //     .duration(500)
        //     .remove();

    }
}



/**
 * Creates profile diagrams for both experiments and all clusters
 * @param {Object} data wide data, e.g. loaded by d3.csv()
 */
function profilePerCluster(data, parentLeftDivId, parentRightDivId, tabDivId) {

    cluster_count = data.cluster_count;

    // remove old entries
    var exp1_old = document.getElementById(parentLeftDivId);
    while (exp1_old.firstChild) exp1_old.removeChild(exp1_old.firstChild);
    var exp2_old = document.getElementById(parentRightDivId);
    while (exp2_old.firstChild) exp2_old.removeChild(exp2_old.firstChild);

    // add new
    //createDivs(cluster_count);
    createChildDivs(cluster_count, parentLeftDivId, "exp1_", tabDivId);
    createChildDivs(cluster_count, parentRightDivId, "exp2_", tabDivId);

    //plot counts might be adjusted when NAs are involved
    plot_counts = document.getElementById(parentLeftDivId).childElementCount;


    for (i = 1; i <= plot_counts; i++) {

        profileDiagram(data, "exp1", i, tabDivId);
        profileDiagram(data, "exp2", i, tabDivId);
    }

}
