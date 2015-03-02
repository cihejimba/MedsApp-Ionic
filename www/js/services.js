angular.module('starter.services', ['ngResource'])

.factory('Session', function($resource){
	return $resource('http://127.0.0.1:port/api/v1/users/:sessionId', {port:':3000'});
});