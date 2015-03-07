angular.module('starter.services', ['ngResource'])

.factory('User', function($resource) {
    return $resource('http://localhost:3000/api/v1/users/:user_id', {}, {
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
    return $resource('http://localhost:3000/api/v1/users/:user_id/treatments/:treatment_id', {}, {
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
    return $resource('http://localhost:3000/api/v1/users/:user_id/treatments/:treatment_id/doses/:dose_id', {}, {
        'save': {
            method: 'POST',
            params: {
                quantity: '@start_date',
                measurement_unit: '@end_date'
            }
        }
    });
})

.factory('Dose', function($resource) {
    return $resource('http://localhost:3000/api/v1/users/:user_id/treatments/:treatment_id/frequencies/:frequency_id', {}, {
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
    return $resource('http://localhost:3000/api/v1/users/:user_id/treatments/:treatment_id/doses/:dose_id/medicines/:medicine_id', {}, {
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

.factory('Medicine', function($resource) {
    return $resource('http://localhost:3000/api/v1/users/:user_id/treatments/:treatment_id/doses/:dose_id/medicines/:medicine_id/administration_routes/:administration_route_id', {}, {
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

.factory('TokenHandler', function() {
    var tokenHandler = {};
    var token = "none";

    tokenHandler.set = function(newToken) {
        token = newToken;
    };

    tokenHandler.get = function() {
        return token;
    };

    // wraps given actions of a resource to send auth token
    // with every request
    tokenHandler.wrapActions = function(resource, actions) {
        // copy original resource
        var wrappedResource = resource;
        // loop through actions and actually wrap them
        for (var i = 0; i < actions.length; i++) {
            tokenWrapper(wrappedResource, actions[i]);
        };
        // return modified copy of resource
        return wrappedResource;
    };

    // wraps resource action to send request with auth token
    var tokenWrapper = function(resource, action) {
        // copy original action
        resource['_' + action] = resource[action];
        // create new action wrapping the original
        // and sending token
        resource[action] = function(data, success, error) {
            return resource['_' + action](
                // call action with provided data and
                // appended access_token
                angular.extend({}, data || {}, {
                    access_token: tokenHandler.get()
                }),
                success,
                error
            );
        };
    };

    return tokenHandler;
})

.factory('authInterceptor', function($q, $window) {
    return {
        request: function(config) {
            config.headers = config.headers || {};
            if ($window.localStorage['ApiToken']) {
                config.headers.Authorization = 'Token token=' + $window.localStorage['ApiToken'];
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
});