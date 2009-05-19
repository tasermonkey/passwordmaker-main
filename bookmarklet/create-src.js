/**
	This file creates the bookmarket for the user.
*/
/**
	For version 1 of the protocol, the parameters work like this:
	p is the compacted parameters to generate the password. Each character is a different part as explained below
		1 (2) - This is a bitmask hex charcter for the parts of the URL to use for calculating the text used in password generation.
		2 (0) - When to apply leet transformations. 0 is none, 1 is before, 2 is after, and 3 is both
		3 (1) - The leet level to use, 1-9
		4 (c) - The hash algo to use. HTML form has the values. Comments in urlv-src.js will have the list as well
		5 (0) - The character set to use. Z is custom. Comments in urlv-src.js will have the list (and below, until this is basically done)
		6-8 (008) - The length of the password to generate. As the Firefox edition support up to 999, this is three characters long
	e is the extra paramters that can not be compacted. The format is described below:
		Each value is encodeURIComponent()ed and separated by a comma
		This works like a function in which each parameter is optional. Each 'parameter' is listed below in the order they must appear:
			master password hash (includes key value, format is hash, then key) (position allows for IE6 users to use this bit, maybe)
			username
			modifier
			prefix
			suffix
			custom character set
*/

/**
	If url.js (and the function the bookmarklet uses) is called on this page, it will load these variables instead of doing the normal operations
*/
var hash, params = '201c0008', extras = '', version = '1';

// various variables
var ie6 = false, g = function (id) {return document.getElementById(id)} /* Can't assign getElementById to a variable */;
// Form fields we'll be editting
var bklname, protocol, subdomain, domain, path, username, whereleet, leetlevel, hashalgo, length, modifier, prefix, suffix, bookmarklet, error;
// Variables for character set handling
var characters, cUpper, cLower, cNumber, cSpecial, cDefine, cTabs;
window.onload = function() {
	var hex = Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');
	var i;
	bklname = g('name');
	protocol = g('protocol');
	subdomain = g('subdomains');
	domain = g('domain');
	path = g('path');
	username = g('username');
	whereleet = g('whereleet');
	leetlevel = g('leetlevel');
	hashalgo = g('hashalgo');
	length = g('length');
	modifier = g('modifier');
	prefix = g('prefix');
	suffix = g('suffix');
	bookmarklet = g('bookmarklet');
	bookmarklet.appendChild(document.createTextNode(''));
	error = g('errorMessage');
	error.appendChild(document.createTextNode(''));
	
	characters = g('characters');
	cUpper = g('charactersUpper');
	cLower = g('charactersLower');
	cNumber = g('charactersNumber');
	cSpecial = g('charactersSpecial');
	cDefine = g('characterDefined');
	cTabs = [g('characterPartsTab'), g('characterDefinedTab')];
	
	// IE needs the onclick
	protocol.onclick = protocol.onchange = updateParams;
	subdomain.onclick = subdomain.onchange = updateParams;
	domain.onclick = domain.onchange = updateParams;
	path.onclick = path.onchange = updateParams;
	// keyup to catch changes before the blur
	bklname.onkeyup = bklname.onchange = updateParams;
	username.onkeyup = username.onchange = updateParams;
	length.onkeyup = length.onchange = updateParams;
	modifier.onkeyup = modifier.onchange = updateParams;
	prefix.onkeyup = prefix.onchange = updateParams;
	suffix.onkeyup = suffix.onchange = updateParams;
	// IE calls onchange with keyup anyway. Other browsers call key up with enter or blur
	whereleet.onkeyup = whereleet.onchange = updateParams;
	leetlevel.onkeyup = leetlevel.onchange = updateParams;
	hashalgo.onkeyup = hashalgo.onchange = updateParams;
	
	characters.onkeyup = characters.onchange = updateParams;
	cUpper.onkeyup = cUpper.onclick = cUpper.onchange = updateParams;
	cLower.onkeyup = cLower.onclick = cLower.onchange = updateParams;
	cNumber.onkeyup = cNumber.onclick = cNumber.onchange = updateParams;
	cSpecial.onkeyup = cSpecial.onclick = cSpecial.onchange = updateParams;
	cDefine.onkeyup = cDefine.onchange = updateParams;
	g('characterParts').onclick = updateParams;
	g('characterDefine').onclick = updateParams;
	g('characterCustion').onclick = updateParams;
	
	// Check for IE6 and disable some features
	if (!(/KHTML|AppleWebKit|Opera/).test(navigator.userAgent)) {
		i = navigator.userAgent.match(/MSIE\s([^;]*)/);
		if (i&&i[1]) {
			i = parseFloat(i[1]);
			if (i == 6.0) {
				ie6 = true;
				username.disabled = true;
				modifier.disabled = true;
				prefix.disabled = true;
				suffix.disabled = true;
				g('characterCustion').disabled = true;
			}
		}
	}
	characters.disabled = true; // Should be disabled by default
	
	hash = 'h';
	for (i = 0; i < 16; i++) {
		hash += hex[Math.floor(Math.random() * 16)];
	}
	updateParams();
};

function characterHandler() {
	var o;
	// remove tabHiden from all tabs
	cTabs[0].className = cTabs[0].className.replace(/\btabHidden\b/g, '');
	cTabs[1].className = cTabs[1].className.replace(/\btabHidden\b/g, '');
	
	o = g('characterParts');
	characters.disabled = true;
	if (o.checked) {
		cTabs[1].className = cTabs[1].className + ' tabHidden';
		// based off checkboxes, 5th will be 0-9a-e
		if (!cUpper.checked && !cLower.checked && !cNumber.checked && !cSpecial.checked) {
			g('bookmarkletRow').className += ' hidden';
			error.firstChild.nodeValue = 'You must have at least one character set checkbox enabled!';
			error.className = 'error';
		}
		else {
			var mask = 0;
			characters.value = '';
			if (cUpper.checked) {
				mask |= 8;
				characters.value += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			}
			if (cLower.checked) {
				mask |= 4;
				characters.value += 'abcdefghijklmnopqrstuvwxyz';
			}
			if (cNumber.checked) {
				mask |= 2;
				characters.value += '0123456789';
			}
			if (cSpecial.checked) {
				mask |= 1;
				characters.value += '`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/';
			}
			mask ^= 15;
			params = params.substr(0, 4) + mask.toString(16) + params.substr(5);
		}
	}
	else {
		o = g('characterDefine');
		if (o.checked) {
			cTabs[0].className = cTabs[0].className + ' tabHidden';
			params = params.substr(0, 4) + cDefine.value + params.substr(5);
			characters.value = '0123456789abcdef';
		}
		else {
			cTabs[0].className = cTabs[0].className + ' tabHidden';
			cTabs[1].className = cTabs[1].className + ' tabHidden';
			params = params.substr(0, 4) + 'Z' + params.substr(5);
			characters.disabled = false;
		}
	}
};

function updateParams() {
	var i;
	g('bookmarkletRow').className = g('bookmarkletRow').className.replace(/\bhidden\b/g, '');
	error.className = 'hidden';
	bookmarklet.firstChild.nodeValue = bklname.value;
	
	i = 0;
	if (protocol.checked) i |= 8;
	if (subdomain.checked) i |= 4;
	if (domain.checked) i |= 2;
	if (path.checked) i |= 1;
	params = i.toString(16);
	
	params += whereleet.value;
	leetlevel.disabled = (whereleet.value == '0');
	params += leetlevel.value;
	params += hashalgo.value + ' '; // Space for character support
	i = length.value;
	while (i.length < 3) {
		i = '0' + i;
	}
	if (!/\d{3}/.test(i)) {
		g('bookmarkletRow').className += ' hidden';
		error.firstChild.nodeValue = 'Password length must be a number!';
		error.className = 'error';
	}
	params += i;
	characterHandler();
	
	extras = '';
	if (!ie6) { // While the user shouldn't be able to enter these fields, block the code anyway. They may have a slow enough computer for this to matter.
		if (params.charAt(4) == 'Z') {
			extras = ',' + encodeURIComponent(characters.value) + extras;
			if (characters.value.length < 2) {
				g('bookmarkletRow').className += ' hidden';
				error.firstChild.nodeValue = 'You must have at least two characters for the character set.';
				error.className = 'error';
			}
		}
		if (suffix.value || extras.length) extras = ',' + encodeURIComponent(suffix.value) + extras;
		if (prefix.value || extras.length) extras = ',' + encodeURIComponent(prefix.value) + extras;
		if (modifier.value || extras.length) extras = ',' + encodeURIComponent(modifier.value) + extras;
		if (username.value || extras.length) extras = ',' + encodeURIComponent(username.value) + extras;
		
		extras = encodeURIComponent(extras.replace(/\\/g, '\\\\').replace(/'/g, "\\'"));
	}
	// TODO Master Password Hash support, if the string is too long, move inside the non-ie6 area
	
	bookmarklet.href = 'javascript:' + bkl.replace('faaaa000', params).replace('pwmextras', extras).replace('hpwmbklhash123456', hash).replace(/ /g, '%20');
	if (ie6 && bookmarklet.href.legnth > 477) {
		g('bookmarkletRow').className += ' hidden';
		error.firstChild.nodeValue = "Whoops, it seems the bookmarklet is too long. If you can't upgrade from IE6, consider using another browser.";
		error.className = 'error';
	}
};

// Called by the bookmarklet, updates the forum fields
// If an older version of the bookmarklet protocol is used, update to the current version.
function paramsUpdate() {
	// TODO
	updateParams();
}

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
