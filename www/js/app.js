// Ionic Starter App

// for ripple emulator dele this on deploy
var annoyingDialog = parent.document.getElementById('exec-dialog');
if ( annoyingDialog ) annoyingDialog.outerHTML = "";

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'angularMoment', 'ngMessages', 'starter.controllers'])

.run(function($ionicPlatform, $rootScope, $http) {

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $compileProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: 'loginCtrl'
    })

    .state('register', {
        url: '/signup',
        templateUrl: 'templates/register.html',
        controller: "registerCtrl"
    })

    .state('recover', {
        url: '/recover',
        templateUrl: 'templates/recover.html',
        controller: 'recoverCtrl'
    })

    .state('treatments', {
        url: '/treatments',
        templateUrl: 'templates/treatments.html',
        controller: 'treatmentsCtrl'
    })

    .state('new_treatment', {
        url: '/new_treatment',
        templateUrl: 'templates/create_treatment.html',
        controller: 'newTreatmentCtrl'
    });

    // .state('treatment', {
    //     url: '/treatment',
    //     templateUrl: 'templates/treatment.html'
    // });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
});