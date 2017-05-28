var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var conf = require('./config.json');

server.listen(conf.port);

app.configure(function() {
	//statische Dateien ausliefern
	app.use(express.static(__dirname + '/public'));
});

//wenn Pfad / aufgerufen wird
app.get('/', function(req, res) {
	//wird die Datei index.html ausgegeben
	res.sendfile(__dirname + '/public/index.html');
});

io.sockets.on('connection', function (socket) {
	//der Client ist verbunden
	socket.emit('chat', {zeit: new Date(), text: 'Du bist nun mit dem Server verbunden!'});
	//wenn ein Benutzer einen Text sendet
	socket.on('chat', function(data) {
		//so wird dieser Text an alle anderen Benutzer gesendet
		io.sockets.emit('chat', {zeit: new Date(), name: data.name || 'Anonym', text: data.text});
	});
});

//Portnummer in die Konsole schreiben
console.log('Der Server läuft nun unter http://blubb:' + conf.port + '/');