var controll = angular.module('starter.controllers', []);

controll.run(['$rootScope', function($root){
	$root.durationToTime = function(dur) {
		var ms = dur / 1000;
		var m = Math.floor(ms / 60); m = (m < 10?"0":"") + m;
		var s = Math.floor(ms % 60); s = (s < 10?"0":"") + s;
		return m + ":" + s;
	}
	$root.$on('$ionicView.beforeEnter', function(e, data) {
		console.log("history", data);
        $root.isBackButtonShown = data.enableBack;
    });
}]);

controll.controller('AppCtrl', ['$scope', '$state', '$timeout', '$ionicLoading', 'user', function($scope, $state, $timeout, $ionicLoading, user) {

	$scope.openSong = function(id) {
		$scope.changeState("app.play", {soundcloud_id: id});
	}

	$scope.openPlaylist = function(id) {
		$scope.changeState("app.playlist", {playlist_id: id});
	}

	$scope.changeState = function(name, params) {
		$state.go(name, params);
	}

	$scope.currentStateName = function() {
		return $state.current.name;
	}


}]);

