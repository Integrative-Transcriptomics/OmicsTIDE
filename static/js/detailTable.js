
function createDetailTable(parentDivId, selection){

	console.log(parentDivId);
	console.log(selection);

	let parentDiv = document.getElementById(parentDivId);


	if(selection.length === 0){
		return;
	}

	let tableWrapper = document.createElement("DIV");

	tableWrapper.setAttribute("class", "table-wrapper-scroll-y my-custom-scrollbar");
	tableWrapper.setAttribute("id", "table-wrapper-" + parentDivId);

		let table = document.createElement("TABLE");
		table.setAttribute("class", "table table-bordered mb-0");
		table.setAttribute("id", "table-" + parentDivId);

			let tableHead = document.createElement("THEAD");
			tableHead.setAttribute("class", "table-head");
			tableHead.setAttribute("id", "table-head-" + parentDivId);

				let trHead = document.createElement("TR");
				trHead.setAttribute("class", "tr-head");
				trHead.setAttribute("id", "tr-head-" + parentDivId);

					let thDs1 = document.createElement("TH");
					thDs1.setAttribute("scope", "col");
					thDs1.setAttribute("class", "th");
					thDs1.setAttribute("id", "th-" + parentDivId);

						let thDs1Text = document.createTextNode("Gene");
						thDs1.appendChild(thDs1Text);

					trHead.appendChild(thDs1);

					let thDs2 = document.createElement("TH");
					thDs2.setAttribute("scope", "col");
					thDs2.setAttribute("class", "th-text");
					thDs2.setAttribute("id", "th-text-2-" + parentDivId);

						let thDs2Text = document.createTextNode("Dataset1");
						thDs2.appendChild(thDs2Text);
					
					trHead.appendChild(thDs2);

					let thCount = document.createElement("TH");
					thCount.setAttribute("scope", "col");
					thDs2.setAttribute("class", "th-text");
					thDs2.setAttribute("id", "th-text-3-" + parentDivId);

						let thCountText = document.createTextNode("Dataset2");
						thCount.appendChild(thCountText);

					trHead.appendChild(thCount);

				tableHead.appendChild(trHead);

			table.appendChild(tableHead);

			let tableBody = document.createElement("TBODY");

			for(let gene of selection){

				eval ( "var tr_" + String(gene['gene']) + "= document.createElement('TR')" );

					eval( "var td_" + String(gene['gene']) + "_gene = document.createElement('TD')" );
					eval( "td_" + String(gene['gene']) + "_gene.appendChild(document.createTextNode('" + String(gene['gene']) + "'))" );
					eval( "tr_" + String(gene['gene']) + ".appendChild(td_" + String(gene['gene']) + "_gene)" );

					eval( "var td_" + String(gene['gene']) + "_ds1 = document.createElement('TD')" );
					eval( "td_" + String(gene['gene']) + "_ds1.style.backgroundColor='" + color(String(gene['ds1_cluster'])) + "'" );
					eval( "td_" + String(gene['gene']) + "_ds1.appendChild(document.createTextNode('" + String(gene['ds1_cluster']) + "'))" );
					eval( "tr_" + String(gene['gene']) + ".appendChild(td_" + String(gene['gene']) + "_ds1)" );

					eval( "var td_" + String(gene['gene']) + "_ds2 = document.createElement('TD')" );
					eval( "td_" + String(gene['gene']) + "_ds2.style.backgroundColor='" + color(String(gene['ds2_cluster'])) + "'" );
					eval( "td_" + String(gene['gene']) + "_ds2.appendChild(document.createTextNode('" + String(gene['ds2_cluster']) + "'))" );
					eval( "tr_" + String(gene['gene']) + ".appendChild(td_" + String(gene['gene']) + "_ds2)" );


			tableBody.appendChild(eval( "tr_" + String(gene['gene'])) );

			}

			table.appendChild(tableBody);

		tableWrapper.appendChild(table);

	parentDiv.appendChild(tableWrapper);

	// eval( "var button_" + comparison + "_" + tabId + "=document.createElement('BUTTON')");
	// eval( "button_" + comparison + "_" + tabId + ".setAttribute('class', 'button_selection')" );
	// eval( "button_" + comparison + "_" + tabId + ".setAttribute('id', 'button_" + comparison + "_" + tabId + "')" );
	// eval( "button_" + comparison + "_" + tabId + ".appendChild(document.createTextNode('new selection tab'))" );

	// parentDiv.appendChild(eval( "button_" + comparison + "_" + tabId ));

}