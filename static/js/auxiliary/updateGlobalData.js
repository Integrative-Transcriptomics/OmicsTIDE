


/**
 * adds a given comparisonId-analysisType-combination to the global Object 'currentlyChosenGlobalData' for easier access.
 * @param {String} comparisonId 
 * @param {String} analysisType 
 * @param {Object} comparisonDataObject 
 */
function addComparisonToChosenGlobalData(comparisonId, analysisType, comparisonDataObject){

    // case: comparisonId alredy found
    if(Object.keys(currentlyChosenGlobalData).includes(comparisonId)){

        // analysisType already found
        if(Object.keys(currentlyChosenGlobalData[comparisonId]).includes(analysisType)){
            alert("Comparison combination: " + comparisonId + " and " + analysisType + " already chosen");
            return;
        }

        // comparisonType included, analysisType not yet included -> add analysisType as key of comparison type!
        else{
            let comparisonDataObjectCopy = JSON.parse(JSON.stringify(comparisonDataObject))
            currentlyChosenGlobalData[comparisonId][analysisType] = comparisonDataObjectCopy;
            return;
        }
    }

    // comparisonId not included -> add comparisonId and analysis
    else{
        let comparisonDataObjectCopy = JSON.parse(JSON.stringify(comparisonDataObject))
        currentlyChosenGlobalData[comparisonId] = {
            [analysisType] : comparisonDataObjectCopy
        }
        return;
    }
}


/**
 * removes a given comparisonId-analysisType-combination from the global Object 'currentlyChosenGlobalData'.
 * @param {String} comparisonId 
 * @param {String} analysisType 
 */
function removeComparisonFromChosenGlobalData(comparisonId, analysisType){

    // case: comparisonId alredy found
    if(Object.keys(currentlyChosenGlobalData).includes(comparisonId)){

        // comparisonId and analysisType found -> remove
        if(Object.keys(currentlyChosenGlobalData[comparisonId]).includes(analysisType)){

            // other keys that current analysisType found -> delete only current analysisType
            if(Object.keys(currentlyChosenGlobalData[comparisonId]).length > 1){
                delete currentlyChosenGlobalData[comparisonId][analysisType];
                return;
            }

            // only current analysisType found -> delete complete comparison
            else{
                delete currentlyChosenGlobalData[comparisonId];
                return;
            }
            
        }

        // comparisonType included, analysisTypte not found
        // else{
        //     alert("AnalysisType: " + analysisType + " not found!");
        //     return;
        // }
    }

    // comparisonId not found
    else{
        alert("ComparisonId: " + comparisonId + " not found!");
        return;
    }
    
}










/**
 * 
 * @param {ObjectArray} currentlyChosenGlobalData 
 * @param {String} comparisonId 
 * @param {String} comparisonType 
 */
function deepCopyOfGlobalDataSubSet(currentlyChosenGlobalData, comparisonId, comparisonType){

    return JSON.parse(JSON.stringify(currentlyChosenGlobalData[comparisonId][comparisonType]));
}





/**
 * 
 * @param {ObjectArray} currentlyChosenGlobalData 
 * @param {String} comparisonId 
 * @param {String} comparisonType 
 * @param {ObjectArray} updatedData 
 */
function updateGlobalDataSubset(currentlyChosenGlobalData, comparisonId, comparisonType, updatedKey, updatedData){

    currentlyChosenGlobalData[comparisonId][comparisonType][updatedKey] = updatedData;
}

