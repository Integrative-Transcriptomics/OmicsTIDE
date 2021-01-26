/*
########################
### DOWNLOAD RESULTS ###
########################
*/

// export button in second-level analysis
$(document).on('click', '.export-button', function(event) {
		
    // get clicked div id
    let currentDiv = jQuery(this).attr("id");

    // get comparison id
    let tabName = currentDiv.split("-")[2];
    let clickedComparison = tabName.split("_")[0];
    let comparisonTypeId = tabName.split("_")[1];
    let globalDataCopy = createDeepCopyofData(document.getElementById('data-json').value);
    let data = {};

    if(comparisonTypeId === "selectionIntersecting"){

        comparisonTypeIdSplit = "intersecting";

        data = {
            'dataset1_plot' : JSON.stringify(document.getElementById("combined_selection-intersecting-diagrams-profiles-dataset1-" + clickedComparison + "_" + comparisonTypeId).outerHTML),
            'dataset2_plot' : JSON.stringify(document.getElementById("combined_selection-intersecting-diagrams-profiles-dataset2-" + clickedComparison + "_" + comparisonTypeId).outerHTML),
            'selection' : JSON.stringify(globalDataCopy[clickedComparison][comparisonTypeIdSplit]['selection'])
        }
    
    }

    if(comparisonTypeId === "selectionNonIntersecting"){

        comparisonTypeIdSplit = "nonIntersecting";

        data = {
            'dataset1_plot' : JSON.stringify(document.getElementById("combined_selection-nonIntersecting-diagrams-profiles-dataset1-" + clickedComparison + "_" + comparisonTypeId).outerHTML),
            'dataset2_plot' : JSON.stringify(document.getElementById("combined_selection-nonIntersecting-diagrams-profiles-dataset2-" + clickedComparison + "_" + comparisonTypeId).outerHTML),
            'selection' : JSON.stringify(globalDataCopy[clickedComparison][comparisonTypeIdSplit]['selection'])
        }

    }   

    for(let goTerm of Object.keys(globalDataCopy[clickedComparison][comparisonTypeIdSplit]['go'])){
        if(globalDataCopy[clickedComparison][comparisonTypeIdSplit]['go'][goTerm].length !== 0){

            console.log(goTerm);

            data[goTerm] = JSON.stringify(globalDataCopy[clickedComparison][comparisonTypeIdSplit]['go'][goTerm]);
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



// download session button in first-level analysis
// downloads the PTCF (I-PTCF or NI-PTCF) for a given comparison

$(document).on('click', '.button_downloadptcf', function(event) {

    let currentDiv = jQuery(this).attr("id");
    let tabName = currentDiv.split("-")[1];
    let comparison = tabName.split("_")[0];
    let tabId = tabName.split("_")[1];

    let globalDataCopy = createDeepCopyofData(document.getElementById("data-json").value);
    globalDataCopy = combineLinkSpecificGlobalData(globalDataCopy);

    let ptcf = globalDataCopy[comparison]['intersecting']['data'].concat(globalDataCopy[comparison]['nonIntersecting']['data']);

    $.ajax({
        url: '/download_session',
        type: 'POST',
        xhrFields: {
        responseType: 'blob'
        },
        data: {'ptcf' : JSON.stringify(ptcf)},
        success: function(result){

            console.log(result);

            let dateTime = new Date();
            dateTime = dateTime.toString().slice(0, 24).replaceAll(",", "");
            dateTime = dateTime.toString().slice(0, 24).replaceAll(/\s/g, "");


            var blob=new Blob([result]);
            var link=document.createElement('a');
            link.href=window.URL.createObjectURL(blob);
            link.download="OmicsTIDE_Session_" + dateTime + ".csv";
            link.click();
        }
    });

});