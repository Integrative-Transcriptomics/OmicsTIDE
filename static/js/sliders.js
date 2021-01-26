
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

    if($("#ds1_slider-" + tabName).attr('class') !== 'undefined' && $("#ds1_slider-" + tabName)[0].noUiSlider){
        $("#ds1_slider-" + tabName)[0].noUiSlider.destroy()
    }

    if($("#ds2_slider-" + tabName).attr('class') !== 'undefined' && $("#ds2_slider-" + tabName)[0].noUiSlider){
        $("#ds2_slider-" + tabName)[0].noUiSlider.destroy()
    }

    if(data.ds1_min === data.ds1_max){
      data.ds1_max = data.ds1_min + 0.1;
    }

    if(data.ds2_min === data.ds2_max){
      data.ds2_max = data.ds2_min + 0.1;
    }


    createSlider("ds1_slider-" + tabName, data.ds1_min, data.ds1_max, true);
    createSlider("ds2_slider-" + tabName, data.ds2_min, data.ds2_max, true);

    introduceSlideUpdates("ds1", "ds1_slider-" + tabName, tabName, "ds1_slider_input1-" + tabName, true, data.ds1_min, data.ds1_max, tabId, data);
    introduceSlideUpdates("ds1", "ds1_slider-" + tabName, tabName, "ds1_slider_input2-" + tabName, false, data.ds1_min, data.ds1_max, tabId, data);
    introduceSlideUpdates("ds2", "ds2_slider-" + tabName, tabName, "ds2_slider_input1-" + tabName, true, data.ds2_min, data.ds2_max, tabId, data);
    introduceSlideUpdates("ds2", "ds2_slider-" + tabName, tabName, "ds2_slider_input2-" + tabName, false, data.ds2_min, data.ds2_max, tabId, data);
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
function introduceSlideUpdates(experimentId, sliderId, tabName, inputBoxId, defaultMin, min, max, tabId, data) {

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
        document.getElementById(experimentId + '_slider_input1-' + tabName).value = (values[0] * 100) / 100;
        document.getElementById(experimentId + '_slider_input2-' + tabName).value = (values[1] * 100) / 100;
        updateCentroidBySlider(tabName, tabId);
    });

    inputNumber.addEventListener('change', function () {
      
      let currentValue = Math.round((inputNumber.valueAsNumber + Number.EPSILON) * 100) / 100;

      let min = $("#"+sliderId)[0].noUiSlider.options.range.min;
      let max = $("#"+sliderId)[0].noUiSlider.options.range.max;

      // get acutal ID of the input number
      if(inputNumber.className.split("_")[2] === "input1"){

        let input2 = parseFloat($("#"+sliderId)[0].noUiSlider.get()[1]);
        
        $("#"+sliderId)[0].noUiSlider.set([currentValue, input2]);

      }

      if(inputNumber.className.split("_")[2] === "input2"){

        let input1 = parseFloat($("#"+sliderId)[0].noUiSlider.get()[0]);

        $("#"+sliderId)[0].noUiSlider.set([input1, currentValue]);
      }

      updateCentroidBySlider(tabName, tabId);
    });
}


function clearCurrentSelection(tabName){

  let globalDataCopy = createDeepCopyofData(document.getElementById("data-json").value);

  let comparison = tabName.split("_")[0];
  let tabId = tabName.split("_")[1];

  globalDataCopy[comparison][tabId]['selection'] = [];

  bindDataToDiv(globalDataCopy);

  let combinations = getDatasetCombinations(globalDataCopy[comparison][tabId]['selection']);

  createTable(tabId + "-information-controls-table-" + comparison + "_" + tabId, combinations, comparison, tabId);

}



/**
 * updates data by altering the "selected" column to show the result of expression filtering
 * @param {Object} data wide data, e.g. loaded by d3.csv()
 * @returns {Object} adapted data
 */
function updateSlide(data, tabName, tabId){

  let ds1Min = +document.getElementById('ds1_slider-' + tabName).noUiSlider.get()[0];
  let ds1Max = +document.getElementById('ds1_slider-' + tabName).noUiSlider.get()[1];
  let ds2Min = +document.getElementById('ds2_slider-' + tabName).noUiSlider.get()[0];
  let ds2Max = +document.getElementById('ds2_slider-' + tabName).noUiSlider.get()[1];

  if (tabId === TabId.intersecting){
        for(let link of Object.keys(data)){
          for(let d of data[link]){

            d.highlighted =
              ((parseFloat(d.ds1_median) >= ds1Min) && (parseFloat(d.ds1_median) <= ds1Max)) &&
              ((parseFloat(d.ds2_median) >= ds2Min) && (parseFloat(d.ds2_median) <= ds2Max))
              ? true
              : false;

          }
      }
  }

  if (tabId === TabId.nonIntersecting){
      for(let d of data){
          d.highlighted = 
          (
              (geneInDatasetOneOnly(d) ? 
                  // case: genes only in dataset1 
                  ( ( (parseFloat(d.ds1_median) >= ds1Min) && (parseFloat(d.ds1_median) <= ds1Max) ) ? true : false) :
                          // case: genes only in dataset2
                          ( ( (parseFloat(d.ds2_median) >= ds2Min) && (parseFloat(d.ds2_median) <= ds2Max) ) ? true : false))
          )
      }
      
  }

  return data;
}




/**
  *
  * @param{String} tabName
  * @param{String} tabId
  */
function updateCentroidBySlider(tabName, tabId){
  
    let globalDataCopy = createDeepCopyofData(document.getElementById("data-json").value);
    //globalDataCopy = combineLinkSpecificGlobalData(globalDataCopy);

    let currentDetailDiagram = getActiveRadioButton(tabName);

    //let comparison = tabName.split("_")[0] + "_" + tabName.split("_")[1] + "_" + tabName.split("_")[2] + "_" + tabName.split("_")[3];
    let comparison = tabName.split("_")[0];

    //globalDataCopy[comparison][tabId]['data'] = updateSlide(globalDataCopy[comparison][tabId]['data'], tabName, tabId);

    globalDataCopy[comparison][tabId]['data'] = updateSlide(globalDataCopy[comparison][tabId]['data'], tabName, tabId);
    bindDataToDiv(globalDataCopy);

    // new copy
    let filteredData = combineLinkSpecificGlobalData(createDeepCopyofData(document.getElementById("data-json").value));
    filteredData[comparison][tabId]['data'] = filteredData[comparison][tabId]['data'].filter(function(d) { return d.highlighted});

    if(tabId === TabId.intersecting){
        render(filteredData, "clustered-data-information-data-sankey-" + tabName, tabId, tabName);
    }
 
    // get clusters of diagram 
    let ds1Cluster = Array.from(new Set(filteredData[comparison][tabId]['data'].map(d => d.ds1_cluster))).filter(d => d !== null);
    let ds2Cluster = Array.from(new Set(filteredData[comparison][tabId]['data'].map(d => d.ds2_cluster))).filter(d => d !== null);

    for(let cluster of ds1Cluster){
        updateDetailDiagram(currentDetailDiagram, filteredData[comparison][tabId], "ds1", cluster.split("_")[1], tabName, tabId);
    }

    for(let cluster of ds2Cluster){
        updateDetailDiagram(currentDetailDiagram, filteredData[comparison][tabId], "ds2", cluster.split("_")[1], tabName, tabId);
    }

}






varianceSlider("variance-slider");

kSlider("k-slider");
