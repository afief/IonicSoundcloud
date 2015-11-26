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

controll.controller('AppCtrl', ['$scope', '$state', '$ionicPopup', '$ionicLoading', 'user', '$ionicViewService', 'user', 'player', '$ionicModal', '$rootScope', function($scope, $state, $ionicPopup, $ionicLoading, user, $ionicViewService, user, player,$ionicModal, $root) {

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

	/* PLAYLIST */
	$scope.playlists = [];
	/* if user is login, then load playlist */
	if (user.isLogin) {		
		loadPlaylists();
	}
	/* after user doing login, load playlist */
	$root.$on("user-profile", function(e) {
		loadPlaylists();
	});
	function loadPlaylists() {
		SC.get("/me/playlists", { offset: 0, limit: 100, linked_partitioning: 1}).then(function(list) {
			if (list && !list.errors && (list.collection.length > 0)) {

				$scope.playlists = [];
				offset = list.collection.length;

				for (var i = 0; i < list.collection.length; i++) {
					if (list.collection[i].streamable) {
						$scope.playlists.push(list.collection[i]);
					}
				}
			}
		}, function() {
			
		});
	}
	$scope.loadPlaylists = loadPlaylists;

	/* PLAYLIST MODAL */
	$ionicModal.fromTemplateUrl('html/modal-playlist.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.playlistModal = modal;
	});
	$scope.addToPlaylist = function(track_id) {
		$scope.playlistModal.show();

		$scope.playlistAdd = function(list) {
			var tracks = list.tracks;
			var track_ids = [];
			for (var i = 0; i < tracks.length; i++) {
				track_ids.push({id: tracks[i].id});
			}
			track_ids.push({id: track_id});

			$ionicLoading.show({template: "Insert To Playlist"});
			SC.put("/playlists/" + list.id, {playlist: { tracks: track_ids}} ).then(function() {
				$ionicLoading.hide();
				$scope.playlistModal.hide();

				$scope.loadPlaylists();
			}, function() {
				$ionicLoading.hide();
				$scope.playlistModal.hide();

				$ionicPopup.alert({title: "Failed", template: "Insert Track to Playlist Failed"});
			});
		}
	}
	$scope.closePlaylistModal = function() {
		$scope.playlistModal.hide();
	}
}]);