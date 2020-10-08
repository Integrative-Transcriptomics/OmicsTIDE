
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



//createCheckboxes("molecular_function", "box_molfunc");


// function createCheckbox(all_go_terms, go_category, div){

//     var parent = document.getElementById(div);

//     for(i=0; i<all_go_terms[go_category].length; i++){
//         var check = document.createElement('input')
//         check.type = "checkbox";
//         check.id = 'check_' + div + "_" + i;
//         check.name = all_go_terms[go_category][i];
//         check.value = "value";
//         check.fontSize = "6px";
//         check.setAttribute("onclick", "updateDiagrams()")
//         check.checked = true;
//         //check.onclick = updateDiagrams();
//         var label = document.createElement('label')
//         //label.style.fontSize = "6px";
//         label.htmlFor = 'check_' + div + "_" + i;
//         label.appendChild(document.createTextNode(all_go_terms[go_category][i]));

//         var br = document.createElement("br");
//         label.appendChild(br);

//         parent.appendChild(check);
//         parent.appendChild(label);
//     }

// }


// // https://stackoverflow.com/questions/386281/how-to-implement-select-all-check-box-in-html
// function deSelectAllCheckboxes(source, parent_div){
//     var all_checkboxes = document.getElementById(parent_div).children;

//     for(i=0; i<all_checkboxes.length; i++){

//         if(all_checkboxes[i] !== source){
//             all_checkboxes[i].checked = source.checked;
//         }
//     }
// }


// function getCheckedBoxInformation(parent_div){
//     var all_checkboxes = document.getElementById(parent_div).children;
//     selected = [];

//     for(i=0; i<all_checkboxes.length; i++){
//         if(all_checkboxes[i].checked){
//             selected.push(all_checkboxes[i].name);
//         }
//     }

//     selected = selected.filter(n => n);

//     return selected;
// }