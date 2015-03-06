angular.module('starter.services', ['ngResource'])

.factory('User', function($resource) {
    return $resource('http://localhost:3000/api/v1/users/:user_id', {}, {
        'get': {
            method: 'GET',
            headers: {
                token: '@token'
            }
        },
        'save': {
            method: 'POST',
            params: {
                email: '@email',
                password: '@password'
            },
            headers: {
                token: '@token'
            }
        },
        'login': {
        	url: 'http://localhost:3000/api/v1/users/login',
            method: 'POST',
            params: {
                email: '@email',
                password: '@password'
            }
        },
    });
})

.factory('Treatment', function($resource) {
    return $resource('http://localhost:3000/api/v1/users/:user_id/treatments/:treatment_id', {}, {
        'get': {
            method: 'GET',
            headers: {
                token: '@token'
            }
        },
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
        'get': {
            method: 'GET',
            headers: {
                token: '@token'
            }
        },
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
        'get': {
            method: 'GET',
            headers: {
                token: '@token'
            }
        },
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
        'get': {
            method: 'GET',
            headers: {
                token: '@token'
            }
        },
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
        'get': {
            method: 'GET',
            headers: {
                token: '@token'
            }
        },
        'save': {
            method: 'POST',
            params: {
                name: "@name",
                location_of_application: "@location_of_application",
                systemic_effect: "@systemic_effect"
            }
        }
    });
});