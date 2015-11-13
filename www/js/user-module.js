var userModule = angular.module("UserModule", [], ["$httpProvider", function($httpProvider) {
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
}]);

userModule.factory("user", ["$http","$q", function($http, $q) {
	return {
		profile: {},
		saveData: function(key, data) {
			if (typeof data == "object") {
				data = JSON.stringify(data);
			}
			window.localStorage[key] = data;
		},
		loadData: function(key) {
			return window.localStorage[key];
		}
	}

}]);

userModule.run(["user", "$rootScope", "$http", function(user, $root, $http) {
	
}]);
