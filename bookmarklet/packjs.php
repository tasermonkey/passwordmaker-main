<?php
/**
	A little script to compact the javascript files before they're used.
	Note: This file and the src.js files should not be put on the public server
*/
require 'jsmin-1.1.1.php';
$files = array(
	'bookmarklet-src.js'=>'bookmarklet.js',
	'create-src.js'=>'create.js',
	'url1-src.js'=>'url1.js'
);

foreach($files as $in=>$out) {
	$src = file_get_contents($in);
	$inl = strlen($src);
	$src = trim(JSMin::minify($src));
	$outl = strlen($src);
	file_put_contents($out, $src);
	echo "'$in compressed from $inl to $outl bytes\n";
}

?>
