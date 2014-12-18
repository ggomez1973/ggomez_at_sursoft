/*
var parseXlsx = require('excel');

parseXlsx(__dirname+'/extractos/SANTANDER-RIO.xls', function(err, data) {
  if(err) throw err;
    // data is an array of arrays
    console.log(data);
});
*/

var excelParser = require('excel-parser');
excelParser.worksheets({
  inFile: __dirname+'/extractos/SANTANDER-RIO.xls'
}, function(err, worksheets){
  if(err) console.error(err);
  console.log(worksheets);
});

/*
var converter = require("xls-to-json");  
var res = {};  
converter({  
  input: __dirname+'/extractos/SANTANDER-RIO.xls', 
  output: null
}, function(err, result) {
  if(err) {
    console.error(err);
  } else {
  	console.log(result);
  	/*
    for (var key = 1; key >= result.length; key++) {
		res[result[key]["Symbol"]] = result[key]["Currency"];  
    };
    for(var i in res) {
      if(res.hasOwnProperty(i)) {
        console.log("<option value=\"" + i + "\">" + res[i] + "</option>");
      }
    }*
  }
});*/
// Main App (Parseo y transformacion)
/*
var fs = require('fs');
var parse = require('csv-parse');
var csv = require("fast-csv");

var CREDICOOP_CSV_START_COLUMN = 8;

var csvStream = csv.createWriteStream({headers: true}),
writableStream = fs.createWriteStream("libertya.csv");

writableStream.on("finish", function(){
  console.log("Listo!");
});
csvStream.pipe(writableStream);

var parser = parse({delimiter: ','}, function(err, data){
	var res = [];
	var resumen = data.slice(CREDICOOP_CSV_START_COLUMN, data.length);
	for (var i = 0; i < resumen.length; i++) {
		var fecha = (resumen[i][0]).replace(/\//g,"-");
		var concepto = resumen[i][2] + "-" + resumen[i][1];
		var importe = parseFloat(resumen[i][4]) - parseFloat(resumen[i][3]);
		var credilinea = fecha + "," + concepto + "," + importe;
		var credilinea2 = { Fecha: fecha, Concepto: concepto, Importe: importe};
		res.push(credilinea);
		csvStream.write(credilinea2);
	};
	csvStream.end();
});

fs.createReadStream(__dirname+'/extractos/CREDICOOP.csv').pipe(parser);
*/