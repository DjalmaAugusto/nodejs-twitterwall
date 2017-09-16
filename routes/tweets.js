/* global module, require */
var express = require('express'),
	router = express.Router(),
	Twit = require('twit'),
	config = require('../config'),

	// instantiate Twit module
	twitter = new Twit(config.twitter);

var TWEET_COUNT = 15,
	USER_TIMELINE_URL = 'statuses/user_timeline',
	SEARCH_URL = 'search/tweets';

/**
 * @param {object} parameter
 * @param {object} request
 * @returns {object}
 */
function addSinceId(parameter, request) {
	// the since_id is passed in via a query string param
	if (request.query.since_id) {
		parameter.since_id = request.query.since_id;
	}

	return parameter;
}

/**
 * @param {array} tweets
 * @param {object} response
 * @param {function} response.setHeader
 * @param {function} response.send
 */
function returnData(tweets, response) {
	if (tweets.length > 0) {
		response.setHeader('Content-Type', 'application/json');
		response.send(tweets);
	}
}

/**
 * GET tweets json.
 *
 * @param {object} request
 * @param {object} response
 */
router.get('/user_timeline/:user', function (request, response) {
	var parameter = {
		// the user id passed in as part of the route
		screen_name: request.params.user,
		// how many tweets to return
		count: TWEET_COUNT
	};

	parameter = addSinceId(parameter, request);

	// request data
	twitter.get(
		USER_TIMELINE_URL,
		parameter,
		/**
		 * @param {string} err
		 * @param {array} data
		 */
		function (err, data) {
			returnData(data, response)
		}
	);
});

/**
 * GET tweets json.
 *
 * @param {object} request
 * @param {object} response
 */
router.get('/search/:search', function (request, response) {
	var parameter = {
		// the search passed in as part of the route
		q: request.params.search + ' AND exclude:retweets',
		// how many tweets to return
		count: TWEET_COUNT
	};

	parameter = addSinceId(parameter, request);

	// request data
	twitter.get(
		SEARCH_URL,
		parameter,
		/**
		 * @param {string} err
		 * @param {object} data
		 * @param {array} data.statuses
		 */
		function (err, data) {
			returnData(data.statuses, response)
		}
	);
});

module.exports = router;
