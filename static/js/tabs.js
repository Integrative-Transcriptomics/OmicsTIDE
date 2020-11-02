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


function removeActivityFromTab(tabName) {

    let currNavTab = document.getElementById("pills-" + tabName.name + "-tab");

    let currDomTokenListTab = currNavTab.classList;
    currDomTokenListTab.remove("active");
    currNavTab.classList = currDomTokenListTab;
}


function removeActivityFromContent(tabName) {

    let currContent = document.getElementById("pills-" + tabName.name);

    let currDomTokenListContent = currContent.classList;
    currDomTokenListContent.remove("active");
    currDomTokenListContent.remove("show");
    currContent.classList = currDomTokenListContent;
}



function removeActivityFromTabs() {

    let active = getActiveTabs();

    console.log(active);

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

async function removeContentChildren(tabName) {

    let currContent = document.getElementById("pills-" + tabName.name);

    await removeActivityFromContent(tabName);

    while (currContent.firstChild) {
        currContent.removeChild(currContent.lastChild);
    }

}


async function removeTabChildren(tabName) {

    let currNavTab = document.getElementById("pills-" + tabName.name + "-tab");

    await removeActivityFromTab(tabName);

    while (currNavTab.firstChild) {
        currNavTab.removeChild(currNavTab.lastChild);
    }

}


async function removeContent(tabName) {

    // removing tab content
    let currContent = document.getElementById("pills-" + tabName.name);

    await removeContentChildren(tabName);

    console.log("REMOVING ");
    console.log(currContent)

    currContent.remove()
}


async function removeTab(tabName) {

    // removing nav tabs
    let currNavTab = document.getElementById("pills-" + tabName.name + "-tab");

    await removeTabChildren(tabName);

    console.log("REMOVING ");
    console.log(currNavTab);

    currNavTab.remove()
}


async function removeTabAndContent(tabName) {

    await removeContent(tabName);

    removeTab(tabName);
}


function currentlyActiveTabIsClosed() {

    return (getActiveTabs().active_tabs.length === 0) ? true : false;

}


function setPrevTabActive(){

    let allPillsChildren = document.getElementById("pills-tab").childNodes;
    let allPillsChildrenLi = [];
    
    for(let li of allPillsChildren){
        console.log(li);
        if(li.tagName === "LI"){
            allPillsChildrenLi.push(li);
        }
    }
}



function extractLiTags(selection){

    let allTabsLi = [];
    
    for(let li of selection){
        if(li.tagName === "LI"){
            allTabsLi.push(li);
        }
    }

    return allTabsLi;
}


function isHomeTab(tab){

    return (tab.id === "pills-home-tab") ? true : false;
    
}




/**
  *
  * @param{String} tabName
  */
async function closeTab(tabName) {

    let currentlyClosedLiId = document.getElementById(tabName.parentElement.id).parentElement;

    let allTabs = document.getElementById("pills-tab").childNodes;

    let allTabsLi = extractLiTags(allTabs);

    let index = 0;

    for(let tab of allTabsLi){
        if(tab.id === currentlyClosedLiId.id){
            console.log(tab.id);
            console.log(index);
            break;
        }

        else{

            console.log(tab.id);
            index += 1;
        }
    }

    await (removeTabAndContent(tabName));

    if (currentlyActiveTabIsClosed()) {

        // tab to switch to
        let prevTab = allTabsLi[index-1];

        prevTab.childNodes[0].classList.add("active");
        
        let currentId = prevTab.childNodes[0].id;

        let tabContentId = currentId.split("-")[0] + "-" + currentId.split("-")[1];

        let prevContent = document.getElementById(tabContentId);

        prevContent.classList.add("active");
        prevContent.classList.add("show");

        if(tabContentId === "pills-data_matrix"){
            setIntersectingTabsActive();
        }

    }
}


function navLinkClassByTabId(tabId) {

    if (tabId === "matrix") {
        return "matrix";
    }

    if (tabId === "intersecting" || tabId === "nonIntersecting") {

        console.log(tabId);

        return "first";
    }

    if (tabId === "selectionIntersecting" || tabId === "selectionNonIntersecting") {

        console.log(tabId);

        return "second";
    }
}




/**
  *
  * @param{String} tabName
  * @param{boolean} hasCloseButton
  * @param{String} tabId
  */
async function addTab(tabName, hasCloseButton, tabId) {

    tabName = tabName + "_" + tabId;

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
        new_li_a.appendChild(document.createTextNode(tabName))
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

        if (tabId === TabId.matrix) {
            $("#pills-" + tabName).load("/data", function () {
                loadDataTab(tabName, TabId.matrix);
            })
        }

        if (tabId === TabId.intersecting) {
            $("#pills-" + tabName).load("/clustered_data", function () {
                loadDataTab(tabName, TabId.intersecting);
            })
        }


        if (tabId === TabId.nonIntersecting) {
            $("#pills-" + tabName).load("/non_intersecting", function () {
                loadDataTab(tabName, TabId.nonIntersecting);
            })
        }

        if (tabId === TabId.selectionIntersecting) {

            $("#pills-" + tabName).load("/selection_intersecting", function () {
                loadDataTab(tabName, TabId.selectionIntersecting);
            })
        }

        if (tabId === TabId.selectionNonIntersecting) {
            $("#pills-" + tabName).load("/selection_non_intersecting", function () {
                loadDataTab(tabName, TabId.selectionNonIntersecting);
            })
        }
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
  * @param{String} tabName
  * @param{String} tabId
  */
function loadDataTab(tabName, tabId) {

    if (tabId === TabId.matrix) {
        initPlotMatrix("matrix-information").done(populateMatrix('matrix-information'));
    }

    if (tabId === TabId.intersecting) {
        createInstance(tabName, TabId.intersecting).then(renderPlots(globalData, tabName, TabId.intersecting))
    }

    if (tabId === TabId.nonIntersecting) {
        createInstance(tabName, TabId.nonIntersecting).then(renderPlots(globalData, tabName, TabId.nonIntersecting))
    }

    if (tabId === TabId.selectionIntersecting) {
        createInstance(tabName, TabId.selectionIntersecting).then(renderPlots(globalData, tabName, TabId.selectionIntersecting))
    }

    if (tabId === TabId.selectionNonIntersecting) {
        createInstance(tabName, TabId.selectionNonIntersecting).then(renderPlots(globalData, tabName, TabId.selectionNonIntersecting))
    }

}

function JsonToJsObject(JsonObject, comparison, tabId, key) {
    return JSON.parse(JsonObject[comparison][tabId][key]);
}

/**
  *
  * @param{} globalData
  * @param{} tabName
  * @param{} tabId
  */
function renderPlots(data, tabName, tabId) {

    let comparison = tabName.split("_")[0] + "_" + tabName.split("_")[1] + "_" + tabName.split("_")[2] + "_" + tabName.split("_")[3];

    if (tabId === TabId.intersecting) {

        if (typeof data[comparison]['intersecting']['data'] === "string") {
            data[comparison]['intersecting']['data'] = JSON.parse(data[comparison]['intersecting']['data']);
        }

        render(data[comparison]['intersecting']['data'], "clustered-data-information-data-sankey-" + tabName, tabId, tabName);

        expressionSlider(data[comparison]['intersecting'], tabName, tabId);

        detailDiagramsPerCluster(
            DiagramId.centroid,
            data[comparison]['intersecting'],
            "clustered-data-information-data-profiles-left-" + tabName,
            "clustered-data-information-data-profiles-right-" + tabName,
            tabName,
            tabId);

    }

    if (tabId === TabId.nonIntersecting) {

        if (typeof data[comparison]['nonIntersecting']['data'] === "string") {
            data[comparison]['nonIntersecting']['data'] = JSON.parse(data[comparison]['nonIntersecting']['data']);
        }

        expressionSlider(data[comparison]['nonIntersecting'], tabName, tabId)

        detailDiagramsPerCluster(
            DiagramId.centroid,
            data[comparison]['nonIntersecting'],
            "non-intersecting-information-data-left-" + tabName,
            "non-intersecting-information-data-right-" + tabName,
            tabName,
            tabId);

    }

    if (tabId === TabId.selectionIntersecting) {

        detailDiagramCombined("selection-intersecting-diagrams-profiles-dataset1-" + tabName, "ds1", data[comparison]['intersecting']);
        detailDiagramCombined("selection-intersecting-diagrams-profiles-dataset2-" + tabName, "ds2", data[comparison]['intersecting']);

        createDetailTable("selection-intersecting-table-" + tabName, data[comparison]['intersecting']['selection']);

        supportedGenomes("dropdown-menu scrollable-menu-" + tabName, data[comparison]['intersecting']['selection'], tabId);
    }

    if (tabId === TabId.selectionNonIntersecting) {

        detailDiagramCombined("selection-nonIntersecting-diagrams-profiles-dataset1-" + tabName, "ds1", data[comparison]['nonIntersecting']);
        detailDiagramCombined("selection-nonIntersecting-diagrams-profiles-dataset2-" + tabName, "ds2", data[comparison]['nonIntersecting']);

        createDetailTable("selection-nonIntersecting-table-" + tabName, data[comparison]['nonIntersecting']['selection']);

        supportedGenomes("dropdown-menu scrollable-menu-" + tabName, data[comparison]['nonIntersecting']['selection'], tabId);
    }




}



/**
  *
  * @param{id} id
  * @param{tabId} tabId
  */
async function createInstance(id, tabId) {

    let currentParentElement = null;

    if (tabId === TabId.intersecting) {
        currentParentClass = document.getElementsByClassName("clustered-data-information");
        for (element of currentParentClass) {
            if (element.id === "") {
                currentParentElement = element;
            }
        }
    }

    if (tabId === TabId.nonIntersecting) {
        currentParentClass = document.getElementsByClassName("non-intersecting-information");
        for (element of currentParentClass) {
            if (element.id === "") {
                currentParentElement = element;
            }
        }
    }

    if (tabId === TabId.selectionIntersecting) {
        currentParentClass = document.getElementsByClassName("selection-intersecting");
        for (element of currentParentClass) {
            if (element.id === "") {
                currentParentElement = element;
            }
        }
    }

    if (tabId === TabId.selectionNonIntersecting) {
        currentParentClass = document.getElementsByClassName("selection-nonIntersecting");
        for (element of currentParentClass) {
            if (element.id === "") {
                currentParentElement = element;
            }
        }
    }


    if (tabId === TabId.intersecting) {
        currentParentElement.setAttribute("id", "clustered-data-information-" + id);
    }

    if (tabId === TabId.nonIntersecting) {
        currentParentElement.setAttribute("id", "non-intersecting-information-" + id);
    }

    if (tabId === TabId.selectionIntersecting) {
        currentParentElement.setAttribute("id", "selection-intersecting-" + id);
    }

    if (tabId === TabId.selectionNonIntersecting) {
        currentParentElement.setAttribute("id", "selection-nonIntersecting-" + id);
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