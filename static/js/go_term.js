bar_margin = {top: 10, right: 20, bottom: 40, left: 80};



/**
 * retrieved the currently supported genomes from PantherDB
 * @param {String} parentDivId 
 * @param {ObjectArray} data 
 * @param {String} tabId 
 */
function supportedGenomes(parentDivId, data, tabId){

    axios.get("http://pantherdb.org/services/oai/pantherdb/supportedgenomes")
        .then(function (response) {
          
            let result = response.data.search.output.genomes.genome;

            let resultArray = result.map(d => d.long_name);

            // fill li attributes of given dropdown
            createDropdown(parentDivId, resultArray);

            buttonClick(response, data, parentDivId, tabId);
        })
}

/**
 * 
 * @param {*} response 
 * @param {*} data 
 * @param {*} parentDivId 
 * @param {*} tabId 
 */
function buttonClick(response, data, parentDivId, tabId){

    $(document).on('click', '.go-dropdown-menu-a', function (event) {
    
    let chosen = ($(this).text());

    globalSelectionToPanther(chosen, data, response, parentDivId, tabId);

    });
}


/**
 * 
 * @param {Array} selection 
 */
function genesInSelectionToString(selection){
    let geneArray = selection.map(d => d.gene)

    return geneArray.join("")
}


/**
 * 
 * @param {Array} selection 
 */
function genesInSelectionToString(selection){

    let geneArray = selection.map( d => d.gene);

    let allGenesModified = [];
    let final = [];

    for(i=0; i<geneArray.length; i++){
        final.push(geneArray[i])

        if(i===0){
            allGenesModified.push(geneArray[i]);
        }

        else{
            allGenesModified.push("%20" + geneArray[i])
        }
    }

    return allGenesModified.toString();
}


/**
 * requests data for the current selection
 * @param {String} organism 
 * @param {ObjectArray} data 
 * @param {Object} response 
 * @param {String} parentDivId 
 * @param {String} tabId 
 */
function globalSelectionToPanther(organism, data, response, parentDivId, tabId){

    let url = 'http://pantherdb.org/services/oai/pantherdb/enrich/overrep?';
    
    let annotDataSetMolFunc = "annotDataSet=GO%3A0003674";
    
    let annotDataSetBioProc = "annotDataSet=GO%3A0008150";
    
    let annotDataSetCellComp = "annotDataSet=GO%3A0005575";
    
    let enrichmentTestType= "enrichmentTestType=FISHER";
    
    let correction= "correction=FDR";

    let geneInputList = "geneInputList=" + genesInSelectionToString(data);

    let taxonId = "organism=";

    for(row of response.data.search.output.genomes.genome){
        if(row.long_name === organism){
            taxonId += row.taxon_id;
            break;
        }
    }

    let id = parentDivId.split("-")[3];

    let molFuncDiv = "";
    let bioProcDiv = "";
    let cellCompDiv = "";

    if(tabId === TabId.selectionIntersecting){

        molFuncDiv = "selection-intersecting-diagrams-go-molfunc-" + id;
        bioProcDiv = "selection-intersecting-diagrams-go-bioproc-" + id;
        cellCompDiv = "selection-intersecting-diagrams-go-cellcomp-" + id;
    }

    if(tabId === TabId.selectionNonIntersecting){

        molFuncDiv = "selection-nonIntersecting-diagrams-go-molfunc-" + id;
        bioProcDiv = "selection-nonIntersecting-diagrams-go-bioproc-" + id;
        cellCompDiv = "selection-nonIntersecting-diagrams-go-cellcomp-" + id;
    }

    postQuery(url, 
        geneInputList,
        taxonId,
        annotDataSetMolFunc,
        enrichmentTestType,
        correction,
        1, 
        molFuncDiv, 
        "GO:0003674", 
        "MolFunc",
        parentDivId);

    postQuery(url, 
        geneInputList,
        taxonId,
        annotDataSetBioProc,
        enrichmentTestType,
        correction,
        1, 
        bioProcDiv, 
        "GO:0008150", 
        "BioProc",
        parentDivId);
    
    postQuery(url, 
        geneInputList,
        taxonId,
        annotDataSetCellComp,
        enrichmentTestType,
        correction,
        1, 
        cellCompDiv, 
        "GO:0005575", 
        "CellComp",
        parentDivId);
}


/**
 * 
 * @param {Array} speciesArray 
 */
function removeDots(speciesArray){
    return speciesArray.map(d => d.replaceAll(".", ""));
}

/**
 * 
 * @param {Array} speciesNameArray 
 * @param {String} replaceWith 
 */
function replaceWhiteSpacesInSpeciesNames(speciesNameArray, replaceWith){
    return speciesNameArray.map(d => d.replaceAll(" ", replaceWith));
}

/**
 * 
 * @param {String} speciesName 
 * @param {String} replacedWith 
 */
function addWhiteSpacesToSpeciesName(speciesName, replacedWith){
    return speciesName.replaceAll(replacedWith, " ");
}


/**
 * 
 * @param {String} parentDivId 
 * @param {Array} array 
 */
function createDropdown(parentDivId, array){

    let buttonUl = document.getElementById(parentDivId);

    // remove space in order to set it as letiable name
    let replacedArray = removeDots(replaceWhiteSpacesInSpeciesNames(array, "_"));

    for(let entry of replacedArray){

        //new li element
        eval( "var li_" + entry + " = document.createElement('LI')" );
        eval( "li_" + entry + ".setAttribute('id', 'li_" + parentDivId + "_" + entry + "')" );

        //new a element
        eval( "var a_" + entry + " = document.createElement('A')" );
        eval( "a_" + entry + ".setAttribute('class', 'go-dropdown-menu-a')" );
        eval( "a_" + entry + ".setAttribute('id', 'a_" + parentDivId + "_" + entry + "')" );
        eval( "a_" + entry + ".setAttribute('value', 'a_" + addWhiteSpacesToSpeciesName(entry, "_") + "')" );
        eval( "a_" + entry + ".setAttribute('href', '#' )" );

        //new a text element
        eval( "var aText_" + entry + " = document.createTextNode('" + addWhiteSpacesToSpeciesName(entry, "_") + "')" );
        eval( "a_" + entry + ".appendChild(aText_" + entry + ")" )

        //append a to li
        eval( "li_" + entry + ".appendChild(a_" + entry + ")" );

        //append li to ul
        eval( "buttonUl.appendChild(li_" + entry + ")" );
    }
}



/**
 * 
 * @param {Object} goResults 
 */
function flattenGoResults(goResults){

    let flatGoResults = [];

    for(let result of goResults){
        result['id'] = result['term']['id'];
        result['label'] = result['term']['label'];
        result['minus_log10_fdr'] = result['term']['minus_log10_fdr'];

        flatGoResults.push(result);
    }

    return flatGoResults;
}


function categoryFromId(id){

    if(id === "annotDataSet=GO%3A0003674"){
        return "molecularFunction";
    }

    if(id === "annotDataSet=GO%3A0008150"){
        return "biologicalProcess";
    }

    if(id === "annotDataSet=GO%3A0005575"){
        return "cellularComponent";
    }
}



/**
 * 
 * @param {String} url 
 * @param {Array} inputList 
 * @param {String} organism 
 * @param {String} category 
 * @param {String} enrichmentTestType 
 * @param {String} correction 
 * @param {float} fdr_threshold 
 * @param {String} div 
 * @param {String} category_id 
 * @param {String} category_name 
 * @param {String} parentDivId 
 */
function postQuery(url, inputList, organism, category, enrichmentTestType, correction, fdr_threshold, div, category_id, category_name, parentDivId){

    axios.get(url + inputList + "&" + organism + "&" + category + "&" + enrichmentTestType + "&" + correction)
        .then(function (response) {

            let tab = parentDivId.split("-")[3];
            let combination = tab.split("_")[0]
            let comparisonId = tab.split("_")[1];

            if(comparisonId === "selectionIntersecting"){
                comparisonId = "intersecting";
            }

            if(comparisonId === "selectionNonIntersecting"){
                comparisonId = "nonIntersecting";
            }

            let goResults = response.data.results.result;

            let globalDataCopy = createDeepCopyofData(document.getElementById("data-json").value);


            globalDataCopy[combination][comparisonId]['go'][categoryFromId(category)] = flattenGoResults(goResults);

            // handle success
            smaller_threshold_fdr = [];

            for(row of response.data.results.result){
                if(row.fdr <= fdr_threshold){
                    smaller_threshold_fdr.push(row);
                }
            }

            // bar chart here
            GoTermBarCharts(smaller_threshold_fdr, div, category_id, category_name)
        });
}


/**
 * 
 * @param {ObjectArray} sorted_values 
 * @param {String} div 
 * @param {String} category_id 
 * @param {String} category_name 
 */
function horizontalBarCharts(sorted_values, div, category_id, category_name){

    let bar_width = document.getElementById(div).offsetWidth;
    let bar_height = document.getElementById(div).offsetHeight;

    d3.select("#bar_" + div).remove();

    let svgBar = d3.select("#" + div)
            .append("div")
            // Container class to make it responsive.
            .classed("svg-container", false)
            .append("svg")
            // Responsive SVG needs these 2 attributes and no width and height attr.
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + bar_width +  " " + bar_height)
            // Class to make it responsive.
            .classed("svg-content-responsive", false)
            // Fill with a rectangle for visualization.
            .attr("id", "bar_" + div);

    let g = svgBar.append("g")
            .attr("transform", "translate(" + bar_margin.left + "," + bar_margin.top + ")");

    let y = d3.scaleBand()
        .rangeRound([bar_margin.top, bar_height-bar_margin.bottom])
        .paddingInner(0.1)
        .align(0.1);

    let x = d3.scaleLinear()
        .range([0, bar_width-bar_margin.right-bar_margin.left])

    y.domain(sorted_values.map(function (d) { return d.id}));
    x.domain([0, d3.max(sorted_values.map(function(d) { return d.minus_log10_fdr }))]);

    g.append("g")
        .selectAll(".bar")
        .data(sorted_values)
        .enter()
        .append("g")
        .attr("fill", "grey")
        .append("rect")
        .attr("y", function (d) {
            return y(d.id);
        })
        .attr("x", 0)
        .attr("width", function (d) {
            return x(d.minus_log10_fdr);
        })
        .attr("height", y.bandwidth())
        .append("title")
        .text(d => d.id + "\n" + d.label);

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,0)")
        .call(d3.axisLeft(y));

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (bar_height-bar_margin.bottom) + ")")
        //.call(d3.axisBottom(x).ticks(null, "s"))
        .call(d3.axisBottom(x))
        .append("text")
        .attr("y", 2)
        .attr("fill", "#000")

    g.append("text")
        .attr("x", ((bar_width-bar_margin.right)/2))
        .attr("y", 0 - (bar_margin.top/5))
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text(category_id + "-" + category_name);

    g.append("text")
        .attr("x", ((bar_width-bar_margin.right)/2))
        .attr("y", (bar_height-(bar_margin.bottom/3)))
        .attr("text-anchor", "middle")
        .style("font-size", "8px")
        .text("-log10(FDR)");
}


/**
 * 
 * @param {Object} panther_results 
 * @param {String} div 
 * @param {String} category_id 
 * @param {String} category_name 
 */
function GoTermBarCharts(panther_results, div, category_id, category_name){

    // restrict to 10 largest values
    panther_results = panther_results.slice(0,9);

    // -log10 transform values
    go_terms = [];

    for(entry of panther_results){
        entry.term.minus_log10_fdr = -Math.log10(entry.fdr)
        go_terms.push(entry.term)
    }

    // sort values decreasingly
    go_terms = go_terms.sort((a,b) => (a.minus_log10_fdr <= b.minus_log10_fdr) ? 1 : -1 )

    horizontalBarCharts(go_terms, div, category_id, category_name)

    // show max. 20 values

    // horizontal bar charts

}


