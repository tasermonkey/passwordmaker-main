<?php
/**
	The following defines are used to control certain options in this script:
		REMOVE_NAME - Set to true if this file will be the file ran without specifying the file in the url, otherwise set to false
*/
define('REMOVE_NAME', true);

// GZip support
$gzip = ini_get('zlib.compress');
if (!$gzip || strtolower($gzip) == 'off') {
	if (function_exists('ob_gzhandler')) ob_start('ob_gzhandler');
}

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
	header('Content-Length: '.strlen($src));
	echo $src;
	exit();
}

// Fix the url of the bookmarklet. All other changes are done client side
$json = file_get_contents('bookmarklet.js');
$url = 'http'.((isset($_SERVER['HTTPS']) && $_SERVER["HTTPS"] == "on") ? 's://': '://')
	.$_SERVER['SERVER_NAME'].(($_SERVER['SERVER_PORT'] != '80') ? ':'.$_SERVER['SERVER_PORT'] : '')
	.((REMOVE_NAME)? str_replace(basename(__FILE__), '', $_SERVER['PHP_SELF']) : $_SERVER['PHP_SELF']);
$json = str_replace('url.js', $url, $json);
$json = json_encode($json);

ob_start();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<title>PasswordMaker: Click! Edition</title>
		<link rel="stylesheet" type="text/css" href="style.css" />
	</head>
	<body>
		<div id="root">
			<form>
				<p id="nameRow" class="formRow">
					<label for="name">Bookmarklet Name:</label>
					<input type="text" class="control" id="name" />
				</p>
				<fieldset id="urlparts">
					<legend>URL Components</legend>
					<label>
						<input type="checkbox" id="protocol" /> Protocol
					</label>
					<label>
						<input type="checkbox" id="subdomains" /> Subdomain(s)
					</label>
					<label>
						<input type="checkbox" id="domain" /> Domain
					</label>
					<label>
						<input type="checkbox" id="urlother" /> Port, path, anchor, query parameters
					</label>
				</fieldset>
				<p id="usernameRow" class="formRow">
					<label for="username">Username:</label>
					<input type="text" class="control" id="username" />
				</p>
				<p id="whereleetRow" class="formRow">
					<label for="whereleet">Use l33t:</label>
					<select id="whereleet" class="control">
						<option value="0">not at all</option>
						<option value="1">before generating password</option>
						<option value="2">after generating password</option>
						<option value="3">before and after generating password</option>
					</select>
				</p>
				<p id="leetlevelRow" class="formRow">
					<label for="leetlevel">l33t Level:</label>
					<select class="control" id="leetlevel">
						<option>1</option>
						<option>2</option>
						<option>3</option>
						<option>4</option>
						<option>5</option>
						<option>6</option>
						<option>7</option>
						<option>8</option>
						<option>9</option>
					</select>
				</p>
				<p id="hashalgoRow" class="formRow">
					<label for="hashalgo">Hash Algorithm</label>
					<select class="control" id="hashalgo">
						<option value="a">MD4</option>
						<option value="b">HMAC-MD4</option>
						<option value="c">MD5</option>
						<option value="d">HMAC-MD5</option>
						<option value="e">SHA-1</option>
						<option value="f">HMAC-SHA-1</option>
						<option value="g">SHA-256</option>
						<option value="h">HMAC-SHA-256</option>
						<option value="i">RIPEMD-160</option>
						<option value="j">HMAC-RIPEMD-160</option>
					</select>
				</p>
				<p id="lengthRow" class="formRow">
					<label for="length">Password Length: </label>
					<input type="text" maxlength="3" class="control" id="length" />
				</p>
				<!-- Planned on using checkboxes to handle this bit -->
				<fieldset id="characterField">
					<legend>Characters</legend>
					<label><input id="characterParts" type="radio" name="characterTab" value="parts" /> Parts</label>
					<label><input id="characterDefined" type="radio" name="characterTab" value="defined" /> Predefined</label>
					<label><input id="characterCustion" type="radio" name="characterTab" value="custom" /> Custom</label>
					<p id="characterPartsTab">
						<label><input type="checkbox" id="charactersUpper" /> Upper Alpha</label>
						<label><input type="checkbox" id="charactersLower" /> Lower Alpha</label>
						<label><input type="checkbox" id="charactersNumber" /> Numbers</label>
						<label><input type="checkbox" id="charactersSpecial" /> Special Characters</label>
					</p>
					<p id="characterDefinedTab" class="formRow">
						<label for="characterDefined">Predefined-sets:</label>
						<select class="control" id="characterDefined">
							<option value="f">Hex String</option>
						</select>
					</p>
					<p class="formRow">
						<label for="characters">Character Set:<br /><sub>(For other editions)</sub></label>
						<input type="text" class="control" id="characters" />
					</p>
					<!-- ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&amp;*()_-+={}|[]\:";'&lt;&gt;?,./ -->
				</fieldset>
				<p id="modifierRow" class="formRow">
					<label for="modifier">Modifier: </label>
					<input type="text" class="control" id="modifier" />
				</p>
				<p id="prefixRow" class="formRow">
					<label for="prefix">Password Prefix: </label>
					<input type="text" class="control" id="prefix" />
				</p>
				<p id="suffixRow" class="formRow">
					<label for="suffix">Password Suffix: </label>
					<input type="text" class="control" id="suffix" />
				</p>
				<p id="bookmarkletRow" class="formRow">
					<label>Your Bookmarklet:</label>
					<a id="bookmarklet" class="control" href="javascript:void()">PWMClick!</a>
				</p>
			</form>
		</div>
		<script type="text/javascript">bkl = <?php echo $json; ?>;</script>
		<script type="text/javascript" src="create.js"></script>
	</body>
</html>
<?php
$c = ob_get_clean();
header('Content-type: text/html; charset=utf-8');
header('Content-Length: '.strlen($c));
// TODO: Cache control
echo $c;
?>
