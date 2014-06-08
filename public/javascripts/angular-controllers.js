
var weatherControllers = angular.module('weatherControllers', []);

weatherControllers.controller('weatherController', ['$scope', '$http', 
  function ($scope, $http) {

    $scope.getWeather = function(lat, lng) {

      $http.post('/weather', {
        latitude: lat,
        longitude: lng
      }).success(function(data) {
        $scope.weather = data;

        $('#current-weather').show();
        $('#daily-weather').show();      
        
        NProgress.done();
      });
    }
    
    $scope.search = function(city) {

      NProgress.start();

      $http.post('/location', {
        location: city
      }).success(function(data) {

        var location = {
          latitude: data.results[0].geometry.location.lat,
          longitude: data.results[0].geometry.location.lng
        };

        $scope.getWeather(location.latitude, location.longitude);
      });
    }

    $scope.weather = $scope.search(prompt('Please type in your location!'));
}]);