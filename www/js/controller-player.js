controll.controller('PlayerCtrl', ['$scope', '$stateParams', '$ionicPlatform', '$ionicLoading', 'user', 'settings', function($scope, $stateParams, $ionicPlatform, $ionicLoading, user, settings) {
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
		if (settings.autoplay)
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