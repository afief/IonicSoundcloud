controll.controller('PlayerCtrl', ['$scope', '$stateParams', '$ionicPlatform', '$ionicLoading', 'user', 'settings', '$ionicModal', '$ionicHistory', 'player', function($scope, $stateParams, $ionicPlatform, $ionicLoading, user, settings, $ionicModal, $ionicHistory, player) {
	console.log("Player Controller");

	var seekPercent = document.querySelector("#seekPercent"); seekPercent.value = 0;
	var bufferPercent = document.querySelector("#bufferPercent"); bufferPercent.style.width = "0%";
	var isSeekDown = false;

	$scope.track = false;
	$scope.isPlaying = false;

	/*
	Player Events
	*/
	function onPlaying() {
		$scope.isPlaying = true;
		checkPhase();
	}
	function onPause() {
		$scope.isPlaying = false;
		checkPhase();
	}
	function onEnded() {
		$scope.isPlaying = false;
		checkPhase();
	}

	function onTimeupdate(e) {
		if (!isSeekDown)
			seekPercent.value = e;
	}
	function onProgress(e) {
		bufferPercent.style.width = e + "%";
	}

	function onSeekChanged() {
		player.playingProgress = seekPercent.value;
		isSeekDown = false;
	}
	function onSeekStart() {
		isSeekDown = true;
	}

	/* prepare player event listeners and seekbar */
	seekPercent.addEventListener("change", onSeekChanged);
	seekPercent.addEventListener("mousedown", onSeekStart);
	seekPercent.addEventListener("touchstart", onSeekStart);

	$scope.$on("$ionicView.enter", function() {
		/* back to previous state or home if there is no song data saved at current_play */
		if (!player.track) {
			if ($ionicHistory.backView())
				$ionicHistory.goBack();
			else
				$scope.changeState("app.home", {}, true);
			return;
		}

		player.onPlaying	= onPlaying;
		player.onPause		= onPause;
		player.onEnded		= onEnded;
		player.onTimeupdate	= onTimeupdate;
		player.onProgress	= onProgress;

		seekPercent.style.width = player.playingProgress + "%";
		bufferPercent.style.width = player.downloadProgress + "%";

		$scope.track = player.track;
		$scope.isLoved = player.track.user_favorite;
		$scope.isPlaying = player.playing;
	});
	$scope.$on("$ionicView.leave", function() {
		player.onPlaying	= null;
		player.onPause		= null;
		player.onEnded		= null;
		player.onTimeupdate	= null;
		player.onProgress	= null;
	});	
	
	/*
	Controller Click
	*/
	$scope.doPlay = function() {
		console.log("isplay", player.playing);
		if (!player.playing) {
			player.play();
		} else {
			player.pause();
		}
	}

	$scope.setLoving = function(song_id) {
		$scope.isLoved = !$scope.isLoved;
		if (user.isLogin) {

			if ($scope.isLoved)
				SC.put("/me/favorites/" + $scope.track.id).then(function() { console.log("put favorite", $scope.track.id)});
			else
				SC.delete("/me/favorites/" + $scope.track.id).then(function() { console.log("delete favorite", $scope.track.id)});
		}
	}

	function checkPhase() {
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	}

	$scope.addSelectPlaylist = function(track_id) {
		$scope.$parent.addToPlaylist(track_id);
	}

}]);