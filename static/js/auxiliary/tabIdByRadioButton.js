/**
 * 
 * @param {String} tabName 
 */
function getActiveRadioButton(tabName){

    // get current diagram
    let currentRadioButtons = document.getElementById("btn-group btn-group-toggle-" + tabName);
    let currentDetailDiagram = "";

    for(let label of currentRadioButtons.children){
        if(label.className.includes("active")){
            currentDetailDiagram = label.children[0].value;
        }
    }
    return currentDetailDiagram;
}
