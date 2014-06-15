
var weatherControllers = angular.module('weatherControllers', []);

weatherControllers.controller('weatherController', ['$scope', '$http', 'Weather',
  function ($scope, $http, Weather) {

    $scope.getWeather = function(lat, lng) {
      /*
      $http.post('/weather', {
        latitude: lat,
        longitude: lng
      }).success(function(data) {
        $scope.weather = data;

        $('#current-weather').show();
        $('#daily-weather').show();      
        
        NProgress.done();
      });*/

      Weather.query({latitude: lat, longitude: lng},
        function(weather) {
          $scope.weather = weather;

          $('#current-weather').show();
          $('#daily-weather').show();      
            
          NProgress.done();
        }
      );
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