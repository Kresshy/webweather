$(document).ready(function() {

	var isVisible = false;

	var location = (function() {
		var self = this;

		self.latitude = 47.4727616;
		self.longitude = 19.0533049;
		self.weather = {};

		return {
			setLocation: function(latitude, longitude) {
				self.longitude = longitude;
				self.latitude = latitude;
			},
			toString: function() {
				console.log('longitude: ' + self.longitude + ' latitude: ' + self.latitude);
			},
			getLatitude: function() {
				return self.latitude;
			},
			getLongitude: function() {
				return self.longitude;
			},
			getAJAXWeather: function() {
				
				$.ajax({
					type: 'POST',
					//API KEY: 023a670b59c0f3caebe079b310908602
					url: '/weather',
					contentType: 'application/json',
					data: JSON.stringify({
						latitude: self.latitude,
						longitude: self.longitude
					})
				}).done(function(data) {
					//console.log(data);
					self.weather = JSON.parse(data);
					NProgress.done();

					// always render the data after ajax request
					readWeatherData(self.weather);
					pollingWeatherData();
				});
			},
		};
	})();

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {

			NProgress.start();
			
			// location is available
			location.setLocation(position.coords.latitude, position.coords.longitude);
			location.toString();

			// getting weather information from the node back-end
			location.getAJAXWeather();

		}, function(data) {

			// error no location data is available
			console.log('Geolocation service is denied');
			// we should ask for the current city 
			var city = prompt("Please enter your current location");
			NProgress.start();

			// using the geolocation service from the back-end
			$.ajax({
				type: 'POST',
				url: '/location',
				contentType: 'application/json',
				data: JSON.stringify({
					location: city
				})
			}).done(function(data) {
				//console.log(data);
				var response = JSON.parse(data);

				location.setLocation(response.results[0].geometry.location.lat , response.results[0].geometry.location.lng);
				location.toString();

				location.getAJAXWeather();			
			});

		});
	} else {

		// geolocation is not supported
		console.log('Geolocation is not supported by this browser using predefined values for testing');

		var city = prompt("Please enter your current location");
		NProgress.start();

		$.ajax({
			type: 'POST',
			url: '/location',
			contentType: 'application/json',
			data: JSON.stringify({
				location: city
			})
		}).done(function(data) {
			//console.log(data);
			var response = JSON.parse(data);

			location.setLocation(response.results[0].geometry.location.lat , response.results[0].geometry.location.lng);
			location.toString();

			location.getAJAXWeather();			
		});
	}

	function readWeatherData(weather) {

		// create a new javascript Date object based on the timestamp
		// multiplied by 1000 so that the argument is in milliseconds, not seconds
		var date = new Date(weather.currently.time*1000);
		
		var year = date.getUTCFullYear();
		var daynum = date.getUTCDate();
		var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var month = months[date.getUTCMonth()];
		var day = weekday[date.getDay()];
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();

		var formattedTime = year + '. ' + month + '. ' + daynum + '. - ' + day;
		
		for(var i = 0; i < weather.daily.data.length; i++) {
			var timeAsDate = new Date(weather.daily.data[i].time*1000)
			weather.daily.data[i].time = weekday[timeAsDate.getDay()];
		}

		// rendering the client side template engine with mustache
		var daily_template = $('#daily-weather-template').html();
		Mustache.parse(daily_template);
		var daily_render = Mustache.render(daily_template, {daily: weather.daily});
		$('#daily-weather').html(daily_render);

		var current_template = $('#current-weather-template').html();
		Mustache.parse(current_template);
		var current_render = Mustache.render(current_template, {current: {
			icon: weather.currently.icon,
			time: formattedTime,
			wind: weather.currently.windSpeed,
			summary: weather.currently.summary,
			temperature: weather.currently.temperature,
			humidity: weather.currently.humidity
		}});
		$('#current-weather').html(current_render);
	}

	// recursive ajax polling for automatically refreshing weather informations
	function pollingWeatherData() {
		setTimeout(function() {
			$.ajax({
				type: 'POST',
				url: '/weather',
				contentType: 'application/json',
				data: JSON.stringify({
					latitude: location.getLatitude(),
					longitude: location.getLongitude()
				}),
				success: function(data) {
					readWeatherData(JSON.parse(data));
					pollingWeatherData();
				}
			});
		}, 1000*60*5);
	}

	// searching for other place's weather information
	$('#location-submit').click(function() {
		var place = $('#location-input').val();


		NProgress.start();

		// minimalistic input validation 
		if (place === "") {

			NProgress.done();

			var searchField = $("#location-input");
			var searchFieldClone = searchField.clone(true);

			searchField.before(searchFieldClone);
			searchField.remove();
			searchFieldClone.addClass("animated shake");

			$('#notification-field').text('The place nothing does not exists! ;)');
			if(!isVisible) {
				isVisible = true;
				$('#notification-field').fadeIn().delay(5000).fadeOut("slow", function() {
					isVisible = false;
				});
			}
			
		} else {
			$.ajax({
				type: 'POST',
				url: '/location',
				contentType: 'application/json',
				data: JSON.stringify({
					location: place
				})
			}).done(function(data) {
				//console.log(data);
				var response = JSON.parse(data);

				NProgress.set(0.5);

				location.setLocation(response.results[0].geometry.location.lat , response.results[0].geometry.location.lng);
				location.toString();

				location.getAJAXWeather();			
			});
		}
	});
});