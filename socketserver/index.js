var app = require('express')();
var http = require('http').Server(app);

var gamesocket = require('./gamesocket.js')(http);

app.get('/', function(req, res){
	res.send('nothing');
});

http.listen(81, function(){
	console.log('listening on *:81');
});