var express = require('express');
var router = express.Router();
var Twit = require('twit');
var config = require('../config');

// instantiate Twit module
var twitter = new Twit(config.twitter);

var TWEET_COUNT = 15;
var USER_TIMELINE_URL = 'statuses/user_timeline';
var SEARCH_TIMELINE_URL = 'search/tweets';

/**
 * GET tweets json.
 */
router.get('/user_timeline/:user', function (req, res) {
	var tweets = [],

		params = {
			// the user id passed in as part of the route
			screen_name: req.params.user,
			// how many tweets to return
			count: TWEET_COUNT
		};

	// the since_id is passed in via a query string param
	if (req.query.since_id) {
		params.since_id = req.query.since_id;
	}

	// request data
	twitter.get(USER_TIMELINE_URL, params, function (err, data, resp) {
		tweets = data;

		if (tweets.length > 0) {
			res.setHeader('Content-Type', 'application/json');
			res.send(tweets);
		}
	});
});

/**
 * GET tweets json.
 */
router.get('/search/:search', function (req, res) {
	var tweets = [],

		params = {
			// the search passed in as part of the route
			q: req.params.search + ' AND exclude:retweets',
			// how many tweets to return
			count: TWEET_COUNT
		};

	// the since_id is passed in via a query string param
	if (req.query.since_id) {
		params.since_id = req.query.since_id;
	}

	// request data
	twitter.get(SEARCH_TIMELINE_URL, params, function (err, data, resp) {
		tweets = data.statuses;

		if (tweets.length > 0) {
			res.setHeader('Content-Type', 'application/json');
			res.send(tweets);
		}
	});
});

module.exports = router;
