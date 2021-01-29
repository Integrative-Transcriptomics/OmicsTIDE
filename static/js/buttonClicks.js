
$(document).on('click', '.intersecting-wrapper', function (event) {

	// get clicked div id
	var currentDiv = jQuery(this).attr("id");

	// get comparison id
	var clickedComparison = currentDiv.split("_")[1] + "_" +
		currentDiv.split("_")[2] + "_" +
		currentDiv.split("_")[3] + "_" +
		currentDiv.split("_")[4];

	clickedComparison = clickedComparison.split("-")[0];

	addTab(clickedComparison, true, TabId.intersecting);
});


$(document).on('click', '.non-intersecting-wrapper', function (event) {

	// get clicked div id
	var currentDiv = jQuery(this).attr("id");

	// get comparison id
	var clickedComparison = currentDiv.split("_")[1] + "_" +
		currentDiv.split("_")[2] + "_" +
		currentDiv.split("_")[3] + "_" +
		currentDiv.split("_")[4];

	clickedComparison = clickedComparison.split("-")[0];

	addTab(clickedComparison, true, TabId.nonIntersecting);
});


// open second-level analysis
$(document).on('click', '.button_selection', function (event) {

	// get clicked div id
	let currentDiv = jQuery(this).attr("id");

	// get comparison id
	let tabName = currentDiv.split("-")[1];
	let comparison = tabName.split("_")[0];
	let tabId = tabName.split("_")[1];

	let selection = createDeepCopyofData(document.getElementById("data-json").value)[comparison][tabId]['selection'];

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


// $(document).on('click', '.matrix_nonIntersecting', function(event) {

// 		// get clicked div id
// 		var currentDiv = jQuery(this).attr("id");

// 		// get comparison id
// 		var clickedComparison = currentDiv.split("_")[3] + "_" + 
// 		currentDiv.split("_")[4] + "_" + 
// 		currentDiv.split("_")[5] + "_" + 
// 		currentDiv.split("_")[6];

// 		addTab(clickedComparison, true, TabId.nonIntersecting);
// 	});


// $(document).on('click', '.non-intersecting-detail', function(event) {

// 		// get clicked div id
// 		let currentDiv = jQuery(this).attr("id");

// 		// get comparison id
// 		let comparison = currentDiv.split("_")[3];
// 		let tabId = currentDiv.split("_")[4];
// 		let completeId = comparison + "_" + tabId;

// 		openSelectionAccordion(completeId);

// 		GenesByDiagramClick(currentDiv);

// 		let globalDataCopy = createDeepCopyofData(document.getElementById("data-json").value);

// 		let combinations = getDatasetCombinations(globalDataCopy[comparison][tabId]['selection']);

// 		createTable("non-intersecting-information-controls-table-" + comparison + "_" + tabId, combinations, comparison, tabId);

// 	});

/**
 * filters the data ObjectArray based on the clicked Id 
 * @param {String} clickedId 
 */
function GenesByDiagramClick(clickedId) {

	let dataset = clickedId.split("_")[1];
	let cluster = clickedId.split("_")[2];
	let comparison = clickedId.split("_")[3];
	let tabId = clickedId.split("_")[4];

	let globalDataCopy = createDeepCopyofData(document.getElementById("data-json").value);

	let currentSelection = globalDataCopy[comparison][tabId]['selection'];

	let data = globalDataCopy[comparison][tabId]['data'];

	let newSelection = data.filter(d => (d.ds1_cluster === dataset + "_" + cluster || d.ds2_cluster === dataset + "_" + cluster));

	globalDataCopy[comparison][tabId]['selection'] = updateSelection(newSelection, currentSelection);

	document.getElementById("data-json").value = JSON.stringify(globalDataCopy);

}



// $('#single-file-accordion').fadeTo('slow',.2);
// $('#single-file-accordion').append('<div id="overlay-div" style="position: absolute;top:0;left:0;width: 100%;height:100%;z-index:2;opacity:0.4;filter: alpha(opacity = 50)"></div>');


$(document).on('click', '.accordion_tab.multiple-files', function (event) {

	$(".accordion_tab.multiple-files").each(function () {
		$(this).parent().removeClass("active");
		$(this).removeClass("active");
	});
	$(this).parent().addClass("active");
	$(this).addClass("active");

});

$(document).on('click', '.accordion_tab.single-file', function (event) {

	$(".accordion_tab.single-file").each(function () {
		$(this).parent().removeClass("active");
		$(this).removeClass("active");
	});
	$(this).parent().addClass("active");
	$(this).addClass("active");

});

$(document).on('click', '.accordion_tab.analysis', function (event) {

	console.log("analysis!")

	$(".accordion_tab.analysis").each(function () {
		$(this).parent().removeClass("active");
		$(this).removeClass("active");
	});
	$(this).parent().addClass("active");
	$(this).addClass("active");

});


// $(document).on('click', '.accordion_tab', function(event){

// 	alert("REST!")

//     $(".accordion_tab").each(function(){
//       $(this).parent().removeClass("active");
//       $(this).removeClass("active");
//     });
//     $(this).parent().addClass("active");
// 	$(this).addClass("active");

// });












