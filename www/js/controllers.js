var controll = angular.module('starter.controllers', []);

controll.run(['$rootScope', function($root){
	$root.durationToTime = function(dur) {
		var ms = dur / 1000;
		var m = Math.floor(ms / 60); m = (m < 10?"0":"") + m;
		var s = Math.floor(ms % 60); s = (s < 10?"0":"") + s;
		return m + ":" + s;
	}
	$root.$on('$ionicView.beforeEnter', function(e, data) {
		$root.isBackButtonShown = data.enableBack;
	});
}]);

controll.controller('AppCtrl', ['$scope', '$state', '$timeout', '$ionicLoading', 'user', '$ionicViewService', 'user', 'player', function($scope, $state, $timeout, $ionicLoading, user, $ionicViewService, user, player) {

	$scope.openSong = function(track) {
		player.play(track);
		$scope.changeState("app.play");
	}

	$scope.openPlaylist = function(id) {
		$scope.changeState("app.playlist", {playlist_id: id});
	}

	$scope.changeState = function(name, params, isReplace) {
		if (isReplace) {
			$ionicViewService.nextViewOptions({
				disableBack: true
			});
		}
		$state.go(name, params);
	}

	$scope.currentStateName = function() {
		return $state.current.name;
	}


}]);