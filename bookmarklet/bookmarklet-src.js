/**
	This is just a proof of concept code. Actual bookmarklet code will have hpwmbklhash123456 replaced with a number unique to the user
	Final file should compress to 488 bytes or less for IE 6
	url.js is to be replaced by the script that will generate the bookmarklet code
*/
(function(){
	var p = 'faaaa000'; // For having the length of the largest set here. the 000 is the length, and should be a fixed length
	var e = 'pwmextras'; // Store the variable length stuff here (format needs to be defined)
	var w = window;
	var h = 'hpwmbklhash123456';
	var f = w[h];
	if (typeof f == 'undefined') {
		w[h] = p+e; // Need to define the main varible/function in the window object first
		var d = document;
		var s = d.createElement('script');
		s.type='text/javascript';
		s.src='url1.js?v=1&h='+h;
		d.getElementsByTagName('head')[0].appendChild(s);
	} else if (typeof f == 'function') {
		f(p, e);
	}
})();