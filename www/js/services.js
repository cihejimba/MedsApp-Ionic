angular.module('starter.services', ['ngResource'])

.factory('Session', function($resource){
	return $resource('http://localhost:port/api/v1/users/:sessionId', {port:':3000'});
});