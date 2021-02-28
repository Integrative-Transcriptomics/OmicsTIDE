
/**
 * combined profile plot -> second-level analysis
 * @param {String} parentDiv 
 * @param {String} experimentId 
 * @param {ObjectArray} data 
 */
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
  
  
  /**
   * -> second-level analysis
   * @param {String} parentDiv 
   * @param {String} experimentId 
   * @param {ObjectArray} data 
   */
  function updateDetailDiagramCombined(parentDiv, experimentId, data){
  
      // set current svg
      let currentSvg = svg["svg_" + parentDiv];
      let currentXScale = svg["svg_x_" + parentDiv];
      let currentYScale = svg["svg_y_" + parentDiv];
  
      renderProfileDiagramCombined(data, parentDiv, experimentId, currentSvg, currentXScale, currentYScale);
  }
  


/**
 * 
 * @param {ObjectArray} data 
 * @param {String} parentDiv 
 * @param {String} experimentId 
 * @param {SvgObject} currentSvg 
 * @param {ScaleFunction} currentXScale 
 * @param {ScaleFunction} currentYScale 
 */
function renderProfileDiagramCombined(data, parentDiv, experimentId, currentSvg, currentXScale, currentYScale){

    let curr_height = document.getElementById(parentDiv).offsetHeight;
  
    let tip = d3.select("body").append("div")   
              .attr("class", "tooltip")           
              .style("opacity", 0);
  
    let nonSelectedProfilesNested = getDataForProfileDiagramCombined(data, experimentId, false);
    let selectedProfilesNested = getDataForProfileDiagramCombined(data, experimentId, true);
  
      
    // updating domains
      let currentXDomain = getCurrentXDomain(DiagramId.profile, data, experimentId);
      let currentYDomain = getCurrentYDomain(DiagramId.profile, data, experimentId);
  
      // calling axis
      currentXScale.domain(currentXDomain);
      currentSvg.selectAll(".x_axis")
          .attr("transform", "translate(0," + (curr_height - marginRelative.bottom) + ")")
          //.transition()
          //.duration(500)
          .call(d3.axisBottom(currentXScale));
  
      currentYScale.domain(currentYDomain);
      currentSvg.selectAll(".y_axis")
          //.transition()
          //.duration(500)
          .call(d3.axisLeft(currentYScale));
  
  
    let linesCombined = currentSvg.selectAll(".linesCombined")
              .data(nonSelectedProfilesNested);
  
          linesCombined
              .enter()
              .append("path")
              .attr("class", "linesCombined")
              .merge(linesCombined)
              .attr("fill", "none")
              .attr("stroke", d => color(d.values[0].experimentAndCluster))
              .attr("stroke-width", 2)
              .attr("id", d => "_lineplot_" + d.values[0].experimentAndCluster.split("_")[0] + "_" + d.key.toString())
              .attr("d", function(d){
  
                  return d3.line()
                      .x(function(d) {
                          // console.log(currentXScale(d.x))
                          // console.log(d.x)
                          return currentXScale(d.x.split(/_(.+)/)[1]); })
                      .y(function(d) {
                          // console.log(currentYScale(d.value))
                          // console.log(d.value)
                          return currentYScale(d.value); })
                      (d.values)
              })
             .on("mouseover", function(d){
  
                       d3.select(this).style("cursor", "pointer"); 
  
                       d3.select("#_lineplot_ds1_" + d.key.toString())
                       .raise()
                       .attr("stroke-width", 4)
                       .attr("stroke", "red")
  
                       d3.select("#_lineplot_ds2_" + d.key.toString())
                       .raise()
                       .attr("stroke-width", 4)
                       .attr("stroke", "red")
  
                       tip
                           .style("opacity", 0.9)
  
                       tip.html(d.key)
                           .style("left", (d3.event.pageX) + "px")     
                           .style("top", (d3.event.pageY - 28) + "px")
                             
                   })
            .on("mouseout", function(d){                
  
                       d3.select("#_lineplot_ds1_" + d.key.toString())
                       .lower()
                       .attr("stroke-width", 2)
                       .attr("stroke", d => color(d.values[0].experimentAndCluster))
  
                       d3.select("#_lineplot_ds2_" + d.key.toString())
                       .lower()
                       .attr("stroke-width", 2)
                       .attr("stroke", d => color(d.values[0].experimentAndCluster))
  
                       tip
                           .style("opacity", 0)
                   })
            .on("click", function(d){
                              window.open("https://www.ncbi.nlm.nih.gov/gene/?term=" + d.key.toString());
                          })
  
  
      let linesHighlighted = currentSvg.selectAll(".lines_highlighted")
          .data(selectedProfilesNested);
  
          linesHighlighted
              .enter()
              .append("path")
              .attr("class", "lines_highlighted")
              .merge(linesHighlighted)
              .attr("fill", "none")
              .attr("stroke", "red")
              .attr("stroke-width", 2)
              .attr("id", d => "_lineplot_highlighted_" + d.values[0].experimentAndCluster.split("_")[0] + "_" + d.key.toString())
              //.transition()
              //.duration(1000)
              .attr("d", function(d){
  
                  return d3.line()
                      .x(function(d) {return currentXScale(d.x.split(/_(.+)/)[1]); })
                      .y(function(d) {return currentYScale(d.value); })
                      (d.values)
              })
             .on("mouseover", function(d){
  
                       d3.select(this).style("cursor", "pointer"); 
  
                       d3.select("#_lineplot_highlighted_ds1_" + d.key.toString())
                       .raise()
                       .attr("stroke-width", 4)
                       .attr("stroke", "red")
  
                       d3.select("#_lineplot_highlighted_ds2_" + d.key.toString())
                       .raise()
                       .attr("stroke-width", 4)
                       .attr("stroke", "red")
  
                       tip
                           .style("opacity", 0.9)
  
                       tip.html(d.key)
                           .style("left", (d3.event.pageX) + "px")     
                           .style("top", (d3.event.pageY - 28) + "px")
                             
                   })
            .on("mouseout", function(d){                
  
                       d3.select("#_lineplot_higlighted_ds1_" + d.key.toString())
                       .raise()
                       .attr("stroke-width", 2)
                       .attr("stroke", "red")
  
                       d3.select("#_lineplot_highlighted_ds2_" + d.key.toString())
                       .raise()
                       .attr("stroke-width", 2)
                       .attr("stroke", "red")
  
                       tip
                           .style("opacity", 0)
                   })
            .on("click", function(d){
                              window.open("https://www.ncbi.nlm.nih.gov/gene/?term=" + d.key.toString());
                          })
  }


/**
 * 
 * @param {ObjectArray} data 
 * @param {String} experimentId 
 * @param {Boolean} isSelected 
 */
function getSelectedNonSelectedProfilesCombined(data, experimentId, isSelected){

    let filteredTmpData = data.filter(function (d) {

        return ((d[experimentId + "_cluster"] !== null) && d[experimentId + "_cluster"].startsWith(experimentId) && (d.profile_selected === isSelected))
    });

    return filteredTmpData;
}



/**
 * 
 * @param {ObjectArray} data 
 * @param {String} experimentId 
 * @param {Boolean} isSelected 
 */
function getDataForProfileDiagramCombined(data, experimentId, isSelected){

    let dataSelectedNonSelectedCombined = getSelectedNonSelectedProfilesCombined(data.selection, experimentId, isSelected);
  
    let dataSubsetLong = wideToLong(dataSelectedNonSelectedCombined, experimentId, false);
  
    let dataSubsetNested = nestData(dataSubsetLong, "gene");
  
    return dataSubsetNested;
  }