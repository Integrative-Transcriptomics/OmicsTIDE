
/**
  *
  * @param{String} id
  * @param{int} min
  * @param{int} max
  * @param{boolean} twoHandles
  */
function createSlider(id, min, max, twoHandles) {

    let slider = document.getElementById(id);

    if(twoHandles){
        noUiSlider.create(slider, {
        start: [min, max],
        connect: true,
        range: {
            'min': min,
            'max': max }
        })
    }

    else{
      noUiSlider.create(slider, {
        start: 3,
        step: 1,
        range: {
            'min': min,
            'max': max }
      })
    }
}


/**
  *
  * @param{String} sliderId
  * @param{String} inputBoxId
  * @param{int} defaultMin
  * @param{int} min
  * @param{int} max
  */
function updateNumbers(sliderId, inputBoxId, defaultMin, min, max) {

    let inputNumber = document.getElementById(inputBoxId);

    inputNumber.setAttribute('min', min)
    inputNumber.setAttribute('max', max)
    inputNumber.setAttribute('value', defaultMin ? min : max)

    $("#"+sliderId)[0].noUiSlider.off('change');
    $('#'+sliderId)[0].noUiSlider.on('change', function (values, handle) {

        document.getElementById('variance-slider-input-1').value = Math.round(values[0]);
        document.getElementById('variance-slider-input-2').value = Math.round(values[1]);
    });

    inputNumber.addEventListener('change', function () {
        document.getElementById(sliderId).noUiSlider.set(defaultMin ? [Math.round(this.value), null] : [null, Math.round(this.value)]);
    });
}

function updateNumbersSingle(sliderId, inputBoxId, min, max) {

    let inputNumber = document.getElementById(inputBoxId);

    inputNumber.setAttribute('min', min)
    inputNumber.setAttribute('max', max)
    inputNumber.setAttribute('value', 3)

    $("#"+sliderId)[0].noUiSlider.off('change');
    $('#'+sliderId)[0].noUiSlider.on('change', function (values, handle) {

        document.getElementById('k-slider-input-1').value = Math.round(values[0]);
    });

    inputNumber.addEventListener('change', function () {
        document.getElementById(sliderId).noUiSlider.set(Math.round(this.value));
    });
}


function destroySlider(id){
  if($("#" + id).attr('class') !== 'undefined' && $("#" + id)[0].noUiSlider){
        $("#" + id)[0].noUiSlider.destroy();
    }
}


/**
  *
  * @param{String} id
  */
function varianceSlider(id){
    
    destroySlider(id);

    createSlider(id, 0, 100, true);

    updateNumbers(id, "variance-slider-input-1", true, 0, 100);
    updateNumbers(id, "variance-slider-input-2", false, 0, 100);
}


function kSlider(id){

  destroySlider(id);

  createSlider(id, 2, 6, false);

  updateNumbersSingle(id, "k-slider-input-1", 2, 6)

}



/**
  *
  * @param{} data
  * @param{String} tabName
  * @param{String} tabId
  */
function expressionSlider(data, tabName, tabId){

    if($("#exp1_slider-" + tabName).attr('class') !== 'undefined' && $("#exp1_slider-" + tabName)[0].noUiSlider){
        $("#exp1_slider-" + tabName)[0].noUiSlider.destroy()
    }

    if($("#exp2_slider-" + tabName).attr('class') !== 'undefined' && $("#exp2_slider-" + tabName)[0].noUiSlider){
        $("#exp2_slider-" + tabName)[0].noUiSlider.destroy()
    }

    if(data.exp1_min === data.exp1_max){
      data.exp1_max = data.exp1_min + 0.1;
    }

    if(data.exp2_min === data.exp2_max){
      data.exp2_max = data.exp2_min + 0.1;
    }


    createSlider("exp1_slider-" + tabName, data.exp1_min, data.exp1_max, true);
    createSlider("exp2_slider-" + tabName, data.exp2_min, data.exp2_max, true);

    introduceSlideUpdates("exp1", "exp1_slider-" + tabName, tabName, "exp1_slider_input1-" + tabName, true, data.exp1_min, data.exp1_max, tabId);
    introduceSlideUpdates("exp1", "exp1_slider-" + tabName, tabName, "exp1_slider_input2-" + tabName, false, data.exp1_min, data.exp1_max, tabId);
    introduceSlideUpdates("exp2", "exp2_slider-" + tabName, tabName, "exp2_slider_input1-" + tabName, true, data.exp2_min, data.exp2_max, tabId);
    introduceSlideUpdates("exp2", "exp2_slider-" + tabName, tabName, "exp2_slider_input2-" + tabName, false, data.exp2_min, data.exp2_max, tabId);
}


/**
  *
  * https://refreshless.com/nouislider/examples/
  * @param{String} experimentId
  * @param{String} sliderId
  * @param{String} tabName
  * @param{String} inputBoxId
  * @param{int} defaultMin
  * @param{int} min
  * @param{int} max
  * @param{String} tabId
  */
function introduceSlideUpdates(experimentId, sliderId, tabName, inputBoxId, defaultMin, min, max, tabId) {

    let inputNumber = document.getElementById(inputBoxId);

    inputNumber.setAttribute('min', min * 100) / 100
    inputNumber.setAttribute('max', max * 100) / 100
    inputNumber.setAttribute('value',
        defaultMin ?
            Math.round(min * 100) / 100 :
            Math.round(max * 100) / 100)

    $("#"+sliderId)[0].noUiSlider.off('change');
    $('#'+sliderId)[0].noUiSlider.on('change', function (values, handle) {

        clearCurrentSelection(tabName);

        let currentTabName = document.getElementById(sliderId)['id'].split("-")[1];

        document.getElementById(experimentId + '_slider_input1-' + currentTabName).value = values[0]
        document.getElementById(experimentId + '_slider_input2-' + currentTabName).value = values[1]
        updateCentroidBySlider(currentTabName, tabId);
    });

    inputNumber.addEventListener('change', function () {

    //document.getElementById(sliderId).noUiSlider.set([]);
        // updateCentroidBySlider(currentTabName, tabId);
    });
}


function clearCurrentSelection(completeTabId){

  let comparison = completeTabId.split("_")[0] + "_" + completeTabId.split("_")[1] + "_" + completeTabId.split("_")[2] + "_" +completeTabId.split("_")[3];
  let comparisonTypeId = completeTabId.split("_")[4];

  globalData[comparison][comparisonTypeId]['selection'] = [];

  let combinations = getDatasetCombinations(globalData[comparison][comparisonTypeId]['selection']);

  createTable(comparisonTypeId + "-information-controls-table-" + comparison + "_" + comparisonTypeId, combinations, comparison, comparisonTypeId);

}

/**
  *
  * @param{String} tabName
  * @param{String} tabId
  */
function updateCentroidBySlider(tabName, tabId){

    let currentDetailDiagram = getActiveRadioButton(tabName);

    let comparison = tabName.split("_")[0] + "_" + tabName.split("_")[1] + "_" + tabName.split("_")[2] + "_" + tabName.split("_")[3];

    globalData[comparison][tabId]['data'] = update(globalData[comparison][tabId]['data'], tabName, tabId);

    // get filtered subset
    let filteredData = JSON.parse(JSON.stringify(globalData));
    filteredData[comparison][tabId]['data'] = filteredData[comparison][tabId]['data'].filter(function(d) { return d.highlighted === true});

    if(tabId === TabId.intersecting){
        render(filteredData[comparison][tabId]['data'], "clustered-data-information-data-sankey-" + tabName, tabId, tabName);
    }
 
    // get clusters of diagram 
    let exp1Cluster = Array.from(new Set(filteredData[comparison][tabId]['data'].map(d => d.exp1_cluster))).filter(d => d !== null);
    let exp2Cluster = Array.from(new Set(filteredData[comparison][tabId]['data'].map(d => d.exp2_cluster))).filter(d => d !== null);

    for(let cluster of exp1Cluster){
        updateDetailDiagram(currentDetailDiagram, filteredData[comparison][tabId], "exp1", cluster.split("_")[1], tabName, tabId);
    }

    for(let cluster of exp2Cluster){
        updateDetailDiagram(currentDetailDiagram, filteredData[comparison][tabId], "exp2", cluster.split("_")[1], tabName, tabId);
    }

}



varianceSlider("variance-slider");

kSlider("k-slider");
