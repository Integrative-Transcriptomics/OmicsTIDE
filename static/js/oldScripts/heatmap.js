heatmap_margin = {left: 30, top:20, right:10, bottom: 10};


// using long data (created by wideToLong)
function heatmap(data, exp, cluster_count) {

    z_score = document.getElementById('z_score').checked;

    no_na_data = []

    for(row of data){
        if(!(row.exp1 === "exp1_NA" || row.exp2 === "exp2_NA")){
            no_na_data.push(row);
        }
    }

    no_na_data.columns = data.columns;

    wide_data = wideToLong(no_na_data, exp, false);

    calculate_zscore(wide_data);

    centroid_data = calc_centroid(wide_data);

    pre_filter = joinData(wide_data, centroid_data);

    data = wide_data.filter(function(d) { return d.exp === exp + "_" + cluster_count; })

    data = joinData(data, centroid_data);

    data = data.map(function (d) {

        var newItem = {};

        // filter data for specific cluster
        newItem.curr_centroid = d.curr_centroid;
        newItem.curr_centroid_zscore = d.curr_centroid_zscore;
        newItem.exp = d.exp;
        newItem.gene = d.gene;
        newItem.time = d.x;
        newItem.value = +d.value;
        newItem.z_score = d.z_score;
        newItem.highlighted = d.highlighted;

        return newItem;
    });

    if(document.getElementById('centroid').checked){
        // adapt centroid colums to number of used conditions
        conditions = [];

        for(row of data){
            conditions.push(row.time);
        }

        unique_conditions = [...new Set(conditions)];

        data = data.slice(0,unique_conditions.length);

        for(row of data){
            row.gene = "avg";
            row.value = row.curr_centroid;
        }
    }


    createSubDivs(exp + "_plot" + cluster_count, "100", "85", "map");
    createSubDivs(exp + "_plot" + cluster_count, "100", "15", "legend");

    curr_width =  document.getElementById(exp + "_plot" + cluster_count + "_map").offsetWidth;
    curr_height = document.getElementById(exp + "_plot" + cluster_count + "_map").offsetHeight;

    var x_elements = d3.set(data.map(function(d) { return d.time; } )).values(),
        y_elements = d3.set(data.map(function(d) { return d.gene; } )).values(),
        cell_values = z_score ? (d3.set(pre_filter.map(function(d) {return d.z_score; } )).values()) : (d3.set(pre_filter.map(function(d) { return +d.value; } )).values())

    cell_values = cell_values.map(Number);

    cell_height = (curr_height-heatmap_margin.bottom) / y_elements.length;
    cell_width = curr_width / x_elements.length;


// color: linear gradient scale (between red and blue), domain: [d3.min(), d3.max()]
    var colorScale = d3.scaleLinear()
        .domain([d3.min(cell_values), d3.max(cell_values)])
        .range([d3.interpolateYlGnBu(0), d3.interpolateYlGnBu(1)]);


    var xScale = d3.scaleBand()
        .domain(x_elements)
        //.range([0, curr_width - margin.right])
        .range([heatmap_margin.left, curr_width])

    var yScale = d3.scaleBand()
        .domain(y_elements)
        //.range([0, curr_height - margin.bottom ])
        .range([heatmap_margin.top, curr_height-heatmap_margin.bottom]);

    var xAxis = d3.axisTop()
        .scale(xScale)
        .tickFormat(function (d) {
            return d;});

    var yAxis = d3.axisLeft()
        .scale(yScale)
        .tickFormat(function (d) {
            return d;});

    var svg = d3.select("#" + exp + "_plot" + cluster_count + "_map")
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
        .attr("id",exp + "_heatmap_" + cluster_count + "_map")
        //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var cells = svg.selectAll('rect')
        .data(data)
        .enter().append('g').append('rect')
        .attr('class', 'cell')
        .attr('width', cell_width)
        .attr('height', cell_height)
        .attr('y', function(d) { return yScale(d.gene); })
        .attr('x', function(d) { return xScale(d.time); })
        .attr('class', function(d) { return "heatmap_" + exp + "_map" + "_" + d.gene; })
        .attr('fill', function(d) {return z_score ? colorScale(d.z_score) : colorScale(d.value);})
        .attr('opacity', function(d) { return d.highlighted === "1" ? 1 : non_selected_opacity })
        .on('mouseover', function(d){ return highlightGeneInHeatmap([d.gene])})
        .on('mouseout', function(d){ return unhighlightGeneInHeatmap([d.gene])})
        .on("dblclick", function(d){
            updateGlobalSelectionLine(d);
            getTabularOutput(global_selection);
        });

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + heatmap_margin.left + "," + 0 + ")")
        .call(yAxis)
        .selectAll('txt')
        .attr('font-weight', 'normal')

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + 0 + "," + heatmap_margin.top + ")")
        .call(xAxis)
        .selectAll('text')
        .attr('font-weight', 'normal')
        .style("text-anchor", "start")

    // legend
    curr_width_legend =  document.getElementById(exp + "_plot" + cluster_count + "_legend").offsetWidth;
    curr_height_legend = document.getElementById(exp + "_plot" + cluster_count + "_legend").offsetHeight;


    // creating color gradient for color scale
    var svg_legend = d3.select("#" + exp + "_plot" + cluster_count + "_legend")
        .append("div")
        // Container class to make it responsive.
        .classed("svg-container", false)
        .append("svg")
        // Responsive SVG needs these 2 attributes and no width and height attr.
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + curr_width_legend + " " + curr_height_legend)
        // Class to make it responsive.
        .classed("svg-content-responsive", false)
        // Fill with a rectangle for visualization.
        .attr("id",exp + "_heatmap_" + cluster_count + "_legend")
        .style('transform', 'translate(30%, 0%)')


    var defs = svg_legend.append("defs");
    var linearGradient = defs.append('linearGradient')
        .attr('id', 'linear-gradient')

    linearGradient
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%')

    linearGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d3.interpolateYlGnBu(0))

    linearGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d3.interpolateYlGnBu(1))

    var legend = svg_legend.append('rect')
        .attr("class", "legendRect")
        .attr("x", 0)
        .attr("y", 0)
        .attr('width', curr_width_legend/2)
        .attr('height', curr_height_legend/3)
        .style('fill', 'url(#linear-gradient)');


    all_values = [];
    all_zscores = [];
    min = 0;
    max = 0;

    //!document.getElementById('centroid').checked)

    for(row of pre_filter){
        all_values.push((!document.getElementById('centroid').checked) ? +row.curr_centroid : +row.value);
        all_zscores.push((!document.getElementById('centroid').checked) ? +row.curr_centroid_zscore : row.z_score);
    }

    if(!document.getElementById('z_score').checked){

        min = d3.min(all_zscores);
        max = d3.max(all_zscores);
    }

    else{
        min = d3.min(all_values);
        max = d3.max(all_values);

    }

//create tick marks
    var x = d3.scaleLinear()
        .domain([min, max])
        .range([0, curr_width_legend/2]);

    var axis = d3.axisBottom(x)
        .scale(x)
        .ticks(4);

   svg_legend
       .append("g")
       .attr("class", "axis")
       .attr("transform", "translate(0," + (curr_height_legend/3) + ")")
       .call(axis)
       //.attr("transform", "rotate(-45)")
       .attr("text-anchor", "start")
       .attr("font-size", "7.5px")
       .append("text")
}


// TODO: Refactor this -> removal and redrawing of divs is stupid!
function heatmapPerCluster(data) {

    // remove old entries
    var exp1_old = document.getElementById('exp1');
    while (exp1_old.firstChild) exp1_old.removeChild(exp1_old.firstChild);
    var exp2_old = document.getElementById('exp2');
    while (exp2_old.firstChild) exp2_old.removeChild(exp2_old.firstChild);

    cluster = [];
    for(row of init_data){
        cluster.push(row.exp1);
    }
    unique_cluster = Array.from([...new Set(cluster)]);

    //remove NA
    unique_cluster = unique_cluster.filter(e => e !== "exp1_NA" && e !== "exp2_NA");

    cluster_count = unique_cluster.length;

    // add new
    //createDivs(cluster_count);
    createChildDivs(cluster_count, 'exp1', 'exp1_plot');
    createChildDivs(cluster_count, 'exp2', 'exp2_plot');

    //plot counts might be adjusted when NAs are involved
    plot_counts = document.getElementById('exp1').childElementCount;

    for (i = 1; i <= plot_counts; i++) {

        heatmap(data, "exp1", i);
        heatmap(data, "exp2", i);

    }

    // drawHeatMap
}

