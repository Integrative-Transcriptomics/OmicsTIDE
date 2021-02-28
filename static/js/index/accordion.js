$(document).on('click', '.accordion_tab.multiple-files', function (event) {

	$(".accordion_tab.multiple-files").each(function () {
		$(this).parent().removeClass("active");
		$(this).removeClass("active");
	});
	$(this).parent().addClass("active");
	$(this).addClass("active");

});

$(document).on('click', '.accordion_tab.single-file', function (event) {

	$(".accordion_tab.single-file").each(function () {
		$(this).parent().removeClass("active");
		$(this).removeClass("active");
	});
	$(this).parent().addClass("active");
	$(this).addClass("active");

});

$(document).on('click', '.accordion_tab.analysis', function (event) {

	console.log("analysis!")

	$(".accordion_tab.analysis").each(function () {
		$(this).parent().removeClass("active");
		$(this).removeClass("active");
	});
	$(this).parent().addClass("active");
	$(this).addClass("active");

});

