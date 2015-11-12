var controll = angular.module('starter.controllers', []);

controll.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicLoading) {


	$scope.doRefresh = function() {
		/* Simulate Loading */
		$ionicLoading.show({template: 'Fetch Data'});
		$timeout(function() {
			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');
		}, 2000);

	}
	

});