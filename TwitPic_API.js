/* Namespace the twitpic object for global access */
twitpic = window.twitpic || {};

(function(window) {

	/*
	 * If jQuery hasn't been loaded already, lets
	 * do so now automatically.
	 */
	var conflict = false;
	if(!("jQuery" in window)) {
		conflict = true;
		var head      = document.getElementsByTagName('head')[0],
		script        = document.createElement('script');
		script.type   = 'text/javascript';
		script.src    = 'http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js';
		script.onload = init;
		head.appendChild(script);
	} else {
		init();
	}
	
	/*
	 * Loads the API methods, removes jQuery conflicts
	 * with other JS libraries, and sends the twitpic
	 * object and jQuery object as $ into a private scope
	 */
	function init() {
		if(conflict) jQuery.noConflict();
			
		load(twitpic, jQuery);
	}
	
	/*
	 * The guts of the API, nicely encapsulated to prevent
	 * any conflicts with other libraries
	 */
	function load(twitpic, $) {
	
		var API = {
			base_url : 'http://api.twitpic.com/',
			
			/*
			 * This validates the API arguments to make sure that
			 * we have all required arguments present before
			 * making the API call.
			 */
			validate : function(args, required) {
				$.each(required, function(i,name) {
					if(!(name in args)) {
						throw "Missing argument " + name + " in TwitPic API call";
					}
				});
			},
			
			/*
			 * Performs a query with the TwitPic JSONP API,
			 * and sends returned data to the user-defined
			 * callback function in the form of an object literal.
			 */
			query : function(url, data, callback) {
				var query_url = this.base_url + url + '.jsonp?callback=?';
			
				$.ajax({
					type: 'GET',
					url: query_url,
					data: data,
					dataType: 'jsonp',
					success: function(data) {
						callback(data);
					}
				});
			}
		}
		
		/*
		 * media/show
		 * Required:
		 *		id - The short ID of the image
		 */
		 twitpic.media = {
		 	show : function(args, callback) {
		 		API.validate(args, ['id']);
		 		API.query('2/media/show', args, callback);
		 	}
		 };
		
		/*
		 * users/show
		 * Required:
		 *		username - username of the user to get info for
		 * Optional
		 *		page - user photo pagination
		 */
		twitpic.users = {
			show : function(args, callback) {
				API.validate(args, ['username']);
				API.query('2/users/show', args, callback);
			}
		};
		
	}
	
})(window);