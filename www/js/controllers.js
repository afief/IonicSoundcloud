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

controll.factory("player", function() {
	console.info("Player Factory");

	var currentTrack = false;
	var playerEl = document.querySelector("#playerElement");
	var progressPercentage = 0;
	var playingProgress = 0;

	/* callbacks */
	var onProgress = null;
	var onTimeupdate = null;
	var onPlaying = null;
	var onPause = null;
	var onEnded = null;

	function play(track) {
		/* play from paused */
		if (!track) {
			playerEl.play();
			return;
		}

		/* play new track */
		if (!currentTrack || (currentTrack.stream_url != track.stream_url)) {
			currentTrack = track;
			playerEl.src = currentTrack.stream_url + "?client_id=" + client_id;
			playerEl.play();
		}
	}
	function pause() {
		if (!playerEl.paused) {
			playerEl.pause();
		}
	}

	function whenPlaying() {
		if (onPlaying) onPlaying();
	}
	function whenPause() {
		if (onPause) onPause();
	}
	function whenEnded() {
		if (onEnded) onEnded();
	}

	function whenTimeupdate(e) {
		playingProgress = playerEl.currentTime / playerEl.duration * 100;
		if (onTimeupdate)
			onTimeupdate(playingProgress);
	}

	function whenProgress(e) {
		var range = 0;
		var bf = this.buffered;
		var time = this.currentTime;
		try {
			while(!(bf.start(range) <= time && time <= bf.end(range))) {
				range += 1;
			}
			progressPercentage = bf.end(range) / this.duration * 100;
			if (onProgress)
				onProgress(progressPercentage);
		} catch(e) {
			//console.warn(e)
		}
	}

	playerEl.addEventListener("playing", whenPlaying);
	playerEl.addEventListener("pause", whenPause);
	playerEl.addEventListener("ended", whenEnded);
	playerEl.addEventListener("timeupdate", whenTimeupdate);
	playerEl.addEventListener("progress", whenProgress);
	

	return {
		get track() {
			return currentTrack;
		},
		set track(val) {
			currentTrack = val;
		},
		get player() {
			return playerEl;
		},
		get downloadProgress() {
			return progressPercentage;
		},
		get playingProgress() {
			return playingProgress;
		},
		get playing() {
			return !playerEl.paused;
		},

		set onProgress(val) {
			onProgress = val;
		},
		set onTimeupdate(val) {
			onTimeupdate = val;
		},
		set onPlaying(val) {
			onPlaying = val;
		},
		set onPause(val) {
			onPause = val;
		},
		set onEnded(val) {
			onEnded = val;
		},

		play: function(track) {
			play(track);
		},
		pause: function() {
			pause();
		}
	}

});