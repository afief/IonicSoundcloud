var userModule = angular.module("UserModule", [], ["$httpProvider", function($httpProvider) {
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
}]);

userModule.factory("user", ["$http","$q", "$rootScope", function($http, $q, $root) {
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
			SC.connect(function(){
				that.saveData("accessToken", SC.accessToken());
				that.prepareUser();
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
				if (!SC.accessToken())
					SC.accessToken(that.loadData('accessToken'));

				SC.get("/me", function(e,f){
					console.log("Load Soundcloud Profile", e, f);
					if (f) {
						if (f.message && (f.message == "HTTP Error: 401"))
							that.logout();
						return;
					}
					that.profile = e;
					that.saveData("profile", e);
					that.saveData("accessToken", SC.accessToken());

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
			console.log("set setting", val);
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

}]);
