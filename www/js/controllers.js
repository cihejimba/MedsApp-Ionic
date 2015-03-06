angular.module('starter.controllers', ['starter.services'])

.controller('treatmentsCtrl', function($scope, $ionicLoading, $ionicPopover, $ionicModal, $http, User, RequestService) {

    // Popover from treatments template control and configuration
    $ionicPopover.fromTemplateUrl('templates/treatment_more_popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.openPopoverTreatmentMore = function($event, treatment) {
        $scope.treatment = treatment;
        $scope.popover.show($event);
    };
    $scope.closePopoverTreatmentMore = function() {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function() {
        // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
        // Execute action
    });

    // show details from popover -> modal configuration
    $ionicModal.fromTemplateUrl('templates/treatment_modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // json loading setup promise frm treatments template list
    $scope.closeTreatmentModal = (function() {
        $scope.modal.hide();
    });

    $ionicLoading.show({
        duration: 1000
    });

    $scope.user = User.get({
        user_id: 1,
    });

    $scope.user.$promise.then(function(result) {
        $scope.user = result;
        $ionicLoading.hide();
    });
})

.controller('registerCtrl', function($scope, User) {

    $scope.user = {
        email: '',
        password: ''
    };

    $scope.signUp = function(form) {

        if (form.$valid) {
            // do something
            var new_user = User.save({
                email: $scope.user.email,
                password: $scope.user.password
            });
            console.log(new_user);
        }
    }
})

.controller('recoverCtrl', function($scope, User) {

    $scope.recover = {
        email: ''
    };

    $scope.recoverPass = function(form) {

        if (form.$valid) {
            // do something

        }
    }

})

.controller('loginCtrl', function($scope, $state, User, RequestService) {

    $scope.user = {
        email: '',
        password: '',
    };

    $scope.signIn = function(form) {

        if (form.$valid) {

            $scope.logged_user = User.login({
                email: $scope.user.email,
                password: $scope.user.password
            });

            $scope.logged_user.$promise.then(function(result) {
                $scope.logged_user = result;
                // console.log($scope.logged_user);
                // console.log($scope.logged_user.api_key);
                RequestService.setToken($scope.logged_user.api_key);
            });

            $state.go('treatments');
        }

    }
});