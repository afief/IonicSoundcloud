controll.controller('PlayerCtrl', ['$scope', '$stateParams', '$ionicPlatform', '$ionicLoading', 'user', 'settings', '$ionicModal', '$ionicHistory', 'player', function($scope, $stateParams, $ionicPlatform, $ionicLoading, user, settings, $ionicModal, $ionicHistory, player) {
	console.log("Player Controller");

	var seekPercent = document.querySelector("#seekPercent"); seekPercent.style.width = "0%";
	var bufferPercent = document.querySelector("#bufferPercent"); bufferPercent.style.width = "0%";

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
		seekPercent.style.width = e + "%";
	}
	function onProgress(e) {
		bufferPercent.style.width = e + "%";
	}


	/* prepare player event listeners and seekbar */
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


	/* Playlist */
	$ionicModal.fromTemplateUrl('html/modal-playlist.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.addSelectPlaylist = function(song_id) {
		console.log("show");
		$scope.modal.show();
	}
	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});
	$scope.$on('$stateChangeStart', function(e){
		$scope.modal.remove();
	});

}]);