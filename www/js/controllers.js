angular.module('starter.controllers', ['starter.services'])

.controller('treatmentsCtrl', function($scope, $ionicLoading, $ionicPopover, $ionicModal, Session) {

	$ionicPopover.fromTemplateUrl('templates/treatment_more_popover.html', {
		scope: $scope,
	}).then(function(popover) {
		$scope.popover = popover;
	});

    $ionicLoading.show({
    	duration: 1000
    });

    $scope.user = Session.get({
        sessionId: 18
    })

    $scope.user.$promise.then(function(result) {
        $scope.user = result;
        $ionicLoading.hide();
    });
})

.controller('registerCtrl', function($scope){
	
});

