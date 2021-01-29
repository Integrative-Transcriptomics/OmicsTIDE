
/**
 * returns all combinations of clusters
 * @param {Array} selection 
 */
function clusterCombinations(selection){

	let combinations = [];

	for(let gene of selection){
		combinations.push(gene.ds1_cluster + "-" + gene.ds2_cluster);
	}

	return combinations
}


/**
 * counts the number of actual combinations
 * @param {Array} clusterCombinations 
 */
function countCombinations(clusterCombinations){

	let countObject = [];

	for(let h of clusterCombinations){
		if(!Object.keys(countObject).includes(h)){
			countObject[h] = 1;
		}

		else{
			countObject[h] = countObject[h] + 1;
		}
	}

	return countObject;
}


/**
 * 
 * @param {int} combinationCounts 
 */
function countOverview(combinationCounts){

	let finalObject = [];

	for(let key of Object.keys(combinationCounts)){
		finalObject.push({ ds1 : key.split('-')[0], ds2 : key.split('-')[1], count : combinationCounts[key] })
	}

	return finalObject;

}


/**
 * 
 * @param {Array} selection 
 */
function getDatasetCombinations(selection){

	let combinations = clusterCombinations(selection);

	let counts = countCombinations(combinations);

	let overview = countOverview(counts);

	return overview;
}


/**
 * 
 * @param {String} parentDivId 
 * @param {String} comparison 
 * @param {String} tabId 
 */
function clearTable(parentDivId, comparison, tabId){

	var parentDiv = document.getElementById(parentDivId);

	if(!parentDiv === null){
		parentDiv.innerHTML = "";
	}
	
	// remove old wrapper if already defined
	if(document.getElementById("table-wrapper-" + comparison + "_" + tabId)){
		let wrapperDiv = document.getElementById("table-wrapper-" + comparison +  "_" + tabId);

		while (wrapperDiv.firstChild) wrapperDiv.removeChild(wrapperDiv.firstChild);

		wrapperDiv.remove();
	}

}


/**
 * 
 * @param {String} clusterCombinations 
 */
function combinationToString(clusterCombinations){

	return "_" + clusterCombinations.ds1 + "_" + clusterCombinations.ds2;
}


/**
 * 
 * @param {String} parentDivId 
 * @param {Array} clusterCombinations 
 * @param {String} comparison 
 * @param {String} tabId 
 */
function createTable(parentDivId, clusterCombinations, comparison, tabId){

	comparison = comparison.replace("-","_");

	var parentDiv = document.getElementById(parentDivId);

	clearTable(parentDivId, comparison, tabId);

	if(clusterCombinations.length === 0){
		return;
	}

	var tableWrapper = document.createElement("DIV");

	tableWrapper.setAttribute("class", "table-wrapper-scroll-y my-custom-scrollbar");
	tableWrapper.setAttribute("id", "table-wrapper-" + comparison + "_" + tabId);

		var table = document.createElement("TABLE");
		table.setAttribute("class", "table table-bordered mb-0");
		table.setAttribute("id", "table-" + comparison + "_" + tabId);

			var tableHead = document.createElement("THEAD");
			tableHead.setAttribute("class", "table-head");
			tableHead.setAttribute("id", "table-head-" + comparison + "_" + tabId);

				var trHead = document.createElement("TR");
				trHead.setAttribute("class", "tr-head");
				trHead.setAttribute("id", "tr-head-" + comparison + "_" + tabId);

					var thDs1 = document.createElement("TH");
					thDs1.setAttribute("scope", "col");
					thDs1.setAttribute("class", "th");
					thDs1.setAttribute("id", "th-" + comparison + "_" + tabId);

						var thDs1Text = document.createTextNode("from");
						thDs1.appendChild(thDs1Text);

					trHead.appendChild(thDs1);

					var thDs2 = document.createElement("TH");
					thDs2.setAttribute("scope", "col");
					thDs2.setAttribute("class", "th-text");
					thDs2.setAttribute("id", "th-text-2-" + comparison + "_" + tabId);

						var thDs2Text = document.createTextNode("to");
						thDs2.appendChild(thDs2Text);
					
					trHead.appendChild(thDs2);

					var thCount = document.createElement("TH");
					thCount.setAttribute("scope", "col");
					thDs2.setAttribute("class", "th-text");
					thDs2.setAttribute("id", "th-text-3-" + comparison + "_" + tabId);

						var thCountText = document.createTextNode("Count");
						thCount.appendChild(thCountText);

					trHead.appendChild(thCount);

				tableHead.appendChild(trHead);

			table.appendChild(tableHead);

			var tableBody = document.createElement("TBODY");

			var count = 1;

			for(let combination of clusterCombinations){


				eval( "var tr" + combinationToString(combination) + "_" + comparison + "_" + tabId + " = document.createElement('TR')" );

					eval( "var td" + combinationToString(combination) + "_" + comparison + "_" + tabId + "_ds1 = document.createElement('TD')" );
					eval( "td" + combinationToString(combination) + "_" + comparison + "_" + tabId + "_ds1.style.backgroundColor='" + color(String(combination['ds1'])) + "'" );
					eval( "td" + combinationToString(combination) + "_" + comparison + "_" + tabId + "_ds1.appendChild(document.createTextNode('" + String(combination['ds1']) + "'))" );
					eval( "tr" + combinationToString(combination) + "_" + comparison + "_" + tabId + ".appendChild(td" + combinationToString(combination) + "_" + comparison + "_" + tabId + "_ds1)" );

					eval( "var td" + combinationToString(combination) + "_" + comparison + "_" + tabId + "_ds2 = document.createElement('TD')" );
					eval( "td" + combinationToString(combination) + "_" + comparison + "_" + tabId + "_ds2.style.backgroundColor='" + color(String(combination['ds2'])) + "'" );
					eval( "td" + combinationToString(combination) + "_" + comparison + "_" + tabId + "_ds2.appendChild(document.createTextNode('" + String(combination['ds2']) + "'))" );
				    eval( "tr" + combinationToString(combination) + "_" + comparison + "_" + tabId + ".appendChild(td" + combinationToString(combination) + "_" + comparison + "_" + tabId + "_ds2)" );
					
					eval( "var td" + combinationToString(combination) + "_" + comparison + "_" + tabId + "_count = document.createElement('TD')" );
					eval( "td" + combinationToString(combination) + "_" + comparison + "_" + tabId + "_count.appendChild(document.createTextNode('" + String(combination['count']) + "'))" );
				    eval( "tr" + combinationToString(combination) + "_" + comparison + "_" + tabId + ".appendChild(td" + combinationToString(combination) + "_" + comparison + "_" + tabId + "_count)" );

			tableBody.appendChild(eval( "tr" + combinationToString(combination) + "_" + comparison + "_" + tabId ));

			}

			table.appendChild(tableBody);

		tableWrapper.appendChild(table);

	parentDiv.appendChild(tableWrapper);

}