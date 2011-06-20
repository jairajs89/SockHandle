SockHandle.Require.start('request');
SockHandle.Require(['socket.io'], function(){
	
	SockHandle.Request = (function(){
		window.WEB_SOCKET_SWF_LOCATION = '/swf/WebSocketMain.swf';
		
		var queued = [],
			callbacks = {},
			socket = new io.Socket();
		
		var emptyQueue = function(){
			for(var msg; msg=queued.shift();)
				request.apply( msg[0], msg.slice(1) );
		};
		
		var request = function(url, data, callback){
			if( !socket.connected ) {
				queued.push([this, url, data, callback]);
				return;
			}
			
			if( typeof(data) == 'function' ) {
				callback = data;
				data = {};
			}
			
			data = data || {};
			
			var time = new Date().getTime();
			
			callbacks[time] = callback;
			
			socket.send({
				time: time,
				session: SockHandle.session,
				url: url,
				data: data
			});
		};
		
		socket.connect(emptyQueue);
		
		socket.on('message', function(msg){
			if(msg.time in callbacks && callbacks[msg.time]) {
				callbacks[msg.time](msg.data);
				delete callbacks[msg.time];
			}
		});
		
		socket.on('reconnect', emptyQueue);
		
		return request;
	})();
	
	SockHandle.Require.end('request');
});
