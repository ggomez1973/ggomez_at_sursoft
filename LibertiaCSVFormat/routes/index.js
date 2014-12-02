var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Parser Libertya', banks: ["Credicoop", "Macro", "Rio"] });
});

router.get('/:file(*)', function(req, res) {
  var file = req.params.file
  var path = './parsed/' + file;
  res.download(path);
});

module.exports = router;
