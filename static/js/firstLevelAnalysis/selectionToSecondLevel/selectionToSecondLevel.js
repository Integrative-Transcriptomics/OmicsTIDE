


// open second-level analysis
$(document).on('click', '.button_selection', function (event) {

	// get clicked div id
	let currentDiv = jQuery(this).attr("id");

	// get comparison id
	let tabName = currentDiv.split("-")[1];
	let comparison = tabName.split("_")[0];
	let tabId = tabName.split("_")[1];
	
	//let selection = createDeepCopyofData(document.getElementById("data-json").value)[comparison][tabId]['selection'];

	let globalDataCopy = deepCopyOfGlobalDataSubSet(currentlyChosenGlobalData, comparison, tabId);

	let selection = globalDataCopy['selection'];

	if (selection.length === 0) {
		alert("CURRENT SELECTION is empty! \n At least one sub-selection is needed to open a new analysis tab!");
		return;
	}

	if (tabId === "intersecting") {
		addTab(comparison, true, TabId.selectionIntersecting);
	}

	if (tabId === "nonIntersecting") {
		addTab(comparison, true, TabId.selectionNonIntersecting);
	}
});
