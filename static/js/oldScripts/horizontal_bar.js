//bar_margin = {top: 10, right: 160, bottom: 50, left: 140};

function summarizeBars(main_category){

    init = sumUpGoTerms(true);
    selection = sumUpGoTerms(false);

    go_init = {};
    go_selection = {};
    go_final = [];

    for (row of init){
        if(row.key === main_category){
            for(cat of row.values){
                go_init[cat.key] = cat.values.values;
            }
        }
    }

    for (row of selection){
        if(row.key === main_category){
            for(cat of row.values){
                go_selection[cat.key] = cat.values.values;
            }
        }
    }


    for (init_keys of Object.keys(go_init)){
        for (selection_keys of Object.keys(go_selection)){
            if(init_keys === selection_keys){
                go_final.push({go_term: init_keys, value : go_selection[selection_keys], rest : (go_init[init_keys]-go_selection[selection_keys]), total:go_init[init_keys] })
                break;
            }

            if(init_keys !== selection_keys && selection_keys === Object.keys(go_selection)[Object.keys(go_selection).length-1]){
                go_final.push({go_term: init_keys, value : 0, rest : go_init[init_keys], total: go_init[init_keys]})
                break;
            }
        }

    }

    go_final.columns = ["go_term", "value", "rest"];

    return go_final;
}


function renderBars(data, div, go_color) {

    bar_width = document.getElementById(div).offsetWidth;
    bar_height = document.getElementById(div).offsetHeight;

    data.sort(function(a, b) { return b.total - a.total; });

    d3.select("#bar_" + div).remove();

    var svg = d3.select("#" + div)
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
        .attr("id", "bar_" + div),

        g = svg.append("g")
            .attr("transform", "translate(" + bar_margin.left + "," + bar_margin.top + ")")
    ;



    // var svg = d3.select("#" + div)
    //         .append("svg")
    //         .attr("id", "bar_" + div),
    //     g = svg.append("g").attr("transform", "translate(" + bar_margin.left + "," + bar_margin.top + ")");

    var y = d3.scaleBand()
        .rangeRound([bar_margin.top, bar_height-bar_margin.bottom])
        .paddingInner(0.1)
        .align(0.1);

    var x = d3.scaleLinear()
        .rangeRound([0, bar_width-bar_margin.right])

    var z = d3.scaleOrdinal()
        .range([go_color, "#edeef4"]);

    var keys = data.columns.slice(1);

    y.domain(data.map(function (d) { return d.go_term}));
    x.domain([0, 8]);
    z.domain(keys);

    g.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(data))
        .enter()
        .append("g")
        .attr("fill", function(d){return z(d.key)})
        .selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter().append("rect")
        .attr("y", function (d) {
            return y(d.data.go_term);
        })
        .attr("x", function (d) {
            return x(d[0]);
        })
        .attr("width", function (d) {
            return x(d[1]) - x(d[0]);
        })
        .attr("height", y.bandwidth())

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,0)")
        .call(d3.axisLeft(y));

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (bar_height-bar_margin.bottom) + ")")
        .call(d3.axisBottom(x).ticks(null, "s"))
        .append("text")
        .attr("y", 2)
        .attr("x", x(x.ticks().pop()) + 0.5)
        .attr("dy", "0.2em")
        .attr("fill", "#000")
        .attr("text-anchor", "start")

}

function renderAllBarCharts(){
    renderBars(summarizeBars('molecular_function'), "molfunc", '#4A7B9D')
    renderBars(summarizeBars('cellular_component'), "cellcomp", '#54577C')
    renderBars(summarizeBars('biological_process'), "bioproc", '#ED6A5A')
}




