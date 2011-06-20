var fs		= require('fs'),
	express	= require('express'),
	io		= require('socket.io'),
	Utilities = require('./lib/Utilities'),
	Routes	= require('./routes'),
	oneYear = 365.25 * 24 * 60 * 60 * 1000;


//TODO: GET AN ACTUAL MEMCACHEISH SOLUTION
var cache = (function(){
	var store = {};
	
	return {
		set: function(key, value){
			store[key] = value;
			return value;
		},
		get: function(key){
			return store[key];
		},
		get_key: function(value){
			for( var i in store )
				if( store[i] == value )
					return i;
		}
	};
})();


// HTTP Server
var static_path = __dirname + '/public',
	app = express.createServer(
			express.cookieParser(),
			express.session({
				secret: '52c7edad36ff27f9b0f5f7932ffe0af8',
				key: 'hulksmash',
				cookie: { maxAge: oneYear }
			})
		);

app.configure(function(){
	app.use( express.static(static_path, { maxAge: oneYear }));
	app.set('view options', { layout: false });
});

app.get('/', function(req, res){
	res.render('home.jade', { session: cache.set(req.session.id, Utilities.hash()) });
});

var port = process.env.PORT || 5000;
app.listen(port);


// Socket Server
Routes.setHandlers();
var socket = io.listen(app);
socket.on('connection', function(client){
	client.on('message', function(msg){
		if( !msg.time || !msg.session || !msg.url )
			return;
		
		if( cache.get_key(msg.session) )
			Routes.get(msg.url, msg.data, function(response){
				client.send({
					time: msg.time,
					data: response
				});
			});
	});
});
