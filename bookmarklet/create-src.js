/**
	This file creates the bookmarket for the user.
*/

/**
	If url.js (and the function the bookmarklet uses) is called on this page, it will load these variables instead of the normal operations
*/
var hash, params, extras;

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
