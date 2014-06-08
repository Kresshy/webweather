
/*
 * POST location
 */
var request = require('request');

exports.loc = function(req, res){
	console.log(req.body);

	request("https://maps.googleapis.com/maps/api/geocode/json?address=" 
		+ req.body.location + "&sensor=true&key=AIzaSyAIUD8TLU-GUY_1le8AaojpzXJ-gZYLkQA" 
		, function(error, response, body) {
		if(error)
			res.send(error);
		else
			res.send(body);
	})
};