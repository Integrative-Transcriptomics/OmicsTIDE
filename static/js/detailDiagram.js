
margin = {top: 0.13, right: 0.06, bottom: 0.22, left: 0.09};
marginRelative = {top: 0, right: 0, bottom: 0, left: 0};
svg = {}

let color = d3.scaleOrdinal()
       .domain(["ds1_1", "ds1_2", "ds1_3", "ds1_4", "ds1_5", "ds1_6", "ds2_1", "ds2_2", "ds2_3","ds2_4", "ds2_5", "ds2_6", "null"])
       .range(["#1b9e77", "#eb914d", "#7570b3", "#e6ab02", "#735363", "#66a61e", "#1b9e77", "#eb914d", "#7570b3", "#e6ab02", "#735363", "#66a61e"]);

/**
  * 
  * @param{} diagramId
  * @param{} data
  * @param{} experimentId
  * @param{int} clusterNumer
  * @param{} tabdivID
  * @param{} tabId
  */
function detailDiagram(diagramId, data, experimentId, clusterNumber, tabDivId, tabId){

    curr_width = document.getElementById(experimentId + "_" + clusterNumber + "_" + tabDivId).offsetWidth;
    curr_height = document.getElementById(experimentId + "_" + clusterNumber + "_" + tabDivId).offsetHeight;

    // override 
    marginRelative.top = curr_height * margin.top;
    marginRelative.bottom = curr_height * margin.bottom;
    marginRelative.left = curr_width * margin.left;
    marginRelative.right = curr_width * margin.right;

    // distinguish matrix and rest
    let addClassInfo = tabDivId.split("_")[4] + "_" + tabDivId.split("_")[5];

    // add SVG
    svg["svg_" + diagramId + "_" + experimentId + "_" + clusterNumber + "_" + tabDivId] = d3.select("#" + experimentId + "_" + clusterNumber + "_" + tabDivId)
        .append("div")
        // Container class to make it responsive.
        .classed("svg-container", false)
        .append("svg")
        // Responsive SVG needs these 2 attributes and no width and height attr.
        .attr("class", (tabId === TabId.nonIntersecting ? ("non-intersecting-detail " + addClassInfo) : "intersecting-detail"))
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + curr_width + " " + curr_height)
        // Class to make it responsive.
        .classed("svg-content-responsive", false)
        // Fill with a rectangle for visualization.
        .attr("id", diagramId + "_" + experimentId + "_" + clusterNumber + "_" + tabDivId)

    // set ranges
    svg["svg_x_" + diagramId + "_" + experimentId + "_" + clusterNumber + "_" + tabDivId] = d3.scalePoint()
        .range([marginRelative.left, curr_width-marginRelative.right])
    let x_axis = svg["svg_" + diagramId + "_" + experimentId + "_" + clusterNumber + "_" + tabDivId].append("g")
        .attr("class","x_axis");

    svg["svg_y_" + diagramId + "_" + experimentId + "_" + clusterNumber + "_" + tabDivId] = d3.scaleLinear()
        .range([curr_height-marginRelative.bottom, marginRelative.top])
    let y_axis = svg["svg_" + diagramId + "_" + experimentId + "_" + clusterNumber + "_" + tabDivId].append("g")
        .attr("class","y_axis")
        .attr("transform", "translate(" + marginRelative.left + ",0)");


    //init
    updateDetailDiagram(diagramId, data, experimentId, clusterNumber, tabDivId, tabId);
}


function getAllMinMax(data){

    let trends = [... new Set(data.map( d => d.ds1_cluster.split("_")[1]).concat(data.map( d => d.ds2_cluster.split("_")[1])) )]

    for(let experiment of ["ds1", "ds2"]){
        for(let trend of trends){
            let tmpDataSubSet = getDataSubset(data, experiment, trend);


        }
    }
}


function detailDiagramCombined(parentDiv, experimentId, data){

  let curr_width =  document.getElementById(parentDiv).offsetWidth;
  let curr_height = document.getElementById(parentDiv).offsetHeight;

    // add SVG
    svg["svg_" + parentDiv] = d3.select("#" + parentDiv)
        .append("div")
        // Container class to make it responsive.
        .classed("svg-container", false)
        .append("svg")
        // Responsive SVG needs these 2 attributes and no width and height attr.
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + curr_width + " " + curr_height)
        // Class to make it responsive.
        .classed("svg-content-responsive", false)
        // Fill with a rectangle for visualization.
        .attr("id", "combined_" + parentDiv)

    
    // set ranges
    svg["svg_x_" + parentDiv] = d3.scalePoint()
        .range([marginRelative.left, curr_width-marginRelative.right])
    let x_axis = svg["svg_" + parentDiv].append("g")
        .attr("class","x_axis")

    svg["svg_y_" + parentDiv] = d3.scaleLinear()
        .range([curr_height-marginRelative.bottom, marginRelative.top])
    let y_axis = svg["svg_" + parentDiv].append("g")
        .attr("class","y_axis")
        .attr("transform", "translate(" + marginRelative.left + ",0)");

    // extract all subsets 

    // calculate all min max

    //init
    updateDetailDiagramCombined(parentDiv, experimentId, data);
}


function updateDetailDiagramCombined(parentDiv, experimentId, data){

    // set current svg
    let currentSvg = svg["svg_" + parentDiv];
    let currentXScale = svg["svg_x_" + parentDiv];
    let currentYScale = svg["svg_y_" + parentDiv];

    renderProfileDiagramCombined(data, parentDiv, experimentId, currentSvg, currentXScale, currentYScale);
}



/**
  * 
  * @param{} diagramId
  * @param{} data
  * @param{} experimentId
  * @param{int} clusterNumer
  * @param{} tabdivID
  * @param{} tabId
  */
function updateDetailDiagram(diagramId, data, experimentId, clusterNumber, tabDivId, tabId){

    // set current svg
    let currentSvg = svg["svg_" + diagramId + "_" + experimentId + "_" + clusterNumber + "_" + tabDivId];
    let currentXScale = svg["svg_x_" + diagramId + "_" + experimentId + "_" + clusterNumber + "_" + tabDivId];
    let currentYScale = svg["svg_y_" + diagramId + "_" + experimentId + "_" + clusterNumber + "_" + tabDivId];

    // get data subset
    let dataSubset = getDataSubset(data, experimentId, clusterNumber);

    // case: emptry subset
    if(dataSubset.data.length === 0){
        console.log("empty!")
        return;
    }

    if(diagramId === DiagramId.centroid){
        renderCentroidDiagram(dataSubset, experimentId, clusterNumber, currentSvg, currentXScale, currentYScale, tabDivId);
    }

    if(diagramId === DiagramId.profile){
        renderProfileDiagram(dataSubset, experimentId, clusterNumber, currentSvg, currentXScale, currentYScale, tabId, tabDivId, data);
    }

    if(diagramId === DiagramId.box){
        renderBoxDiagram(dataSubset, experimentId, clusterNumber, currentSvg, currentXScale, currentYScale, tabDivId, data);
    }
}





/**
  * 
  * @param{} diagramId
  * @param{} data
  * @param{} parentLeftDivId
  * @param{int} parentRightDivId
  * @param{} tabDivId
  * @param{} tabId
  */
function detailDiagramsPerCluster(diagramId, data, parentLeftDivId, parentRightDivId, tabDivId, tabId) {

    if(!isValidEnum(DiagramId, diagramId)){
        alert("invalid diagram Id!");
        return;
    }

    //determine cluster count in a different way? 
    cluster_count = data.cluster_count;

    // remove old entries
    let ds1_old = document.getElementById(parentLeftDivId);
    while (ds1_old.firstChild) ds1_old.removeChild(ds1_old.firstChild);
    let ds2_old = document.getElementById(parentRightDivId);
    while (ds2_old.firstChild) ds2_old.removeChild(ds2_old.firstChild);

    // add new
    //createDivs(cluster_count);
    createChildDivs(cluster_count, parentLeftDivId, "ds1_", tabDivId);
    createChildDivs(cluster_count, parentRightDivId, "ds2_", tabDivId);

    //plot counts might be adjusted when NAs are involved
    plot_counts = document.getElementById(parentLeftDivId).childElementCount;

    for (i = 1; i <= plot_counts; i++) {

        detailDiagram(diagramId, data, "ds1", i, tabDivId, tabId);
        detailDiagram(diagramId, data, "ds2", i, tabDivId, tabId);
    }

}


/**
  * 
  * @param{} diagramId
  * @param{} data
  * @param{} experimentId
  */
function getCurrentXDomain(diagramId, data, experimentId){


    if (typeof data.data === "string") {
        data.data = JSON.parse(data.data);
    }


    if(diagramId === DiagramId.profile){

        let colnames = Object.keys(data.data[0])
        let xValues = [];

        for(colname of colnames){
            if(isSingleValue(colname, experimentId)){
                
                xValues.push(colname.split("_")[1]);
            }
        }

        xDomain = xValues;
    }

    if(diagramId === DiagramId.centroid){
        xDomain = data[0].values.map(function(d){ return d.key.split("_")[1]});
    }    


    if(diagramId === DiagramId.box){
        
        xDomain = data.map(function(d){ return d.key.split("_")[1]});
    }

    return xDomain;
}


/**
  * 
  * @param{} diagramId
  * @param{} data
  * @param{} experimentId
  */
function getCurrentYDomain(diagramId, data, experimentId){

    if (typeof data.data === "string") {
        data.data = JSON.parse(data.data);
    }

    if(diagramId === DiagramId.profile){

        let valueArray = valuesToArray(data.data, experimentId);

        yDomain = [d3.min(valueArray), d3.max(valueArray)];
    }

    if(diagramId === DiagramId.centroid){
        yDomain = [getMinValueLowerBoundCentroid(data), getMaxValueUpperBoundCentroid(data)];
    }

    if(diagramId === DiagramId.box){
        
        yDomain = [getMinValueBox(data), getMaxValueBox(data)];
    }

    return yDomain;
}



/**
  * 
  * @param{} colname
  * @param{} experimentId
  */
function isSingleValue(colname, experimentId){
    return (
        colname.startsWith(experimentId) && 
        !colname.endsWith("cluster") &&
        !colname.endsWith("median") &&
        colname !== "gene" &&
        colname !== "highlighted" &&
        colname !== "profile_selected")
}


/**
  * 
  * @param{} data
  * @param{} experimentId
  */
function valuesToArray(data, experimentId){
    let allValues = [];

    for(row of data){
        for(col of Object.keys(row)){
            if(isSingleValue(col, experimentId)){
                allValues.push(row[col]);
            }
        }
    }

    return allValues;
}


/**
  * 
  * @param{} Enum
  * @param{} chosenValue
  */
function isValidEnum(Enum, chosenValue){
    return Object.keys(Enum).includes(chosenValue);
}


/**
  * 
  * @param{} data
  * @param{} experimentId
  * @param{int} clusterNumer
  */
function getDataSubset(data, experimentId, clusterNumber){

    // clone object from globalData
    
    // deep copy
    let dataSubset = JSON.parse(JSON.stringify(data))

    if (typeof dataSubset.data === "string") {
        dataSubset.data = JSON.parse(dataSubset.data);
    }

    // why isnt it an array any more?
    if(!Array.isArray(dataSubset.data)){
        dataSubset.data = [];
    }

    else{
        dataSubset.data = dataSubset.data.filter(function (d) {
            return (d[experimentId + "_cluster"] === (experimentId + "_" + clusterNumber) && (d.highlighted))
        });
    }

    return dataSubset;
}




/**
 * Creates n vertically stacked child divs (childHeight = parentHeight/n) in a parent div
 * @param {number} n number of child divs.
 * @param {string} parent_div_id ID of the parent div
 * @param {string} child_div_id_prefix ID prefix of the child divs
 */
function createChildDivs(n, parent_div_id, child_div_id_prefix, tabDivId){
    var parent_div = document.getElementById(parent_div_id);

    let currentClass = tabDivId.split("_")[4] + "_"+ tabDivId.split("_")[5];

    for(i=0; i<n; i++){
        var child = document.createElement('div');
        child.id = child_div_id_prefix+(i+1) + "_" + tabDivId;
        child.className = currentClass;
        child.style.width = "100%";
        child.style.height = (100/n) + "%";
        //child.style.margin = "10%";
        parent_div.appendChild(child);
    }
}


function createSubDivs(parent_div_name, width_perc, height_perc, div_suffix){

    var parent_div = document.getElementById(parent_div_name);
    var child = document.createElement('div');
    child.id = parent_div_name + "_" + div_suffix;
    child.style.width = width_perc + "%";
    child.style.height = height_perc + "%";
    parent_div.appendChild(child);
}
