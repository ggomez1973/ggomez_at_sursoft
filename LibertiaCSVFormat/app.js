var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var busboy = require('connect-busboy');
var fs = require('fs');
var inspect = require('util').inspect;

var routes = require('./routes/index');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(busboy());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.route('/upload')
    .post(function (req, res, next) {
        var fstream;
        req.pipe(req.busboy);
        var bank = 0; // Default to CREDICOOP
        req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
            bank = val;
        });
        req.busboy.on('file', function (fieldname, file, filename) {        
            fstream = fs.createWriteStream(__dirname + '/temp/' + filename);
            file.pipe(fstream);
            fstream.on('close', function () {    
                parse(bank, filename, function(error, result){ 
                    res.render('done', {file: "libertya_"+filename});
                });  
            });
        });
        req.busboy.on('finish', function() {
            // DO NOTHING    
        });
    });
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
function parse_credicoop(data, csvStream){
    var resumen = data.slice(8, data.length);
    for (var i = 0; i < resumen.length; i++) {
        var fecha = (resumen[i][0]).replace(/\//g,"-");
        var concepto = resumen[i][2] + "-" + resumen[i][1];
        var importe = parseFloat(resumen[i][4]) - parseFloat(resumen[i][3]);
        var credilinea = { Fecha: fecha, Concepto: concepto, Importe: importe};
        csvStream.write(credilinea);
    };
};
function parse_macro(data, csvStream){
    var resumen = data.slice(1, data.length);
    for (var i = 0; i < resumen.length; i++) {
        var fecha = (resumen[i][0]).replace(/ /g,"-");
        var mes_string = fecha.substring(3,6);
        var mes_numero = getMonth(mes_string);
        fecha = fecha.replace(mes_string,mes_numero);    
        var concepto = resumen[i][1] + "-" + resumen[i][3];
        var credito = (resumen[i][5]!="")? parseFloat(resumen[i][5].replace(',','')) : 0;
        var debito = (resumen[i][4]!="")? parseFloat(resumen[i][4].replace(',','')) : 0;
        var importe = credito - debito;
        var credilinea = { Fecha: fecha, Concepto: concepto, Importe: importe};
        csvStream.write(credilinea);
    };
};
function parse_chubut(data, csvStream){
    var converter = require("xls-to-json");  
	var res = {};  
	converter({  
  		input: __dirname+'/extractos/CHUBUT.xls',
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
  		}
	});
};

function getMonth(month){
    var months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Set','Oct','Nov','Dic'];
    return months.indexOf(month)+1;
}

function parse(bank, filename, callback){
    if(bank === '2'){ // CHUBUT es un excel, no un CSV
        var ww = require('xlsjs').readFile(__dirname+'/temp/'+filename);
        console.log(ww);
    } else {
        var fs = require('fs');
        var parse = require('csv-parse');
        var csv = require("fast-csv");

        var csvStream = csv.createWriteStream({headers: true}),
        writableStream = fs.createWriteStream(__dirname+'/parsed/libertya_'+filename);

        writableStream.on("finish", function(){
          return callback(null, "Done!")
        });
        csvStream.pipe(writableStream);

        var parser = parse({delimiter: ','}, function(err, data){
            switch(bank){
                case '0': // Credicoop
                    parse_credicoop(data, csvStream);
                    break;
                case '1': // Macro
                    parse_macro(data, csvStream);
                    break;
            }
            csvStream.end();
        });
        fs.createReadStream(__dirname+'/temp/'+filename).pipe(parser);
    }
};
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;
