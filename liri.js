var Twitter = require('twitter');
var keys = require('./keys.js');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');

// terminal array
var command = process.argv;

var client = new Twitter(keys.twitterKeys);

if(command[2] == "my-tweets") {
	var params = {screen_name: 'Jason_Chan__'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	for(var i = 0; tweets.length > i; i++) {
	  		console.log("Tweet number-" + i + ": " +tweets[i].text);
	  	}

	  }
	});
}




if(command[2] == "movie-this") {
 
	var movie = command[3] || "iron man";

	request('http://www.omdbapi.com/?t='+ movie +'&y=&plot=short&r=json&tomatoes=true', function (error, response, body) {

		if (!error && response.statusCode == 200) {

			console.log("Title of the movie: " + JSON.parse(body)["Title"]);
			console.log("Year of the movie: " + JSON.parse(body)["Year"]);
			console.log("IMDB rating of the movie: " + JSON.parse(body)["imdbRating"]);
			console.log("Country where movie produced: " + JSON.parse(body)["Country"]);
			console.log("Languge of the movie: " + JSON.parse(body)["Country"]);
			console.log("Plot of the movie: " + JSON.parse(body)["Plot"]);
			console.log("Actors of the movie: " + JSON.parse(body)["Actors"]);
			console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
			console.log("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
		}
	});
}

if(command.length == 2) {
	console.log("Please type in relevent commands: ");
	console.log("");
	console.log("node liri my-tweets");
	console.log("node liri spotify-this-song 'pass in song here'");
	console.log("node liri movie-this 'pass in movie here'");
	console.log("node liri do-what-it-says");
	console.log("node liri tweet 'tweet something'");
	console.log("node liri read-log");

}

if(command[2] == "spotify-this-song") {
	spotify.search({ type: 'track', query: command[3] || "The Sign by Ace of Base" }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }
	    for(var i = 0; 20 > i;i++){
	    	console.log("Artist: " + JSON.stringify(data.tracks.items[i].artists[0].name, null, 2));
		    console.log("Track: " + JSON.stringify(data.tracks.items[i].name, null, 2));
		    console.log("Album: " + JSON.stringify(data.tracks.items[i].album.name, null, 2));
		    console.log("Preview of track: " + JSON.stringify(data.tracks.items[i].preview_url, null, 2)); 
		    console.log("");
	    }
	     
  
	});
}

// readtext

if(command[2] == "do-what-it-says"){
	fs.readFile("random.txt", "utf8", function(error, data) {
		if(error) {
			return console.log(error);
		}

		// We will then print the contents of data
		var dataArr = data.split(", ");
		// console.log(dataArr)
		//spotify if statement
		if(dataArr[0] == "spotify-this-song") {
			spotify.search({ type: 'track', query: dataArr[1] || "The Sign by Ace of Base" }, function(err, data) {
			    if ( err ) {
			        console.log('Error occurred: ' + err);
			        return;
			    }
			    for(var i = 0; 20 > i;i++){
			    	console.log("Artist: " + JSON.stringify(data.tracks.items[i].artists[0].name, null, 2));
				    console.log("Track: " + JSON.stringify(data.tracks.items[i].name, null, 2));
				    console.log("Album: " + JSON.stringify(data.tracks.items[i].album.name, null, 2));
				    console.log("Preview of track: " + JSON.stringify(data.tracks.items[i].preview_url, null, 2)); 
				    console.log("");
			    }
	     
  
			});
		}
		//omdb if statement
		if(dataArr[0] == "movie-this") {
 
			var movie = dataArr[1] || "iron man";

			request('http://www.omdbapi.com/?t='+ movie +'&y=&plot=short&r=json&tomatoes=true', function (error, response, body) {

				if (!error && response.statusCode == 200) {

					console.log("Title of the movie: " + JSON.parse(body)["Title"]);
					console.log("Year of the movie: " + JSON.parse(body)["Year"]);
					console.log("IMDB rating of the movie: " + JSON.parse(body)["imdbRating"]);
					console.log("Country where movie produced: " + JSON.parse(body)["Country"]);
					console.log("Languge of the movie: " + JSON.parse(body)["Country"]);
					console.log("Plot of the movie: " + JSON.parse(body)["Plot"]);
					console.log("Actors of the movie: " + JSON.parse(body)["Actors"]);
					console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
					console.log("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
				}
			});
		}
		//tweets if statement
		if(dataArr[0] == "my-tweets") {
			var params = {screen_name: 'Jason_Chan__'};
			client.get('statuses/user_timeline', params, function(error, tweets, response) {
			  if (!error) {
			  	for(var i = 0; tweets.length > i; i++) {
			  		console.log("Tweet number-" + i + ": " +tweets[i].text);
			  	}

			  }
			});
		}
// end of callback `do-what-it-says`		
	});
// end of if statement `do-what-it-says`
}

// bonus add commands to log file

if(command[3]) {
	fs.appendFile('log.txt', ", " + command[2] + " " + command[3]);
} else {
	fs.appendFile('log.txt', ", " + command[2]);	
}

// read log.txt file
if(command[2] == "read-log") {
	fs.readFile("log.txt", "utf8", function(error, data) {

		// Then split it by commas (to make it more readable)
		var dataArr = data.split(', ');

		// We will then re-display the content with the split for aesthetics.
		for(var i = dataArr.length; i--;){
			console.log("Log #"+ i + " " + dataArr[i]);
		}
		
	});
}
	
//tweet to twitter
if(command[2] == "tweet") {
	client.post('statuses/update', {status: command[3]}, function(error, tweet, response) {
	  if (!error) {
	    console.log(tweet);
	  }
	});
}



