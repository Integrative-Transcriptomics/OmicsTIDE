var globalDataLoaded = false;


/**
  *
  */
function loadFilesForClustering(){

    if((document.getElementById("files").files.length < 2 || document.getElementById("files").files.length > 4) && 
    document.getElementById("dropdownMenuButton").classList.contains("disabled")){
        alert("Choose between two and four abundance files!");
        return;
    }

    clusterData(); 
}


/**
  *
  */
function loadClusteredFile(){

    if(document.getElementById("input_clustered_file").value.length === 0){
        alert("NO FILE CHOSEN!");
        return;
    }

    $("#clustered_file_form").ajaxSubmit({
        url: '/upload',
        type: 'POST',
        beforeSend: function(){
            $("#overlay-index").fadeIn(100);　
        },
        success: function(result){

            let globalData = JSON.parse(JSON.stringify(result));

            bindDataToDiv(globalData);
            addTab("data", true, TabId.matrix);

        },
        error: function(request){
            alert(request.responseJSON.message);
        },
        complete: function(){
            $("#overlay-index").fadeOut(100);　
        }
    })
}


/**
  *
  */
function globalDataIsSet(){
    return global_data.length > 0
}



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





$('#files').bind('change', function() {

    for(let file of this.files){
        if(file.size/1024/1024 > 50){
            alert("Max File Size: 50 MB")

            return;
        }
    }
});

$('#input_clustered_file').bind('change', function() {

    for(let file of this.files){
        if(file.size/1024/1024 > 50){
            alert("Max File Size: 50 MB")

            return;
        }
    }
});





/**
  *
  */
function clusterData(){

    let chosenUrl;

    // own data
    if(document.getElementById("dropdownMenuButton").classList.contains("disabled")){
        chosenUrl = '/cluster_data';
    }

    else{
        if(document.getElementById("study-selected-value").value === "streptomyces"){
            chosenUrl = '/load_test_data_streptomyces';
        }

        if(document.getElementById("study-selected-value").value === "bloodcell"){
            chosenUrl = '/load_test_data_bloodcell';
        }
    }



    if(chosenUrl === '/cluster_data'){

        $("#my_form").ajaxSubmit({
            url: chosenUrl,
            type: 'POST',
            success: function(result){
                $.ajax({
                url: '/load_k',
                type: 'POST',
                beforeSend: function(){
                $("#overlay-index").fadeIn(100);　
                },
                data: {
                    'k' : $("#k-slider-input-1")[0].value,
                    'lowerVariancePercentage' : $('#variance-slider-input-1')[0].value,
                    'upperVariancePercentage' : $('#variance-slider-input-2')[0].value
                },
                success: function(result){
    
                    let globalData = JSON.parse(JSON.stringify(result));
                    bindDataToDiv(globalData);
                    addTab("data", true, TabId.matrix);
    
                },
                error: function(request){
                    alert(request.responseJSON.message);
                },
                complete: function(){
                $("#overlay-index").fadeOut(100);
                }
            })},
        })
    } 
    
    else{

        $.ajax({
            url: chosenUrl,
            type: 'POST',
            beforeSend: function(){
                $("#overlay-index").fadeIn(100);　
            },
            data: {
                    'k' : $("#k-slider-input-1")[0].value,
                    'lowerVariancePercentage' : $('#variance-slider-input-1')[0].value,
                    'upperVariancePercentage' : $('#variance-slider-input-2')[0].value
            },
            success: function(result){
    
                    let globalData = JSON.parse(JSON.stringify(result));

                    console.log(globalData)
    
                    bindDataToDiv(globalData);
    
                    addTab("data", true, TabId.matrix);
    
            },
            error: function(request){
                alert(request.responseJSON.message);
            },
            complete: function(){
                $("#overlay-index").fadeOut(100);　
            }
        })

    }
}
















function createDeepCopyofData(inputData){

    let data = JSON.parse(JSON.stringify(inputData))

    if(isJson(data)){
        data = JSON.parse(data);
    }

    for(let comparison of Object.keys(data)){

        if(isJson(data[comparison]['nonIntersecting']['data'])){
            data[comparison]['nonIntersecting']['data'] = JSON.parse(data[comparison]['nonIntersecting']['data']);
        }

        for(let link of Object.keys(data[comparison]['intersecting']['data'])){

            if(isJson(data[comparison]['intersecting']['data'][link])){
                data[comparison]['intersecting']['data'][link] = JSON.parse(data[comparison]['intersecting']['data'][link]);
            }  
        }
      
    }

    return data
}


function combineLinkSpecificGlobalData(data){

    for(let comparison of Object.keys(data)){

        let combined = [];

        for(let link of Object.keys(data[comparison]['intersecting']['data'])){
            
            combined = combined.concat(data[comparison]['intersecting']['data'][link]);

        }

        data[comparison]['intersecting']['data'] = combined;

    }

    return data
}


function updateDetailDiagramsOnMouseOver(comparison, currentLink){

    let linkId = currentLink.names[0] + "-" + currentLink.names[1];

    let ds1Cluster = currentLink.names[0].split("_")[1];
    let ds2Cluster = currentLink.names[1].split("_")[1];

    let filtered =[];
    //let globalDataCopy = createDeepCopyofData(document.getElementById('data-json').value);
    let globalDataCopy = JSON.parse(document.getElementById('data-json').value)[comparison]['intersecting'];


    for(let link of Object.keys(globalDataCopy['data'])){

        if(isJson(globalDataCopy['data'][link])){
            globalDataCopy['data'][link] = JSON.parse(globalDataCopy['data'][link]);
        }

        if(link === linkId){
            filtered = filtered.concat(globalDataCopy['data'][link]);
        }
    }

    // for(let link of Object.keys(globalDataCopy[comparison]['intersecting']['data'])){

    //     if(link === linkId){
    //         filtered = filtered.concat(globalDataCopy[comparison]['intersecting']['data'][link]);
    //     }
    // }


    globalDataCopy['data'] = filtered;

    firstDiagramData = JSON.parse(JSON.stringify(document.getElementById('data-json').value));
    secondDiagramData = JSON.parse(JSON.stringify(document.getElementById('data-json').value));

    firstDiagramData = JSON.parse(firstDiagramData);
    secondDiagramData = JSON.parse(secondDiagramData);

    // let firstDiagramData = createDeepCopyofData(document.getElementById('data-json').value);
    // let secondDiagramData = createDeepCopyofData(document.getElementById('data-json').value);

    // firstDiagramData[comparison]['intersecting']['data'] = globalDataCopy[comparison]['intersecting']['data'].filter(d => d.ds1_cluster === currentLink.names[0] && d.highlighted);
    // secondDiagramData[comparison]['intersecting']['data'] = globalDataCopy[comparison]['intersecting']['data'].filter(d => d.ds2_cluster === currentLink.names[1] && d.highlighted);

    firstDiagramData[comparison]['intersecting']['data'] = globalDataCopy['data'].filter(d => d.ds1_cluster === currentLink.names[0] && d.highlighted);
    secondDiagramData[comparison]['intersecting']['data'] = globalDataCopy['data'].filter(d => d.ds2_cluster === currentLink.names[1] && d.highlighted);

    let currentDetailDiagram = getActiveRadioButton(comparison + "_intersecting");

    updateDetailDiagram(currentDetailDiagram, firstDiagramData[comparison]['intersecting'], "ds1", ds1Cluster, comparison+"_intersecting", "intersecting", comparison)
    updateDetailDiagram(currentDetailDiagram, secondDiagramData[comparison]['intersecting'], "ds2", ds2Cluster, comparison+"_intersecting", "intersecting", comparison)

    
}



function restoreDetailDiagramsOnMouseOut(comparison, linkId){

    let filtered =[];

    let firstDatasetCluster = linkId.names[0];
    let secondDatasetCluster = linkId.names[1];

    let ds1Cluster = linkId.names[0].split("_")[1];
    let ds2Cluster = linkId.names[1].split("_")[1];

    //let globalDataCopy = createDeepCopyofData(document.getElementById('data-json').value);
    let globalDataCopy = JSON.parse(document.getElementById('data-json').value)[comparison]['intersecting'];

    

    for(let link of Object.keys(globalDataCopy['data'])){

        if(isJson(globalDataCopy['data'][link])){
            globalDataCopy['data'][link] = JSON.parse(globalDataCopy['data'][link]);
        }

        if(link.startsWith(firstDatasetCluster) || link.endsWith(secondDatasetCluster)){
            filtered = filtered.concat(globalDataCopy['data'][link]);
        }
    }

    globalDataCopy['data'] = filtered;

    firstDiagramData = JSON.parse(JSON.stringify(document.getElementById('data-json').value));
    secondDiagramData = JSON.parse(JSON.stringify(document.getElementById('data-json').value));

    firstDiagramData = JSON.parse(firstDiagramData);
    secondDiagramData = JSON.parse(secondDiagramData);

    // let firstDiagramData = createDeepCopyofData(document.getElementById('data-json').value);
    // let secondDiagramData = createDeepCopyofData(document.getElementById('data-json').value);

    firstDiagramData[comparison]['intersecting']['data'] = globalDataCopy['data'].filter(d => d.ds1_cluster === linkId.names[0] && d.highlighted);
    secondDiagramData[comparison]['intersecting']['data'] = globalDataCopy['data'].filter(d => d.ds2_cluster === linkId.names[1] && d.highlighted);


    let currentDetailDiagram = getActiveRadioButton(comparison + "_intersecting");

    updateDetailDiagram(currentDetailDiagram, firstDiagramData[comparison]['intersecting'], "ds1", ds1Cluster, comparison+"_intersecting", "intersecting", comparison)
    updateDetailDiagram(currentDetailDiagram, secondDiagramData[comparison]['intersecting'], "ds2", ds2Cluster, comparison+"_intersecting", "intersecting", comparison)
}




