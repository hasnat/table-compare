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
    var highlighter = new daff.TableDiff(alignment, flags);
    highlighter.hilite(tableDiff);


    var diff2html = new daff.DiffRender();
    diff2html.render(tableDiff);
    return '<style>' + fs.readFileSync('./daff2html.css', 'utf-8') + '</style>' + diff2html.html();

}
if (process.argv.length < 4) {
    console.log('Usage: node index.js a.csv b.csv > diff.html')
    process.exit(1)
}
console.log(daffBoilerPlate(
    Papa.parse(fs.readFileSync(process.argv[2], 'utf-8'),{delimiter: ","}).data,
    Papa.parse(fs.readFileSync(process.argv[3], 'utf-8'),{delimiter: ","}).data
))