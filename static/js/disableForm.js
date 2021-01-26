
// /**
//   * 
//   *
//   * @param{} current
//   */
// function disableForm(current) {

// 	let clusteredFile = document.getElementsByClassName('clustered-file');
// 	let filesForClustering = document.getElementsByClassName('files-for-clustering');

// 	// hide currently non-selected
// 	if (document.getElementById("radio-files-for-clustering") === current) {

// 		for (element of clusteredFile) {
// 			element.setAttribute("disabled", true);
// 		}

// 		for (element of filesForClustering) {
// 			element.removeAttribute("disabled");
// 		}

// 		//deactivate accordion
// 		$(".accordion_tab.single-file").each(function () {
// 			$(this).parent().removeClass("active");
// 			$(this).removeClass("active");
// 		});

// 		$(".accordion_tab.multiple-files").each(function () {
// 			$(this).parent().removeClass("active");
// 			$(this).removeClass("active");
// 		});

// 		$(".accordion_tab.multiple-files.multiple-input").each(function () {
// 			$(this).parent().addClass("active");
// 			$(this).addClass("active");
// 		});

// 		$('#overlay-div').remove();
// 		$('#multiple-files-accordion').css({ opacity: 1.0 });
// 		$('#single-file-accordion').fadeTo('slow',.6);
// 		$('#single-file-accordion').append('<div id="overlay-div" style="position: absolute;top:0;left:0;width: 100%;height:100%;z-index:2;opacity:0.4;filter: alpha(opacity = 50)"></div>');

// 		// disable sliders
// 		document.getElementById("variance-slider").removeAttribute('disabled');
// 		document.getElementById("k-slider").removeAttribute('disabled');
// 		document.getElementById("variance-slider-input-1").removeAttribute('disabled');
// 		document.getElementById("variance-slider-input-2").removeAttribute('disabled');
// 		document.getElementById("k-slider-input-1").removeAttribute('disabled');

// 	}

// 	// unhide currently selected
// 	else {

// 		for (element of clusteredFile) {
// 			element.removeAttribute("disabled");
// 		}

// 		for (element of filesForClustering) {
// 			element.setAttribute("disabled", true);
// 		}

// 		//deactivate accordion
// 		$(".accordion_tab.multiple-files").each(function () {
// 			$(this).parent().removeClass("active");
// 			$(this).removeClass("active");
// 		});

// 		//deactivate accordion
// 		$(".accordion_tab.single-file").each(function () {
// 			$(this).parent().removeClass("active");
// 			$(this).removeClass("active");
// 		});

// 		//deactivate accordion
// 		$(".accordion_tab.single-file.single-input").each(function () {
// 			$(this).parent().addClass("active");
// 			$(this).addClass("active");
// 		});

// 		// https://stackoverflow.com/questions/8423812/enable-disable-a-div-and-its-elements-in-javascript/8423836
// 		$('#overlay-div').remove();
// 		$('#single-file-accordion').css({ opacity: 1.0 });
// 		$('#multiple-files-accordion').fadeTo('slow',.6);
// 		$('#multiple-files-accordion').append('<div id="overlay-div" style="position: absolute;top:0;left:0;width: 100%;height:100%;z-index:2;opacity:0.4;filter: alpha(opacity = 50)"></div>');
		
// 		// remove disabling of sliders
// 		document.getElementById("variance-slider").setAttribute('disabled', true);
// 		document.getElementById("k-slider").setAttribute('disabled', true);
// 		document.getElementById("variance-slider-input-1").setAttribute('disabled', true);
// 		document.getElementById("variance-slider-input-2").setAttribute('disabled', true);
// 		document.getElementById("k-slider-input-1").setAttribute('disabled', true);
// 	}

// }