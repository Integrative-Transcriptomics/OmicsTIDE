/*
########################
### DOWNLOAD RESULTS ###
########################
*/

// download session button in first-level analysis
// downloads the PTCF (I-PTCF or NI-PTCF) for a given comparison

$(document).on('click', '.button_downloadptcf', function(event) {

    let currentDiv = jQuery(this).attr("id");
    let tabName = currentDiv.split("-")[1];
    let comparison = tabName.split("_")[0];
    let tabId = tabName.split("_")[1];

    let globalDataCopy = deepCopyOfGlobalDataSubSet(currentlyChosenGlobalData, comparison, tabId);
    globalDataCopy['data'] = combineLinkSpecificGlobalData2(globalDataCopy['data']);

    let ptcf = globalDataCopy['data'].concat(globalDataCopy['data']);

    $.ajax({
        url: '/download_session',
        type: 'POST',
        xhrFields: {
        responseType: 'blob'
        },
        data: {'ptcf' : JSON.stringify(ptcf)},
        success: function(result){

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