


/*
*
*
*/
function getOverview(data, exp1, exp2){
	//console.log("")
}


function getOverlapping(){
	//cnsole.log("")
}


// based on two selected experiments
function flattenData(data, exp_id1, exp_id2){
	flatObject = {};

	for(gene of Object.keys(data['genes'])){
		for(exp of Object.keys(data[genes][gene])){
			if(exp === exp_id1 || exp === exp_id2){

			}
		}
	}
}




/**
 * transforms nested genes object to represent the genes and corresponding clusters in the two chosen experiments
 * @param {Object} data object
 * @param {string} identifier of first experiment used for Sankey
 * @param {string} identifier of second experiment used for Sankey
 */
function transformDataForSankey(data, exp1, exp2){
	sankeyData = {};

	// assuming that genes are occuring in both experiments (intersection only for Sankey)
	for(gene of Object.keys(data.genes)){
		for(exp of Object.keys(data.genes[gene])){
			if(!Object.keys(sankeyData).includes(gene)){
				sankeyData[gene] = { [exp] : data.genes[gene][exp]["cluster"]}
			}

			sankeyData[gene][exp] = data.genes[gene][exp]["cluster"]

		}
	}
	return sankeyData;
}



function transformDataForCentroid(data){
	centroidData = {};

	all_values = {};

	for(gene of Object.keys(data.genes)){
		for(exp of Object.keys(data.genes[gene])){
			if(!Object.keys(all_values).includes(exp)){
				all_values[exp] = { [data.genes[gene][exp]['cluster']] : [data.genes[gene][exp]['values']] }
			}

			else{
				if(Object.keys(all_values[exp]).includes(data.genes[gene][exp]['cluster'].toString())){
					current_values = all_values[exp][data.genes[gene][exp]['cluster']]
					new_values = data.genes[gene][exp]['values']
					current_values.push(new_values);
				}

				else{
					//console.log("Cluster key not found! add key!")
					all_values[exp][data.genes[gene][exp]['cluster']] = [data.genes[gene][exp]['values']]
				}
			}
		}
	}

	// get number of x values 
	x_values_number = all_values[Object.keys(all_values)[0]][Object.keys(all_values[Object.keys(all_values)[0]])[0]][0].length

	// calculate statistics 
	for(exp of Object.keys(all_values)){
		for(cluster of Object.keys(all_values[exp])){
			tmp_object = {};
			for(gene in all_values[exp][cluster]){
				for(x_value of all_values[exp][cluster][gene]){
					
				}
			}
		}
	}


	return all_values;
}




data = {
	'genes' : {
		'g1' : {
			'exp1' : {
				'values' : [20, 25, 30],
				'median' : 25,
				'cluster' : 1,
				'in_current_abundance_range' : true,
				'is_highlighted' : false
			},

			'exp2' : {
				'values' : [5, 10, 15],
				'median' : 10,
				'cluster' : 2,
				'in_current_abundance_range' : true,
				'is_highlighted' : false
			},

			'exp3' : {
				'values' : [5, 10, 15],
				'median' : 10,
				'cluster' : 1,
				'in_current_abundance_range' : true,
				'is_highlighted' : false
			}
		},

		'g2' : {
			'exp1' : {
				'values' : [10, 25, 30],
				'median' : 25,
				'cluster' : 2,
				'in_current_abundance_range' : true,
				'is_highlighted' : false
			}, 

		},

		'g3' : {
			'exp3' : {
				'values' : [5, 10, 15],
				'median' : 10,
				'cluster' : 1,
				'in_current_abundance_range' : true,
				'is_highlighted' : false
			}
		},

		'g4' : {
			'exp1' : {
				'values' : [5, 10, 15],
				'median' : 10,
				'cluster' : 1,
				'in_current_abundance_range' : true,
				'is_highlighted' : false
			}
		}
	}
}


//console.log(transformDataForSankey(data, 'exp1', 'exp2'));

//console.log(transformDataForCentroid(data));

















/*

general data structure

data = {
	datasets : {
		exp1 : {
			genes : [g1, ..., gn],
			columns : [t1, ..., tn],
			min: 1,
			max: 192,
			...
		},
		...
	}

	genes : {
		exp1 : { 
			g1 : {
				values : [20, ..., 30],
				median : 22,
				cluster : 1,
				in_current_abundance_range : true,
				is_highlighted : false,
				}, 
				...
		},
		...
}

*/