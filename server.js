var express = require('express')
,   app = express()
,   server = require('http').createServer(app)
,   io = require('socket.io').listen(server)
,   conf = require('./config.json')
,   port = process.env.Port || 3000
,	bodyParser = require("body-parser")
,	urlencodedParser = bodyParser.urlencoded({ extended: false });
//,	events = require('events')
//,	serverEmitter = new events.EventEmitter();

var LdapAuth = require('ldapauth');
var options = {
    url: 'ldap://52.233.129.104:389',
    adminDn: "cn=admin,dc=gamingservice,dc=cc",
    adminPassword: "root",
    searchBase: "dc=gamingservice,dc=cc",
    searchFilter: "(uid={{username}})"
};
var auth = new LdapAuth(options);

// Webserver
// auf den Port x schalten
server.listen(port);

// statische Dateien ausliefern
app.use(express.static(__dirname + '/public'));
app.use(urlencodedParser);


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
	console.log("Server created: ",  req.body);
	//serverEmitter.emit('vm', req.body);
	io.sockets.emit('chat', {zeit: new Date(), name: 'VM-Update', text: JSON.stringify(req.body)});
	res.status(200);
	res.end();
});

auth.once('connect', function () {
	auth.authenticate("eva", "eva", function(err, user) {
		console.log("User logged in");
		console.log("err:", err);
		io.sockets.emit('chat', {zeit: new Date(), name: 'Ldap-Login', text: JSON.stringify(err)});
		io.sockets.emit('chat', {zeit: new Date(), name: 'Ldap-Login', text: JSON.stringify(user)});
	});

	/*auth.close(function(err) {
		console.log("On close: ", err);
	});*/
});

// Portnummer in die Konsole schreiben
console.log('Der Server läuft nun unter http://127.0.0.1:' + port + '/');


