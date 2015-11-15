controll.controller('ProfileCtrl', ['$scope', '$stateParams', '$state', '$ionicLoading', 'user', "$rootScope", function($scope, $stateParams, $state, $ionicLoading, user, $root) {
	console.log("ProfileCtrl");

	$scope.tracks = [];

	if (user.isLogin) {
		getTracks();
	}

	$root.$on("user-profile", function(e) {
		getTracks();
	});

	function getTracks() {
		SC.get('/users/44556246/tracks', {offset: 0,limit: 5}).then(function(tracks) {
			console.log("tracks", tracks);
			if (tracks && tracks.length)
				$scope.tracks = tracks;

			checkPhase();
		}, function(err) {
			console.log("failed to get tracks", err);
			checkPhase();
		});
	}

	function checkPhase() {
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	}
}]);