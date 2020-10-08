
// https://stackoverflow.com/questions/29131627/how-to-group-multiple-values-in-nested-d3-to-create-multiple-rollup-sum-chart
function calc_centroid(data){

    var group_exp_timepoint = d3.nest()
        .key(function(d) {return d.exp; })
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

    return group_exp_timepoint;

}

// considering that d3.deviation requires at least 2 values (set from undefined to 0 is only one value is present)
function calcDeviation(v, d){
    return (typeof d3.deviation(v, function (d){return +d.value}) === "undefined") ? 0 : d3.deviation(v, function (d){return +d.value});
}

// function calculate_zscore(data){
//
//     for(row of data){
//         row.z_score = (row.value-row.mean)/row.sd;
//     }
//
//     return data;
// }

