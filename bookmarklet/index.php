<?php
/**
	The following defines are used to control certain options in this script:
		REMOVE_NAME - Set to false only if removing the file from the url will not run this script (in a directory, index.php normally is ran, so this would be true)
*/
define('REMOVE_NAME', true);

/**
	Expires: Fri, 30 Oct 1998 14:19:41 GMT (HTTP Date format, if PHP has a shortcut)
	Cache-Control: max-age=secs, must-revalidate, public
*/
// GZip support
$gzip = @ini_get('zlib.compress');
if (!$gzip || strtolower($gzip) == 'off') {
	if (function_exists('ob_gzhandler')) ob_start('ob_gzhandler');
}
$url = 'http'.((isset($_SERVER['HTTPS']) && $_SERVER["HTTPS"] == "on") ? 's://': '://')
	.$_SERVER['SERVER_NAME'].(($_SERVER['SERVER_PORT'] != '80') ? ':'.$_SERVER['SERVER_PORT'] : '')
	.((REMOVE_NAME)? str_replace(basename(__FILE__), '', $_SERVER['PHP_SELF']) : $_SERVER['PHP_SELF']);
$mtime = 0;

if (isset($_GET['v'])) {
	// Chrome alters the src string somehow. To allow existing bookmarklets to work, this work around should do fine
	if (!isset($_GET['h'])) {
		foreach($_GET as $k=>$v) {
			if (false !== strpos($k, 'amp;')) {
				$_GET[str_replace('amp;', '', $k)] = $v;
				unset($_GET[$k]);
			}
		}
	}
	if (isset($_GET['h'])) {
		header('Content-type: text/javascript; charset=utf-8');
		if (preg_match('/\Ah[\da-z]{16}\z/i', $_GET['h'])) {
			switch ($_GET['v']) {
				case '1': {
					$src = file_get_contents('url'.$_GET['v'].'.js');
					$mtime = filemtime('url'.$_GET['v'].'.js');
					$src = str_replace('hpwmbklhash123456', $_GET['h'], $src);
					$src = str_replace('url1.js', $url, $src);
					break;
				}
				default: {
					$src = 'alert("Error with parameters!")';
				}
			}
		}
		else {
			$src = 'alert("Error with parameters!")';
		}
		
		if ($mtime) { // Only if an error path as not followed
			$mtime = gmdate('D, d M Y H:i:s', $mtime) . ' GMT';
			$etag = '"'.md5($src).'"';
			header('Last-Modified: '.$mtime);
			header('Etag: '.$etag);
			if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) && $_SERVER['HTTP_IF_MODIFIED_SINCE'] == $mtime) {
				header($_SERVER['SERVER_PROTOCOL']. ' 304 Not Modified');
				header('Content-Length: 0');
				echo ''; // For the compression to allow keep alive
				exit();
			}
			if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && $_SERVER['HTTP_IF_NONE_MATCH'] == $etag) {
				header($_SERVER['SERVER_PROTOCOL']. ' 304 Not Modified');
				header('Content-Length: 0');
				echo ''; // For the compression to allow keep alive
				exit();
			}
		}
		
		header('Content-Length: '.strlen($src));
		echo $src;
		exit();
	}
}

// Fix the url of the bookmarklet. All other changes are done client side
$json = file_get_contents('bookmarklet.js');
$json = str_replace('url1.js', $url, $json);
$json = json_encode($json);

$c = file_get_contents('create.html');
$c = str_replace('"pwmbml"', $json, $c);
header('Content-type: text/html; charset=utf-8');
header('Content-Length: '.strlen($c));

$mtime = gmdate('D, d M Y H:i:s', max(filemtime('bookmarklet.js'), filemtime($_SERVER['SCRIPT_FILENAME']), filemtime('create.html'))). ' GMT';
$etag = '"'.md5($c).'"';
header('Etag: '.$etag);
header('Last-Modified: '.$mtime);
if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) && $_SERVER['HTTP_IF_MODIFIED_SINCE'] == $mtime) {
	header($_SERVER['SERVER_PROTOCOL']. ' 304 Not Modified');
	header('Content-Length: 0');
	echo ''; // For the compression to allow keep alive
	exit();
}
if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && $_SERVER['HTTP_IF_NONE_MATCH'] == $etag) {
	header($_SERVER['SERVER_PROTOCOL']. ' 304 Not Modified');
	header('Content-Length: 0');
	echo ''; // For the compression to allow keep alive
	exit();
}
echo $c;
?>
