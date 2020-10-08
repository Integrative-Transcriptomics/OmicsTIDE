
// https://gist.github.com/jfreels/6733593

/**
 * creates HTML table from selection (http://jsfiddle.net/W7Zwg/1/)
 * @param {Object} selection_array current selection
 */
function getTabularOutput(selection_array){

    d3.select("table").remove();

    var table = d3.select("#box1").append('table');
    var thead = table.append('thead')
    var tbody = table.append('tbody')

    thead.append('tr')
        .selectAll('th')
        .data(work_data.columns)
        .enter()
        .append('th')
        .text(function (column) {return column})
        .style('font-size', '4px')
        .on("click", function (d) {
            console.log(d);
        });

    // create a row for each object in the data
    var rows = tbody.selectAll('tr')
        .data(selection_array)
        .enter()
        .append('tr')

    // create a cell in each row for each column
    var cells = rows.selectAll('td')
        .data(function (row) {
            return work_data.columns.map(function (column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append('td')
        .text(function (d) { return d.value; })
        .style('font-size', '4px')

    if (selection_array.length===0) d3.select("table").remove();

    return table;
}
