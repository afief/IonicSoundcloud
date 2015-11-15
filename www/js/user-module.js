var userModule = angular.module("UserModule", [], ["$httpProvider", function($httpProvider) {
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
}]);

userModule.factory("user", ["$http","$q", "$rootScope", '$sce', function($http, $q, $root, $sce) {
	return {
		profile: {},
		saveData: function(key, data) {
			if (!window.localStorage)
				return false;

			if (typeof data == "object") {
				data = JSON.stringify(data);
			}
			window.localStorage[key] = data;
			return true;
		},
		loadData: function(key) {
			if (window.localStorage)
				return window.localStorage[key];
			return false;
		},

		get isLogin() {
			return (this.loadData('accessToken') != undefined) && (this.loadData('accessToken') != "");
		},
		login: function() {
			var that = this;
			var loginURL = 'https://soundcloud.com/connect?client_id=' + client_id + '&redirect_uri=' + encodeURIComponent(redirect_uri) + '&response_type=code_and_token&scope=non-expiring&display=popup';
			var winpop = window.open(loginURL, "_blank", "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,resizable=no");
			SC.connectCallback = function(url) {
				url = url || winpop.location.href;

				console.log("Callback", url);
				var access_token = url.split("access_token=")[1].split("&")[0];
				SC.initialize({oauth_token: that.loadData('accessToken')});
				that.saveData("accessToken", access_token);
				that.prepareUser();
				$root.$emit("login", access_token);

				winpop.close();
			}
			winpop.addEventListener("loadstart", function(e) {
				console.log("LOADSTART : " +  e.url);
				if (e && e.url && e.url.startsWith(redirect_uri)) {
					SC.connectCallback(e.url);
				}
			});
		},
		logout: function() {
			console.log("Logout");
			this.saveData('accessToken', '');
			this.saveData('profile', '');
			this.profile = {};
		},
		prepareUser: function() {
			var that = this;
			if (this.isLogin) {
				var profileText = this.loadData('profile');
				if (profileText) {
					this.profile = JSON.parse(profileText);
					console.log("profile", this.profile);
					getProfile();
				} else {
					getProfile();
				}
			}
			function getProfile() {
				if (!SC.isConnected()) {
					SC.initialize({oauth_token: that.loadData('accessToken')});
				}

				SC.get("/me").then(function(e){
					console.log("Load Soundcloud Profile", e);

					that.profile = e;
					that.saveData("profile", e);

					$root.$emit("user-profile", e);

					if (!$root.$$phase)
						$root.$apply();
				});
			}
		}
	}

}]);

userModule.factory('settings', ['$rootScope', 'user', function($root, user){
	var autoplay;
	return  {
		get autoplay() { return autoplay },
		set autoplay(val) {
			autoplay = val;
			user.saveData("setting_autoplay", autoplay);
		}
	};
}]);

userModule.run(["user", "$rootScope", "$http", "settings", function(user, $root, $http, settings) {

	/* get users */
	user.prepareUser();
	$root.user = user;

	/* get settings */
	settings.autoplay = (user.loadData("setting_autoplay") == 'true') ? true : false;
	$root.settings = settings;

	window.us = user;

}]);
