/**
 * 
 * @param {ObjectArray} wideData 
 * @param {String} experimentId 
 * @param {Boolean} isBox 
 */
function wideToLong(wideData, experimentId, isBox){
    var longData = [];

    wideData.forEach(function (row) {

        Object.keys(row).forEach(function (colname) {

            // skips columns not related to time point measurments
            if (colname.startsWith(experimentId) && !(colname.endsWith("var") || colname.endsWith("cluster") || colname.endsWith("median") || colname.endsWith("median")|| colname === "gene" || colname === "highlighted" || colname === "profile_selected")) {

                if(!isBox){
                longData.push({
                    "profile_selected": row["profile_selected"],
                    "highlighted": row["highlighted"],
                    "experimentAndCluster": row[experimentId+"_cluster"],
                    "median": Math.round( row[experimentId+"_median"] * 100 + Number.EPSILON ) / 100
                    ,
                    "gene": row["gene"],
                    "x": colname,
                    "value": Math.round( row[colname] * 100 + Number.EPSILON ) / 100
                });

                }

                else{
                    longData.push({
                        "profile_selected": row["profile_selected"],
                        "highlighted": row["highlighted"],
                        "experimentAndCluster": row[experimentId+"_cluster"],
                        "gene": row["gene"],
                        "x": colname,
                        "value": Math.round( row[colname] * 100 + Number.EPSILON ) / 100
                    });

                }
            }

            else{
                return;
            }

        });
    });

    return longData;
}


/**
 * creates nested object from data
 * @param {ObjectArray} data 
 * @param {String} key 
 */
function nestData(data, key){

	return d3.nest()
        .key(function(d) {return d[key]})
        .entries(data);
}




// bar chart
// formatting Data to a more d3-friendly
// extracting binNames and clusterNames
function formatData(data) {


    let clusterNames = d3.keys(data[0]).filter(function (key) { return (key !== 'comparison' && key !== 'file_1' && key !== 'file_2'); });
    let binNames = [];

    let blockData = [];


    for (let i = 0; i < data.length; i++) {
        let y = 0;
        binNames.push(data[i].comparison);
        for (let j = 0; j < clusterNames.length; j++) {

            let height = data[i][clusterNames[j]];
            let y0 = y;
            let y1 = y + height;
            let x = data[i].comparison;
            let cluster = clusterNames[j];
            let key = data[i].comparison + "_" + clusterNames[j];


            let block = {};

            block['y0'] = y0;
            block['y1'] = y1;
            block['height'] = height;
            block['x'] = x;
            block['cluster'] = cluster;
            block['key'] = key;
            block['file_1'] = data[i]['file_1'];
            block['file_2'] = data[i]['file_2'];

            y += data[i][clusterNames[j]];
            blockData.push(block);
        }
    }
    return {
        blockData: blockData,
        binNames: binNames,
        clusterNames: clusterNames
    };

}



/**
 * transforms data for bar charts
 * @param {ObjectArray} data 
 */
function barChartFromGlobalDataInfo(data) {

    let barChartData = [];

    for (let comparison of Object.keys(data).reverse()) {

        barChartData.push({
            'comparison': comparison,
            'i_concordant': data[comparison]['info']['barChart']['absolute']['concordant_count'],
            'i_discordant': data[comparison]['info']['barChart']['absolute']['discordant_count'],
            'ni_firstOnly': data[comparison]['info']['barChart']['absolute']['first_non_intersecting_genes_count'],
            'ni_secondOnly': data[comparison]['info']['barChart']['absolute']['second_non_intersecting_genes_count'],
            'file_1': data[comparison]['info']['file_1']['filename'],
            'file_2': data[comparison]['info']['file_2']['filename'],
        })
    }

    return barChartData
}