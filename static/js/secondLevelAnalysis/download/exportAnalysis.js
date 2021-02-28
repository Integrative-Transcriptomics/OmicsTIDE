
// export button in second-level analysis
$(document).on('click', '.export-button', function(event) {
		
    // get clicked div id
    let currentDiv = jQuery(this).attr("id");

    // get comparison id
    let tabName = currentDiv.split("-")[2];
    let clickedComparison = tabName.split("_")[0];
    let comparisonTypeId = tabName.split("_")[1];  
    
    let data = {};
    let exportCopy;

    if(comparisonTypeId === "selectionIntersecting"){

        comparisonTypeIdSplit = "intersecting";

        exportCopy = deepCopyOfGlobalDataSubSet(currentlyChosenGlobalData, clickedComparison, comparisonTypeIdSplit);
        exportCopy['data'] = combineLinkSpecificGlobalData2(exportCopy['data']);

        data = {
            'dataset1_plot' : JSON.stringify(document.getElementById("combined_second-level-intersecting-diagrams-profiles-dataset1-" + clickedComparison + "_" + comparisonTypeId).outerHTML),
            'dataset2_plot' : JSON.stringify(document.getElementById("combined_second-level-intersecting-diagrams-profiles-dataset2-" + clickedComparison + "_" + comparisonTypeId).outerHTML),
            //'selection' : JSON.stringify(exportCopy[clickedComparison][comparisonTypeIdSplit]['selection'])
            'selection' : JSON.stringify(exportCopy['selection'])
        }
    
    }

    if(comparisonTypeId === "selectionNonIntersecting"){


        comparisonTypeIdSplit = "nonIntersecting";

        exportCopy = deepCopyOfGlobalDataSubSet(currentlyChosenGlobalData, clickedComparison, comparisonTypeIdSplit);
        exportCopy['data'] = combineLinkSpecificGlobalData2(exportCopy['data']);

        data = {
            'dataset1_plot' : JSON.stringify(document.getElementById("combined_second-level-non-intersecting-diagrams-profiles-dataset1-" + clickedComparison + "_" + comparisonTypeId).outerHTML),
            'dataset2_plot' : JSON.stringify(document.getElementById("combined_second-level-non-intersecting-diagrams-profiles-dataset2-" + clickedComparison + "_" + comparisonTypeId).outerHTML),
            //'selection' : JSON.stringify(exportCopy[clickedComparison][comparisonTypeIdSplit]['selection'])
            'selection' : JSON.stringify(exportCopy['selection'])
        }

    }   

    // for(let goTerm of Object.keys(exportCopy['go'])){
    //     if(exportCopy['go'][goTerm].length !== 0){

    //         data[goTerm] = JSON.stringify(exportCopy['go'][goTerm]);
    //     }
    // }


    for(let goTerm of Object.keys(exportCopy['go'])){
            if(exportCopy['go'][goTerm].length !== 0){

                data[goTerm] = JSON.stringify(exportCopy['go'][goTerm]);
            }
    }

    console.log(data);

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
