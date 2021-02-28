var globalDataLoaded = false;


/**
 * 
 */
function loadFilesForClustering() {

    if ((document.getElementById("files").files.length < 2 || document.getElementById("files").files.length > 4) &&
        document.getElementById("dropdownMenuButton").classList.contains("disabled")) {
        alert("Choose between two and four abundance files!");
        return;
    }

    clusterData();
}


/**
  *
  */
function loadClusteredFile() {

    if (document.getElementById("input_clustered_file").value.length === 0) {
        alert("NO FILE CHOSEN!");
        return;
    }

    $("#clustered_file_form").ajaxSubmit({
        url: '/upload',
        type: 'POST',
        beforeSend: function () {
            $("#overlay-index").fadeIn(100);
        },
        success: function (result) {

            let globalData = createDeepCopyofData(result);

            for (let comparison of Object.keys(globalData)) {
                for (let comparisonType of ['intersecting', 'nonIntersecting']) {
                    globalData[comparison][comparisonType]['yScales'] = updateYScalesMinMax(globalData[comparison][comparisonType], comparison, comparisonType);
                }
            }

            bindDataToDiv(globalData);

            addTab("data", true, TabId.matrix);

        },
        error: function (request) {
            alert(request.responseJSON.message);
        },
        complete: function () {
            $("#overlay-index").fadeOut(100);
        }
    })
}


// /**
//   *
//   */
// function globalDataIsSet(){
//     return global_data.length > 0
// }



// $(document).on('click', '#input-test', function(event) {

//     event.stopImmediatePropagation();

//     $("#my_form").ajaxSubmit({
//         url: '/load_test_data',
//         type: 'POST',
//         beforeSend: function(){
//             $("#overlay-index").fadeIn(100);　
//         },
//         data: {
//                 'k' : $("#k-slider-input-1")[0].value,
//                 'lowerVariancePercentage' : $('#variance-slider-input-1')[0].value,
//                 'upperVariancePercentage' : $('#variance-slider-input-2')[0].value
//         },
//         success: function(result){

//                 let globalData = JSON.parse(JSON.stringify(result));

//                 bindDataToDiv(globalData);

//                 addTab("data", true, TabId.matrix);

//         },
//         error: function(request){
//             alert(request.responseJSON.message);
//         },
//         complete: function(){
//             $("#overlay-index").fadeOut(100);　
//         }
//     })
// });





$('#files').bind('change', function () {

    for (let file of this.files) {
        if (file.size / 1024 / 1024 > 50) {
            alert("Max File Size: 50 MB")

            return;
        }
    }
});

$('#input_clustered_file').bind('change', function () {

    for (let file of this.files) {
        if (file.size / 1024 / 1024 > 50) {
            alert("Max File Size: 50 MB")

            return;
        }
    }
});





/**
  *
  */
function clusterData() {

    let chosenUrl;

    // own data
    if (document.getElementById("dropdownMenuButton").classList.contains("disabled")) {
        chosenUrl = '/cluster_data';
    }

    else {
        if (document.getElementById("study-selected-value").value === "streptomyces") {
            chosenUrl = '/load_test_data_streptomyces';
        }

        if (document.getElementById("study-selected-value").value === "bloodcell") {
            chosenUrl = '/load_test_data_bloodcell';
        }
    }



    if (chosenUrl === '/cluster_data') {

        $("#my_form").ajaxSubmit({
            url: chosenUrl,
            type: 'POST',
            success: function (result) {
                $.ajax({
                    url: '/load_k',
                    type: 'POST',
                    beforeSend: function () {
                        $("#overlay-index").fadeIn(100);
                    },
                    data: {
                        'k': $("#k-slider-input-1")[0].value,
                        'lowerVariancePercentage': $('#variance-slider-input-1')[0].value,
                        'upperVariancePercentage': $('#variance-slider-input-2')[0].value
                    },
                    success: function (result) {

                        let globalData = createDeepCopyofData(result);

                        for (let comparison of Object.keys(globalData)) {
                            for (let comparisonType of ['intersecting', 'nonIntersecting']) {
                                globalData[comparison][comparisonType]['yScales'] = updateYScalesMinMax(globalData[comparison][comparisonType], comparison, comparisonType);
                            }
                        }

                        bindDataToDiv(globalData);

                        addTab("data", true, TabId.matrix);

                    },
                    error: function (request) {
                        alert(request.responseJSON.message);
                    },
                    complete: function () {
                        $("#overlay-index").fadeOut(100);
                    }
                })
            },
        })
    }

    else {

        $.ajax({
            url: chosenUrl,
            type: 'POST',
            beforeSend: function () {
                $("#overlay-index").fadeIn(100);
            },
            data: {
                'k': $("#k-slider-input-1")[0].value,
                'lowerVariancePercentage': $('#variance-slider-input-1')[0].value,
                'upperVariancePercentage': $('#variance-slider-input-2')[0].value
            },
            success: function (result) {

                let globalData = createDeepCopyofData(result);

                for (let comparison of Object.keys(globalData)) {
                    for (let comparisonType of ['intersecting', 'nonIntersecting']) {
                        globalData[comparison][comparisonType]['yScales'] = updateYScalesMinMax(globalData[comparison][comparisonType], comparison, comparisonType);
                    }
                }

                bindDataToDiv(globalData);

                addTab("data", true, TabId.matrix);

            },
            error: function (request) {
                alert(request.responseJSON.message);
            },
            complete: function () {
                $("#overlay-index").fadeOut(100);
            }
        })

    }
}


/**
 * 
 * @param {ObjectArray} inputData 
 */
function createDeepCopyofData(inputData) {

    let data = JSON.parse(JSON.stringify(inputData))

    if (isJson(data)) {
        data = JSON.parse(data);
    }

    for (let comparison of Object.keys(data)) {

        if (isJson(data[comparison]['nonIntersecting']['data'])) {
            data[comparison]['nonIntersecting']['data'] = JSON.parse(data[comparison]['nonIntersecting']['data']);
        }

        for (let link of Object.keys(data[comparison]['intersecting']['data'])) {

            if (isJson(data[comparison]['intersecting']['data'][link])) {
                data[comparison]['intersecting']['data'][link] = JSON.parse(data[comparison]['intersecting']['data'][link]);
            }
        }

    }

    return data
}


/**
 * combines the data separated by the single trend comparisons (e.g. ds1_1-ds2_1) to one ObjectArray
 * @param {ObjectArray} data 
 */
function combineLinkSpecificGlobalData(data) {

    for (let comparison of Object.keys(data)) {

        let combined = [];

        for (let link of Object.keys(data[comparison]['intersecting']['data'])) {

            combined = combined.concat(data[comparison]['intersecting']['data'][link]);

        }

        data[comparison]['intersecting']['data'] = combined;

    }

    return data
}





/**
 * combines the data separated by the single trend comparisons (e.g. ds1_1-ds2_1) to one ObjectArray
 * @param {ObjectArray} data 
 */
function combineLinkSpecificGlobalData2(data) {

    let combined = [];

    for (let link of Object.keys(data)) {

        combined = combined.concat(data[link]);

    }

    return combined;
}



