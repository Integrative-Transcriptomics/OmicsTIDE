





//http://forrestcoward.github.io/examples/scrollable-table/index.html

/**
  *
  */
// function updateTable(selection, comparison, tabId){

// 	d3.select("#current_gene_table").remove();

// 	var myTableData = []

// 	for(row of selection){
// 		myTableData.push({'gene': row.gene, 'ds1_cluster': row.ds1_cluster, 'ds2_cluster': row.ds2_cluster})
// 	}

// 	var tableChart = document.getElementById(tabId + "-information-controls-table-wrapper-" + comparison + "_" + tabId);

// 	var tableWidth = tableChart.offsetWidth;
// 	var tableHeight = tableChart.offsetHeight;

// 	var textFunc = function(data) { return data.gene; }
// 	var valueFunc = function(data) { return data.ds1_cluster; }
// 	var ds2 = function(data) { return data.ds2_cluster; }
// 	//var columns = ['Gene', 'ds1', 'ds2'];
// 	var columns = ['gene', 'ds1', 'ds2'];

// 	let id = tabId + "-information-controls-table-wrapper-" + comparison + "_"  + tabId;

// 	drawTable(myTableData, id, { tableWidth: tableWidth, tableHeight: tableHeight }, valueFunc, textFunc, ds2, columns);
// }


// /**
//   *
//   * @param{} data
//   * @param{} tableId
//   * @param{} dimensions
//   * @param{} valueFunc
//   * @param{} textFunc
//   * @param{} ds2
//   * @param{} columns
//   */
// function drawTable(data, tableid, dimensions, valueFunc, textFunc, ds2, columns) {

//     var sortValueAscending = function (a, b) { return valueFunc(a) - valueFunc(b) }
//     var sortValueDescending = function (a, b) { return valueFunc(b) - valueFunc(a) }
//     var sortNameAscending = function (a, b) { return textFunc(a).localeCompare(textFunc(b)); }
//     var sortNameDescending = function (a, b) { return textFunc(b).localeCompare(textFunc(a)); }
//     var metricAscending = true;
//     var nameAscending = true;

//     var tableWidth = dimensions.tableWidth + "px";
//     var tableHeight = dimensions.tableHeight + "px";
//     var twidth = (dimensions.tableWidth - 25) + "px";
//     var divHeight = (dimensions.tableHeight - 60) + "px";

//     var outerTable = d3.select("#" + tableid)
//     	.append("table")
//     	.attr("id", "current_gene_table")
//     	.attr("width", tableWidth);

//     console.log(outerTable);

//     outerTable.append("tr").append("td")
//         .append("table").attr("class", "headerTable").attr("width", twidth)
//         .append("tr").selectAll("th").data(columns).enter()
// 		.append("th").text(function (column) { return column; })
//         .on("click", function (d) {
//             // Choose appropriate sorting function.
//             if (d === columns[1]) {
// 			    var sort = metricAscending ? sortValueAscending : sortValueDescending;
//                 metricAscending = !metricAscending;
//             } else if(d === columns[0]) {
// 				var sort = nameAscending ? sortNameAscending : sortNameDescending
//                 nameAscending = !nameAscending;
//             }
			
//             var rows = tbody.selectAll("tr").sort(sort);
//         });

//     var inner = outerTable.append("tr").append("td")
// 		.append("div")
// 		.attr("class", "scroll")
// 		.attr("width", tableWidth)
// 		.attr("style", "height:" + divHeight + ";")
// 		.append("table")
// 		.attr("class", "bodyTable")
// 		.attr("border", 1).attr("width", twidth)
// 		.attr("height", tableHeight)
// 		.attr("style", "table-layout:fixed");

//     var tbody = inner.append("tbody");
//     // Create a row for each object in the data and perform an intial sort.
//     var rows = tbody.selectAll("tr")
// 	    .data(data)
// 	    .enter()
// 	    .append("tr")
// 	    .attr("id", function(d) {
// 	    	return "row_ " + d.gene + "_" + d.ds1_cluster + "_" + d.ds2_cluster;
// 	    })
// 	    .on("mouseover", function(d){


// 			var hovered_element = d3.select(this).attr("id").split("_");
// 			var hovered_gene = hovered_element[1].trim();
// 			var hovered_ds1_cluster = hovered_element[2].trim() + "_" + hovered_element[3].trim();
// 			var hovered_ds2_cluster = hovered_element[4].trim() + "_" + hovered_element[5].trim();

// 			//console.log("#lineplot_" + hovered_element[2].trim() + "_" + hovered_gene)

// 			d3.select("#col_" + hovered_gene)
// 				.style("cursor", "pointer")
// 			 	.style("background-color", "lightgrey")

// 			d3.select("#col_" + hovered_gene + "_" + hovered_ds1_cluster)
// 				.style("cursor", "pointer")
// 			 	.style("background-color", "lightgrey")

// 			d3.select("#col_" + hovered_gene + "_" + hovered_ds2_cluster)
// 				.style("cursor", "pointer")
// 			 	.style("background-color", "lightgrey")

// 			// highlight corresponding genes
// 			d3.select("#lineplot_" + hovered_element[2].trim() + "_" + hovered_gene)
// 				.raise()
// 				.attr('stroke', 'red')
// 				.attr('stroke-width', 4)

// 			d3.select("#lineplot_" + hovered_element[4].trim() + "_" + hovered_gene)
// 				.raise()
// 				.attr('stroke', 'red')
// 				.attr('stroke-width', 4)
// 		})

// 		.on("mouseout", function(d){
// 			var hovered_element = d3.select(this).attr("id").split("_");
// 			var hovered_gene = hovered_element[1].trim();
// 			var hovered_ds1_cluster = hovered_element[2].trim() + "_" + hovered_element[3].trim();
// 			var hovered_ds2_cluster = hovered_element[4].trim() + "_" + hovered_element[5].trim();

// 			// get currently highlighted genes
// 			currently_selected_profiles = global_selection.filter(d => d.highlighted && d.profile_selected).map(e => e.gene)

// 			d3.select("#col_" + hovered_gene)
// 			 	.style("background-color", (currently_selected_profiles.includes(hovered_gene)) ? "red" : "transparent")

// 			d3.select("#col_" + hovered_gene + "_" + hovered_ds1_cluster)
// 			 	.style("background-color", color(hovered_ds1_cluster))

// 			d3.select("#col_" + hovered_gene + "_" + hovered_ds2_cluster)
// 			 	.style("background-color", color(hovered_ds2_cluster))


// 			// if(currently_selected_profiles.includes(hovered_gene)){
// 			// 	d3.select("#lineplot_" + hovered_element[2].trim() + "_" + hovered_gene)
// 			// 		.raise()
// 			// 		.attr('stroke', 'red')
// 			// 		.attr('stroke-width', 2)

// 			// 	d3.select("#lineplot_" + hovered_element[4].trim() + "_" + hovered_gene)
// 			// 		.raise()
// 			// 		.attr('stroke', 'red')
// 			// 		.attr('stroke-width', 2)
// 			// }

// 			// else{
// 			// 	d3.select("#lineplot_" + hovered_element[2].trim() + "_" + hovered_gene)
// 			// 		.lower()
// 			// 		.attr('stroke', color(hovered_ds1_cluster))
// 			// 		.attr('stroke-width', 2)

// 			// 	d3.select("#lineplot_" + hovered_element[4].trim() + "_" + hovered_gene)
// 			// 		.lower()
// 			// 		.attr('stroke', color(hovered_ds2_cluster))
// 			// 		.attr('stroke-width', 2)
// 			// }
			
// 		})

// 	    //.sort(sortValueDescending);

//     // Create a cell in each row for each column
//     var cells = rows.selectAll("td")
//         .data(function (d) {
//             return columns.map(function (column) {
//                 return { column: column, text: textFunc(d), value: valueFunc(d), value2: ds2(d)};
//             });
//         })
//         .enter()
//         .append("td")
//         .attr("id", function(d){
//         	if (d.column === columns[0]) return "col_" + d.text;
// 			else if (d.column === columns[1]) return "col_" + d.text + "_" + d.value;
// 			else return "col_" + d.text + "_" + d.value2;
//         })
// 		.text(function (d) {
// 			if (d.column === columns[0]) return d.text;
// 			else if (d.column === columns[1]) return d.value;
// 			else return d.value2;
// 		})
// 		.style("background-color", function(d) {

// 			// get currently highlighted genes
// 			currently_selected_profiles = global_selection.filter(d => d.highlighted && d.profile_selected).map(e => e.gene)

// 			if (d.column === columns[0]){
// 				if(currently_selected_profiles.includes(d.text)){
// 					return "red";
// 				}

// 				else{
// 					return;
// 				}
// 			}
// 			else if (d.column === columns[1]) return color(d.value);
// 			else return color(d.value2);
// 		})
// 		.on("click", function(d) {
// 			window.open("https://www.ncbi.nlm.nih.gov/gene/?term=" + d.text);
// 		})
// }


