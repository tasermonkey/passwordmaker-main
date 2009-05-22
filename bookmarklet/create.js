var hash,params='',extras='',rehash=false;var ie6=false,g=function(id){return document.getElementById(id);};var bklname,protocol,subdomain,domain,path,username,whereleet,leetlevel,hashalgo,length,modifier,prefix,suffix,bookmarklet,error;var characters,cUpper,cLower,cNumber,cSpecial,cDefine,cTabs;function characterHandler(){var o;cTabs[0].className=cTabs[0].className.replace(/\btabHidden\b/g,'');cTabs[1].className=cTabs[1].className.replace(/\btabHidden\b/g,'');o=g('characterParts');characters.readonly=true;if(o.checked){cTabs[1].className=cTabs[1].className+' tabHidden';if(!cUpper.checked&&!cLower.checked&&!cNumber.checked&&!cSpecial.checked){g('bookmarkletRow').className+=' hidden';error.firstChild.nodeValue='You must have at least one character set checkbox enabled!';error.className='error';}
else{var mask=0;characters.value='';if(cUpper.checked){mask|=8;characters.value+='ABCDEFGHIJKLMNOPQRSTUVWXYZ';}
if(cLower.checked){mask|=4;characters.value+='abcdefghijklmnopqrstuvwxyz';}
if(cNumber.checked){mask|=2;characters.value+='0123456789';}
if(cSpecial.checked){mask|=1;characters.value+='`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/';}
mask^=15;params=params.substr(0,4)+mask.toString(16)+params.substr(5);}}
else{o=g('characterDefine');if(o.checked){cTabs[0].className=cTabs[0].className+' tabHidden';params=params.substr(0,4)+cDefine.value+params.substr(5);characters.value='0123456789abcdef';}
else{cTabs[0].className=cTabs[0].className+' tabHidden';cTabs[1].className=cTabs[1].className+' tabHidden';params=params.substr(0,4)+'Z'+params.substr(5);characters.readonly=false;}}}
function updateParams(){var i;g('bookmarkletRow').className=g('bookmarkletRow').className.replace(/\bhidden\b/g,'');error.className='hidden';bookmarklet.firstChild.nodeValue=bklname.value;i=0;if(protocol.checked){i|=8;}
if(subdomain.checked){i|=4;}
if(domain.checked){i|=2;}
if(path.checked){i|=1;}
if(!i){g('bookmarkletRow').className+=' hidden';error.firstChild.nodeValue='At least one part must be used.';error.className='error';}
params=i.toString(16);params+=whereleet.value;leetlevel.disabled=(whereleet.value=='0');params+=leetlevel.value;params+=hashalgo.value+' ';i=length.value;while(i.length<3){i='0'+i;}
if(!/\d{3}/.test(i)){g('bookmarkletRow').className+=' hidden';error.firstChild.nodeValue='Password length must be a number!';error.className='error';}
params+=i;characterHandler();if(!ie6){extras={};if(username.value){extras.username=username.value;}
if(modifier.value){extras.modifier=modifier.value;}
if(prefix.value){extras.prefix=prefix.value;}
if(suffix.value){extras.suffix=suffix.value;}
if(params.charAt(4)=='Z'){extras.characters=characters.value;if(characters.value.length<2){g('bookmarkletRow').className+=' hidden';error.firstChild.nodeValue='You must have at least two characters for the character set.';error.className='error';}}}
else{extras='';}
extras=JSON.stringify(extras);bookmarklet.href='javascript:'+bkl.replace('faaaa000',params).replace('pwmextras',extras).replace('hpwmbklhash123456',hash).replace(/ /g,'%20');if(ie6&&bookmarklet.href.length>477){g('bookmarkletRow').className+=' hidden';error.firstChild.nodeValue="Whoops, it seems the bookmarklet is too long. If you can't upgrade from IE6, consider using another browser.";error.className='error';}}
function paramsUpdate(version,params,extras,hash){if(version<1){return;}
switch(version){case 1:break;default:return;}
updateParams();}
if(!this.JSON){JSON={};}
(function(){function f(n){return n<10?'0'+n:n;}
if(typeof String.prototype.toJSON!=='function'){String.prototype.toJSON=function(key){return this.valueOf();};}
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
if(typeof rep==='function'){value=rep.call(holder,key,value);}
switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
v=partial.length===0?'[]':gap?'[\n'+gap+
partial.join(',\n'+gap)+'\n'+
mind+']':'['+partial.join(',')+']';gap=mind;return v;}
if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==='string'){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+
mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
return str('',{'':value});};}}());window.onload=function(){var hex=Array('0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f');var i;bklname=g('name');protocol=g('protocol');subdomain=g('subdomains');domain=g('domain');path=g('path');username=g('username');whereleet=g('whereleet');leetlevel=g('leetlevel');hashalgo=g('hashalgo');length=g('length');modifier=g('modifier');prefix=g('prefix');suffix=g('suffix');bookmarklet=g('bookmarklet');bookmarklet.appendChild(document.createTextNode(''));error=g('errorMessage');error.appendChild(document.createTextNode(''));characters=g('characters');cUpper=g('charactersUpper');cLower=g('charactersLower');cNumber=g('charactersNumber');cSpecial=g('charactersSpecial');cDefine=g('characterDefined');cTabs=[g('characterPartsTab'),g('characterDefinedTab')];protocol.onclick=protocol.onchange=updateParams;subdomain.onclick=subdomain.onchange=updateParams;domain.onclick=domain.onchange=updateParams;path.onclick=path.onchange=updateParams;bklname.onkeyup=bklname.onchange=updateParams;username.onkeyup=username.onchange=updateParams;length.onkeyup=length.onchange=updateParams;modifier.onkeyup=modifier.onchange=updateParams;prefix.onkeyup=prefix.onchange=updateParams;suffix.onkeyup=suffix.onchange=updateParams;whereleet.onkeyup=whereleet.onchange=updateParams;leetlevel.onkeyup=leetlevel.onchange=updateParams;hashalgo.onkeyup=hashalgo.onchange=updateParams;characters.onkeyup=characters.onchange=updateParams;cUpper.onkeyup=cUpper.onclick=cUpper.onchange=updateParams;cLower.onkeyup=cLower.onclick=cLower.onchange=updateParams;cNumber.onkeyup=cNumber.onclick=cNumber.onchange=updateParams;cSpecial.onkeyup=cSpecial.onclick=cSpecial.onchange=updateParams;cDefine.onkeyup=cDefine.onchange=updateParams;g('characterParts').onclick=updateParams;g('characterDefine').onclick=updateParams;g('characterCustom').onclick=updateParams;characters.readonly=true;if(!(/KHTML|AppleWebKit|Opera/).test(navigator.userAgent)){i=navigator.userAgent.match(/MSIE\s([^;]*)/);if(i&&i[1]){i=parseFloat(i[1]);if(i==6.0){ie6=true;username.disabled=true;modifier.disabled=true;prefix.disabled=true;suffix.disabled=true;g('characterCustom').disabled=true;}}}
hash='h';for(i=0;i<16;i++){hash+=hex[Math.floor(Math.random()*16)];}
updateParams();};