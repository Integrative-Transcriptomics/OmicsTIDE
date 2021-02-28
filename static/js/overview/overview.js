// parse globalData to as javascript object

/**
 * creates the overview tab
 * inspired by: https://bl.ocks.org/ricardo-marino/ca2db3457f82dbb10a8753ecba8c0029
 * @param {ObjectArray} globalDataCopy 
 */
function comparisonOverview(globalDataCopy) {

    //let globalDataCopy = JSON.parse(JSON.stringify(flaskGlobalData));

    let barChartData = barChartFromGlobalDataInfo(globalDataCopy);

    let copyBarChartData = JSON.parse(JSON.stringify(barChartData));

    // extract input information
    extractInputParameters(globalDataCopy,
        "overview-analysis-dataset-content",
        "overview-analysis-variance-content",
        "overview-analysis-k-content");

    comparisonTable(globalDataCopy, "overview-table-comparisons-content");

    // percentages as numbers
    let input = { 'data': copyBarChartData, 'globalDataCopy': globalDataCopy, 'width': 100, 'height': 80 };
    let canvas = setUpSvgCanvas(input, "matrix-information");

    drawBars(input, canvas);

    // update preview
    removePreview("matrix-information-preview-content")
        .then(setPreview("matrix-information-preview-content", "matrix-information-preview-content-text"));

}





