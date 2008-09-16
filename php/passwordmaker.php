#!/usr/bin/php -q
<?php

/**
Command-line front end for passwordmaker_class.php file.
Version 0.8, 2005-11-14.
Version 0.9, 2005-11-26.
Version 1.0, 2005-12-17.
Version 1.1, 2005-12-18. Fixed bug with default character set
	and improved error messages.
Version 1.2 2006-01-27. Length can be any arbitrary length regardless of
	character set length. And fixed the default character set again!
Version 1.2.1 2006-02-01. Fixed a bug that poped up with supporting unlimited
	length of passwords that broke password generation.
Version 1.2.2 2006-02-01. Fixed a bug with unlimited password support (Somewhat
	independant of previous bug due to only showing up when orignal limit for
	password was reached)
Version 1.3 2006-05-10. Added support for 0.6 compatibity.
Version 1.3.1 2007-05-22. Fixed leet levels 8 and 9.
	Combined with Mobile edition for releases.
	Fixed an error with handling arguements as pointed out here: http://forums.passwordmaker.org/index.php/topic,1303.0.html
	Reformatted the file to use tabs instead of spaces
Version 1.4 2007-12-31
	Able to run without mHash. Will use mHash if it's there. (Not used with the buggy HMAC-SHA256 however.)
	Really combined Mobile Edition for releases
	Fixed bug with arbitrary length passwords.
Version 1.4.1 2008-01-14
	No changes
Version 1.5 2008-04-22
	Allows using the fixed HMAC-SHA-256

Written by Pedro Gimeno Fortea
<http://www.formauri.es/personal/pgimeno/>
Updated by Miquel Matthew 'Fire' Burns
<miquelfire@gmail.com>

This version works with PHP in both CGI (web) and command-line
interface modes.

Note: If only the CGI version of PHP is available, change the first
line of this file to the path of the CGI program, adding -q to it
to prevent the HTTP headers from being printed.
*/

require_once('passwordmaker_class.php');

/* The 'leet' define contains the string used in the command
 line for the leet settings. The decision about using l33t=x
 or leet=x affects this. */
define('LEET', 'l33t');

function printerr_exit($errcode, $txt)
{
	/* This can later be conditioned to be in "verbose mode"
	or not to be in "quiet mode", if desired. By now it
	unconditionally prints the passed text. */
	print($txt);
	exit($errcode);
}

function help($errcode, $extratext = '')
{
	$leet = LEET;
	printerr_exit($errcode,
"{$extratext}Usage:

   {$_SERVER['argv'][0]} param1=value1 param2=value2...

Parameters are in the form of var=value pairs.

Available parameters:

  alg=<string>     [hmac-] md4/md5/sha1/sha256/rmd160 [_v6/_v151](default md5)
  mpw=<string>     Master password (default blank)
  url=<string>     URL to use (default blank)
  user=<string>    User name (default blank)
  mod=<string>     Modifier to use (default blank)
  len=<number>     Length of generated password (default 8)
  charset=<string> characters to use in password (default ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#\$%^&*()_-+={}|[]\\:\";'<>?,./)
  pfx=<string>     prefix (default blank)
  sfx=<string>     suffix (default blank)
  $leet=n/bN/aN/2N
    $leet=n (default): none;
    $leet=bN (N=1..9): before;
    $leet=aN: after;
    $leet=2N: both
    e.g. $leet=25 means before and after generating password, with
    leet level 5.
");
}

error_reporting(E_ALL ^ E_NOTICE);

if ($_SERVER['argc'] <= 1)
	help(0);

$args=array();
$argv = $_SERVER['argv'];

/* The parsing is performed here. It can be done in several
ways; the result must be the array $args[] filled with
pairs of the form $args['var'] = 'value'.

The following code just interprets the command line as
multiple var=value arguments, like this:

passwdmaker.php alg=md5 charset=ABC mpw=PW ...

getopt()-like options can be used instead as long as the
resulting array has the same structure.
*/

$args = array('alg'=>'', 'mpw'=>'', 'url'=>'', 'user'=>'', 'mod'=>'', 'len'=>'', 'charset'=>'', 'pfx'=>'', 'sfx'=>'', LEET=>'');
for ($i = 1; $i < $_SERVER['argc']; $i++)
{
	$argpos = strpos($argv[$i], '=');
	if ($argpos !== false) /* found '=' */
		$args[strtolower(substr($argv[$i], 0, $argpos))] = substr($argv[$i], $argpos + 1);
	else
		help(1, "Invalid parameter: $argv[$i]\n");
}

/* Default algorithm is md5 */

if (empty($args['alg']))
	$args['alg'] = 'md5';

/* Check for validity of algorithm */
$sha256_bug = false;
$alg = explode('_', $args['alg']);
if (count($alg) > 1 && $alg[1] == 'v6') {
	$trim = false;
	$args['charset'] = '0123456789abcedf';
}
elseif (count($alg) > 1 && $alg[1] == 'v151') {
	$sha256_bug = true;
}
else {
	$trim = true;
}
$args['alg'] = $alg[0];

$valid_algs = array(
	'md4', 'hmac-md4',
	'md5', 'hmac-md5',
	'sha1', 'hmac-sha1',
	'sha256', 'hmac-sha256',
	'rmd160', 'hmac-rmd160'
);

if (! in_array(strtolower($args['alg']), $valid_algs))
	help(1, "Unknown or misspelled algorithm: $args[alg]\n");

/* Default for leet is LEET_NONE */

$map_lmode = array(
	' ' => LEET_NONE,
	'n' => LEET_NONE,
	'b' => LEET_BEFORE,
	'a' => LEET_AFTER,
	'2' => LEET_BOTH
);

if (empty($args[LEET]))
	$args[LEET] = 'n';
if (strlen($args[LEET]) == 2) {
	$leetlevel = (int)$args[LEET]{1};
	switch ($args[LEET]{0}) {
	case 'b':
		$leet = LEET_BEFORE;
		break;
	case 'a':
		$leet = LEET_AFTER;
		break;
	case '2':
		$leet = LEET_BOTH;
		break;
	case 'n':
		$leet = LEET_NONE;
		break;
	default:
		help(1, "Invalid " . LEET . " setting: " . $args[LEET] . "\n");
	}
}
elseif (strlen($args[LEET]) == 1 && $args[LEET] == 'n') {
	$leet = LEET_NONE;
	$leetlevel = 0;
}
else {
	help(1, "Invalid " . LEET . " setting: " . $args[LEET]);
}

if ($leet != LEET_NONE && ($leetlevel < 1 || $leetlevel > 9)) {
	help(1, "Invalid " . LEET . " setting: " . $args[LEET] . "\n");
}

if (empty($args['len']))
	$args['len'] = 8;

if (empty($args['charset']))
	$args['charset'] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+={}|[]\:";\'<>?,./';

echo generatepassword(
		$args['alg'],
		$args['mpw'],
		$args['url'] . $args['user'] . $args['mod'],
		$leet,
		$leetlevel - 1,
		$args['len'],
		$args['charset'],
		$args['pfx'],
		$args['sfx'],
		$trim, $sha256_bug
	),"\n";
?>
