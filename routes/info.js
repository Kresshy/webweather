
/*
 * POST Weather
 */
var request = require('request');

exports.info = function(req, res){
	console.log(req.body);

	var uri = "https://api.forecast.io/forecast/023a670b59c0f3caebe079b310908602/" 
		+ req.body.latitude + "," + req.body.longitude + "?units=ca"
	console.log(uri);

	request(uri, function(error, response, body) {
		if(error)
			res.send(error);
		else
			res.send(body);
	});
	
};