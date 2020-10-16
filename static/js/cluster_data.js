var globalDataLoaded = false;


/**
  *
  */
function loadFilesForClustering(){

    if(document.getElementById("files").files.length < 2 || document.getElementById("files").files.length > 4){
        alert("CHOOSE BETWEEN TWO AND FOUR FILES!");
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
            globalData = result;

            addTab("data", true, TabId.matrix);
        },
        error: function(request){
            alert("Invalid Data!\n" + request.responseJSON.message);
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


/**
  *
  */
function clusterData(){

    console.log(document.getElementById("my_form"));

    $("#my_form").ajaxSubmit({
        url: '/cluster_data',
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
                globalData = result
                
                addTab("data", true, TabId.matrix);

            },
            error: function(request){
                alert("Invalid Data!\n" + request.responseJSON.message);
            },
            complete: function(){
            $("#overlay-index").fadeOut(100);
            }
        })},
    })
}

// https://codepen.io/yic666kr/pen/mxmvbV