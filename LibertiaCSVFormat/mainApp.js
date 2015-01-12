// Ninguno anda con este parser
/*
var parseXlsx = require('excel');
//var filename = 'BANCO NEUQUEN XLS.xls';
//var filename = 'CHUBUT.xls';
var filename = 'SANTANDER-RIO.xls';

parseXlsx(__dirname+'/extractos/'+filename, function(err, data) {
  if(err) throw err;
    // data is an array of arrays
    console.log(data);
});
*/

// Ninguno anda con este parser
/*
var excelParser = require('excel-parser');
excelParser.worksheets({
  inFile: __dirname+'/extractos/BANCO NEUQUEN XLS.xls',
  //inFile: __dirname+'/extractos/CHUBUT.xls'
  //inFile: __dirname+'/extractos/SANTANDER-RIO.xls',
  worksheet: 1,
  skipEmpty: true
}, function(err, worksheets){
  if(err) console.error(err);
  console.log(worksheets);
});
*/

// Solo el chubut pasa el xls-to-json

var converter = require("xls-to-json");  
var res = {};  
converter({  
  //input: __dirname+'/extractos/BANCO NEUQUEN XLS.xls', 
  input: __dirname+'/extractos/CHUBUT.xls',
  //input: __dirname+'/extractos/SANTANDER-RIO.xls',   
  output: null
}, function(err, result) {
  if(err) {
    console.error(err);
  } else {
    for (var key = 0; key < result.length; key++) {
    	var concepto = result[key]['Nro. Comprobante'].substring(2,14)+'-'+result[key]['Concepto'];
    	var importe = result[key]['Importe'];
    	var fecha = result[key]['Fecha / Hora Mov.'].substring(0,10).replace(/\//g,"-");;
    	var credilinea = { Fecha: fecha, Concepto: concepto, Importe: importe};
		res[key] = credilinea;
    };
    console.log(res);
    /*
    for(var i in res) {
      if(res.hasOwnProperty(i)) {
        console.log("<option value=\"" + i + "\">" + res[i] + "</option>");
      }
    }*/
  }
});