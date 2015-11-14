controll.controller('HomeCtrl', ['$scope', "$state", "$stateParams", "$ionicLoading", "$ionicPopup", function($scope, $state, $stateParams, $ionicLoading, $ionicPopup) {
	$scope.search = {};

	$scope.doSearch = function() {
		if ($scope.search.text && ($scope.search.text != ""))
			$state.go("app.search", {search_text: $scope.search.text});
	}

}]);

