<?php
/**
	The following defines are used to control certain options in this script:
		REMOVE_NAME - Set to true if this file will be the file ran without specifying the file in the url, otherwise set to false
*/
define('REMOVE_NAME', true);
if (isset($_GET['h']) && isset($_GET['v'])) {
	header('Content-type: text/javascript; charset=utf-8');
	if (preg_match('/\Ah[\da-f]{16}\z/', $_GET['h'])) {
		switch ($_GET['v']) {
		case '1': {
			$src = file_get_contents('url'.$_GET['v'].'.js');
			$mtime = filemtime('url'.$_GET['v'].'.js');
			$src = str_replace('hpwmbklhash123456', $_GET['h'], $src);
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
	
	// TODO: Cache control
	echo $src;
	exit();
}

// Fix the url of the bookmarklet. All other changes are done client side
$json = file_get_contents('bookmarklet.js');
$url = 'http'.((isset($_SERVER['HTTPS']) && $_SERVER["HTTPS"] == "on") ? 's://': '://')
	.$_SERVER['SERVER_NAME'].((REMOVE_NAME)? str_replace(basename(__FILE__), '', $_SERVER['PHP_SELF']) : $_SERVER['PHP_SELF']);
$json = str_replace('url.js', $url, $json);
$json = json_encode($json);

ob_start();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<title>PasswordMaker: Click! Edition</title>
	</head>
	<body>
		<div id="root">
			<p>Moo!</p>
		</div>
		<script type="text/javascript">bkl = <?php echo $json; ?>;</script>
		<script type="text/javascript" src="create.js"></script>
	</body>
</html>
<?php
$c = ob_get_contents();
ob_end_clean();
header('Content-type: text/html; charset=utf-8');
header('Content-Length: '.strlen($c));
// TODO: Cache control
echo $c;
?>
