window._hpwmbklhash123456_v={id:'hpwmbklhash123456',ie:false,url:'url1.js',protocol:false,subdomain:false,domain:false,path:false,usetext:'',whereLeet:0,leetlevel:0,hash:'',characters:'',length:0,mphash:'',username:'',modifier:'',prefix:'',suffix:'',populateAll:false,form:false,generatePassword:function(){var password='',count=0,mpw,data;if(this.characters.length<2){alert('Character Set is less than 2 characters!');return;}
mpw=document.getElementById(this.id+'mpw1').value;if(this.mphash){}else{if(mpw!=document.getElementById(this.id+'mpw2').value){alert('Master Passwords do not match!');document.getElementById(this.id+'mpw1').focus();return;}}
data=this.usetext+this.username+this.modifier;if(!this.usetext.length){this.getText();}
while(password.length<this.length){password+=(count==0)?this._generatePassword(mpw,data):this._generatePassword(mpw+'\n'+count,data);count++;}
if(this.prefix){password=this.prefix+password;}
if(this.suffix){password=password.substring(0,this.length-this.suffix.length)+this.suffix;}
password=password.substring(0,this.length);return password;},_generatePassword:function(key,data){var password='ERROR! No hashing done!';if(this.whereLeet&1){key=this.l33t.convert(this.leetlevel-1,key);data=this.l33t.convert(this.leetlevel-1,data);}
switch(this.hash){case"a":password=this.MD4.any_md4(key+data,this.characters);break;case"b":password=this.MD4.any_hmac_md4(key,data,this.characters);break;case"c":password=this.MD5.any_md5(key+data,this.characters);break;case"d":password=this.MD5.any_hmac_md5(key,data,this.characters);break;case"e":password=this.SHA1.any_sha1(key+data,this.characters);break;case"f":password=this.SHA1.any_hmac_sha1(key,data,this.characters);break;case"g":password=this.SHA256.any_sha256(key+data,this.characters);break;case"h":password=this.SHA256.any_hmac_sha256(key,data,this.characters,false);break;case"i":password=this.RIPEMD160.any_rmd160(key+data,this.characters);break;case"j":password=this.RIPEMD160.any_hmac_rmd160(key,data,this.characters);break;}
if(this.whereLeet&2){password=this.l33t.convert(this.leetlevel-1,password);}
return password;},populateFields:function(){var i,o=document.getElementsByTagName('input'),q,p=this.generatePassword();if(!p){return;}
for(i=0;i<o.length;i++){q=o[i];if(q.id.substring(0,17)!=this.id){switch(q.type){case'text':if(this.populateAll||!q.value){console.log(q);if(q.name.match(/ID|un|name|user|usr|log|email|mail|acct|ssn/i)){q.value=this.username;}}
break;case'password':if(this.populateAll||!q.value){q.value=p;}
break;}}}
o=this.form.style.display='none';this.populateAll=true;},getText:function(){var temp,domainSegments,displayMe='',displayMeTemp;temp=location.href.match(/^([^:]+:\/\/)([^\/]+)(.*)$/);if(!temp){temp=['','','',''];}
domainSegments=temp[2].split('.');displayMeTemp=this.protocol?temp[1]:'';if(this.subdomain){for(var i=0;i<domainSegments.length-2;i++){displayMe+=domainSegments[i];if(i+1<domainSegments.length-2){displayMe+='.';}}}
if(this.domain){if(displayMe!=''&&displayMe[displayMe.length-1]!='.'){displayMe+='.';}
if(domainSegments[domainSegments.length-2]){displayMe+=domainSegments[domainSegments.length-2]+'.';}
displayMe+=domainSegments[domainSegments.length-1];}
displayMe=displayMeTemp+displayMe;if(this.path){displayMe+=temp[3];}
this.usetext=displayMe;}};window._hpwmbklhash123456_v.HashUtils={chrsz:8,str2rstr_utf8:function(input){var output="";var i=-1;var x,y;while(++i<input.length)
{x=input.charCodeAt(i);y=i+1<input.length?input.charCodeAt(i+1):0;if(0xD800<=x&&x<=0xDBFF&&0xDC00<=y&&y<=0xDFFF)
{x=0x10000+((x&0x03FF)<<10)+(y&0x03FF);i++;}
if(x<=0x7F)
output+=String.fromCharCode(x);else if(x<=0x7FF)
output+=String.fromCharCode(0xC0|((x>>>6)&0x1F),0x80|(x&0x3F));else if(x<=0xFFFF)
output+=String.fromCharCode(0xE0|((x>>>12)&0x0F),0x80|((x>>>6)&0x3F),0x80|(x&0x3F));else if(x<=0x1FFFFF)
output+=String.fromCharCode(0xF0|((x>>>18)&0x07),0x80|((x>>>12)&0x3F),0x80|((x>>>6)&0x3F),0x80|(x&0x3F));}
return output;},rstr2binl:function(input){var output=Array(input.length>>2);for(var i=0;i<output.length;i++)
output[i]=0;for(var i=0;i<input.length*8;i+=8)
output[i>>5]|=(input.charCodeAt(i/8)&0xFF)<<(i%32);return output;},binl2rstr:function(input){var output="";for(var i=0;i<input.length*32;i+=8)
output+=String.fromCharCode((input[i>>5]>>>(i%32))&0xFF);return output;},rstr2any:function(input,encoding){var divisor=encoding.length;var remainders=Array();var i,q,x,quotient;var dividend=Array(input.length/2);var inp=new String(input);for(i=0;i<dividend.length;i++){dividend[i]=(inp.charCodeAt(i*2)<<8)|inp.charCodeAt(i*2+1);}
while(dividend.length>0){quotient=Array();x=0;for(i=0;i<dividend.length;i++){x=(x<<16)+dividend[i];q=Math.floor(x/divisor);x-=q*divisor;if(quotient.length>0||q>0)
quotient[quotient.length]=q;}
remainders[remainders.length]=x;dividend=quotient;}
var output="";for(i=remainders.length-1;i>=0;i--)
output+=encoding.charAt(remainders[i]);return output;},rstr2binb:function(input){var output=Array(input.length>>2);for(var i=0;i<output.length;i++)
output[i]=0;for(var i=0;i<input.length*8;i+=8)
output[i>>5]|=(input.charCodeAt(i/8)&0xFF)<<(24-i%32);return output;},binb2rstr:function(input){var output="";for(var i=0;i<input.length*32;i+=8)
output+=String.fromCharCode((input[i>>5]>>>(24-i%32))&0xFF);return output;},bit_rol:function(num,cnt){return(num<<cnt)|(num>>>(32-cnt));},safe_add:function(x,y){var lsw=(x&0xFFFF)+(y&0xFFFF);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&0xFFFF);}};window._hpwmbklhash123456_v.SHA256={any_sha256:function(s,e){return _hpwmbklhash123456_v.HashUtils.rstr2any(this.rstr_sha256(_hpwmbklhash123456_v.HashUtils.str2rstr_utf8(s)),e);},any_hmac_sha256:function(k,d,e,b){return _hpwmbklhash123456_v.HashUtils.rstr2any(this.rstr_hmac_sha256(_hpwmbklhash123456_v.HashUtils.str2rstr_utf8(k),_hpwmbklhash123456_v.HashUtils.str2rstr_utf8(d),b),e);},rstr_sha256:function(s){return _hpwmbklhash123456_v.HashUtils.binb2rstr(this.binb_sha256(_hpwmbklhash123456_v.HashUtils.rstr2binb(s),s.length*8));},rstr_hmac_sha256:function(key,data,bug){var bkey=_hpwmbklhash123456_v.HashUtils.rstr2binb(key);if(bkey.length>16)bkey=this.binb_sha256(bkey,key.length*8);var ipad=Array(16),opad=Array(16);for(var i=0;i<16;i++)
{ipad[i]=bkey[i]^0x36363636;opad[i]=bkey[i]^0x5C5C5C5C;}
var hash=this.binb_sha256(ipad.concat(_hpwmbklhash123456_v.HashUtils.rstr2binb(data)),512+data.length*8);return _hpwmbklhash123456_v.HashUtils.binb2rstr(this.binb_sha256(opad.concat(hash),512+((bug)?160:256)));},S:function(X,n){return(X>>>n)|(X<<(32-n));},R:function(X,n){return(X>>>n);},Ch:function(x,y,z){return((x&y)^((~x)&z));},Maj:function(x,y,z){return((x&y)^(x&z)^(y&z));},Sigma0256:function(x){return(this.S(x,2)^this.S(x,13)^this.S(x,22));},Sigma1256:function(x){return(this.S(x,6)^this.S(x,11)^this.S(x,25));},Gamma0256:function(x){return(this.S(x,7)^this.S(x,18)^this.R(x,3));},Gamma1256:function(x){return(this.S(x,17)^this.S(x,19)^this.R(x,10));},Sigma0512:function(x){return(this.S(x,28)^this.S(x,34)^this.S(x,39));},Sigma1512:function(x){return(this.S(x,14)^this.S(x,18)^this.S(x,41));},Gamma0512:function(x){return(this.S(x,1)^this.S(x,8)^this.R(x,7));},Gamma1512:function(x){return(this.S(x,19)^this.S(x,61)^this.R(x,6));},sha256_K:new Array(1116352408,1899447441,-1245643825,-373957723,961987163,1508970993,-1841331548,-1424204075,-670586216,310598401,607225278,1426881987,1925078388,-2132889090,-1680079193,-1046744716,-459576895,-272742522,264347078,604807628,770255983,1249150122,1555081692,1996064986,-1740746414,-1473132947,-1341970488,-1084653625,-958395405,-710438585,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,-2117940946,-1838011259,-1564481375,-1474664885,-1035236496,-949202525,-778901479,-694614492,-200395387,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,-2067236844,-1933114872,-1866530822,-1538233109,-1090935817,-965641998),binb_sha256:function(m,l){var HASH=new Array(1779033703,-1150833019,1013904242,-1521486534,1359893119,-1694144372,528734635,1541459225);var W=new Array(64);var a,b,c,d,e,f,g,h;var i,j,T1,T2;m[l>>5]|=0x80<<(24-l%32);m[((l+64>>9)<<4)+15]=l;for(i=0;i<m.length;i+=16)
{a=HASH[0];b=HASH[1];c=HASH[2];d=HASH[3];e=HASH[4];f=HASH[5];g=HASH[6];h=HASH[7];for(j=0;j<64;j++)
{if(j<16)W[j]=m[j+i];else W[j]=_hpwmbklhash123456_v.HashUtils.safe_add(_hpwmbklhash123456_v.HashUtils.safe_add(_hpwmbklhash123456_v.HashUtils.safe_add(this.Gamma1256(W[j-2]),W[j-7]),this.Gamma0256(W[j-15])),W[j-16]);T1=_hpwmbklhash123456_v.HashUtils.safe_add(_hpwmbklhash123456_v.HashUtils.safe_add(_hpwmbklhash123456_v.HashUtils.safe_add(_hpwmbklhash123456_v.HashUtils.safe_add(h,this.Sigma1256(e)),this.Ch(e,f,g)),this.sha256_K[j]),W[j]);T2=_hpwmbklhash123456_v.HashUtils.safe_add(this.Sigma0256(a),this.Maj(a,b,c));h=g;g=f;f=e;e=_hpwmbklhash123456_v.HashUtils.safe_add(d,T1);d=c;c=b;b=a;a=_hpwmbklhash123456_v.HashUtils.safe_add(T1,T2);}
HASH[0]=_hpwmbklhash123456_v.HashUtils.safe_add(a,HASH[0]);HASH[1]=_hpwmbklhash123456_v.HashUtils.safe_add(b,HASH[1]);HASH[2]=_hpwmbklhash123456_v.HashUtils.safe_add(c,HASH[2]);HASH[3]=_hpwmbklhash123456_v.HashUtils.safe_add(d,HASH[3]);HASH[4]=_hpwmbklhash123456_v.HashUtils.safe_add(e,HASH[4]);HASH[5]=_hpwmbklhash123456_v.HashUtils.safe_add(f,HASH[5]);HASH[6]=_hpwmbklhash123456_v.HashUtils.safe_add(g,HASH[6]);HASH[7]=_hpwmbklhash123456_v.HashUtils.safe_add(h,HASH[7]);}
return HASH;}};window._hpwmbklhash123456_v.MD4={any_md4:function(s,e){return _hpwmbklhash123456_v.HashUtils.rstr2any(this.rstr_md4(_hpwmbklhash123456_v.HashUtils.str2rstr_utf8(s)),e);},any_hmac_md4:function(k,d,e){return _hpwmbklhash123456_v.HashUtils.rstr2any(this.rstr_hmac_md4(_hpwmbklhash123456_v.HashUtils.str2rstr_utf8(k),_hpwmbklhash123456_v.HashUtils.str2rstr_utf8(d)),e);},rstr_md4:function(s){return _hpwmbklhash123456_v.HashUtils.binl2rstr(this.binl_md4(_hpwmbklhash123456_v.HashUtils.rstr2binl(s),s.length*_hpwmbklhash123456_v.HashUtils.chrsz));},binl_md4:function(x,len){x[len>>5]|=0x80<<(len%32);x[(((len+64)>>>9)<<4)+14]=len;var a=1732584193;var b=-271733879;var c=-1732584194;var d=271733878;for(var i=0;i<x.length;i+=16)
{var olda=a;var oldb=b;var oldc=c;var oldd=d;a=this.md4_ff(a,b,c,d,x[i+0],3);d=this.md4_ff(d,a,b,c,x[i+1],7);c=this.md4_ff(c,d,a,b,x[i+2],11);b=this.md4_ff(b,c,d,a,x[i+3],19);a=this.md4_ff(a,b,c,d,x[i+4],3);d=this.md4_ff(d,a,b,c,x[i+5],7);c=this.md4_ff(c,d,a,b,x[i+6],11);b=this.md4_ff(b,c,d,a,x[i+7],19);a=this.md4_ff(a,b,c,d,x[i+8],3);d=this.md4_ff(d,a,b,c,x[i+9],7);c=this.md4_ff(c,d,a,b,x[i+10],11);b=this.md4_ff(b,c,d,a,x[i+11],19);a=this.md4_ff(a,b,c,d,x[i+12],3);d=this.md4_ff(d,a,b,c,x[i+13],7);c=this.md4_ff(c,d,a,b,x[i+14],11);b=this.md4_ff(b,c,d,a,x[i+15],19);a=this.md4_gg(a,b,c,d,x[i+0],3);d=this.md4_gg(d,a,b,c,x[i+4],5);c=this.md4_gg(c,d,a,b,x[i+8],9);b=this.md4_gg(b,c,d,a,x[i+12],13);a=this.md4_gg(a,b,c,d,x[i+1],3);d=this.md4_gg(d,a,b,c,x[i+5],5);c=this.md4_gg(c,d,a,b,x[i+9],9);b=this.md4_gg(b,c,d,a,x[i+13],13);a=this.md4_gg(a,b,c,d,x[i+2],3);d=this.md4_gg(d,a,b,c,x[i+6],5);c=this.md4_gg(c,d,a,b,x[i+10],9);b=this.md4_gg(b,c,d,a,x[i+14],13);a=this.md4_gg(a,b,c,d,x[i+3],3);d=this.md4_gg(d,a,b,c,x[i+7],5);c=this.md4_gg(c,d,a,b,x[i+11],9);b=this.md4_gg(b,c,d,a,x[i+15],13);a=this.md4_hh(a,b,c,d,x[i+0],3);d=this.md4_hh(d,a,b,c,x[i+8],9);c=this.md4_hh(c,d,a,b,x[i+4],11);b=this.md4_hh(b,c,d,a,x[i+12],15);a=this.md4_hh(a,b,c,d,x[i+2],3);d=this.md4_hh(d,a,b,c,x[i+10],9);c=this.md4_hh(c,d,a,b,x[i+6],11);b=this.md4_hh(b,c,d,a,x[i+14],15);a=this.md4_hh(a,b,c,d,x[i+1],3);d=this.md4_hh(d,a,b,c,x[i+9],9);c=this.md4_hh(c,d,a,b,x[i+5],11);b=this.md4_hh(b,c,d,a,x[i+13],15);a=this.md4_hh(a,b,c,d,x[i+3],3);d=this.md4_hh(d,a,b,c,x[i+11],9);c=this.md4_hh(c,d,a,b,x[i+7],11);b=this.md4_hh(b,c,d,a,x[i+15],15);a=_hpwmbklhash123456_v.HashUtils.safe_add(a,olda);b=_hpwmbklhash123456_v.HashUtils.safe_add(b,oldb);c=_hpwmbklhash123456_v.HashUtils.safe_add(c,oldc);d=_hpwmbklhash123456_v.HashUtils.safe_add(d,oldd);}
return Array(a,b,c,d);},md4_cmn:function(q,a,b,x,s,t){return _hpwmbklhash123456_v.HashUtils.safe_add(_hpwmbklhash123456_v.HashUtils.bit_rol(_hpwmbklhash123456_v.HashUtils.safe_add(_hpwmbklhash123456_v.HashUtils.safe_add(a,q),_hpwmbklhash123456_v.HashUtils.safe_add(x,t)),s),b);},md4_ff:function(a,b,c,d,x,s){return this.md4_cmn((b&c)|((~b)&d),a,0,x,s,0);},md4_gg:function(a,b,c,d,x,s){return this.md4_cmn((b&c)|(b&d)|(c&d),a,0,x,s,1518500249);},md4_hh:function(a,b,c,d,x,s){return this.md4_cmn(b^c^d,a,0,x,s,1859775393);},rstr_hmac_md4:function(key,data){var bkey=_hpwmbklhash123456_v.HashUtils.rstr2binl(key);if(bkey.length>16)bkey=this.binl_md4(bkey,key.length*_hpwmbklhash123456_v.HashUtils.chrsz);var ipad=Array(16),opad=Array(16);for(var i=0;i<16;i++){ipad[i]=bkey[i]^0x36363636;opad[i]=bkey[i]^0x5C5C5C5C;}
var hash=this.binl_md4(ipad.concat(_hpwmbklhash123456_v.HashUtils.rstr2binl(data)),512+data.length*_hpwmbklhash123456_v.HashUtils.chrsz);return _hpwmbklhash123456_v.HashUtils.binl2rstr(this.binl_md4(opad.concat(hash),512+128));}};window._hpwmbklhash123456_v.MD5={any_md5:function(s,e){return _hpwmbklhash123456_v.HashUtils.rstr2any(this.rstr_md5(_hpwmbklhash123456_v.HashUtils.str2rstr_utf8(s)),e);},any_hmac_md5:function(k,d,e){return _hpwmbklhash123456_v.HashUtils.rstr2any(this.rstr_hmac_md5(_hpwmbklhash123456_v.HashUtils.str2rstr_utf8(k),_hpwmbklhash123456_v.HashUtils.str2rstr_utf8(d)),e);},rstr_md5:function(s){return _hpwmbklhash123456_v.HashUtils.binl2rstr(this.binl_md5(_hpwmbklhash123456_v.HashUtils.rstr2binl(s),s.length*_hpwmbklhash123456_v.HashUtils.chrsz));},binl_md5:function(x,len){x[len>>5]|=0x80<<((len)%32);x[(((len+64)>>>9)<<4)+14]=len;var a=1732584193;var b=-271733879;var c=-1732584194;var d=271733878;for(var i=0;i<x.length;i+=16){var olda=a;var oldb=b;var oldc=c;var oldd=d;a=this.md5_ff(a,b,c,d,x[i+0],7,-680876936);d=this.md5_ff(d,a,b,c,x[i+1],12,-389564586);c=this.md5_ff(c,d,a,b,x[i+2],17,606105819);b=this.md5_ff(b,c,d,a,x[i+3],22,-1044525330);a=this.md5_ff(a,b,c,d,x[i+4],7,-176418897);d=this.md5_ff(d,a,b,c,x[i+5],12,1200080426);c=this.md5_ff(c,d,a,b,x[i+6],17,-1473231341);b=this.md5_ff(b,c,d,a,x[i+7],22,-45705983);a=this.md5_ff(a,b,c,d,x[i+8],7,1770035416);d=this.md5_ff(d,a,b,c,x[i+9],12,-1958414417);c=this.md5_ff(c,d,a,b,x[i+10],17,-42063);b=this.md5_ff(b,c,d,a,x[i+11],22,-1990404162);a=this.md5_ff(a,b,c,d,x[i+12],7,1804603682);d=this.md5_ff(d,a,b,c,x[i+13],12,-40341101);c=this.md5_ff(c,d,a,b,x[i+14],17,-1502002290);b=this.md5_ff(b,c,d,a,x[i+15],22,1236535329);a=this.md5_gg(a,b,c,d,x[i+1],5,-165796510);d=this.md5_gg(d,a,b,c,x[i+6],9,-1069501632);c=this.md5_gg(c,d,a,b,x[i+11],14,643717713);b=this.md5_gg(b,c,d,a,x[i+0],20,-373897302);a=this.md5_gg(a,b,c,d,x[i+5],5,-701558691);d=this.md5_gg(d,a,b,c,x[i+10],9,38016083);c=this.md5_gg(c,d,a,b,x[i+15],14,-660478335);b=this.md5_gg(b,c,d,a,x[i+4],20,-405537848);a=this.md5_gg(a,b,c,d,x[i+9],5,568446438);d=this.md5_gg(d,a,b,c,x[i+14],9,-1019803690);c=this.md5_gg(c,d,a,b,x[i+3],14,-187363961);b=this.md5_gg(b,c,d,a,x[i+8],20,1163531501);a=this.md5_gg(a,b,c,d,x[i+13],5,-1444681467);d=this.md5_gg(d,a,b,c,x[i+2],9,-51403784);c=this.md5_gg(c,d,a,b,x[i+7],14,1735328473);b=this.md5_gg(b,c,d,a,x[i+12],20,-1926607734);a=this.md5_hh(a,b,c,d,x[i+5],4,-378558);d=this.md5_hh(d,a,b,c,x[i+8],11,-2022574463);c=this.md5_hh(c,d,a,b,x[i+11],16,1839030562);b=this.md5_hh(b,c,d,a,x[i+14],23,-35309556);a=this.md5_hh(a,b,c,d,x[i+1],4,-1530992060);d=this.md5_hh(d,a,b,c,x[i+4],11,1272893353);c=this.md5_hh(c,d,a,b,x[i+7],16,-155497632);b=this.md5_hh(b,c,d,a,x[i+10],23,-1094730640);a=this.md5_hh(a,b,c,d,x[i+13],4,681279174);d=this.md5_hh(d,a,b,c,x[i+0],11,-358537222);c=this.md5_hh(c,d,a,b,x[i+3],16,-722521979);b=this.md5_hh(b,c,d,a,x[i+6],23,76029189);a=this.md5_hh(a,b,c,d,x[i+9],4,-640364487);d=this.md5_hh(d,a,b,c,x[i+12],11,-421815835);c=this.md5_hh(c,d,a,b,x[i+15],16,530742520);b=this.md5_hh(b,c,d,a,x[i+2],23,-995338651);a=this.md5_ii(a,b,c,d,x[i+0],6,-198630844);d=this.md5_ii(d,a,b,c,x[i+7],10,1126891415);c=this.md5_ii(c,d,a,b,x[i+14],15,-1416354905);b=this.md5_ii(b,c,d,a,x[i+5],21,-57434055);a=this.md5_ii(a,b,c,d,x[i+12],6,1700485571);d=this.md5_ii(d,a,b,c,x[i+3],10,-1894986606);c=this.md5_ii(c,d,a,b,x[i+10],15,-1051523);b=this.md5_ii(b,c,d,a,x[i+1],21,-2054922799);a=this.md5_ii(a,b,c,d,x[i+8],6,1873313359);d=this.md5_ii(d,a,b,c,x[i+15],10,-30611744);c=this.md5_ii(c,d,a,b,x[i+6],15,-1560198380);b=this.md5_ii(b,c,d,a,x[i+13],21,1309151649);a=this.md5_ii(a,b,c,d,x[i+4],6,-145523070);d=this.md5_ii(d,a,b,c,x[i+11],10,-1120210379);c=this.md5_ii(c,d,a,b,x[i+2],15,718787259);b=this.md5_ii(b,c,d,a,x[i+9],21,-343485551);a=_hpwmbklhash123456_v.HashUtils.safe_add(a,olda);b=_hpwmbklhash123456_v.HashUtils.safe_add(b,oldb);c=_hpwmbklhash123456_v.HashUtils.safe_add(c,oldc);d=_hpwmbklhash123456_v.HashUtils.safe_add(d,oldd);}
return Array(a,b,c,d);},md5_cmn:function(q,a,b,x,s,t){return _hpwmbklhash123456_v.HashUtils.safe_add(_hpwmbklhash123456_v.HashUtils.bit_rol(_hpwmbklhash123456_v.HashUtils.safe_add(_hpwmbklhash123456_v.HashUtils.safe_add(a,q),_hpwmbklhash123456_v.HashUtils.safe_add(x,t)),s),b);},md5_ff:function(a,b,c,d,x,s,t){return this.md5_cmn((b&c)|((~b)&d),a,b,x,s,t);},md5_gg:function(a,b,c,d,x,s,t){return this.md5_cmn((b&d)|(c&(~d)),a,b,x,s,t);},md5_hh:function(a,b,c,d,x,s,t){return this.md5_cmn(b^c^d,a,b,x,s,t);},md5_ii:function(a,b,c,d,x,s,t){return this.md5_cmn(c^(b|(~d)),a,b,x,s,t);},rstr_hmac_md5:function(key,data){var bkey=_hpwmbklhash123456_v.HashUtils.rstr2binl(key);if(bkey.length>16)bkey=this.binl_md5(bkey,key.length*_hpwmbklhash123456_v.HashUtils.chrsz);var ipad=Array(16),opad=Array(16);for(var i=0;i<16;i++){ipad[i]=bkey[i]^0x36363636;opad[i]=bkey[i]^0x5C5C5C5C;}
var hash=this.binl_md5(ipad.concat(_hpwmbklhash123456_v.HashUtils.rstr2binl(data)),512+data.length*_hpwmbklhash123456_v.HashUtils.chrsz);return _hpwmbklhash123456_v.HashUtils.binl2rstr(this.binl_md5(opad.concat(hash),512+128));}};window._hpwmbklhash123456_v.RIPEMD160={any_rmd160:function(s,e){return _hpwmbklhash123456_v.HashUtils.rstr2any(this.rstr_rmd160(_hpwmbklhash123456_v.HashUtils.str2rstr_utf8(s)),e);},any_hmac_rmd160:function(k,d,e){return _hpwmbklhash123456_v.HashUtils.rstr2any(this.rstr_hmac_rmd160(_hpwmbklhash123456_v.HashUtils.str2rstr_utf8(k),_hpwmbklhash123456_v.HashUtils.str2rstr_utf8(d)),e);},rstr_rmd160:function(s){return _hpwmbklhash123456_v.HashUtils.binl2rstr(this.binl_rmd160(_hpwmbklhash123456_v.HashUtils.rstr2binl(s),s.length*_hpwmbklhash123456_v.HashUtils.chrsz));},rstr_hmac_rmd160:function(key,data){var bkey=_hpwmbklhash123456_v.HashUtils.rstr2binl(key);if(bkey.length>16)bkey=this.binl_rmd160(bkey,key.length*8);var ipad=Array(16),opad=Array(16);for(var i=0;i<16;i++){ipad[i]=bkey[i]^0x36363636;opad[i]=bkey[i]^0x5C5C5C5C;}
var hash=this.binl_rmd160(ipad.concat(_hpwmbklhash123456_v.HashUtils.rstr2binl(data)),512+data.length*8);return _hpwmbklhash123456_v.HashUtils.binl2rstr(this.binl_rmd160(opad.concat(hash),512+160));},binl_rmd160:function(x,len){x[len>>5]|=0x80<<(len%32);x[(((len+64)>>>9)<<4)+14]=len;var h0=0x67452301;var h1=0xefcdab89;var h2=0x98badcfe;var h3=0x10325476;var h4=0xc3d2e1f0;for(var i=0;i<x.length;i+=16){var T;var A1=h0,B1=h1,C1=h2,D1=h3,E1=h4;var A2=h0,B2=h1,C2=h2,D2=h3,E2=h4;for(var j=0;j<=79;++j){T=_hpwmbklhash123456_v.HashUtils.safe_add(A1,this.rmd160_f(j,B1,C1,D1));T=_hpwmbklhash123456_v.HashUtils.safe_add(T,x[i+this.rmd160_r1[j]]);T=_hpwmbklhash123456_v.HashUtils.safe_add(T,this.rmd160_K1(j));T=_hpwmbklhash123456_v.HashUtils.safe_add(_hpwmbklhash123456_v.HashUtils.bit_rol(T,this.rmd160_s1[j]),E1);A1=E1;E1=D1;D1=_hpwmbklhash123456_v.HashUtils.bit_rol(C1,10);C1=B1;B1=T;T=_hpwmbklhash123456_v.HashUtils.safe_add(A2,this.rmd160_f(79-j,B2,C2,D2));T=_hpwmbklhash123456_v.HashUtils.safe_add(T,x[i+this.rmd160_r2[j]]);T=_hpwmbklhash123456_v.HashUtils.safe_add(T,this.rmd160_K2(j));T=_hpwmbklhash123456_v.HashUtils.safe_add(_hpwmbklhash123456_v.HashUtils.bit_rol(T,this.rmd160_s2[j]),E2);A2=E2;E2=D2;D2=_hpwmbklhash123456_v.HashUtils.bit_rol(C2,10);C2=B2;B2=T;}
T=_hpwmbklhash123456_v.HashUtils.safe_add(h1,_hpwmbklhash123456_v.HashUtils.safe_add(C1,D2));h1=_hpwmbklhash123456_v.HashUtils.safe_add(h2,_hpwmbklhash123456_v.HashUtils.safe_add(D1,E2));h2=_hpwmbklhash123456_v.HashUtils.safe_add(h3,_hpwmbklhash123456_v.HashUtils.safe_add(E1,A2));h3=_hpwmbklhash123456_v.HashUtils.safe_add(h4,_hpwmbklhash123456_v.HashUtils.safe_add(A1,B2));h4=_hpwmbklhash123456_v.HashUtils.safe_add(h0,_hpwmbklhash123456_v.HashUtils.safe_add(B1,C2));h0=T;}
return[h0,h1,h2,h3,h4];},str2rstr_utf16le:function(input){var output="";for(var i=0;i<input.length;i++)
output+=String.fromCharCode(input.charCodeAt(i)&0xFF,(input.charCodeAt(i)>>>8)&0xFF);return output;},str2rstr_utf16be:function(input){var output="";for(var i=0;i<input.length;i++)
output+=String.fromCharCode((input.charCodeAt(i)>>>8)&0xFF,input.charCodeAt(i)&0xFF);return output;},rmd160_f:function(j,x,y,z){return(0<=j&&j<=15)?(x^y^z):(16<=j&&j<=31)?(x&y)|(~x&z):(32<=j&&j<=47)?(x|~y)^z:(48<=j&&j<=63)?(x&z)|(y&~z):(64<=j&&j<=79)?x^(y|~z):"rmd160_f: j out of range";},rmd160_K1:function(j){return(0<=j&&j<=15)?0x00000000:(16<=j&&j<=31)?0x5a827999:(32<=j&&j<=47)?0x6ed9eba1:(48<=j&&j<=63)?0x8f1bbcdc:(64<=j&&j<=79)?0xa953fd4e:"rmd160_K1: j out of range";},rmd160_K2:function(j){return(0<=j&&j<=15)?0x50a28be6:(16<=j&&j<=31)?0x5c4dd124:(32<=j&&j<=47)?0x6d703ef3:(48<=j&&j<=63)?0x7a6d76e9:(64<=j&&j<=79)?0x00000000:"rmd160_K2: j out of range";},rmd160_r1:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13],rmd160_r2:[5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11],rmd160_s1:[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6],rmd160_s2:[8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11]};window._hpwmbklhash123456_v.SHA1={any_sha1:function(s,e){return _hpwmbklhash123456_v.HashUtils.rstr2any(this.rstr_sha1(_hpwmbklhash123456_v.HashUtils.str2rstr_utf8(s)),e);},any_hmac_sha1:function(k,d,e){return _hpwmbklhash123456_v.HashUtils.rstr2any(this.rstr_hmac_sha1(_hpwmbklhash123456_v.HashUtils.str2rstr_utf8(k),_hpwmbklhash123456_v.HashUtils.str2rstr_utf8(d)),e);},rstr_sha1:function(s){return _hpwmbklhash123456_v.HashUtils.binb2rstr(this.binb_sha1(_hpwmbklhash123456_v.HashUtils.rstr2binb(s),s.length*_hpwmbklhash123456_v.HashUtils.chrsz));},binb_sha1:function(x,len){x[len>>5]|=0x80<<(24-len%32);x[((len+64>>9)<<4)+15]=len;var w=Array(80);var a=1732584193;var b=-271733879;var c=-1732584194;var d=271733878;var e=-1009589776;for(var i=0;i<x.length;i+=16){var olda=a;var oldb=b;var oldc=c;var oldd=d;var olde=e;for(var j=0;j<80;j++){if(j<16)w[j]=x[i+j];else w[j]=_hpwmbklhash123456_v.HashUtils.bit_rol(w[j-3]^w[j-8]^w[j-14]^w[j-16],1);var t=_hpwmbklhash123456_v.HashUtils.safe_add(_hpwmbklhash123456_v.HashUtils.safe_add(_hpwmbklhash123456_v.HashUtils.bit_rol(a,5),this.sha1_ft(j,b,c,d)),_hpwmbklhash123456_v.HashUtils.safe_add(_hpwmbklhash123456_v.HashUtils.safe_add(e,w[j]),this.sha1_kt(j)));e=d;d=c;c=_hpwmbklhash123456_v.HashUtils.bit_rol(b,30);b=a;a=t;}
a=_hpwmbklhash123456_v.HashUtils.safe_add(a,olda);b=_hpwmbklhash123456_v.HashUtils.safe_add(b,oldb);c=_hpwmbklhash123456_v.HashUtils.safe_add(c,oldc);d=_hpwmbklhash123456_v.HashUtils.safe_add(d,oldd);e=_hpwmbklhash123456_v.HashUtils.safe_add(e,olde);}
return Array(a,b,c,d,e);},sha1_ft:function(t,b,c,d){if(t<20)return(b&c)|((~b)&d);if(t<40)return b^c^d;if(t<60)return(b&c)|(b&d)|(c&d);return b^c^d;},sha1_kt:function(t){return(t<20)?1518500249:(t<40)?1859775393:(t<60)?-1894007588:-899497514;},rstr_hmac_sha1:function(key,data){var bkey=_hpwmbklhash123456_v.HashUtils.rstr2binb(key);if(bkey.length>16)bkey=this.binb_sha1(bkey,key.length*8);var ipad=Array(16),opad=Array(16);for(var i=0;i<16;i++){ipad[i]=bkey[i]^0x36363636;opad[i]=bkey[i]^0x5C5C5C5C;}
var hash=this.binb_sha1(ipad.concat(_hpwmbklhash123456_v.HashUtils.rstr2binb(data)),512+data.length*8);return _hpwmbklhash123456_v.HashUtils.binb2rstr(this.binb_sha1(opad.concat(hash),512+160));}};window._hpwmbklhash123456_v.l33t={alphabet:new Array(/a/g,/b/g,/c/g,/d/g,/e/g,/f/g,/g/g,/h/g,/i/g,/j/g,/k/g,/l/g,/m/g,/n/g,/o/g,/p/g,/q/g,/r/g,/s/g,/t/g,/u/g,/v/g,/w/g,/x/g,/y/g,/z/g),levels:new Array(new Array("4","b","c","d","3","f","g","h","i","j","k","1","m","n","0","p","9","r","s","7","u","v","w","x","y","z"),new Array("4","b","c","d","3","f","g","h","1","j","k","1","m","n","0","p","9","r","5","7","u","v","w","x","y","2"),new Array("4","8","c","d","3","f","6","h","'","j","k","1","m","n","0","p","9","r","5","7","u","v","w","x","'/","2"),new Array("@","8","c","d","3","f","6","h","'","j","k","1","m","n","0","p","9","r","5","7","u","v","w","x","'/","2"),new Array("@","|3","c","d","3","f","6","#","!","7","|<","1","m","n","0","|>","9","|2","$","7","u","\\/","w","x","'/","2"),new Array("@","|3","c","|)","&","|=","6","#","!",",|","|<","1","m","n","0","|>","9","|2","$","7","u","\\/","w","x","'/","2"),new Array("@","|3","[","|)","&","|=","6","#","!",",|","|<","1","^^","^/","0","|*","9","|2","5","7","(_)","\\/","\\/\\/","><","'/","2"),new Array("@","8","(","|)","&","|=","6","|-|","!","_|","|\(","1","|\\/|","|\\|","()","|>","(,)","|2","$","|","|_|","\\/","\\^/",")(","'/","\"/_"),new Array("@","8","(","|)","&","|=","6","|-|","!","_|","|\{","|_","/\\/\\","|\\|","()","|>","(,)","|2","$","|","|_|","\\/","\\^/",")(","'/","\"/_")),convert:function(leetLevel,message){if(leetLevel>-1){var ret=message.toLowerCase();for(var item=0;item<this.alphabet.length;item++)
ret=ret.replace(this.alphabet[item],this.levels[leetLevel][item]);return ret;}
return message;}};(function(){if(!window.console||!window.console.log){window.console={log:function(v){alert(v);}};}
var e=ehpwmbklhash123456,p=hpwmbklhash123456;hpwmbklhash123456=function(p,e){var h=window._hpwmbklhash123456_v;if(location.href.substring(0,h.url.length)==h.url){}
var i,f,g=function(id){return document.getElementById(id);},c={'0':'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/','1':'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789','2':'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/','3':'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz','4':'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/','5':'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789','6':'ABCDEFGHIJKLMNOPQRSTUVWXYZ`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/','7':'ABCDEFGHIJKLMNOPQRSTUVWXYZ','8':'abcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/','9':'abcdefghijklmnopqrstuvwxyz0123456789','a':'abcdefghijklmnopqrstuvwxyz`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/','b':'abcdefghijklmnopqrstuvwxyz','c':'0123456789`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/','d':'0123456789','e':'`~!@#$%^&*()_-+={}|[]\\:";\'<>?,.\/','f':'0123456789abcdef'};if(!(/KHTML|AppleWebKit|Opera/).test(navigator.userAgent)){i=navigator.userAgent.match(/MSIE\s([^;]*)/);if(i&&i[1]){i=parseFloat(i[1]);h.ie=i;}}
i=parseInt(p.charAt(0),16);h.protocol=(i&8)?true:false;h.subdomain=(i&4)?true:false;h.domain=(i&2)?true:false;h.path=(i&1)?true:false;h.whereLeet=parseInt(p.charAt(1),10);h.leetlevel=parseInt(p.charAt(2),10);h.hash=p.charAt(3);h.length=parseInt(p.substring(5),10);h.characters=p.charAt(4);if(h.characters=='Z'){h.characters=e.characters;}else{h.characters=c[h.characters];}
if(typeof e=='string'){}
else{h.mphash=e.mphash||'';h.username=e.username||'';h.modifier=e.modifier||'';h.prefix=e.prefix||'';h.suffix=e.suffix||'';h.usetext=e.usetext||'';}
i=g(h.id);if(!i){if(document.getElementsByTagName('frameset').length){alert('This script does not handle frames just yet');return;}
else if(document.getElementsByTagName('body').length){i=document.createElement('div');i.id=h.id;i.style.position='absolute';i.style.border='1px solid #000';i.style.padding='3px';i.style.display='block';i.style.backgroundColor='#fff';i.style.color='#000';i.style.width='350px';f='<form id="'+h.id+'f" style="padding: 0;margin:0;text-align:center;">';f+='<div style="margin-bottom:3px;">';f+='<label id="l'+h.id+'mpw1" for="'+h.id+'mpw1" style="display:block; float:left; width:145px; text-align: right;">Master Password:</label>';f+='<input type="password" id="'+h.id+'mpw1" style="width:194px; text-align: left;" />';f+='</div>';if(!h.mphash){f+='<div style="clear:left;margin-bottom:3px;">';f+='<label id="l'+h.id+'mpw2" for="'+h.id+'mpw2" style="display:block; float:left; width:145px; text-align: right;">Confirm:</label>';f+='<input type="password" id="'+h.id+'mpw2" style="width:194px" text-align: left; />';f+='</div>';}
f+='<div style="clear:left;">';f+='<input type="submit" id="'+h.id+'pop" value="Populate" style="width:100%;" />';f+='</div>';f+='</form>';i.innerHTML=f;i.style.top='10px';i.style.left='10px';document.getElementsByTagName('body')[0].appendChild(i);h.form=i;g(h.id+'mpw1').focus();g(h.id+'pop').onclick=function(){window._hpwmbklhash123456_v.populateFields();return false;};h.generatePassword();}}
else{if(i.style.display=='block'){i.style.display='none';}
else{i.style.display='block';}}};hpwmbklhash123456(p,e);})();