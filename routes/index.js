var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
	res.render('index', {title: 'TwitterWall T3CRR17'});
});

module.exports = router;
