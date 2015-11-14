angular.module('starter', ['ionic', 'starter.controllers', 'UserModule'])

.run(function($ionicPlatform) {

	SC.initialize({
		client_id: client_id,
		redirect_uri: redirect_uri
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
				templateUrl: 'html/home.html',
				controller: 'HomeCtrl'
			}
		}
	})
	.state('app.search', {
		url: '/search/:search_text',
		views: {
			content: {
				templateUrl: 'html/search.html',
				controller: 'SearchCtrl'
			}
		}
	})
	.state('app.favorites', {
		url: '/favorites',
		views: {
			content: {
				templateUrl: 'html/favorites.html',
				controller: 'FavoritesCtrl'
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
				templateUrl: 'html/profile.html',
				controller: 'ProfileCtrl'
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
				templateUrl: 'html/settings.html',
				controller: 'SettingsCtrl'
			}
		}
	})

	$urlRouterProvider.otherwise('/app/home');
});
