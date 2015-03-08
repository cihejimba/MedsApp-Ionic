angular.module('starter.controllers', ['starter.services'])

.controller('mainCtrl', function($scope, $location, $ionicLoading, Session, User) {
    $scope.$watch(function() {
        return $location.path();
    }, function(newValue, oldValue) {
        if (!Session.isActive() && newValue != '/recover' && newValue != '/signup' && newValue != '/login') {
            $location.path('/login');
        }

        if (Session.isActive() && newValue == '/treatments') {
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
        }
    });
})

.controller('newTreatmentCtrl', function($scope, $state, $window, $ionicPopup, Treatment, Dose, Medicine, Frequency, Session, Camera) {

    $scope.treatment = {
        start_date: '',
        end_date: '',
        description: ''
    };

    $scope.treatment.medicine = {
        name: '',
        company_name: '',
        description: '',
        route_of_administration: 'oral',
        measurement_unit: 'mg',
        quantity: '',
        frequency: '',
        expiration_date: ''
    };

    var options = {
        quality: 80,
        targetWidth: 320,
        targetHeight: 320,
        // destinationType: Camera.DestinationType.DATA_URL,
        // sourceType: Camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: false
    };

    $scope.getPhoto = function() {
        console.log('Getting Camera');
        Camera.getPicture(options).then(function(imageData) {
            // picture taken successfully
            console.log(imageData);
            $scope.lastPhoto = "data:image/jpeg;base64," + imageData;
        }, function(err) {
            // failure an error occurred taking the picture
            console.err(err);
        });
    };

    // new treatment form submit
    $scope.createTreatment = function(form) {

        if (form.$valid) {
            $scope.new_treatment = Treatment.save({
                user_id: Session.getUser().id,
                start_date: $scope.treatment.start_date,
                end_date: $scope.treatment.end_date,
                description: $scope.treatment.description,
            });

            $scope.new_treatment.$promise.then(function(result) {
                // success
                $scope.new_treatment = result;
                // create dose info
                $scope.dose = Dose.save({
                    user_id: Session.getUser().id,
                    treatment_id: $scope.new_treatment.id,
                    quantity: $scope.treatment.medicine.quantity,
                    measurement_unit: $scope.treatment.medicine.measurement_unit,
                });

                $scope.dose.$promise.then(function(result) {
                    // success
                    $scope.medicine = Medicine.save({
                        user_id: Session.getUser().id,
                        treatment_id: $scope.new_treatment.id,
                        dose_id: $scope.dose.id,
                        name: $scope.treatment.medicine.name,
                        company_name: $scope.treatment.medicine.company_name,
                        description: $scope.treatment.medicine.description,
                        expiration_date: $scope.treatment.medicine.expiration_date,
                        url_photo: $scope.lastPhoto
                    });

                    $scope.medicine.$promise.then(function(result) {
                        // show promt to treatment success
                        $ionicPopup.alert({
                            title: "Success!",
                            template: $scope.medicine.name + ' treatment created successfully',
                            cssClass: 'balanced'
                        });
                        // success
                        $state.go('treatments');


                    }, function(result) {
                        // failure
                        if (result.status == 422) {
                            var template = '<ul>';
                            if (result.data.errors.name) {
                                template += '<li>' + 'Name ' + result.data.errors.name[0] + '</li>';
                            }
                            if (result.data.errors.expiration_date) {
                                template += '<li>' + 'Password ' + result.data.errors.expiration_date[0] + '</li>';
                            }
                            template += '</ul>';
                            // show promt to email error
                            $ionicPopup.alert({
                                title: "Something went wrong!",
                                template: template,
                                cssClass: 'assertive'
                            });
                        }
                    });

                }, function(result) {
                    // failure
                    if (result.status == 422) {
                        var template = '<ul>';
                        if (result.data.errors.quantity) {
                            template += '<li>' + 'Quantity ' + result.data.errors.quantity[0] + '</li>';
                        }
                        if (result.data.errors.measurement_unit) {
                            template += '<li>' + 'Measurement Unit ' + result.data.errors.measurement_unit[0] + '</li>';
                        }
                        template += '</ul>';
                        // show promt to email error
                        $ionicPopup.alert({
                            title: "Something went wrong!",
                            template: template,
                            cssClass: 'assertive'
                        });
                    }
                });

            }, function(result) {
                // failure
                if (result.status == 422) {
                    var template = '<ul>';
                    if (result.data.errors.start_date) {
                        template += '<li>' + 'Start Date ' + result.data.errors.start_date[0] + '</li>';
                    }
                    if (result.data.errors.end_date) {
                        template += '<li>' + 'End Date ' + result.data.errors.end_date[0] + '</li>';
                    }
                    if (result.data.errors.description) {
                        template += '<li>' + 'End Date ' + result.data.errors.description[0] + '</li>';
                    }
                    template += '</ul>';
                    // show promt to email error
                    $ionicPopup.alert({
                        title: "Something went wrong!",
                        template: template,
                        cssClass: 'assertive'
                    });
                }
            });
        }
    };
})

.controller('treatmentsCtrl', function($scope, $state, $ionicLoading, $ionicPopover, $ionicModal, $http, $window, Session, User) {

    // Popover from treatments template control and configuration
    $ionicPopover.fromTemplateUrl('templates/treatment_more_popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.treatmentMorePopover = popover;
    });

    $scope.openPopoverTreatmentMore = function($event, treatment) {
        $scope.treatment = treatment;
        $scope.treatmentMorePopover.show($event);
    };
    $scope.closePopoverTreatmentMore = function() {
        $scope.treatmentMorePopover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.treatmentMorePopover.remove();
    });

    // popover for options logout etc
    $ionicPopover.fromTemplateUrl('templates/options_popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.optionsPopover = popover;
    });

    $scope.openPopoverOptions = function($event) {
        $scope.optionsPopover.show($event);
    };
    $scope.closePopoverOptions = function() {
        $scope.optionsPopover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.optionsPopover.remove();
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

    // logout function
    $scope.logout = function(user) {
        Session.logout();
        // go to login page
        $state.go('login');
    };
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
                if (result.status == 422) {
                    var template = '<ul>';
                    if (result.data.errors.email) {
                        template += '<li>' + 'Email ' + result.data.errors.email[0] + '</li>';
                    }
                    if (result.data.errors.password) {
                        template += '<li>' + 'Password ' + result.data.errors.password[0] + '</li>';
                    }
                    template += '</ul>';
                    // show promt to email error
                    $ionicPopup.alert({
                        title: "Couldn't register your account",
                        template: template,
                        cssClass: 'assertive'
                    });

                }
            });
        }
    };
})

.controller('recoverCtrl', function($scope, User) {

    $scope.recover = {
        email: ''
    };

    $scope.recoverPass = function(form) {

        if (form.$valid) {
            // do something

        }
    };

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
                Session.login($scope.user);
                // save api token locally
                $window.localStorage.ApiToken = $scope.user.api_key;
                $window.localStorage.LocalUser = JSON.stringify($scope.user);
                // move to treatments on successful login
                $state.go('treatments');
            }, function(result) {
                if (result.status == 403) {
                    // show promt to email error
                    $ionicPopup.alert({
                        title: "Something went wrong!",
                        template: result.data.message,
                        cssClass: 'assertive'
                    });

                }
            });
        }

    };
});