// Zones. This should be split out into a separate module.

(function (module) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], module);
	} else {
		// Browser globals
		module(jQuery);
	}
})(function(jQuery, undefined){
	var win = jQuery(window),
		
		zones = {},
		
		rem = /(\d*\.?\d+)r?em/,
		rpercent = /(\d*\.?\d+)%/,
		
		body, fontSize, windowSize;

	function assignBody() {
		body = jQuery(document.body);
	}

	function getFontSize() {
		if (!body) { assignBody(); }
		return fontSize || (fontSize = parseInt(body.css('fontSize')));
	}

	function getWindowSize() {
		return windowSize || (windowSize = win.width());
	}

	function pixelify(val) {
		var test;
		
		return (test = rem.exec(val)) ? parseFloat(test[1]) * getFontSize() :
		       (test = rpercent.exec(val)) ? parseFloat(test[1])/100 * getWindowSize() :
		       val ;
	}

	function scroll() {
		var scrollTop = win.scrollTop(),
		    zone, obj, test, min, max;

		for (zone in zones) {
			obj = zones[zone];

			min = pixelify(obj.min);
			max = pixelify(obj.max);

			if (scrollTop < max && scrollTop >= min) {
				if (!obj.active) {
					if (!body) { assignBody(); }
					
					body.addClass(zone);
					obj.active = true;
					if (obj.enter) { obj.enter(); }
				}
				
				if (obj.scroll) { obj.scroll(scrollTop, scrollTop - min); }
			}
			else {
				if (obj.active) {
					if (obj.scroll) { obj.scroll(scrollTop < min ? min : max, scrollTop < min ? 0 : (max - min)); }
					if (!body) { assignBody(); }
					
					body.removeClass(zone);
					obj.active = false;
					if (obj.exit) { obj.exit(); }
				}
			}
		}

		fontSize = false;
		windowSize = false;
	}

	win.on('scroll', scroll);

	jQuery.scrollzones = function(obj) {
		zones = obj;
		jQuery(document).ready(scroll);
	};
	
	return jQuery.scrollzones;
});