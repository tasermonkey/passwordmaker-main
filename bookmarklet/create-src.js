/**
	This file creates the bookmarket for the user.
*/
version = '0.6.1';

/**
	If url.js (and the function the bookmarklet uses) is called on this page, it will load these variables instead of doing the normal operations
*/
var hash, params = '', extras = '', rehash = false;

// various variables
var ie6 = false, g = function(id){return document.getElementById(id);}; /* Can't assign getElementById to a variable... */
// Form fields we'll be editting
var bklname, protocol, subdomain, domain, path, usetext, username, whereleet, leetlevel, hashalgo, length, modifier, prefix, suffix, bookmarklet, error;
// Variables for character set handling
var characters, cUpper, cLower, cNumber, cSpecial, cDefine, cTabs;
function characterHandler() {
	var o;
	// remove tabHiden from all tabs
	cTabs[0].className = cTabs[0].className.replace(/\btabHidden\b/g, '');
	cTabs[1].className = cTabs[1].className.replace(/\btabHidden\b/g, '');
	
	o = g('characterParts');
	characters.readonly = true;
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
			characters.readonly = false;
		}
	}
}

function updateParams() {
	var i;
	g('bookmarkletRow').className = g('bookmarkletRow').className.replace(/\bhidden\b/g, '');
	error.className = 'hidden';
	bookmarklet.firstChild.nodeValue = bklname.value;
	
	i = 0;
	if (protocol.checked) {i |= 8;}
	if (subdomain.checked) {i |= 4;}
	if (domain.checked) {i |= 2;}
	if (path.checked) {i |= 1;}
	// TODO if i == 0, then use text string
	if (!i) {
		usetext.disabled = false;
	} else {
		usetext.disabled = true;
	}
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
	
	if (!ie6) { // While the user shouldn't be able to enter these fields, block the code anyway. They may have a slow enough computer for this to matter.
		extras = {};
		if (username.value) {
			extras.username = username.value;
		}
		if (modifier.value) {
			extras.modifier = modifier.value;
		}
		if (prefix.value) {
			extras.prefix = prefix.value;
		}
		if (suffix.value) {
			extras.suffix = suffix.value;
		}
		if (params.charAt(0) == '0') {
			extras.usetext = usetext.value;
		}
		if (params.charAt(4) == 'Z') {
			extras.characters = characters.value;
			if (characters.value.length < 2) {
				g('bookmarkletRow').className += ' hidden';
				error.firstChild.nodeValue = 'You must have at least two characters for the character set.';
				error.className = 'error';
			}
		}
		// TODO Master Password Hash support
	}
	else {
		if (params.charAt(0) == '0') {
			extras = usetext.value;
		}
	}
	
	extras = JSON.stringify(extras);
	
	bookmarklet.href = 'javascript:' + bkl.replace('faaaa000', params).replace('pwmextras', extras).replace('hpwmbklhash123456', hash).replace(/ /g, '%20');
	if (ie6 && bookmarklet.href.length > 477) {
		g('bookmarkletRow').className += ' hidden';
		error.firstChild.nodeValue = "Whoops, it seems the bookmarklet is too long. This is a limitation of IE6.";
		error.className = 'error';
	}
}

// Called by the bookmarklet, updates the forum fields
// If an older version of the bookmarklet protocol is used, update to the current version.
function paramsUpdate(v, p, e, h) {
	var c, i, j;
	if (v < 1) {return;} // Should never be 0
	switch (v) {
	case 1:
		// TODO
		i = parseInt(p.charAt(0), 16);
		protocol.checked = (i & 8) ? true : false;
		subdomain.checked = (i & 4) ? true : false;
		domain.checked = (i & 2) ? true : false;
		path.checked = (i & 1) ? true : false;
		length.value = parseInt(p.substring(5, 8), 10);
		for (i = 0, c = hashalgo.options; i < c.length; i++) {
			if (c[i].value == p.charAt(3)) {
				c[i].selected = true;
			}
		}
		for (i = 0, c = whereleet.options; i < c.length; i++) {
			if (c[i].value == p.charAt(1)) {
				c[i].selected = true;
			}
		}
		for (i = 0, c = leetlevel.options; i < c.length; i++) {
			if (c[i].value == p.charAt(2)) {
				c[i].selected = true;
			}
		}
		i = p.charAt(4);
		if (/^[0-9a-e]$/.test(i)) {
			g('characterParts').checked = true;
			i = parseInt(i, 16)^15;
			cUpper.checked = (i & 8) ? true : false;
			cLower.checked = (i & 4) ? true : false;
			cNumber.checked = (i & 2) ? true : false;
			cSpecial.checked = (i & 1) ? true : false;
		} else if (/^[f]$/.test(i)) {
			// Note, the regEx can be updated to allow for more predefined sets later
			g('characterDefine').checked = true;
			for (j = 0, c = gDefine.options; j < c.length; j++) {
				if (c[j].value == i) {
					c[j].selected = true;
				}
			}
		} else if (i == 'Z') {
			characters.value = e.characters;
		}
		if (p.charAt(8)) {
			i = parseInt(p.charAt(8), 32);
			// TODO handle binary switches, once the feature is added
		}
		
		if (typeof e == 'string') {
			// IE6 - usetext mode only
			usetext.value = e;
		}
		else {
			// TODO how to handle importing Master Password Hash (once this feature is added)
			//mphash.value = e.mphash||'';
			username.value = e.username||'';
			modifier.value = e.modifier||'';
			prefix.value = e.prefix||'';
			suffix.value = e.suffix||'';
			usetext.value = e.usetext||'';
		}
		// TODO figure out how to reuse hash only if user wants to
		//console.log(h);
		break;
	default:
		// Unsupported version. Somehow a newer version of the protocol called this function (downgrade?)
		return;
	}
	updateParams();
}

/*
    http://www.JSON.org/json2.js
    2009-04-16

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html

    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    JSON = {};
}
(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof String.prototype.toJSON !== 'function') {
        String.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }
}());

window.onload = function() {
	var hex = Array(
		'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
		'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
		'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
	);
	var i;
	bklname = g('name');
	protocol = g('protocol');
	subdomain = g('subdomains');
	domain = g('domain');
	path = g('path');
	usetext = g('usetext');
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
	usetext.onkeyup = usetext.onchange = updateParams;
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
	g('characterCustom').onclick = updateParams;
	
	// Check for IE6 and disable some features
	characters.readonly = true; // Should be readonly by default
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
				g('characterCustom').disabled = true;
			}
		}
	}
	
	hash = 'h';
	for (i = 0; i < 16; i++) {
		hash += hex[Math.floor(Math.random() * hex.length)];
	}
	updateParams();
};

