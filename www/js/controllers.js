angular.module('starter.controllers', ['starter.services'])

.controller('treatmentsCtrl', function($scope, $ionicLoading, Session) {

	$ionicLoading.show({
	    content: 'Loading Data',
	    animation: 'fade-in',
	    showBackdrop: false,
	    maxWidth: 200,
	    showDelay: 500
	});

    $scope.user = Session.get({sessionId: 18})
	$scope.user.$promise.then(function(result) {
		$scope.user = result;
		$ionicLoading.hide();
	});
});