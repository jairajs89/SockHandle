var routes = require('../routes');

routes.set('/', function(req, res){
	res({
		marco: 'polo'
	});
});
