/**
	This is just a proof of concept code. Actual bookmarklet code will have hpwmbklhash123456 replaced with a number unique to the user
	Final file should compress to 488 bytes or less for IE 6
	url.js is to be replaced by the script that will generate the bookmarklet code
*/
(function(){
	var p = 'faaaa000'; // For having the length of the largest set here. the 000 is the length, and should be a fixed length
	var e = pwmextras; // Store the variable length stuff here
	var h = 'hpwmbklhash123456'; // used a few times
	var w = window;
	var f = w[h]; // used three times.
	if (typeof f == 'undefined') {
		w[h] = p;
		w['e'+h] = e;
		var s = document.createElement('script');
		s.type='text/javascript';
		s.src='url1.js?v=1&h='+h;
		document.getElementsByTagName('html')[0].appendChild(s);
	} else if (typeof f == 'function') {
		f(p, e);
	}
})();