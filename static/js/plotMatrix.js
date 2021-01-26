
// /**
//   *
//   */
// function getFileCount(){
// 	let files = [];


// 	for(combination of Object.keys(globalData)){
// 		files.push(combination.split('_')[0] + '_' + combination.split('_')[1])
// 		files.push(combination.split('_')[2] + '_' + combination.split('_')[3])
// 	}

// 	let set = new Set(files);

// 	return set.size;
// }


// /**
//   *
//   * @param{String} divID
//   */
// function initPlotMatrix(divID){

// 	// get Div in which the matrix should be embedded
// 	let selectedDiv = document.getElementById(divID);

// 	let newWrapperDiv = document.createElement("DIV");
// 	newWrapperDiv.setAttribute("id", divID + "-wrapper");
// 	newWrapperDiv.style.position = "relative";
// 	newWrapperDiv.style.width = "100%";
// 	newWrapperDiv.style.height = "100%";

// 	// get number of experiments to determine the number of rows and cols in the matrix
// 	let colRowNumber = getFileCount()-1;

// 	for(i = 1; i <= colRowNumber; i++){
		
// 		tmpRow = document.createElement("DIV");
// 		tmpRow.setAttribute("id", divID + "_matrixRow" + i);
// 		tmpRow.setAttribute("class", divID + "_matrixRow");
// 		tmpRow.style.position = "relative";
// 		tmpRow.style.display = "flex";
// 		tmpRow.style.height = (100/colRowNumber - 5) + "%";
// 		tmpRow.style.width = "100%";
// 		tmpRow.style.marginBottom = "1%";


// 		for(j = 1; j <= colRowNumber; j++){
		
// 			tmpCell = document.createElement("DIV")
// 			tmpCell.setAttribute("id", divID + "_file_" + j + "_file_" + (colRowNumber + 2 - i));
// 			tmpCell.setAttribute("class", divID + "_cell");
// 			tmpCell.style.position = "relative";
// 			tmpCell.style.height = "100%";
// 			tmpCell.style.width = (100/colRowNumber - 1) + "%";
// 			tmpCell.style.marginLeft = "1%";

// 			tmpRow.appendChild(tmpCell);
// 		}

// 		newWrapperDiv.appendChild(tmpRow);
// 	}

// 	//selectedDiv.appendChild(newWrapperDiv)

// 	return $.Deferred().resolve();
// }



// /**
//   *
//   * @param{String} divId
//   */
// function createPills(divID){

// 	let textSize = "10px";

// 	let currentParentDiv = document.getElementById(divID);

// 	let currentFiles = divID.split("_");

// 	let comparison = currentFiles[1] + "_" + currentFiles[2] + "_" + currentFiles[3] + "_" + currentFiles[4];

// 	let intersectingGenesCount = globalData[comparison]['info']['intersecting_genes']['genes'].length;

// 	let firstFileGeneCount = globalData[comparison]['info'][currentFiles[1] + "_" + currentFiles[2] + '_only']['genes'].length;
// 	let secondFileGeneCount = globalData[comparison]['info'][currentFiles[3] + "_" + currentFiles[4] + '_only']['genes'].length;

// 	let trendCount = globalData[comparison]['k'];

// 	let firstFileName = globalData[comparison]['info'][currentFiles[1] + "_" + currentFiles[2]]['filename'];
// 	let secondFileName = globalData[comparison]['info'][currentFiles[3] + "_" + currentFiles[4]]['filename'];

// 	let description = document.createElement("P");
// 	description.style.margin = "0px 0px 0px 0px";
// 	description.style.textAlign = "center";
// 	description.style.color = "#707070";
// 	description.style.fontSize = textSize;
// 	description.style.fontWeight = 400;
// 	description.style.letterSpacing = "1px";
// 	description.style.fontSize = "10px";
// 	description.appendChild(document.createTextNode(
// 		currentFiles[1] + "_" + 
// 		currentFiles[2] + 
// 		" (" +
// 		firstFileName + 
// 		") vs. " + 
// 		currentFiles[3] + "_" + 
// 		currentFiles[4] + 
// 		" (" + 
// 		secondFileName + 
// 		")"));

// 	let currentCellPills = document.createElement("UL");
// 	currentCellPills.setAttribute("class", "nav nav-pills mb-3");
// 	currentCellPills.setAttribute("id", divID + "-pills-tab");
// 	currentCellPills.setAttribute("role", "tablist");

// 	let intersectingNavItem = document.createElement("LI");
// 	intersectingNavItem.setAttribute("class", "nav-item");
// 	intersectingNavItem.setAttribute("id", divID + "-intersect-nav-item");

// 	let nonIntersectingNavItem = document.createElement("LI");
// 	nonIntersectingNavItem.setAttribute("class", divID + "nav-item");
// 	nonIntersectingNavItem.setAttribute("id", divID + "-non-intersect-nav-item");

// 	let intersectingA = document.createElement("A");
// 	intersectingA.appendChild(document.createTextNode("Intersecting"));
// 	intersectingA.setAttribute("class", "nav-link active matrix");
// 	intersectingA.setAttribute("id", divID + "-intersect-pills");
// 	intersectingA.setAttribute("data-toggle", "pill");
// 	intersectingA.setAttribute("href", "#" + divID + "-intersect");
// 	intersectingA.setAttribute("role", "tab");
// 	intersectingA.setAttribute("aria-controls", divID + "-intersect");

// 	let nonIntersectingA = document.createElement("A");
// 	nonIntersectingA.appendChild(document.createTextNode("Non-Intersecting"));
// 	nonIntersectingA.setAttribute("class", "nav-link matrix");
// 	nonIntersectingA.setAttribute("id", divID + "-non-intersect-pills");
// 	nonIntersectingA.setAttribute("data-toggle", "pill");
// 	nonIntersectingA.setAttribute("href", "#" + divID + "-non-intersect");
// 	nonIntersectingA.setAttribute("role", "tab");
// 	nonIntersectingA.setAttribute("aria-controls", divID + "-non-intersect");

// 	let tabHeight = currentParentDiv.offsetHeight;
// 	let remainingHeight = tabHeight - 70;

// 	let tabContent = document.createElement("DIV");
// 	tabContent.setAttribute("class", "tab-content");
// 	tabContent.setAttribute("id", divID + "-tabContent");

	

// 	/**
// 	 * INTERSECTING GENES
// 	 */
// 	let intersectingWrapper = document.createElement("DIV");
// 	intersectingWrapper.setAttribute("id", divID + "-intersecting-wrapper");
// 	intersectingWrapper.setAttribute("class", "intersecting-wrapper");
// 	intersectingWrapper.style.height = remainingHeight + "px";
// 	intersectingWrapper.style.position = "relative";

// 	let intersectingDataWrapper = document.createElement("DIV");
// 	intersectingDataWrapper.setAttribute("id", divID + "-intersect-data");
// 	intersectingDataWrapper.style.width = "100%";
// 	intersectingDataWrapper.style.height = "100%";
// 	intersectingDataWrapper.style.position = "relative";
// 	intersectingDataWrapper.style.padding = "0.5%";

// 	let intersectingTabContentPanel = document.createElement("DIV");
// 	intersectingTabContentPanel.setAttribute("class", "tab-pane fade show active");
// 	intersectingTabContentPanel.setAttribute("id", divID + "-intersect");
// 	intersectingTabContentPanel.setAttribute("role", "tabpanel");
// 	intersectingTabContentPanel.setAttribute("aria-labelledby", divID + "-intersect-pills");

// 	let intersectingDataHeaderGeneInfo = document.createElement("DIV");
// 	intersectingDataHeaderGeneInfo.setAttribute("id", divID + "-intersect-data-header-gene-info")
// 	intersectingDataHeaderGeneInfo.style.width = "100%";
// 	intersectingDataHeaderGeneInfo.style.height = "5%";
// 	intersectingDataHeaderGeneInfo.style.position = "relative";
// 	intersectingDataHeaderGeneInfo.style.padding = "0.5%";
// 	intersectingDataHeaderGeneInfo.style.textAlign = "center";
// 	intersectingDataHeaderGeneInfo.style.fontSize = textSize;
// 	intersectingDataHeaderGeneInfo.style.fontWeight = 400;
// 	intersectingDataHeaderGeneInfo.style.textTransform = "uppercase";
// 	intersectingDataHeaderGeneInfo.style.letterSpacing = "1px";

// 	let intersectingDataHeaderGeneInfoText = document.createTextNode(
// 		intersectingGenesCount + " intersecting genes following " + trendCount + " trends"
// 	);

// 	let intersectingDataHeaderTrends = document.createElement("DIV");
// 	intersectingDataHeaderTrends.setAttribute("id", divID + "-intersect-data-header-trends")
// 	intersectingDataHeaderTrends.style.width = "100%";
// 	intersectingDataHeaderTrends.style.height = "5%";
// 	intersectingDataHeaderTrends.style.position = "relative";
// 	intersectingDataHeaderTrends.style.padding = "0.5%";
// 	intersectingDataHeaderTrends.style.margin= "1%";
// 	intersectingDataHeaderTrends.style.display = "flex";

// 	let intersectingDataHeaderTrendsFile1 = document.createElement("DIV");
// 	intersectingDataHeaderTrendsFile1.setAttribute("id", divID + "-intersect-data-header-trends-file1")
// 	intersectingDataHeaderTrendsFile1.style.width = "25%";
// 	intersectingDataHeaderTrendsFile1.style.height = "100%";
// 	intersectingDataHeaderTrendsFile1.style.position = "relative";
// 	intersectingDataHeaderTrendsFile1.style.padding = "0.5%";
// 	intersectingDataHeaderTrendsFile1.style.textAlign = "center";
// 	intersectingDataHeaderTrendsFile1.style.fontSize = textSize;
// 	intersectingDataHeaderTrendsFile1.style.fontWeight = 400;
// 	intersectingDataHeaderTrendsFile1.style.textTransform = "uppercase";
// 	intersectingDataHeaderTrendsFile1.style.letterSpacing = "1px";

// 	let intersectingDataHeaderTrendsFile1Text = document.createTextNode(
// 		"Trends " + currentFiles[1] + "_" + currentFiles[2]
// 	);

// 	let intersectingDataHeaderTrendsComparison = document.createElement("DIV");
// 	intersectingDataHeaderTrendsComparison.setAttribute("id", divID + "-intersect-data-header-trends-comparison")
// 	intersectingDataHeaderTrendsComparison.style.width = "50%";
// 	intersectingDataHeaderTrendsComparison.style.height = "100%";
// 	intersectingDataHeaderTrendsComparison.style.position = "relative";
// 	intersectingDataHeaderTrendsComparison.style.padding = "0.5%";
// 	intersectingDataHeaderTrendsComparison.style.textAlign = "center";
// 	intersectingDataHeaderTrendsComparison.style.fontSize = textSize;
// 	intersectingDataHeaderTrendsComparison.style.fontWeight = 400;
// 	intersectingDataHeaderTrendsComparison.style.textTransform = "uppercase";
// 	intersectingDataHeaderTrendsComparison.style.letterSpacing = "1px";

// 	let intersectingDataHeaderTrendsComparisonText = document.createTextNode(
// 		"Trend Comparison"
// 	);

// 	let intersectingDataHeaderTrendsFile2 = document.createElement("DIV");
// 	intersectingDataHeaderTrendsFile2.setAttribute("id", divID + "-intersect-data-header-trends-file2")
// 	intersectingDataHeaderTrendsFile2.style.width = "25%";
// 	intersectingDataHeaderTrendsFile2.style.height = "100%";
// 	intersectingDataHeaderTrendsFile2.style.position = "relative";
// 	intersectingDataHeaderTrendsFile2.style.padding = "0.5%";
// 	intersectingDataHeaderTrendsFile2.style.textAlign = "center";
// 	intersectingDataHeaderTrendsFile2.style.fontSize = textSize;
// 	intersectingDataHeaderTrendsFile2.style.fontWeight = 400;
// 	intersectingDataHeaderTrendsFile2.style.textTransform = "uppercase";
// 	intersectingDataHeaderTrendsFile2.style.letterSpacing = "1px";

// 	let intersectingDataHeaderTrendsFile2Text = document.createTextNode(
// 		"Trends " + currentFiles[3] + "_" + currentFiles[4]
// 	);
	
// 	let intersectingDataDiagrams = document.createElement("DIV");
// 	intersectingDataDiagrams.setAttribute("id", divID + "-intersect-data-diagrams")
// 	intersectingDataDiagrams.style.width = "100%";
// 	intersectingDataDiagrams.style.height = "90%";
// 	intersectingDataDiagrams.style.position = "relative";
// 	intersectingDataDiagrams.style.padding = "0.5%";
// 	intersectingDataDiagrams.style.display = "flex";

// 	let intersectingDataDiagramsLeft = document.createElement("DIV");
// 	intersectingDataDiagramsLeft.setAttribute("id", divID + "-intersect-data-diagrams-left")
// 	intersectingDataDiagramsLeft.style.width = "25%";
// 	intersectingDataDiagramsLeft.style.height = "100%";
// 	intersectingDataDiagramsLeft.style.position = "relative";
// 	intersectingDataDiagramsLeft.style.padding = "0.5%";
// 	intersectingDataDiagramsLeft.style.paddingBottom = "1.5%";
// 	intersectingDataDiagramsLeft.style.paddingLeft = "1.5%";
// 	intersectingDataDiagramsLeft.style.paddingRight = "1.5%";

// 	let intersectingDataDiagramsSankey = document.createElement("DIV");
// 	intersectingDataDiagramsSankey.setAttribute("id", divID + "-intersect-data-diagrams-sankey")
// 	intersectingDataDiagramsSankey.style.width = "50%";
// 	intersectingDataDiagramsSankey.style.height = "100%";
// 	intersectingDataDiagramsSankey.style.position = "relative";
// 	intersectingDataDiagramsSankey.style.paddingBottom = "1.5%";
// 	intersectingDataDiagramsSankey.style.paddingLeft = "1.5%";
// 	intersectingDataDiagramsSankey.style.paddingRight = "1.5%";

// 	let intersectingDataDiagramsRight = document.createElement("DIV");
// 	intersectingDataDiagramsRight.setAttribute("id", divID + "-intersect-data-diagrams-right")
// 	intersectingDataDiagramsRight.style.width = "25%";
// 	intersectingDataDiagramsRight.style.height = "100%";
// 	intersectingDataDiagramsRight.style.position = "relative";
// 	intersectingDataDiagramsRight.style.padding = "0.5%";
// 	intersectingDataDiagramsRight.style.paddingBottom = "1.5%";
// 	intersectingDataDiagramsRight.style.paddingLeft = "1.5%";
// 	intersectingDataDiagramsRight.style.paddingRight = "1.5%";


// 	/**
// 	 * NON-INTERSECTING GENES
// 	 */	

// 	let nonIntersectingWrapper = document.createElement("DIV");
// 	nonIntersectingWrapper.setAttribute("id", divID + "-non-intersecting-wrapper");
// 	nonIntersectingWrapper.setAttribute("class", "non-intersecting-wrapper");
// 	nonIntersectingWrapper.style.height = remainingHeight + "px";
// 	nonIntersectingWrapper.style.position = "relative";

// 	let nonIntersectingTabContentPanel = document.createElement("DIV");
// 	nonIntersectingTabContentPanel.setAttribute("class", "tab-pane fade active");
// 	nonIntersectingTabContentPanel.setAttribute("id", divID + "-non-intersect");
// 	nonIntersectingTabContentPanel.setAttribute("role", "tabpanel");
// 	nonIntersectingTabContentPanel.setAttribute("aria-labelledby", divID + "-non-intersect-pills");

// 	let nonIntersectingDataWrapper = document.createElement("DIV");
// 	nonIntersectingDataWrapper.setAttribute("id", divID + "-non-intersect-data");
// 	nonIntersectingDataWrapper.style.width = "100%";
// 	nonIntersectingDataWrapper.style.height = "100%";
// 	nonIntersectingDataWrapper.style.position = "relative";
// 	nonIntersectingDataWrapper.style.padding = "0.5%";
	

// 	let nonIntersectingDataHeaderGeneInfo = document.createElement("DIV");
// 	nonIntersectingDataHeaderGeneInfo.setAttribute("id", divID + "-non-intersect-data-header-gene-info")
// 	nonIntersectingDataHeaderGeneInfo.style.width = "100%";
// 	nonIntersectingDataHeaderGeneInfo.style.height = "5%";
// 	nonIntersectingDataHeaderGeneInfo.style.position = "relative";
// 	nonIntersectingDataHeaderGeneInfo.style.padding = "0.5%";
// 	nonIntersectingDataHeaderGeneInfo.style.textAlign = "center";
// 	nonIntersectingDataHeaderGeneInfo.style.fontSize = textSize;
// 	nonIntersectingDataHeaderGeneInfo.style.fontWeight = 400;
// 	nonIntersectingDataHeaderGeneInfo.style.textTransform = "uppercase";
// 	nonIntersectingDataHeaderGeneInfo.style.letterSpacing = "1px";

// 	let nonIntersectingDataHeaderGeneInfoText = document.createTextNode(
// 		firstFileGeneCount + secondFileGeneCount + " non-intersecting genes following " + trendCount + " trends"
// 	);

// 	let nonIntersectingDataHeaderTrends = document.createElement("DIV");
// 	nonIntersectingDataHeaderTrends.setAttribute("id", divID + "-non-intersect-data-header-trends")
// 	nonIntersectingDataHeaderTrends.style.width = "100%";
// 	nonIntersectingDataHeaderTrends.style.height = "5%";
// 	nonIntersectingDataHeaderTrends.style.position = "relative";
// 	nonIntersectingDataHeaderTrends.style.padding = "0.5%";
// 	nonIntersectingDataHeaderTrends.style.display = "flex";

// 	let nonIntersectingDataHeaderTrendsFile1 = document.createElement("DIV");
// 	nonIntersectingDataHeaderTrendsFile1.setAttribute("id", divID + "-non-intersect-data-header-trends-file1")
// 	nonIntersectingDataHeaderTrendsFile1.style.width = "50%";
// 	nonIntersectingDataHeaderTrendsFile1.style.height = "100%";
// 	nonIntersectingDataHeaderTrendsFile1.style.position = "relative";
// 	nonIntersectingDataHeaderTrendsFile1.style.padding = "0.5%";
// 	nonIntersectingDataHeaderTrendsFile1.style.textAlign = "center";
// 	nonIntersectingDataHeaderTrendsFile1.style.fontSize = textSize;
// 	nonIntersectingDataHeaderTrendsFile1.style.fontWeight = 400;
// 	nonIntersectingDataHeaderTrendsFile1.style.textTransform = "uppercase";
// 	nonIntersectingDataHeaderTrendsFile1.style.letterSpacing = "1px";

// 	let nonIntersectingDataHeaderTrendsFile1Text = document.createTextNode(
// 		"Trends " + currentFiles[1] + "_" + currentFiles[2] + (" (" + firstFileGeneCount + " Genes)")
// 	);
	
// 	let nonIntersectingDataHeaderTrendsFile2 = document.createElement("DIV");
// 	nonIntersectingDataHeaderTrendsFile2.setAttribute("id", divID + "-non-intersect-data-header-trends-file2")
// 	nonIntersectingDataHeaderTrendsFile2.style.width = "50%";
// 	nonIntersectingDataHeaderTrendsFile2.style.height = "100%";
// 	nonIntersectingDataHeaderTrendsFile2.style.position = "relative";
// 	nonIntersectingDataHeaderTrendsFile2.style.padding = "0.5%";
// 	nonIntersectingDataHeaderTrendsFile2.style.textAlign = "center";
// 	nonIntersectingDataHeaderTrendsFile2.style.fontSize = textSize;
// 	nonIntersectingDataHeaderTrendsFile2.style.fontWeight = 400;
// 	nonIntersectingDataHeaderTrendsFile2.style.textTransform = "uppercase";
// 	nonIntersectingDataHeaderTrendsFile2.style.letterSpacing = "1px";

// 	let nonIntersectingDataHeaderTrendsFile2Text = document.createTextNode(
// 		"Trends " + currentFiles[3] + "_" + currentFiles[4] + (" (" + secondFileGeneCount + " Genes)")
// 	);

// 	let nonIntersectingDataDiagrams = document.createElement("DIV");
// 	nonIntersectingDataDiagrams.setAttribute("id", divID + "-non-intersect-data-diagrams")
// 	nonIntersectingDataDiagrams.style.width = "100%";
// 	nonIntersectingDataDiagrams.style.height = "90%";
// 	nonIntersectingDataDiagrams.style.position = "relative";
// 	nonIntersectingDataDiagrams.style.padding = "0.5%";
// 	nonIntersectingDataDiagrams.style.display = "flex";

// 	let nonIntersectingDataDiagramsLeft = document.createElement("DIV");
// 	nonIntersectingDataDiagramsLeft.setAttribute("id", divID + "-non-intersect-data-diagrams-left")
// 	nonIntersectingDataDiagramsLeft.style.width = "50%";
// 	nonIntersectingDataDiagramsLeft.style.height = "100%";
// 	nonIntersectingDataDiagramsLeft.style.position = "relative";
// 	nonIntersectingDataDiagramsLeft.style.padding = "0.5%";

// 	let nonIntersectingDataDiagramsRight = document.createElement("DIV");
// 	nonIntersectingDataDiagramsRight.setAttribute("id", divID + "-non-intersect-data-diagrams-right")
// 	nonIntersectingDataDiagramsRight.style.width = "50%";
// 	nonIntersectingDataDiagramsRight.style.height = "100%";
// 	nonIntersectingDataDiagramsRight.style.position = "relative";
// 	nonIntersectingDataDiagramsRight.style.padding = "0.5%";



// 		/**
// 	 * APPEND INTERSECTING CHILDS
// 	 */

// 	intersectingDataHeaderTrendsFile1.appendChild(intersectingDataHeaderTrendsFile1Text);
// 	intersectingDataHeaderTrendsComparison.appendChild(intersectingDataHeaderTrendsComparisonText);
// 	intersectingDataHeaderTrendsFile2.appendChild(intersectingDataHeaderTrendsFile2Text);

// 	intersectingDataHeaderTrends.appendChild(intersectingDataHeaderTrendsFile1);
// 	intersectingDataHeaderTrends.appendChild(intersectingDataHeaderTrendsComparison);
// 	intersectingDataHeaderTrends.appendChild(intersectingDataHeaderTrendsFile2);

// 	intersectingDataDiagrams.appendChild(intersectingDataDiagramsLeft);
// 	intersectingDataDiagrams.appendChild(intersectingDataDiagramsSankey);
// 	intersectingDataDiagrams.appendChild(intersectingDataDiagramsRight);

// 	intersectingDataHeaderGeneInfo.appendChild(intersectingDataHeaderGeneInfoText);

// 	intersectingDataWrapper.appendChild(intersectingDataHeaderGeneInfo);
// 	intersectingDataWrapper.appendChild(intersectingDataHeaderTrends);
// 	intersectingDataWrapper.appendChild(intersectingDataDiagrams);

// 	intersectingWrapper.appendChild(intersectingDataWrapper);

// 	intersectingTabContentPanel.appendChild(intersectingWrapper)

// 	tabContent.appendChild(intersectingTabContentPanel);

// 	currentCellPills.appendChild(intersectingNavItem);
// 	intersectingNavItem.appendChild(intersectingA)

// 	currentParentDiv.appendChild(description);
// 	currentParentDiv.appendChild(currentCellPills);
// 	currentParentDiv.appendChild(tabContent);


// 	/**
// 	 * APPEND NON-INTERSECTING CHILDS
// 	 */

// 	nonIntersectingDataHeaderTrendsFile1.appendChild(nonIntersectingDataHeaderTrendsFile1Text);
// 	nonIntersectingDataHeaderTrendsFile2.appendChild(nonIntersectingDataHeaderTrendsFile2Text);

// 	nonIntersectingDataHeaderTrends.appendChild(nonIntersectingDataHeaderTrendsFile1);
// 	nonIntersectingDataHeaderTrends.appendChild(nonIntersectingDataHeaderTrendsFile2);

// 	nonIntersectingDataDiagrams.appendChild(nonIntersectingDataDiagramsLeft);
// 	nonIntersectingDataDiagrams.appendChild(nonIntersectingDataDiagramsRight);

// 	nonIntersectingDataHeaderGeneInfo.appendChild(nonIntersectingDataHeaderGeneInfoText);

// 	nonIntersectingDataWrapper.appendChild(nonIntersectingDataHeaderGeneInfo);
// 	nonIntersectingDataWrapper.appendChild(nonIntersectingDataHeaderTrends);
// 	nonIntersectingDataWrapper.appendChild(nonIntersectingDataDiagrams);

// 	nonIntersectingWrapper.appendChild(nonIntersectingDataWrapper);

// 	nonIntersectingTabContentPanel.appendChild(nonIntersectingWrapper)

// 	tabContent.appendChild(nonIntersectingTabContentPanel);

// 	currentCellPills.appendChild(nonIntersectingNavItem);
// 	nonIntersectingNavItem.appendChild(nonIntersectingA)


// }



