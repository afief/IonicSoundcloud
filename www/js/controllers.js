var controll = angular.module('starter.controllers', []);

controll.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', '$ionicLoading', function($scope, $ionicModal, $timeout, $ionicLoading) {


	$scope.doRefresh = function() {
		/* Simulate Loading */
		$ionicLoading.show({template: 'Fetch Data'});
		$timeout(function() {
			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');
		}, 2000);

	}
	

}]);

controll.controller('SearchCtrl', ['$scope', "$state", function($scope, $state) {
	$scope.searchResult = [];
	$scope.search = {};

	$scope.doSearch = function() {
		console.log("search", $scope.search);

		SC.get('/tracks', { q: $scope.search.text, limit: 5, linked_partitioning: 1}, function(tracks) {
			console.log(tracks);
			for (var i = 0; i < tracks.length; i++) {
				if (tracks[i].streamable) {
					$scope.searchResult.push({
						from: "sc",
						id: tracks[i].id,
						url: tracks[i].stream_url + "?client_id=" + client_id,
						judul: tracks[i].title,
						duration: Math.floor(tracks[i].duration / 1000),
						tanggal: tracks[i].created_at,
						deskripsi: tracks[i].description,
						thumbnail: tracks[i].artwork_url || tracks[i].user.avatar_url,
						avatar: tracks[i].user.avatar_url,
						meta: tracks[i]
					});

					console.log("tracks", tracks[i]);
				}
			}
			$scope.$apply();
		});
	}

	$scope.openSong = function(id) {
		$state.go("app.play", {soundcloud_id: id});
	}
}]);

controll.controller('PlayerCtrl', ['$scope', '$stateParams', '$ionicPlatform', '$timeout', '$ionicLoading', function($scope, $stateParams, $ionicPlatform, $timeout, $ionicLoading) {
	console.log("Player Controller");

	var SC_ID = $stateParams.soundcloud_id;
	var player = document.querySelector("#playerElement");

	$scope.song = false;
	SC.get('/tracks/' + SC_ID, function(res) {
		$scope.song = res;
		console.log(res.stream_url + "?client_id=" + client_id);
		player.src = res.stream_url + "?client_id=" + client_id;
	});

	
	//player.src = "http://192.168.88.14/audio/index.mp3";

	/*
	Player Events
	*/
	$scope.isPlaying = false;
	player.addEventListener("playing", function() {
		$scope.isPlaying = true;
		checkPhase();
	});
	player.addEventListener("pause", function() {
		$scope.isPlaying = false;
		checkPhase();
	});
	player.addEventListener("ended", function() {
		$scope.isPlaying = false;
		checkPhase();
	});
	

	/*
	Controller Click
	*/
	$scope.doPlay = function() {
		if (player.paused) {
			player.play();
		} else {
			player.pause();
		}
	}

	function checkPhase() {
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	}

}]);