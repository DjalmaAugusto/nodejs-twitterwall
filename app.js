var express = require('express'),
	path = require('path'),
	index = require('./routes/index'),
	tweets = require('./routes/tweets'),
	app = express();

// serve static assets from the public directory
app.use(express.static(path.join(__dirname, 'public')), function () {});

// look for view html in the views directory
app.set('views', path.join(__dirname, 'views'));

// use ejs to render
app.set('view engine', 'ejs');

// setup routes
app.use('/', index);
app.use('/tweets', tweets);

module.exports = app;

var port = process.env.PORT || 5000;
app.listen(port, function () {
	console.log('Listening on ' + port);
});
