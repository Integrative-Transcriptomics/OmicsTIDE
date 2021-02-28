
/**
 * 
 * @param {ObjectArray} data 
 * @param {String} experimentId 
 * @param {int} clusterNumber 
 * @param {SvgObject} currentSvg 
 * @param {ScaleFunction} currentXScale 
 * @param {ScaleFunction} currentYScale 
 * @param {String} tabId 
 * @param {String} tabDivId 
 */
 function renderProfileDiagram(data, experimentId, clusterNumber, currentSvg, currentXScale, currentYScale, tabId, tabDivId){

	let tip = d3.select("body").append("div")   
            .attr("class", "toolTipSecond")
            .style("width", "300px")
            .style("height", "150px")
            .style("font-size", "10px")
            .style("opacity", 0);

	let nonSelectedProfilesNested = getDataForProfileDiagram(data, experimentId, clusterNumber, false);
	let selectedProfilesNested = getDataForProfileDiagram(data, experimentId, clusterNumber, true);
    
	// updating domains
    let currentXDomain = getCurrentXDomain(DiagramId.profile, data, experimentId);
    //let currentYDomain = getCurrentYDomain(DiagramId.profile, data, experimentId);


    // calling axis
    currentXScale.domain(currentXDomain);
    currentSvg.selectAll(".x_axis")
        .attr("transform", "translate(0," + (curr_height - marginRelative.bottom) + ")")
        //.transition()
        //.duration(500)
        .call(d3.axisBottom(currentXScale));

    let minValue = data.yScales.profilesMinMax.profilesMin;
    let maxValue = data.yScales.profilesMinMax.profilesMax;

    currentYScale.domain([minValue, maxValue]);   
    let tickRange = createTickRange(minValue, maxValue, 0.5, -6, 6);

    //currentYScale.domain(currentYDomain);
    currentSvg.selectAll(".y_axis")
        //.transition()
        //.duration(500)
        .call(d3.axisLeft(currentYScale)
        .tickValues(tickRange) 
        );


	let lines = currentSvg.selectAll(".lines")
            .data(nonSelectedProfilesNested);

        lines
            .enter()
            .append("path")
            .attr("class", "lines")
            .merge(lines)
            .attr("fill", "none")
            .attr("stroke", d => color(d.values[0].experimentAndCluster))
            .attr("stroke-width", 2)
            .attr("id", d => tabDivId + "_lineplot_" + d.values[0].experimentAndCluster.split("_")[0] + "_" + d.key.toString())
            //.transition()
            //.duration(1000)
            .attr("d", function(d){

                return d3.line()
                    .x(function(d) {return currentXScale(d.x.split(/_(.+)/)[1]); })
                    .y(function(d) {return currentYScale(d.value); })
                    (d.values)
            })
            
						.on("mouseover", function(d){

			                d3.select("#" + tabDivId + "_lineplot_ds1_" + d.key.toString())
                            .raise()
			                .attr("stroke", "red")
			                .attr("stroke-width", 4)

			                d3.select("#" + tabDivId + "_lineplot_ds2_" + d.key.toString())
                            .raise()
			                .attr("stroke", "red")
			                .attr("stroke-width", 4)

			                tip
			                    .style("opacity", 0.9)

			                tip.html(d.key)
			                    .style("left", (d3.event.pageX) + "px")     
			                    .style("top", (d3.event.pageY - 28) + "px")
			                     
			            })
			            .on("mouseout", function(d){                

			                d3.select("#" + tabDivId + "_lineplot_ds1_" + d.key.toString())
                            .lower()
			                .attr("stroke", d => color(d.values[0].experimentAndCluster))
			                .attr("stroke-width", 2)

			                d3.select("#" + tabDivId + "_lineplot_ds2_" + d.key.toString())
                            .lower()
			                .attr("stroke", d => color(d.values[0].experimentAndCluster))
			                .attr("stroke-width", 2)

			                tip
			                    .style("opacity", 0)
			            })

		//}  

        lines    
            .exit()
            //.transition()
            //.duration(1000)
            .style("stroke-opacity", 0)
            .remove();



        let linesHighlighted = currentSvg.selectAll(".lines_highlighted")
            .data(selectedProfilesNested);

        linesHighlighted
            .raise()
            .enter()
            .append("path")
            .attr("class", "lines_highlighted")
            .merge(linesHighlighted)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("id", function(d){
                return tabDivId + "_lineplot_highlighted_" + d.values[0].experimentAndCluster.split("_")[0] + "_" + d.key;
            })
            .attr("d", function(d){

                return d3.line()
                    .x(function(d) {return currentXScale(d.x.split(/_(.+)/)[1]); })
                    .y(function(d) {return currentYScale(d.value); })
                    (d.values)
            })
            .on("mouseover", function(d){

                d3.select("#" + tabDivId + "_lineplot_highlighted_ds1_" + d.key.toString())
                .raise()
                .attr("stroke", "red")
                .attr("stroke-width", 4)

                d3.select("#" + tabDivId + "_lineplot_highlighted_ds2_" + d.key.toString())
                .raise()
                .attr("stroke", "red")
                .attr("stroke-width", 4)

                tip
                    .style("opacity", 0.9)

                tip.html(d.key)
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px")
                     
            })
            .on("mouseout", function(d){                

                d3.select("#" + tabDivId + "_lineplot_highlighted_ds1_" + d.key.toString())
                .raise()
                .attr("stroke", "red")
                .attr("stroke-width", 2)

                d3.select("#" + tabDivId + "_lineplot_highlighted_ds2_" + d.key.toString())
                .raise()
                .attr("stroke", "red")
                .attr("stroke-width", 2)

                tip
                    .style("opacity", 0)
            })

        linesHighlighted = linesHighlighted
                    .exit()
                    //.transition()
                    //.duration(1000)
                    .style("stroke-opacity", 0)
                    .remove();


	
}


// /**
//  * 
//  * @param {ObjectArray} data 
//  * @param {String} parentDiv 
//  * @param {String} experimentId 
//  * @param {SvgObject} currentSvg 
//  * @param {ScaleFunction} currentXScale 
//  * @param {ScaleFunction} currentYScale 
//  */
// function renderProfileDiagramCombined(data, parentDiv, experimentId, currentSvg, currentXScale, currentYScale){

//   let curr_height = document.getElementById(parentDiv).offsetHeight;

//   let tip = d3.select("body").append("div")   
//             .attr("class", "tooltip")           
//             .style("opacity", 0);

//   let nonSelectedProfilesNested = getDataForProfileDiagramCombined(data, experimentId, false);
//   let selectedProfilesNested = getDataForProfileDiagramCombined(data, experimentId, true);

    
//   // updating domains
//     let currentXDomain = getCurrentXDomain(DiagramId.profile, data, experimentId);
//     let currentYDomain = getCurrentYDomain(DiagramId.profile, data, experimentId);

//     // calling axis
//     currentXScale.domain(currentXDomain);
//     currentSvg.selectAll(".x_axis")
//         .attr("transform", "translate(0," + (curr_height - marginRelative.bottom) + ")")
//         //.transition()
//         //.duration(500)
//         .call(d3.axisBottom(currentXScale));

//     currentYScale.domain(currentYDomain);
//     currentSvg.selectAll(".y_axis")
//         //.transition()
//         //.duration(500)
//         .call(d3.axisLeft(currentYScale));


//   let linesCombined = currentSvg.selectAll(".linesCombined")
//             .data(nonSelectedProfilesNested);

//         linesCombined
//             .enter()
//             .append("path")
//             .attr("class", "linesCombined")
//             .merge(linesCombined)
//             .attr("fill", "none")
//             .attr("stroke", d => color(d.values[0].experimentAndCluster))
//             .attr("stroke-width", 2)
//             .attr("id", d => "_lineplot_" + d.values[0].experimentAndCluster.split("_")[0] + "_" + d.key.toString())
//             .attr("d", function(d){

//                 return d3.line()
//                     .x(function(d) {
//                         // console.log(currentXScale(d.x))
//                         // console.log(d.x)
//                         return currentXScale(d.x.split(/_(.+)/)[1]); })
//                     .y(function(d) {
//                         // console.log(currentYScale(d.value))
//                         // console.log(d.value)
//                         return currentYScale(d.value); })
//                     (d.values)
//             })
//            .on("mouseover", function(d){

//                      d3.select(this).style("cursor", "pointer"); 

//                      d3.select("#_lineplot_ds1_" + d.key.toString())
//                      .raise()
//                      .attr("stroke-width", 4)
//                      .attr("stroke", "red")

//                      d3.select("#_lineplot_ds2_" + d.key.toString())
//                      .raise()
//                      .attr("stroke-width", 4)
//                      .attr("stroke", "red")

//                      tip
//                          .style("opacity", 0.9)

//                      tip.html(d.key)
//                          .style("left", (d3.event.pageX) + "px")     
//                          .style("top", (d3.event.pageY - 28) + "px")
                           
//                  })
//           .on("mouseout", function(d){                

//                      d3.select("#_lineplot_ds1_" + d.key.toString())
//                      .lower()
//                      .attr("stroke-width", 2)
//                      .attr("stroke", d => color(d.values[0].experimentAndCluster))

//                      d3.select("#_lineplot_ds2_" + d.key.toString())
//                      .lower()
//                      .attr("stroke-width", 2)
//                      .attr("stroke", d => color(d.values[0].experimentAndCluster))

//                      tip
//                          .style("opacity", 0)
//                  })
//           .on("click", function(d){
//                             window.open("https://www.ncbi.nlm.nih.gov/gene/?term=" + d.key.toString());
//                         })


//     let linesHighlighted = currentSvg.selectAll(".lines_highlighted")
//         .data(selectedProfilesNested);

//         linesHighlighted
//             .enter()
//             .append("path")
//             .attr("class", "lines_highlighted")
//             .merge(linesHighlighted)
//             .attr("fill", "none")
//             .attr("stroke", "red")
//             .attr("stroke-width", 2)
//             .attr("id", d => "_lineplot_highlighted_" + d.values[0].experimentAndCluster.split("_")[0] + "_" + d.key.toString())
//             //.transition()
//             //.duration(1000)
//             .attr("d", function(d){

//                 return d3.line()
//                     .x(function(d) {return currentXScale(d.x.split(/_(.+)/)[1]); })
//                     .y(function(d) {return currentYScale(d.value); })
//                     (d.values)
//             })
//            .on("mouseover", function(d){

//                      d3.select(this).style("cursor", "pointer"); 

//                      d3.select("#_lineplot_highlighted_ds1_" + d.key.toString())
//                      .raise()
//                      .attr("stroke-width", 4)
//                      .attr("stroke", "red")

//                      d3.select("#_lineplot_highlighted_ds2_" + d.key.toString())
//                      .raise()
//                      .attr("stroke-width", 4)
//                      .attr("stroke", "red")

//                      tip
//                          .style("opacity", 0.9)

//                      tip.html(d.key)
//                          .style("left", (d3.event.pageX) + "px")     
//                          .style("top", (d3.event.pageY - 28) + "px")
                           
//                  })
//           .on("mouseout", function(d){                

//                      d3.select("#_lineplot_higlighted_ds1_" + d.key.toString())
//                      .raise()
//                      .attr("stroke-width", 2)
//                      .attr("stroke", "red")

//                      d3.select("#_lineplot_highlighted_ds2_" + d.key.toString())
//                      .raise()
//                      .attr("stroke-width", 2)
//                      .attr("stroke", "red")

//                      tip
//                          .style("opacity", 0)
//                  })
//           .on("click", function(d){
//                             window.open("https://www.ncbi.nlm.nih.gov/gene/?term=" + d.key.toString());
//                         })



// }


// /**
//  * 
//  * @param {ObjectArray} data 
//  * @param {String} experimentId 
//  * @param {Boolean} isSelected 
//  */
// function getDataForProfileDiagramCombined(data, experimentId, isSelected){

//   let dataSelectedNonSelectedCombined = getSelectedNonSelectedProfilesCombined(data.selection, experimentId, isSelected);

//   let dataSubsetLong = wideToLong(dataSelectedNonSelectedCombined, experimentId, false);

//   let dataSubsetNested = nestData(dataSubsetLong, "gene");

//   return dataSubsetNested;
// }


// /**
//  * 
//  * @param {ObjectArray} data 
//  * @param {String} experimentId 
//  * @param {Boolean} isSelected 
//  */
// function getSelectedNonSelectedProfilesCombined(data, experimentId, isSelected){

//     let filteredTmpData = data.filter(function (d) {

//         return ((d[experimentId + "_cluster"] !== null) && d[experimentId + "_cluster"].startsWith(experimentId) && (d.profile_selected === isSelected))
//     });

//     return filteredTmpData;
// }



/**
 * 
 * @param {ObjectArray} data 
 * @param {String} experimentId 
 * @param {int} clusterNumber 
 * @param {Boolean} isSelected 
 */
function getDataForProfileDiagram(data, experimentId, clusterNumber, isSelected){

	let dataSelectedNonSelected = getSelectedNonSelectedProfiles(data.data, experimentId, clusterNumber, isSelected);

	let dataSubsetLong = wideToLong(dataSelectedNonSelected, experimentId, false);

	let dataSubsetNested = nestData(dataSubsetLong, "gene");

    return dataSubsetNested;
}


/**
 * 
 * @param {ObjectArray} data 
 * @param {String} experimentId 
 * @param {int} clusterNumber 
 * @param {Boolean} isSelected 
 */
function getSelectedNonSelectedProfiles(data, experimentId, clusterNumber, isSelected){

    let filteredTmpData = data.filter(function (d) {
        return (d[experimentId + "_cluster"] === (experimentId + "_" + clusterNumber) && (d.profile_selected === isSelected))
    });

    return filteredTmpData;
}


