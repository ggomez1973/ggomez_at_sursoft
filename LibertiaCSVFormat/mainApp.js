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