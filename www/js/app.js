var client_id = "7e747f7d6f9eedfbf64282e8d5ef8673";

angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {

	SC.initialize({
		client_id: client_id
	});

	$ionicPlatform.ready(function() {

		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);

		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}

	});
})

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider

	.state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'html/index.html',
		controller: 'AppCtrl'
	})

	.state('app.home', {
		url: '/home',
		views: {
			content: {
				templateUrl: 'html/home.html'
			}
		}
	})
	.state('app.search', {
		url: '/search',
		views: {
			content: {
				templateUrl: 'html/search.html',
				controller: 'SearchCtrl'
			}
		}
	})
	.state('app.play', {
		url: '/play/:soundcloud_id',
		views: {
			content: {
				templateUrl: 'html/player.html',
				controller: 'PlayerCtrl'
			}
		}
	})
	.state('app.profile', {
		url: '/profile',
		views: {
			content: {
				templateUrl: 'html/profile.html'
			}
		}
	})
	.state('app.message', {
		url: '/message',
		views: {
			content: {
				templateUrl: 'html/message.html'
			}
		}
	})
	.state('app.settings', {
		url: '/settings',
		views: {
			content: {
				templateUrl: 'html/settings.html'
			}
		}
	})

	$urlRouterProvider.otherwise('/app/home');
});