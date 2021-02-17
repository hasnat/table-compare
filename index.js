const fs = require('fs');
const daff = require('daff');
const Papa = require('papaparse');

var daffBoilerPlate = function (responseA, responseB) {



    const tableA = new daff.NdjsonTable(responseA);
    const tableB = new daff.NdjsonTable(responseB);
    var dataDiff = [];
    var tableDiff = new daff.TableView(dataDiff);

    var alignment = daff.compareTables(tableA, tableB).align();

    var flags = new daff.CompareFlags();
    flags.allow_nested_cells = true;
    flags.ignore_whitespace = true;
    var highlighter = new daff.TableDiff(alignment, flags);
    highlighter.hilite(tableDiff);


    var diff2html = new daff.DiffRender();
    diff2html.render(tableDiff);
    return '<style>' + diff2html.sampleCss() + '</style>' +
        '<pre>' + JSON.stringify(highlighter.getSummary(), null, 2) + '</pre>' + '<hr />' +
        '<div class="highlighter">' + diff2html.html() + '</div>';

}
if (process.argv.length < 4) {
    console.log('Usage: node index.js a.csv b.csv > diff.html')
    process.exit(1)
}
console.log(daffBoilerPlate(
    Papa.parse(fs.readFileSync(process.argv[2], 'utf-8'),{delimiter: ",", header: true}).data,
    Papa.parse(fs.readFileSync(process.argv[3], 'utf-8'),{delimiter: ",", header: true}).data
))