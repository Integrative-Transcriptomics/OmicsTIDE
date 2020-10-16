
$(document).on('click', '.intersecting-wrapper', function(event) {
		
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



$(document).on('click', '.non-intersecting-wrapper', function(event) {
		
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


$(document).on('click', '.button_selection', function(event) {
		
		// get clicked div id
		let currentDiv = jQuery(this).attr("id");

		currentDiv = currentDiv.split("-")[1];

		// get comparison id
		let clickedComparison = currentDiv.split("_")[0] + "_" + 
		currentDiv.split("_")[1] + "_" + 
		currentDiv.split("_")[2] + "_" + 
		currentDiv.split("_")[3];

		let tabId = currentDiv.split("_")[4];

		if(globalData[clickedComparison][tabId]['selection'].length === 0){
			alert("CURRENT SELECTION is empty! \n At least one sub-selection is needed to open a new analysis tab!");
			return;
		}

		if(tabId === "intersecting"){
			addTab(clickedComparison, true, TabId.selectionIntersecting);
		}

		if(tabId === "nonIntersecting"){
			addTab(clickedComparison, true, TabId.selectionNonIntersecting);	
		}

		
	});


$(document).on('click', '.matrix_nonIntersecting', function(event) {
		
		// get clicked div id
		var currentDiv = jQuery(this).attr("id");

		// get comparison id
		var clickedComparison = currentDiv.split("_")[3] + "_" + 
		currentDiv.split("_")[4] + "_" + 
		currentDiv.split("_")[5] + "_" + 
		currentDiv.split("_")[6];

		addTab(clickedComparison, true, TabId.nonIntersecting);
	});


$(document).on('click', '.non-intersecting-detail', function(event) {
		
		// get clicked div id
		let currentDiv = jQuery(this).attr("id");

		// get comparison id
		let clickedComparison = currentDiv.split("_")[3] + "_" + 
		currentDiv.split("_")[4] + "_" + 
		currentDiv.split("_")[5] + "_" + 
		currentDiv.split("_")[6];

		let comparisonTypeId = currentDiv.split("_")[7];

		// alert (accordion + current div)

		let completeId = clickedComparison + "_" + comparisonTypeId;

		openSelectionAccordion(completeId);

		GenesByDiagramClick(currentDiv, globalData[clickedComparison][comparisonTypeId]['data']);

		let combinations = getDatasetCombinations(globalData[clickedComparison][comparisonTypeId]['selection']);

		createTable("non-intersecting-information-controls-table-" + clickedComparison + "_" + comparisonTypeId, combinations, clickedComparison, comparisonTypeId);

	});


function openSelectionAccordion(completeTabId){

	let allAccordions = $("[id*='accordion '][id*='" + completeTabId + "']");

	for(let accordion of allAccordions){

		console.log(accordion.id);

		// case: selection already opened
		if(accordion.id.includes("selection") && accordion.classList.contains("active")){
			console.log("already active - do nothing");
			return;
		}

		if(accordion.id.includes("selection")){
			console.log("seletion... add activity");
			accordion.classList.add("active");
		}

		else{
			console.log("not selection... remove activity");
			accordion.classList.remove("active");
		}
	}
}


$(document).on('click', '.export-button', function(event) {
		
		// get clicked div id
		let currentDiv = jQuery(this).attr("id");

		// get comparison id
		let splitOne = currentDiv.split("-")[2];

		let clickedComparison = splitOne.split("_")[0] + "_" + 
		splitOne.split("_")[1] + "_" + 
		splitOne.split("_")[2] + "_" + 
		splitOne.split("_")[3];

		let comparisonTypeId = splitOne.split("_")[4];

		let comparisonTypeIdSplit = ''

		let data = {};

		if(comparisonTypeId === "selectionIntersecting"){

			comparisonTypeIdSplit = "intersecting";

			data = {
                'dataset1_plot' : JSON.stringify(document.getElementById("combined_selection-intersecting-diagrams-profiles-dataset1-" + clickedComparison + "_" + comparisonTypeId).outerHTML),
                'dataset2_plot' : JSON.stringify(document.getElementById("combined_selection-intersecting-diagrams-profiles-dataset2-" + clickedComparison + "_" + comparisonTypeId).outerHTML),
                'selection' : JSON.stringify(globalData[clickedComparison][comparisonTypeIdSplit]['selection'])
            }
		
		}

		if(comparisonTypeId === "selectionNonIntersecting"){

			comparisonTypeIdSplit = "nonIntersecting";

			data = {
                'dataset1_plot' : JSON.stringify(document.getElementById("combined_selection-nonIntersecting-diagrams-profiles-dataset1-" + clickedComparison + "_" + comparisonTypeId).outerHTML),
                'dataset2_plot' : JSON.stringify(document.getElementById("combined_selection-nonIntersecting-diagrams-profiles-dataset2-" + clickedComparison + "_" + comparisonTypeId).outerHTML),
                'selection' : JSON.stringify(globalData[clickedComparison][comparisonTypeIdSplit]['selection'])
            }

		}


		

        for(let goTerm of Object.keys(globalData[clickedComparison][comparisonTypeIdSplit]['go'])){
        	if(globalData[clickedComparison][comparisonTypeIdSplit]['go'][goTerm].length !== 0){

				console.log(goTerm);

        		data[goTerm] = JSON.stringify(globalData[clickedComparison][comparisonTypeIdSplit]['go'][goTerm]);
        	}
        }


		$.ajax({
            url: '/send_svg',
            type: 'POST',
            xhrFields: {
            responseType: 'blob'
        	},
            data: data,
            success: function(result){

            	let dateTime = new Date();
            	dateTime = dateTime.toString().slice(0, 24).replaceAll(",", "");
            	dateTime = dateTime.toString().slice(0, 24).replaceAll(" ", "");

            	var blob=new Blob([result]);
			    var link=document.createElement('a');
			    link.href=window.URL.createObjectURL(blob);
			    link.download="OmicsTIDE_" + dateTime + ".zip";
			    link.click();
            }
        });
});


$('#single-file-accordion').fadeTo('slow',.2);
$('#single-file-accordion').append('<div id="overlay-div" style="position: absolute;top:0;left:0;width: 100%;height:100%;z-index:2;opacity:0.4;filter: alpha(opacity = 50)"></div>');


$(document).on('click', '.accordion_tab.multiple-files', function(event){
	
    $(".accordion_tab.multiple-files").each(function(){
      $(this).parent().removeClass("active");
      $(this).removeClass("active");
    });
    $(this).parent().addClass("active");
	$(this).addClass("active");
	
});

$(document).on('click', '.accordion_tab.single-file', function(event){
	
    $(".accordion_tab.single-file").each(function(){
      $(this).parent().removeClass("active");
      $(this).removeClass("active");
    });
    $(this).parent().addClass("active");
	$(this).addClass("active");
	
});

$(document).on('click', '.accordion_tab.analysis', function(event){
	
    $(".accordion_tab.analysis").each(function(){
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












