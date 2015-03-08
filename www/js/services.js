angular.module('starter.services', ['ngResource'])

.factory('User', function($resource) {
    return $resource('http://localhost:3000/api/v1/users/:user_id', {
        user_id: '@user_id',
    }, {
        'save': {
            method: 'POST',
            params: {
                email: '@email',
                password: '@password'
            }
        },
        'login': {
            url: 'http://localhost:3000/api/v1/login',
            method: 'GET',
            params: {
                email: '@email',
                password: '@password'
            }
        },
    });
})

.factory('Treatment', function($resource) {
    return $resource('http://localhost:3000/api/v1/users/:user_id/treatments/:treatment_id', {
        user_id: '@user_id',
        treatment_id: '@treatment_id'
    }, {
        'save': {
            method: 'POST',
            params: {
                start_date: '@start_date',
                end_date: '@end_date',
                description: '@description'
            }
        }
    });
})

.factory('Dose', function($resource) {
    return $resource('http://localhost:3000/api/v1/users/:user_id/treatments/:treatment_id/doses/:dose_id', {
        user_id: '@user_id',
        treatment_id: '@treatment_id',
        dose_id: '@dose_id'
    }, {
        'save': {
            method: 'POST',
            params: {
                quantity: '@quantity',
                measurement_unit: '@measurement_unit'
            }
        }
    });
})

.factory('Frequency', function($resource) {
    return $resource('http://localhost:3000/api/v1/users/:user_id/treatments/:treatment_id/frequencies/:frequency_id', {
        user_id: '@user_id',
        treatment_id: '@treatment_id',
        frequency_id: '@frequency_id'
    }, {
        'save': {
            method: 'POST',
            params: {
                occurrences: '@occurrences',
                period_of_time: '@period_of_time'
            }
        }
    });
})

.factory('Medicine', function($resource) {
    return $resource('http://localhost:3000/api/v1/users/:user_id/treatments/:treatment_id/doses/:dose_id/medicines/:medicine_id', {
        user_id: '@user_id',
        treatment_id: '@treatment_id',
        dose_id: '@dose_id',
        medicine_id: '@medicine_id'
    }, {
        'save': {
            method: 'POST',
            params: {
                name: "@name",
                company_name: "@company_name",
                sampling_class: "@sampling_class",
                origin: "@origin",
                description: "@description",
                expiration_date: "@expiration_date",
                url_photo: "@url_photo"
            }
        }
    });
})

.factory('AdministrationRoute', function($resource) {
    return $resource('http://localhost:3000/api/v1/users/:user_id/treatments/:treatment_id/doses/:dose_id/medicines/:medicine_id/administration_routes/:administration_route_id', {
        user_id: '@user_id',
        treatment_id: '@treatment_id',
        dose_id: '@dose_id',
        medicine_id: '@medicine_id',
        administration_route_id: '@administration_route_id'
    }, {
        'save': {
            method: 'POST',
            params: {
                name: "@name",
                location_of_application: "@location_of_application",
                systemic_effect: "@systemic_effect"
            }
        }
    });
})

.factory('authInterceptor', function($q, $window) {
    return {
        request: function(config) {
            config.headers = config.headers || {};
            if ($window.localStorage.ApiToken) {
                config.headers.Authorization = 'Token token=' + $window.localStorage.ApiToken;
            }
            return config;
        },
        responseError: function(rejection) {
            if (rejection.status === 401) {
                // handle the case where the user is not authenticated
            }
            return $q.reject(rejection);
        }
    };
})

.config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
})

.service('Session', function() {
    var user = '';
    var isLogged = false;

    return {
        getUser: function() {
            return user;
        },
        login: function(value) {
            user = value;
            isLogged = true;
        },
        logout: function() {
            isLogged = false;
            user = '';
        },
        isActive: function() {
            return isLogged;
        }
    };
})

.factory('Camera', ['$q',
    function($q) {

        return {
            getPicture: function(options) {
                var q = $q.defer();

                navigator.camera.getPicture(function(result) {
                    // Do any magic you need
                    q.resolve(result);
                }, function(err) {
                    q.reject(err);
                }, options);

                return q.promise;
            }
        };
    }
]);