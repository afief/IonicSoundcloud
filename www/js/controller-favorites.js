controll.controller("FavoritesCtrl", ["$scope", "$rootScope", "$ionicLoading", "user", "$ionicPopover", function($scope, $root, $ionicLoading, user, $ionicPopover) {
	var maxResult = 28;
	var limit = 7;
	var offset = 0;

	$scope.isLoadingData = false;
	$scope.tracks = [];

	if (user.isLogin) {		
		loadSongs();
	}
	$root.$on("user-profile", function(e) {
		loadSongs();
	});

	$scope.loadMore = function() {
		console.log("load more");
		if (offset != -1) { 
			loadSongs();
		}
	}
	$scope.canLoadMore = function() {
		return offset > 0;
	}
	$scope.doRefresh = function() {
		/*
		lang: id
		Load semua data dari awal.
		*/
		$scope.isLoadingData = true;
		SC.get("/me/favorites", { offset: 0, limit: limit, linked_partitioning: 1}).then(function(tracks) {
			$scope.$broadcast('scroll.refreshComplete');
			$scope.isLoadingData = false;

			if (tracks && !tracks.errors && (tracks.collection.length > 0)) {

				$scope.tracks = [];
				offset = tracks.collection.length;

				for (var i = 0; i < tracks.collection.length; i++) {
					if (tracks.collection[i].streamable) {
						$scope.tracks.push(tracks.collection[i]);
					}
				}
			}
		}, function() {
			$scope.$broadcast('scroll.refreshComplete');
			$scope.isLoadingData = false;
		});
	}

	function loadSongs() {
		if ($scope.isLoadingData) return;

		$ionicLoading.show({template: "Fetch Data"});
		$scope.isLoadingData = true;

		SC.get("/me/favorites", { offset: offset, limit: limit, linked_partitioning: 1}).then(function(tracks) {
			$scope.$broadcast("scroll.infiniteScrollComplete");
			$ionicLoading.hide();
			$scope.isLoadingData = false;

			if (tracks && !tracks.errors) {
				if ((tracks.collection.length <= 0) || ((offset + limit) > maxResult)) {
					offset = -1;
				} else {
					offset += limit;
				}
				for (var i = 0; i < tracks.collection.length; i++) {
					if (tracks.collection[i].streamable) {
						$scope.tracks.push(tracks.collection[i]);
					}
				}
			}

			checkPhase();
		}, function(err) {
			console.log("error", err);

			$scope.$broadcast("scroll.infiniteScrollComplete");
			$ionicLoading.hide();
			$scope.isLoadingData = false;

			checkPhase();
		});
	}

	function checkPhase() {
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	}


	/* popup on more button */
	$ionicPopover.fromTemplateUrl('menu-pop.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.popover = popover;
	});
	$scope.openPopover = function($event, track) {
		$scope.popover.show($event);

		$scope.selectPlaylist = function() {
			console.log("OK");
			$scope.$parent.addToPlaylist(track.id);
			$scope.popover.hide();
		}
	};
}]);

