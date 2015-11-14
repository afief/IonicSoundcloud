controll.controller('SearchCtrl', ['$scope', "$state", "$stateParams", "$ionicLoading", "$ionicPopup", function($scope, $state, $stateParams, $ionicLoading, $ionicPopup) {
	var maxResult = 28;
	var limit = 7;
	var offset = 0;

	$scope.searchResult = [];
	$scope.search = {text: $stateParams.search_text};
	loadSongs();

	$scope.doSearch = function() {
		console.log("search", $scope.search);

		$scope.searchResult = [];
		offset = 0;

		loadSongs();
	}

	$scope.loadMore = function() {
		console.log("load more");
		if (offset != -1) { 
			loadSongs();
		}
	}
	$scope.canLoadMore = function() {
		return offset > 0;
	}

	function loadSongs() {
		$ionicLoading.show({template: "Searching"});
		SC.get('/tracks', { q: $scope.search.text, offset: offset, limit: limit, linked_partitioning: 1}, function(tracks) {
			console.log(tracks);
			if ((tracks.collection.length <= 0) || ((offset + limit) > maxResult)) {
				offset = -1;
			} else {
				offset += limit;
			}
			for (var i = 0; i < tracks.collection.length; i++) {
				if (tracks.collection[i].streamable) {
					$scope.searchResult.push(tracks.collection[i]);
					console.log("tracks", tracks.collection[i].title);
				}
			}
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$ionicLoading.hide();
			checkPhase();
		});
	}

	function checkPhase() {
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	}
}]);

