controll.controller('PlaylistsCtrl', ["$scope", "$rootScope", "$ionicLoading", "$ionicPopup", "user", function($scope, $root, $ionicLoading, $ionicPopup, user) {

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
			$scope.$parent.loadPlaylists();
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
