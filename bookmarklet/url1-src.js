(function(){
	/* Start Firebug check, remove when done */
	/* Any other browser defining their own console.log will skip loading firebug lite */
	if (!console || !console.log) {
		var s = document.createElement('script');
		s.type='text/javascript';
		s.src='http://getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js';
		firebug.env.showIconWhenHidden = false;
		firebug.env.debug = false;
	}
	/* End Firebug check */
	hpwmbklhash123456_url = 'url1.js';
	var e = hpwmbklhash123456.substring(8),p = hpwmbklhash123456.substring(0,8);
	hpwmbklhash123456 = function(p, e) {
		var i;
		// Now to write this part out
		console.log(p);
		e = e.split(',');
		for (i = 0; i < e.length; i++) {
			e[i] = decodeURIComponent(e[i]);
		}
		console.log(e);
	};
	hpwmbklhash123456(p, e);
})();

/*
Characters to parameter values
0='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/'
1='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
2='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/'
3='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
4='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/'
5='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
6='ABCDEFGHIJKLMNOPQRSTUVWXYZ`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/'
7='ABCDEFGHIJKLMNOPQRSTUVWXYZ'
8='abcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/'
9='abcdefghijklmnopqrstuvwxyz0123456789'
a='abcdefghijklmnopqrstuvwxyz`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/'
b='abcdefghijklmnopqrstuvwxyz'
c='0123456789`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/'
d='0123456789'
e='`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/'
f='0123456789abcdef'
*/
