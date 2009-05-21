/**
	For version 1 of the protocol, the parameters work like this:
	p is the compacted parameters to generate the password. Each character is a different part as explained below
		1 (2) - This is a bitmask hex charcter for the parts of the URL to use for calculating the text used in password generation.
		2 (0) - When to apply leet transformations. 0 is none, 1 is before, 2 is after, and 3 is both
		3 (1) - The leet level to use, 1-9
		4 (c) - The hash algo to use. HTML form has the values.
			"a">MD4
			"b">HMAC-MD4
			"c" selected="selected">MD5
			"d">HMAC-MD5
			"e">SHA-1
			"f">HMAC-SHA-1
			"g">SHA-256
			"h">HMAC-SHA-256
			"i">RIPEMD-160
			"j">HMAC-RIPEMD-160
		5 (0) - The character set to use. Z is custom. List below.
		6-8 (008) - The length of the password to generate. As the Firefox edition support up to 999, this is three characters long
	e is the extra paramters that can not be compacted.
	If it is a string, it's a master password hash, otherwise it's a JSON object with the following members, all optional
			mphash (Master Password Hash)
			username
			modifier
			prefix
			suffix
			characters
			usetext (custom text, like in the accounts of the Firefox version)

Defined character sets
	'0':'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/',
	'1':'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
	'2':'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/',
	'3':'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
	'4':'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/',
	'5':'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
	'6':'ABCDEFGHIJKLMNOPQRSTUVWXYZ`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/',
	'7':'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	'8':'abcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/',
	'9':'abcdefghijklmnopqrstuvwxyz0123456789',
	'a':'abcdefghijklmnopqrstuvwxyz`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/',
	'b':'abcdefghijklmnopqrstuvwxyz',
	'c':'0123456789`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/',
	'd':'0123456789',
	'e':'`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/',
	'f':'0123456789abcdef'
*/
window._hpwmbklhash123456_v = {
	url:'url1.js',
	protocol:false,
	subdomain:false,
	domain:false,
	path:false,
	usetext:'',
	whereLeet:0,
	leetlevel:0,
	hash:'',
	characters:'',
	length:0,
	mphash:'',
	username:'',
	modifier:'',
	prefix:'',
	suffix:''
};
(function(){
	/* Start Firebug check, remove when done */
	/* Any other browser defining their own console.log will skip loading firebug lite */
	if (!console || !console.log) {
		var s = document.createElement('script');
		s.type='text/javascript';
		s.src='http://getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js';
		document.body.appendChild(s);
		firebug.env.showIconWhenHidden = false;
		firebug.env.debug = false;
		//firebug.init();
	}
	/* End Firebug check */
	var e = ehpwmbklhash123456,p = hpwmbklhash123456;
	hpwmbklhash123456 = function(p, e) {
		// If self url, call updateParams and return
		var i, h = window._hpwmbklhash123456_v, c = {
			'0':'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/',
			'1':'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
			'2':'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/',
			'3':'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
			'4':'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/',
			'5':'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
			'6':'ABCDEFGHIJKLMNOPQRSTUVWXYZ`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/',
			'7':'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
			'8':'abcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/',
			'9':'abcdefghijklmnopqrstuvwxyz0123456789',
			'a':'abcdefghijklmnopqrstuvwxyz`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/',
			'b':'abcdefghijklmnopqrstuvwxyz',
			'c':'0123456789`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/',
			'd':'0123456789',
			'e':'`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/',
			'f':'0123456789abcdef'
		}
		// Now to write this part out
		i = parseInt(p.charAt(0), 16);
		h.protocol = (i & 8) ? true : false;
		h.subdomain = (i & 4) ? true : false;
		h.domain = (i & 2) ? true : false;
		h.path = (i & 1) ? true : false;
		
		h.whereLeet = parseInt(p.charAt(1));
		h.leetlevel = parseInt(p.charAt(2));
		h.hash = p.charAt(3);
		h.length = parseInt(p.substring(5), 10);
		h.characters = p.charAt(4);
		if (h.characters == 'Z') {
			h.characters = e.characters;
		} else {
			h.characters = c[h.characters];
		}
		
		if (typeof e == 'string') {
			// IE6
		}
		else {
			if (e.mphash) h.mphash = e.mphash;
			if (e.username) h.username = e.username;
			if (e.modifier) h.modifier = e.modifier;
			if (e.prefix) h.prefix = e.prefix;
			if (e.suffix) h.suffix = e.suffix;
			if (e.usetext) h.usetext = e.usetext;
		}
		
		// display the form to ask for the master password
	};
	hpwmbklhash123456(p, e);
})();
