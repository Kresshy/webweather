var weatherService = angular.module('weatherService', ['ngResource']);

weatherService.factory('Weather', ['$resource', 
	function($resource) {
		return $resource('/weather', 
		{
			latitude: '@latitude',
			longitude: '@longitude'
		}, 
		{
			query: {
				method: 'POST', 
				params: {
					latitude: '@latitude', 
					longitude: '@longitude'
				}
			}
		});
}]);