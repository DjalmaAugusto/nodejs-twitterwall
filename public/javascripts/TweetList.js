/* global angular */
var app = angular.module('Twitter', ['ngResource', 'ngSanitize']);

app.controller('TweetList', function ($scope, $resource, $timeout) {
	var allTweets = [];

	/**
	 * requests and processes tweet data
	 */
	function getTweets(paging) {
		var parameter = {
			action: 'search',
			parameter: $scope.parameter
		};

		if ($scope.sinceId) {
			parameter.since_id = $scope.sinceId;
		}

		// create Tweet data resource
		$scope.tweets = $resource('/tweets/:action/:parameter', parameter);

		// GET request using the resource
		$scope.tweets.query({}, function (res) {

			if (paging === false) {
				allTweets = [];
			}

			allTweets = allTweets.concat(res);

			$scope.tweetsResult1 = allTweets.slice(0,4);
			$scope.tweetsResult2 = allTweets.slice(0,4);
			$scope.tweetsResult3 = allTweets.slice(0,4);
			$scope.tweetsResult4 = allTweets.slice(0,3);

			// for paging - https://dev.twitter.com/docs/working-with-timelines
			$scope.sinceId = res[res.length - 1].id;

			// retry after amount of milli seconds
			$timeout(function () {
				getTweets(paging);
			}, 3000000);
		});
	}

	/**
	 * bound to @user input form
	 */
	$scope.getTweets = function () {
		$scope.maxId = undefined;
		getTweets();
	};

	/**
	 * bound to 'Get More Tweets' button
	 */
	$scope.getMoreTweets = function () {
		getTweets(true);
	};

	/**
	 * init controller and set defaults
	 */
	function init() {
		// set a default username value
		$scope.parameter = "t3crr";

		// empty tweet model
		$scope.tweetsResult = [];

		$scope.getTweets(false);
	}

	init();
});
