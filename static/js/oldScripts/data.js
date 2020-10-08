/**
 *  transforms wide format to long format
 * @param {Object} wide_data data in wide table format, i.e. each measure time point has its own column
 * @param {string} exp ID of the experiment
 * @returns {Object} long_data transformed object with each measure time point per gene and exp in a single row
 */
// function wideToLong(wide_data, exp, boxplot){
//     var long_data_ = [];

//     wide_data.forEach(function (row) {

//         count = 1;
//         Object.keys(row).forEach(function (colname) {
//             // skips columns not related to time point measurments
//             if (colname.startsWith(exp) && !(colname.endsWith("cluster") || colname.endsWith("median") || colname === "gene" || colname === "highlighted" || colname === "profile_selected")) {
//                 if(!boxplot){
//                 long_data_.push({
//                     "profile_selected": row["profile_selected"],
//                     "highlighted": row["highlighted"],
//                     "exp": row[exp+"_cluster"],
//                     "median": row[exp+"_median"],
//                     "gene": row["gene"],
//                     "x": "t"+count.toString(),
//                     "value": row[colname]
//                 });

//                     count++;
//                 }

//                 else{
//                     long_data_.push({
//                         "profile_selected": row["profile_selected"],
//                         "highlighted": row["highlighted"],
//                         "exp": row[exp+"_cluster"],
//                         "gene": row["gene"],
//                         "x": "t"+count.toString(),
//                         "value": row[colname]
//                     });

//                     count++;
//                 }
//             }

//             else{
//                 return;
//             }

//         });
//     });

//     return long_data_;
// }


function joinData(data1, data2){
    joined_array = [];

    for(j=0; j<data1.length; j++){

        curr_centroids = [];
        for(k=0; k<data2[0].values.length; k++) {
            curr_centroids.push(data2[0].values[k].value);
        }

        // mean = d3.mean(curr_centroids);
        // sd = d3.deviation(curr_centroids);

        for(k=0; k<data2[0].values.length; k++) {
            if(data1[j].x === data2[0].values[k].key){
                data1[j].curr_centroid = data2[0].values[k].value;
                //data1[j].curr_centroid_zscore = (data2[0].values[k].value - mean) / sd;
            }
        }
    }

    return data1;
}
