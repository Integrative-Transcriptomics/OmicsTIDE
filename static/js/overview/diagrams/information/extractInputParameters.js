/**
 * 
 * @param {ObjectArray} data 
 * @param {String} datasetDiv 
 * @param {String} varianceDiv 
 * @param {String} kDiv 
 */
function extractInputParameters(data, datasetDiv, varianceDiv, kDiv) {

    let datasetElement = document.getElementById(datasetDiv);
    let varianceElement = document.getElementById(varianceDiv);
    let kElement = document.getElementById(kDiv);


    let k = data.Comparison1.k;
    let lower = data.Comparison1.lower_variance_percentile;
    let upper = data.Comparison1.upper_variance_percentile;
    let files = [];

    for (let comparison of Object.keys(data)) {
        files.push(data[comparison]['info']['file_1']['filename'])
        files.push(data[comparison]['info']['file_2']['filename'])
    }

    files = [... new Set(files)];

    for (let dataset of files) {
        datasetElement.appendChild(document.createTextNode(dataset))
        datasetElement.appendChild(document.createElement("br"))
        datasetElement.appendChild(document.createElement("br"))
        datasetElement.appendChild(document.createElement("br"))
    }

    if (lower === undefined || upper === undefined) {
        varianceElement.appendChild(document.createTextNode("not determined for PTCF"))
    }

    else {
        varianceElement.appendChild(document.createTextNode(lower + "-" + upper + "%"))
    }


    kElement.appendChild(document.createTextNode(k))

}

// function initButton(id, buttonName, functionCall) {
//     let button = document.createElement("BUTTON");
//     button.innerHTML = buttonName;

//     let parent = document.getElementById(this);
// }

