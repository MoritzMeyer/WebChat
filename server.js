var express = require('express')
,   app = express()
,   server = require('http').createServer(app)
,   io = require('socket.io').listen(server)
,   conf = require('./config.json')
,   port = process.env.Port || 3000;
//,	events = require('events')
//,	serverEmitter = new events.EventEmitter();

// Webserver
// auf den Port x schalten
server.listen(port);

app.configure(function(){
	// statische Dateien ausliefern
	app.use(express.static(__dirname + '/public'));
});

// wenn der Pfad / aufgerufen wird
app.get('/', function (req, res) {
	// so wird die Datei index.html ausgegeben
	res.sendfile(__dirname + '/public/index.html');
});

// Websocket
io.sockets.on('connection', function (socket) {
	// der Client ist verbunden
	socket.emit('chat', { zeit: new Date(), text: 'Du bist nun mit dem Server verbunden! Auf Port: ' + port });
	// wenn ein Benutzer einen Text senden
	socket.on('chat', function (data) {
		// so wird dieser Text an alle anderen Benutzer gesendet
		io.sockets.emit('chat', { zeit: new Date(), name: data.name || 'Anonym', text: data.text });
	});
/*	serverEmitter.on('vm', function (data) {
		io.sockets.emit('chat', {zeit: new Date(), text:'Server created: ' + data);
	});*/
});

app.post('/vmcreatedinfo', function(req, res) {
	console.log("Server created: " +  JSON.stringify(req.body));
	//serverEmitter.emit('vm', req.body);
	io.sockets.emit('chat', {zeit: new Date(), name: 'VM-Update', text: JSON.stringify(req.body)});
	res.status(200);
	res.end();
});

// Portnummer in die Konsole schreiben
console.log('Der Server läuft nun unter http://127.0.0.1:' + port + '/');


