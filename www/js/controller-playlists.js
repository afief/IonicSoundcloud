controll.controller('PlaylistsCtrl', ['$scope', "$state", "$stateParams", "$ionicLoading", "$ionicPopup", function($scope, $state, $stateParams, $ionicLoading, $ionicPopup) {
	var maxResult = 28;
	var limit = 7;
	var offset = 0;

	$scope.playlists = [];
	loadSongs();

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
		$ionicLoading.show({template: "Fetch Data"});
		SC.get('/me/playlists', { offset: offset, limit: limit, linked_partitioning: 1}).then(function(list) {
			console.log(list);
			if ((list.collection.length <= 0) || ((offset + limit) > maxResult)) {
				offset = -1;
			} else {
				offset += limit;
			}
			for (var i = 0; i < list.collection.length; i++) {
				if (list.collection[i].streamable) {
					$scope.playlists.push(list.collection[i]);
				}
			}
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$ionicLoading.hide();
			checkPhase();
		}, function(err) {
			console.log(err);
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

