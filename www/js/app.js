angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
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
	.state('app.project', {
		url: '/project',
		views: {
			content: {
				templateUrl: 'html/project.html'
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
