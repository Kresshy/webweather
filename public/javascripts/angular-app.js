
var phonecatApp = angular.module('weatherApp', []);

phonecatApp.controller('weatherController', function ($scope, $http) {
  		
  	$http.post('/weather', {latitude: 47.4727616, longitude: 19.0533049}).success(function(data) {
  		$scope.weather = data;
  		console.log($scope.weather);
  	});
});