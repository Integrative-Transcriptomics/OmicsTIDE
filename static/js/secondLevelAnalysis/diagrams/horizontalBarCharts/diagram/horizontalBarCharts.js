/**
 * 
 * @param {ObjectArray} sorted_values 
 * @param {String} div 
 * @param {String} category_id 
 * @param {String} category_name 
 */
function horizontalBarCharts(sorted_values, div, category_id, category_name){

    let bar_width = document.getElementById(div).offsetWidth;
    let bar_height = document.getElementById(div).offsetHeight;

    d3.select("#bar_" + div).remove();

    let svgBar = d3.select("#" + div)
            .append("div")
            // Container class to make it responsive.
            .classed("svg-container", false)
            .append("svg")
            // Responsive SVG needs these 2 attributes and no width and height attr.
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + bar_width +  " " + bar_height)
            // Class to make it responsive.
            .classed("svg-content-responsive", false)
            // Fill with a rectangle for visualization.
            .attr("id", "bar_" + div);

    let g = svgBar.append("g")
            .attr("transform", "translate(" + bar_margin.left + "," + bar_margin.top + ")");

    let y = d3.scaleBand()
        .rangeRound([bar_margin.top, bar_height-bar_margin.bottom])
        .paddingInner(0.1)
        .align(0.1);

    let x = d3.scaleLinear()
        .range([0, bar_width-bar_margin.right-bar_margin.left])

    y.domain(sorted_values.map(function (d) { return d.id}));
    x.domain([0, d3.max(sorted_values.map(function(d) { return d.minus_log10_fdr }))]);

    g.append("g")
        .selectAll(".bar")
        .data(sorted_values)
        .enter()
        .append("g")
        .attr("fill", "grey")
        .append("rect")
        .attr("y", function (d) {
            return y(d.id);
        })
        .attr("x", 0)
        .attr("width", function (d) {
            return x(d.minus_log10_fdr);
        })
        .attr("height", y.bandwidth())
        .append("title")
        .text(d => d.id + "\n" + d.label + "\n" + "FDR: " + d.fdr.toPrecision(2));

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,0)")
        .call(d3.axisLeft(y));

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (bar_height-bar_margin.bottom) + ")")
        //.call(d3.axisBottom(x).ticks(null, "s"))
        .call(d3.axisBottom(x))
        .append("text")
        .attr("y", 2)
        .attr("fill", "#000")

    g.append("text")
        .attr("x", ((bar_width-bar_margin.right)/2))
        .attr("y", 0 - (bar_margin.top/5))
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text(category_id + "-" + category_name);

    g.append("text")
        .attr("x", ((bar_width-bar_margin.right)/2))
        .attr("y", (bar_height-(bar_margin.bottom/3)))
        .attr("text-anchor", "middle")
        .style("font-size", "8px")
        .text("-log10(FDR)");
}


/**
 * 
 * @param {Object} panther_results 
 * @param {String} div 
 * @param {String} category_id 
 * @param {String} category_name 
 */
function GoTermBarCharts(panther_results, div, category_id, category_name){

    panther_results = panther_results.filter(d => d.term.label !== "UNCLASSIFIED");

    // restrict to 10 largest values
    panther_results = panther_results.slice(0,9);

    // -log10 transform values
    go_terms = [];

    for(entry of panther_results){
        entry.term.minus_log10_fdr = -Math.log10(entry.fdr)
        entry.term['fdr'] = entry.fdr;
        go_terms.push(entry.term);
    }

    // sort values decreasingly
    go_terms = go_terms.sort((a,b) => (a.minus_log10_fdr <= b.minus_log10_fdr) ? 1 : -1 )

    horizontalBarCharts(go_terms, div, category_id, category_name)

    // show max. 20 values

    // horizontal bar charts

}