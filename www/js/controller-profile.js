controll.controller('ProfileCtrl', ['$scope', '$stateParams', '$state', '$ionicLoading', 'user', function($scope, $stateParams, $state, $ionicLoading, user) {
	console.log("ProfileCtrl");

	$scope.tracks = [];

	if (user.isLogin) {
		SC.get('/users/44556246/tracks', {offset: 0,limit: 5}, function(tracks) {
			console.log("tracks", tracks);
			if (tracks && tracks.length)
				$scope.tracks = tracks;

			checkPhase();
		});
	}

	function checkPhase() {
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	}
}]);