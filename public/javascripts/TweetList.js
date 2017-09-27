/* global angular */
var app = angular.module('Twitter', ['ngResource', 'ngSanitize']);

app.controller('TweetList', function ($scope, $resource, $timeout) {
	// set search parameter
	$scope.parameter = 't3crr';

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
				$scope.allTweets = [];
			}

			for (var index = res.length - 1; index > -1; index--) {
				var tweet = res[index];
				// if no tweet is stored or id is not the same as the first tweet in store
				// this is to prevent storing last tweet in response equal to first tweet
				if ($scope.allTweets.length === 0 || tweet.id !== $scope.allTweets[0].id) {
					$scope.allTweets.unshift(tweet);
				}
			}

			$scope.lineOne = $scope.allTweets.slice(0,4);
			$scope.lineTwo = $scope.allTweets.slice(4,8);
			$scope.lineThree = $scope.allTweets.slice(8,12);
			$scope.lineFour = $scope.allTweets.slice(12,15);

			// prevent memory consumption getting higher than displayable
			$scope.allTweets = $scope.allTweets.slice(0,15);

			// for paging - https://dev.twitter.com/docs/working-with-timelines
			$scope.sinceId = res[0].id;

			// retry after amount of milli seconds
			$timeout($scope.getMoreTweets, 60 * 1000);
		});
	}

	/**
	 * bound to @user input form
	 */
	$scope.getTweets = function () {
		$scope.sinceId = undefined;
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
	(function init() {
		// empty tweet model
		$scope.allTweets = [];

		$scope.getTweets(false);
	})();
});

app.filter("trust", ['$sce', function ($sce) {
	return function (htmlCode) {
		return $sce.trustAsHtml(htmlCode);
	}
}]);
