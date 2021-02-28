
/**
 * 
 * @param {String} parentDivId 
 */
async function removePreview(parentDivId) {

    let parentDiv = document.getElementById(parentDivId);
    while (parentDiv.firstChild) {
        parentDiv.firstChild.remove();
    }
}

/**
 * 
 * @param {String} parentDivId 
 * @param {String} previewDivId 
 */
async function setPreview(parentDivId, previewDivId) {

    //let parentDiv = document.getElementById(parentDivId);
    let previewDiv = document.getElementById(previewDivId).cloneNode(true);

    if (previewDivId === "matrix-information-preview-content-text") {
        previewDiv.style.display = "block";
    }

    else {
        previewDiv.style.display = "flex";
    }


    //parentDiv.appendChild(previewDiv);

    $("#" + parentDivId).append(previewDiv).fadeIn(500);
}