angular.module('starter.controllers', ['starter.services'])

.service('Session', function() {
    var user = '';

    return {
        getUser: function() {
            return user;
        },
        setUser: function(value) {
            user = value;
        }
    };
})

.controller('treatmentsCtrl', function($scope, $ionicLoading, $ionicPopover, $ionicModal, $http, Session, User) {

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
        user_id: Session.getUser().id,
    });

    $scope.user.$promise.then(function(result) {

        $scope.user = result;
        $ionicLoading.hide();
    });

})

.controller('registerCtrl', function($scope, $state, $ionicPopup, User) {

    $scope.user = {
        email: '',
        password: ''
    };

    $scope.signUp = function(form) {

        if (form.$valid) {
            // do something
            $scope.user = User.save({
                email: $scope.user.email,
                password: $scope.user.password
            });

            $scope.user.$promise.then(function(result) {
                // success
                $scope.user = result;
                // show promt to email account
                $ionicPopup.alert({
                    title: 'Registration Successful',
                    template: 'Welcome ' + result.email + '!',
                    cssClass: 'positive'
                }).then(function() {
                    $state.go('login');
                });


            }, function(result) {
                // failure
                if (result.status = 422) {
                    var template = '';
                    if (result.data.errors.email) {
                        template = template + 'Email ' + result.data.errors.email;
                    }
                    if (result.data.errors.password) {
                        template = template + 'Password ' + result.data.errors.password;
                    }
                    // show promt to email error
                    $ionicPopup.alert({
                        title: "Couldn't register your account",
                        template: template,
                        cssClass: 'assertive'
                    });

                }
            });
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

.controller('loginCtrl', function($scope, $state, $window, $ionicPopup, Session, User) {

    $scope.user = {
        email: '',
        password: '',
    };

    $scope.signIn = function(form) {

        if (form.$valid) {

            $scope.user = User.login({
                email: $scope.user.email,
                password: $scope.user.password
            });

            $scope.user.$promise.then(function(result) {
                $scope.user = result;
                // save user to service to share between controllers
                Session.setUser($scope.user);
                console.log(Session.getUser());
                // console.log($scope.user);
                // console.log($scope.user.api_key);
                // save api token locally
                $window.localStorage['ApiToken'] = $scope.user.api_key;
                // move to treatments on successful login
                $state.go('treatments');
            }, function(result) {
                if (result.status = 403) {
                    // show promt to email error
                    $ionicPopup.alert({
                        title: "Something went wrong!",
                        template: result.data.message,
                        cssClass: 'assertive'
                    });

                }
            });
        }

    }
});