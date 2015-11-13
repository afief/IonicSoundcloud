var controll = angular.module('starter.controllers', []);

controll.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', '$ionicLoading', 'user', function($scope, $ionicModal, $timeout, $ionicLoading, user) {


	$scope.doRefresh = function() {
		/* Simulate Loading */
		$ionicLoading.show({template: 'Fetch Data'});
		$timeout(function() {
			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');
		}, 2000);

	}	

	$scope.doLogin = function() {	

		if (user.loadData('accessToken'))	 {
			SC.accessToken(user.loadData('accessToken'));
			getUser();
		} else {
			SC.connect(function(){
				getUser();
			});
		}


		function getUser() {
			SC.get("/me",function(e){
				console.log(e);
				user.profile = e;
				user.saveData("profile", e);
				user.saveData("accessToken", SC.accessToken());
			});
		}

	}
	

}]);

controll.controller('SearchCtrl', ['$scope', "$state", "$ionicLoading", "$ionicPopup", function($scope, $state, $ionicLoading, $ionicPopup) {
	var maxResult = 28;
	var limit = 7;
	var offset = 0;

	$scope.searchResult = [];
	$scope.search = {};

	$scope.doSearch = function() {
		console.log("search", $scope.search);

		$scope.searchResult = [];
		offset = 0;

		loadSongs();
	}

	$scope.openSong = function(id) {
		$state.go("app.play", {soundcloud_id: id});
	}

	$scope.loadMore = function() {
		console.log("load more");
		if (offset != -1) { 
			loadSongs();
		}
	}
	$scope.canLoadMore = function() {
		return offset > 0;
	}

	$scope.durationToTime = function(dur) {
		var ms = dur / 1000;
		var m = Math.floor(ms / 60); m = (m < 10?"0":"") + m;
		var s = Math.floor(ms % 60); s = (s < 10?"0":"") + s;
		return m + ":" + s;
	}

	function loadSongs() {
		$ionicLoading.show({template: "Searching"});
		SC.get('/tracks', { q: $scope.search.text, offset: offset, limit: limit, linked_partitioning: 1}, function(tracks) {
			console.log(tracks);
			if ((tracks.collection.length <= 0) || ((offset + limit) > maxResult)) {
				offset = -1;
			} else {
				offset += limit;
			}
			for (var i = 0; i < tracks.collection.length; i++) {
				if (tracks.collection[i].streamable) {
					$scope.searchResult.push(tracks.collection[i]);
					console.log("tracks", tracks.collection[i].title);
				}
			}
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

controll.controller('PlayerCtrl', ['$scope', '$stateParams', '$ionicPlatform', '$timeout', '$ionicLoading', function($scope, $stateParams, $ionicPlatform, $timeout, $ionicLoading) {
	console.log("Player Controller");

	var SC_ID = $stateParams.soundcloud_id;
	var player = document.querySelector("#playerElement");
	var seekPercent = document.querySelector("#seekPercent"); seekPercent.style.width = "0%";
	var bufferPercent = document.querySelector("#bufferPercent"); bufferPercent.style.width = "0%";

	$scope.song = false;
	$ionicLoading.show({template: "Fetch Data"});
	SC.get('/tracks/' + SC_ID, function(res) {
		$scope.song = res;
		console.log(res);
		player.src = res.stream_url + "?client_id=" + client_id;

		$ionicLoading.hide();
	});	

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
	player.addEventListener("canplay", function() {
		player.play();
	});
	player.addEventListener("timeupdate", function(e) {
		seekPercent.style.width = (player.currentTime / player.duration * 100) + "%";
	});
	player.addEventListener('progress', function() {
		var range = 0;
		var bf = this.buffered;
		var time = this.currentTime;
		try {
			while(!(bf.start(range) <= time && time <= bf.end(range))) {
				range += 1;
			}
			var loadEndPercentage = bf.end(range) / this.duration;
			bufferPercent.style.width = (loadEndPercentage * 100) + "%";
		} catch(e) {
			console.warn(e);
		}

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

	$scope.isLoved = false;
	$scope.setLoving = function(song_id) {
		$scope.isLoved = !$scope.isLoved;
	}

	function checkPhase() {
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	}

}]);