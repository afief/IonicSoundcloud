var playerModule = angular.module("PlayerModule", []);

playerModule.factory("player", function() {
	console.log("Player Factory");

	var currentTrack = false;
	var playerEl = document.createElement("audio");
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
		set playingProgress(percent) {
			playerEl.currentTime = playerEl.duration / 100 * percent;
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

playerModule.directive('playerDir', function() {
	return {
		restrict: 'E',
		templateUrl: 'html/player-directive.html',
		link: function (scope, element) {

		},
		controller: ['$scope', '$state', 'player', function($scope, $state, player){
			var seekPercent = document.querySelector("#playerSeekPercent"); seekPercent.style.width = "0%";
			var bufferPercent = document.querySelector("#playerBufferPercent"); bufferPercent.style.width = "0%";

			function onTimeupdate(e) {
				seekPercent.style.width = e + "%";
			}
			function onProgress(e) {
				bufferPercent.style.width = e + "%";
			}

			$scope.player = player;
			$scope.canShowUp = function() {
				var canShow = (player.track && ($state.current.name != 'app.play'));
				if (canShow) {
					console.log("can show");
					player.onTimeupdate	= onTimeupdate;
					player.onProgress	= onProgress;

					seekPercent.style.width = player.playingProgress + "%";
					bufferPercent.style.width = player.downloadProgress + "%";
				}
				return canShow;
			}
			$scope.doPlayPause = function() {
				if (!player.playing) {
					player.play();
				} else {
					player.pause();
				}
			}
			$scope.openPlayerPage = function() {
				player.onTimeupdate	= null;
				player.onProgress	= null;

				$state.go("app.play");
			}
		}]
	};
});