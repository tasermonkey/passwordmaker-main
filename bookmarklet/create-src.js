/**
	This file creates the bookmarket for the user.
*/

/**
	If url.js (and the function the bookmarklet uses) is called on this page, it will load these variables instead of the normal operations
*/
var hash, params, extras;
/**
	For version 1 of the protocol, the parameters work like this:
	p is the compacted parameters to generate the password. Each character is a different part as explained below
		1 (2) - This is a bitmask hex charcter for the parts of the URL to use for calculating the text used in password generation.
		2 (0) - When to apply leet transformations. 0 is none, 1 is before, 2 is after, and 3 is both
		3 (1) - The leet level to use, 1-9
		4 (c) - The hash algo to use. HTML form has the values. Comments in url1-src.js will have the list as well
		5 (0) - The character set to use. Z is custom. Comments in url1-src.js will have the list (and below, until this is basically done)
		6-8 (008) - The length of the password to generate. As the Firefox edition support up to 999, this is three characters long
	e is the extra paramters that can not be compacted. The format is described below:
		Each value is encodeURIComponent()ed is separated by a comma
		This works like a function in which each parameter is optional. Each 'parameter' is listed below in the order they must appear:
			master password hash (includes key value, format is hash, then key)
			username
			modifier
			prefix
			suffix
			custom character set
*/

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
