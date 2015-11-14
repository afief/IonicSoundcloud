var controll = angular.module('starter.controllers', []);

controll.run(['$rootScope', function($root){
	$root.durationToTime = function(dur) {
		var ms = dur / 1000;
		var m = Math.floor(ms / 60); m = (m < 10?"0":"") + m;
		var s = Math.floor(ms % 60); s = (s < 10?"0":"") + s;
		return m + ":" + s;
	}
}]);

controll.controller('AppCtrl', ['$scope', '$state', '$timeout', '$ionicLoading', 'user', function($scope, $state, $timeout, $ionicLoading, user) {


	$scope.doRefresh = function() {
		/* Simulate Loading */
		$ionicLoading.show({template: 'Fetch Data'});
		$timeout(function() {
			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');
		}, 2000);

	}	

	$scope.openSong = function(id) {
		$state.go("app.play", {soundcloud_id: id});
	}

}]);

