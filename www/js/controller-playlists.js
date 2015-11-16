controll.controller('PlaylistsCtrl', ["$scope", "$rootScope", "$ionicLoading", "$ionicPopup", "user", function($scope, $root, $ionicLoading, $ionicPopup, user) {
	var maxResult = 28;
	var limit = 7;
	var offset = 0;

	$scope.isLoadingData = false;
	$scope.playlists = [];
	
	if (user.isLogin) {		
		loadPlaylists();
	}
	$root.$on("user-profile", function(e) {
		loadPlaylists();
	});

	$scope.loadMore = function() {
		console.log("load more");
		if (offset != -1) { 
			loadPlaylists();
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
		SC.get("/me/playlists", { offset: 0, limit: limit, linked_partitioning: 1}).then(function(list) {
			$scope.$broadcast('scroll.refreshComplete');
			$scope.isLoadingData = false;

			if (list && !list.errors && (list.collection.length > 0)) {

				$scope.playlists = [];
				offset = list.collection.length;

				for (var i = 0; i < list.collection.length; i++) {
					if (list.collection[i].streamable) {
						$scope.playlists.push(list.collection[i]);
					}
				}
			}
		}, function() {
			$scope.$broadcast('scroll.refreshComplete');
			$scope.isLoadingData = false;
		});
	}

	function loadPlaylists() {
		if ($scope.isLoadingData) return;

		$ionicLoading.show({template: "Fetch Data"});
		$scope.isLoadingData = true;

		SC.get('/me/playlists', { offset: offset, limit: limit, linked_partitioning: 1}).then(function(list) {
			console.log(list);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$ionicLoading.hide();
			$scope.isLoadingData = false;

			if (list && !list.errors) {
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
			}

			checkPhase();
		}, function(err) {
			console.log("error", err);

			$scope.$broadcast('scroll.infiniteScrollComplete');
			$ionicLoading.hide();
			$scope.isLoadingData = false;

			checkPhase();
		});
	}

	$scope.newlist = {title: ""};
	$scope.doCreatePlaylist = function() {
		if ($scope.newlist.title == "") {
			$ionicPopup.alert({template: "New Playlist Title Cannot Empty", title: "Failed"});
			return;
		}

		$ionicLoading.show({template: "Creating New Playlist"});
		SC.post('/playlists', {
			playlist: { title: $scope.newlist.title, tracks: [] }
		}).then(function() {
			console.log("Playlist Created");
			loadPlaylists();
		}, function() {
			$ionicPopup.alert({template: "Failed Creating Playlist", title: "Failed"});
		});
	}

	function checkPhase() {
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	}
}]);

