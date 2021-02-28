var fileCount = 2

/**
  *
  */
function getActiveTabs() {
    // get IDs of active tabs
    let active_tabs = Array.prototype.slice.call(document.getElementsByClassName("nav-link active"))

    // get IDs of active content
    let active_content = Array.prototype.slice.call(document.getElementsByClassName("tab-pane fade show active"))

    return { 'active_tabs': active_tabs, 'active_content': active_content }
}


/**
 * 
 * @param {String} tabName 
 */
function removeActivityFromTab(tabName) {

    let currNavTab = document.getElementById("pills-" + tabName.name + "-tab");

    let currDomTokenListTab = currNavTab.classList;
    currDomTokenListTab.remove("active");
    currNavTab.classList = currDomTokenListTab;
}


/**
 * 
 * @param {String} tabName 
 */
function removeActivityFromContent(tabName) {

    let currContent = document.getElementById("pills-" + tabName.name);

    let currDomTokenListContent = currContent.classList;
    currDomTokenListContent.remove("active");
    currDomTokenListContent.remove("show");
    currContent.classList = currDomTokenListContent;
}

/**
 * 
 */
// function activateTransitions(){

//     let allTabs = document.getElementById("pills-tabContent");

//     for(let child of allTabs.children){
        
//         if(child.id.includes("intersecting") || child.id.includes("nonIntersecting")){

//             let tabName = child.id.split("-")[1];

//             let currentButtons = document.getElementById("btn-group btn-group-toggle-" + tabName);

//             for(let button of currentButtons.children){
//                 if(button.id.includes("active")){
//                     //console.log(document.getElementById(button.children[0].id));
//                     button.children[0].click();
//                 }
//             }

//         }
//     }
// }


/**
 * 
 */
function removeActivityFromTabs() {

    let active = getActiveTabs();
    let active_tabs = active.active_tabs;
    let active_content = active.active_content;

    for (let tab of active_tabs) {
        let currDomTokenListTab = tab.classList;
        currDomTokenListTab.remove("active");
        tab.classList = currDomTokenListTab;
    }

    for (let content of active_content) {
        let currDomTokenListContent = content.classList;
        currDomTokenListContent.remove("active");
        currDomTokenListContent.remove("show");
        currDomTokenListContent.add("fade");
        content.classList = currDomTokenListContent;
    }
}


/**
 * 
 * @param {String} tabName 
 */
async function removeContentChildren(tabName) {

    let currContent = document.getElementById("pills-" + tabName.name);

    await removeActivityFromContent(tabName);

    while (currContent.firstChild) {
        currContent.removeChild(currContent.lastChild);
    }

}


/**
 * 
 * @param {String} tabName 
 */
async function removeTabChildren(tabName) {

    let currNavTab = document.getElementById("pills-" + tabName.name + "-tab");

    await removeActivityFromTab(tabName);

    while (currNavTab.firstChild) {
        currNavTab.removeChild(currNavTab.lastChild);
    }

}


/**
 * 
 * @param {String} tabName 
 */
async function removeContent(tabName) {

    // removing tab content
    let currContent = document.getElementById("pills-" + tabName.name);

    await removeContentChildren(tabName);

    currContent.remove()
}


/**
 * 
 * @param {String} tabName 
 */
async function removeTab(tabName) {

    // removing nav tabs
    let currNavTab = document.getElementById("pills-" + tabName.name + "-tab");

    await removeTabChildren(tabName);

    currNavTab.remove()
}


/**
 * 
 * @param {String} tabName 
 */
async function removeTabAndContent(tabName) {

    await removeContent(tabName);

    removeTab(tabName);
}


/**
 * 
 */
function currentlyActiveTabIsClosed() {

    return (getActiveTabs().active_tabs.length === 0) ? true : false;

}


/**
 * 
 */
// function setPrevTabActive(){

//     let allPillsChildren = document.getElementById("pills-tab").childNodes;
//     let allPillsChildrenLi = [];
    
//     for(let li of allPillsChildren){
//         if(li.tagName === "LI"){
//             allPillsChildrenLi.push(li);
//         }
//     }
// }


/**
 * 
 * @param {Array} selection 
 */
function extractLiTags(selection){

    let allTabsLi = [];
    
    for(let li of selection){
        if(li.tagName === "LI"){
            allTabsLi.push(li);
        }
    }

    return allTabsLi;
}


// /**
//  * 
//  * @param {Element} tab 
//  */
// function isHomeTab(tab){

//     return (tab.id === "pills-home-tab") ? true : false;
    
// }


/**
 * 
 * @param {String} tabName 
 */
async function closeTab(tabName) {

    let currentlyClosedLiId = document.getElementById(tabName.parentElement.id).parentElement;

    let allTabs = document.getElementById("pills-tab").childNodes;

    let allTabsLi = extractLiTags(allTabs);

    let index = 0;

    for(let tab of allTabsLi){
        if(tab.id === currentlyClosedLiId.id){
            break;
        }

        else{
            index += 1;
        }
    }

    await (removeTabAndContent(tabName));

    if (currentlyActiveTabIsClosed()) {

        // tab to switch to
        let prevTab = allTabsLi[index-1];

        prevTab.childNodes[0].classList.add("active");
        
        let currentId = prevTab.childNodes[0].id;

        

        //let tabContentId = currentId.split("-")[0] + "-" + currentId.split("-")[1];

        let tabContentId = currentId.split("-")[0] + "-" + currentId.split("-")[1];

        let prevContent = document.getElementById(tabContentId);

        prevContent.classList.add("active");
        prevContent.classList.add("show");

        if(tabContentId === "pills-data_matrix"){
            setIntersectingTabsActive();
        }

    }

    let comparisonId = currentlyClosedLiId.id.split("-")[1].split("_")[0]
    let analysisType = currentlyClosedLiId.id.split("-")[1].split("_")[1]

    removeComparisonFromChosenGlobalData(comparisonId, analysisType)
}


/**
 * 
 * @param {String} tabId 
 */
function navLinkClassByTabId(tabId) {

    if (tabId === "matrix") {
        return "matrix";
    }

    if (tabId === "intersecting" || tabId === "nonIntersecting") {

        return "first";
    }

    if (tabId === "selectionIntersecting" || tabId === "selectionNonIntersecting") {

        return "second";
    }
}


/**
 * 
 * @param {String} tabName 
 * @param {Boolean} hasCloseButton 
 * @param {String} tabId 
 */
async function addTab(tabName, hasCloseButton, tabId) {

    if(tabName === "data"){
        tabName = "Comparison_Overview";
    }

    else{
        tabName = tabName + "_" + tabId;
    }
    

    if (!isValidEnum(TabId, tabId)) {
        alert("invalid tab Id!");
        return;
    }

    if (document.getElementById("pills-" + tabName + "-tab")) {
        alert("Tab already created: " + tabName + "\n" + "close selection first to open new");
    }

    else {
        // remove current activity from tabs

        await removeActivityFromTabs();

        /*
         * TAB-ITEM
         */

        // get current tab list
        let current_tabs = document.getElementById("pills-tab")

        // creat new item
        let new_li = document.createElement("li")
        new_li.setAttribute("id", "pills-" + tabName + "-tab")
        new_li.setAttribute("class", "nav-item")

        let new_li_a = document.createElement("a")
        new_li_a.appendChild(document.createTextNode(tabName.split("_")[0] + " " + tabName.split("_")[1]))
        //new_li_a.appendChild(document.createTextNode(tabName))
        new_li_a.setAttribute("id", "pills-" + tabName + "-tab-a")
        new_li_a.setAttribute("name", tabName)
        new_li_a.setAttribute("class", "nav-link active " + navLinkClassByTabId(tabId))
        new_li_a.setAttribute("data-toggle", "pill")
        new_li_a.setAttribute("href", "#pills-" + tabName)
        new_li_a.setAttribute("role", "tab")
        new_li_a.setAttribute("aria-controls", "pills-" + tabName)
        new_li_a.setAttribute("aria-selected", "false")

        if (hasCloseButton) {
            //new_li_a.appendChild(document.createElement("BUTTON"))

            let curr_button = document.createElement("BUTTON")
            curr_button.setAttribute("id", "button_" + tabName)
            curr_button.setAttribute("name", tabName)
            curr_button.setAttribute("class", "close")
            curr_button.setAttribute("aria-label", "Close")
            curr_button.setAttribute("onclick", "closeTab(this)")

            let span_aria = document.createElement("span")
            span_aria.setAttribute("id", "aria_" + tabName)
            span_aria.setAttribute("aria-hidden", "true")
            span_aria.appendChild(document.createTextNode("×"))

            // adding span aria to button
            curr_button.appendChild(span_aria)

            // adding button to a 
            new_li_a.appendChild(curr_button)
        }

        // appending li to current tab list
        new_li.appendChild(new_li_a)
        current_tabs.appendChild(new_li)

        /*
         * TAB-CONTENT 
         */

        // add tab page
        let current_content = document.getElementById("pills-tabContent")

        // create new item 
        let new_content = document.createElement("div")
        new_content.setAttribute("class", "tab-pane fade show active ")
        new_content.setAttribute("id", "pills-" + tabName)
        new_content.setAttribute("role", "tabpanel")
        new_content.setAttribute("aria-labelledby", "pills-" + tabName + "-tab-a")
        current_content.appendChild(new_content);

        // see app routes in python file (--> load different HTML templates)
        // $("#pills-" + tabName).load("/" + tabId, function () {
        //     loadDataTab(tabName, tabId);
        // })

        $("#pills-" + tabName).delay(250).queue(function(next){
            $(this).load("/" + tabId, function () {
                loadDataTab(tabName, tabId);
                //activateTransitions();
            next();})
        })
    }
}


$("#pills-tab").on('click', 'li#pills-data_matrix-tab', function () {
    let intersectingTabs = $('a[id^="matrix-information_"][id$="-intersect-pills"]:not([id$="non-intersect-pills"])');

    for (let element of intersectingTabs) {
        let elementId = element.id;

        let currentElement = document.getElementById(elementId);

        currentElement.setAttribute("class", "nav-link active matrix");
        currentElement.setAttribute("aria-selected", false);

        elementIdArray = elementId.split("-");
        elementIdArray.pop();
        elementIdString = elementIdArray.join("-");


        let currentDiv = document.getElementById(elementIdString);
        currentDiv.setAttribute("class", "tab-pane fade active show");
    }
});


/**
 * 
 */
function setIntersectingTabsActive(){

    let intersectingTabs = $('a[id^="matrix-information_"][id$="-intersect-pills"]:not([id$="non-intersect-pills"])');

    for (let element of intersectingTabs) {
        let elementId = element.id;

        let currentElement = document.getElementById(elementId);

        currentElement.setAttribute("class", "nav-link active matrix");
        currentElement.setAttribute("aria-selected", false);

        elementIdArray = elementId.split("-");
        elementIdArray.pop();
        elementIdString = elementIdArray.join("-");


        let currentDiv = document.getElementById(elementIdString);
        currentDiv.setAttribute("class", "tab-pane fade active show");
    }

}





/**
 * 
 * @param {String} tabName 
 * @param {String} tabId 
 */
function loadDataTab(tabName, tabId) {

    if (tabId === TabId.matrix) {
        
        //bindDataToDiv(updateYScalesMinMax(createDeepCopyofData(document.getElementById("data-json").value)));
        comparisonOverview(createDeepCopyofData(document.getElementById("data-json").value)); 
    }

    else{
        createInstance(tabName, tabId)
        .then(renderPlots(tabName, tabId))
    }

}


// /**
//  * 
//  * @param {Object} JsonObject 
//  * @param {String} comparison 
//  * @param {String} tabId 
//  * @param {String} key 
//  */
// function JsonToJsObject(JsonObject, comparison, tabId, key) {
//     return JSON.parse(JsonObject[comparison][tabId][key]);
// }


/**
 * 
 * @param {ObjectArray} data 
 */
function isJson(data){
    return typeof data === "string";
}


/**
 * 
 * @param {ObjectArray} data 
 */
function objectToJson(data){
    return JSON.stringify(data);
}


/**
 * 
 * @param {ObjectArray} data 
 */
function bindDataToDiv(data){

    if(data.length === 0){
        alert("Select at least one link to start the second-level analysis!")
    }

    if(!isJson(data)){

        data = objectToJson(data);
    }

    document.getElementById("data-json").value = data;
}


/**
 * adds/removes activity to a given bootstrap tab
 * @param {String} completeTabId 
 */
function openSelectionAccordion(completeTabId) {

	let allAccordions = $("[id*='accordion '][id*='" + completeTabId + "']");

	for (let accordion of allAccordions) {

		// case: selection already opened
		if (accordion.id.includes("selection") && accordion.classList.contains("active")) {
			console.log("already active - do nothing");
			return;
		}

		if (accordion.id.includes("selection")) {
			console.log("seletion... add activity");
			accordion.classList.add("active");
		}

		else {
			console.log("not selection... remove activity");
			accordion.classList.remove("active");
		}
	}
}




/**
 * 
 * @param {String} tabName 
 * @param {String} tabId 
 */
function renderPlots(tabName, tabId) {

    let tmpTabId = tabId;

    if(tabId === TabId.selectionIntersecting){
        tmpTabId = TabId.intersecting;
    }

    if(tabId === TabId.selectionNonIntersecting){
        tmpTabId = TabId.nonIntersecting;
    }

    let comparison = tabName.split("_")[0];

    let data = deepCopyOfGlobalDataSubSet(currentlyChosenGlobalData, comparison, tmpTabId)

    data['data'] = combineLinkSpecificGlobalData2(data['data']);

    let textNodeDs1 = document.createTextNode(data['info']['file_1']['filename'])
    let textNodeDs2 = document.createTextNode(data['info']['file_2']['filename'])

 
    if (tabId === TabId.intersecting) {

        if (typeof data['data'] === "string") {
            data['data'] = JSON.parse(data['data']);
        }

        render(data, "first-level-intersecting-information-data-sankey-" + tabName, tabId, tabName);

        varianceAndAbundanceslider(data, tabName, tabId);

        detailDiagramsPerCluster(
            DiagramId.centroid,
            data,
            "first-level-intersecting-information-data-profiles-left-" + tabName,
            "first-level-intersecting-information-data-profiles-right-" + tabName,
            tabName,
            tabId);

            let headerDivDs1 = document.getElementById("first-level-intersecting-information-data-header-left-" + tabName);
            headerDivDs1.appendChild(textNodeDs1.cloneNode(true));
        
            let headerDivDs2 = document.getElementById("first-level-intersecting-information-data-header-right-" + tabName);
            headerDivDs2.appendChild(textNodeDs2.cloneNode(true));

    }

    if (tabId === TabId.nonIntersecting) {

        if (typeof data[comparison] === "string") {
            data[comparison] = JSON.parse(data['data']);
        }  

        varianceAndAbundanceslider(data, tabName, tabId);

        detailDiagramsPerCluster(
            DiagramId.centroid,
            data,
            "first-level-non-intersecting-information-data-left-" + tabName,
            "first-level-non-intersecting-information-data-right-" + tabName,
            tabName,
            tabId);

            let headerDivDs1Non = document.getElementById("first-level-non-intersecting-information-data-header-left-" + tabName);
            headerDivDs1Non.appendChild(textNodeDs1.cloneNode(true));
        
            let headerDivDs2Non = document.getElementById("first-level-non-intersecting-information-data-header-right-" + tabName);
            headerDivDs2Non.appendChild(textNodeDs2.cloneNode(true));

    }

    // second-level analysis

    if (tabId === TabId.selectionIntersecting) {

        if (typeof data['selection'] === "string") {
            data['selection'] = JSON.parse(data['selection']);
        }

        let headerDivDs1Selection = document.getElementById("second-level-intersecting-diagrams-header-dataset1-" + tabName);
            headerDivDs1Selection.appendChild(textNodeDs1.cloneNode(true));
        
        let headerDivDs2Selection = document.getElementById("second-level-intersecting-diagrams-header-dataset2-" + tabName);
           headerDivDs2Selection.appendChild(textNodeDs2.cloneNode(true));


        //detailDiagramCombined("second-level-intersecting-diagrams-profiles-dataset1-" + tabName, "ds1", data[comparison]['intersecting']);
        //detailDiagramCombined("second-level-intersecting-diagrams-profiles-dataset2-" + tabName, "ds2", data[comparison]['intersecting']);

        detailDiagramCombined("second-level-intersecting-diagrams-profiles-dataset1-" + tabName, "ds1", data);
        detailDiagramCombined("second-level-intersecting-diagrams-profiles-dataset2-" + tabName, "ds2", data);

        createDetailTable("second-level-intersecting-table-" + tabName, data['selection']);
        supportedGenomes("dropdown-menu scrollable-menu-" + tabName, data['selection'], tabId);
    }

    if (tabId === TabId.selectionNonIntersecting) {

        if (typeof data['selection'] === "string") {
            data['selection'] = JSON.parse(data['selection']);
        }

        let headerDivDs1NonSelection = document.getElementById("second-level-non-intersecting-diagrams-header-dataset1-" + tabName);
            headerDivDs1NonSelection.appendChild(textNodeDs1.cloneNode(true));
        
        let headerDivDs2NonSelection = document.getElementById("second-level-non-intersecting-diagrams-header-dataset2-" + tabName);
           headerDivDs2NonSelection.appendChild(textNodeDs2.cloneNode(true));

        detailDiagramCombined("second-level-non-intersecting-diagrams-profiles-dataset1-" + tabName, "ds1", data);
        detailDiagramCombined("second-level-non-intersecting-diagrams-profiles-dataset2-" + tabName, "ds2", data);

        createDetailTable("second-level-non-intersecting-table-" + tabName, data['selection']);
        supportedGenomes("dropdown-menu scrollable-menu-" + tabName, data['selection'], tabId);
    }

}


/**
 * 
 * @param {String} id 
 * @param {String} tabId 
 */
async function createInstance(id, tabId) {

    let currentParentElement = null;

    if (tabId === TabId.intersecting) {
        currentParentClass = document.getElementsByClassName("first-level-intersecting-information");
    }

    if (tabId === TabId.nonIntersecting) {
        currentParentClass = document.getElementsByClassName("first-level-non-intersecting-information");
    }

    if (tabId === TabId.selectionIntersecting) {
        currentParentClass = document.getElementsByClassName("second-level-intersecting");
    }

    if (tabId === TabId.selectionNonIntersecting) {
        currentParentClass = document.getElementsByClassName("second-level-non-intersecting");
    }

    for (let element of currentParentClass) {
            if (element.id === "") {
                currentParentElement = element;
            }
    }


    if (tabId === TabId.intersecting) {
        currentParentElement.setAttribute("id", "first-level-intersecting-information-" + id);
    }

    if (tabId === TabId.nonIntersecting) {
        currentParentElement.setAttribute("id", "first-level-non-intersecting-information-" + id);
    }

    if (tabId === TabId.selectionIntersecting) {
        currentParentElement.setAttribute("id", "second-level-intersecting-" + id);
    }

    if (tabId === TabId.selectionNonIntersecting) {
        currentParentElement.setAttribute("id", "second-level-non-intersecting-" + id);
    }


    // setting ID for all child divs of parent
    let currentChildDivs = currentParentElement.getElementsByTagName("DIV");
    for (let childDiv of currentChildDivs) {
        childDiv.setAttribute("id", childDiv.className + "-" + id);
    }

    // setting ID for all child input (sliders)
    let currentChildInputs = currentParentElement.getElementsByTagName("INPUT");
    for (let childInput of currentChildInputs) {
        childInput.setAttribute("id", childInput.className + "-" + id);
    }

    // setting ID for all select (dropdown)
    let currentChildSelect = currentParentElement.getElementsByTagName("SELECT");
    for (let childSelect of currentChildSelect) {
        childSelect.setAttribute("id", childSelect.className + "-" + id);
    }

    // setting ID for all labels
    let currentChildLabel = currentParentElement.getElementsByTagName("LABEL");
    for (let childLabel of currentChildLabel) {
        childLabel.setAttribute("id", childLabel.className + "-" + id);
    }

    // setting ID for all buttons
    let currentChildButton = currentParentElement.getElementsByTagName("BUTTON");
    for (let childButton of currentChildButton) {
        childButton.setAttribute("id", childButton.className + "-" + id);
    }

    let currentChildUl = currentParentElement.getElementsByTagName("UL");
    for (let childUl of currentChildUl) {
        childUl.setAttribute("id", childUl.className + "-" + id);
    }
}