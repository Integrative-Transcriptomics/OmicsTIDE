
function selectAllGenes(newSelection, currentSelection){
	return updateSelection(newSelection, currentSelection);

}


function deselectAll(newSelection, currentSelection){
	return [];
}




function ptcfEntryByGeneId(gene, ptcf){
	
	for(let row of ptcf){
		if(row.gene === gene){
			return row;
		}
	}
}


function geneAlreadyInSelection(gene, selection){

	let currentSelectionGenes = selection.map(d => d.gene);

	return currentSelectionGenes.includes(gene);
}


function removeGeneFromSelection(gene, selection){

}


/**
 * updates the selection array of a given globalData by adding new objects to it
 * @param {Array} geneList
 * @param {Array} globalData
 * @param {String} comparison
 * @param {String} tabId
 */
function updateSelection(newSelection, currentSelection){

	let tmpData = [];

	// trivial case: empty selection -> current genes will be selection
	if(currentSelection.length === 0){

		return newSelection;
	}

	else{

		let newSelectionGenes = new Set(newSelection.map(d => d.gene));
		
		let currentSelectionGenes = new Set(currentSelection.map(d => d.gene));

		let newSelectionGenesOnly = Array.from(new Set([...newSelectionGenes].filter(d => !currentSelectionGenes.has(d))))

		let currentSelectionGenesOnly = Array.from(new Set([...currentSelectionGenes].filter(d => !newSelectionGenes.has(d))))

		newSelectionGenesOnly = newSelection.filter(d => newSelectionGenesOnly.includes(d.gene));

		currentSelectionGenesOnly = currentSelection.filter(d => currentSelectionGenesOnly.includes(d.gene));

		return newSelectionGenesOnly.concat(currentSelectionGenesOnly);
	}	
}


/**
 * updates the selection array of a given globalData by removing objects from it
 * @param {Array} geneList
 * @param {Array} globalDataSelection
 */
function removeFromSelection(geneArray, globalDataSelection, comparison, tabId){

}







