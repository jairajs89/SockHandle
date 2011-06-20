var fs = require('fs');

var routes = {};

var set = exports.set = function(url, func){
	if( url in routes )
		throw 'multiple routes for path "'+url+'"';
	
	else if( typeof(func) != 'function' )
		throw 'request handler for path "'+url+'" must be a function';
	
	else 
		routes[url] = func;
};

var get = exports.get = function(url, req, res){
	if( !(url in routes) )
		return false;
	
	routes[url](req, res);
	return true;
};

var setHandlers = exports.setHandlers = function(){
	var files = fs.readdirSync('./handlers');
	for(var i in files) {
		var parts = files[i].split('.');
		if( (parts[0] != '') || (parts[parts.length-1] == 'js') )
			require('./handlers/'+files[i]);
	}
};
