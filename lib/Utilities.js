var crypto = require('crypto');

var hash = exports.hash = function(input){
	return crypto.createHash('md5')
					.update( input || (Math.random()+'') )
					.digest('hex');
};

var fileHash = exports.fileHash = (function(){
	var static_cache = {};
	return function(url){
		if(url in static_cache)
			return static_cache[url];
	
		if( url.indexOf('?') != -1 )
			return url;
	
		try {
			return static_cache[url] = url + '?v='
								+ hash(fs.readFileSync(static_path + '/' + url))
									.substr(0, 5);
	
		} catch(err) {
			return static_cache[url] = url;
		}
	};
})();
