function preGeneratePassword() {
   // Never *ever, ever* allow the charset's length<2 else
   // the hash algorithms will run indefinitely
   var passwdGenerated = document.getElementById("genpasswd");
   var hashalg = document.getElementById("hashalg");
   var usel33t = document.getElementById("usel33t");
   var l33tlevel = document.getElementById("l33tlevel");
   var charset = document.getElementById("characters");
   var passwdMaster = document.getElementById("masterpass");
   var passwdLength = document.getElementById("length");
   var passwdUrl = document.getElementById("inputurl");
   var usernameTB = document.getElementById("username");
   var counter = document.getElementById("modifier");
   var passwordPrefix = document.getElementById("prefix");
   var passwordSuffix = document.getElementById("suffix");
   
   if (characters.object.getValue().length < 2) {
     passwdGenerated.value = "";
     return;
   }
   try {
     var hashAlgorithm = hashalg.object.getValue();
     var whereToUseL33t = usel33t.object.getValue();
     var l33tvalue = l33tlevel.object.getValue();
   }
   catch (e) {return;}

   var userCharsetValue;
   if (!charset.disabled)
      userCharsetValue = charset.object.getValue(); // Save the user's character set for when the hash algoritm does not specify one.

   if (hashAlgorithm == "md5_v6" || hashAlgorithm == "hmac-md5_v6") {
      charset.object.setValue(base16);
      charset.disabled = true;
   }
   else {
      //charset.object.setValue(userCharsetValue);
      charset.disabled = false;
   }
   
   // Calls generatepassword() n times in order to support passwords
   // of arbitrary length regardless of character set length.
   var password = "";
   var count = 0;
   while (password.length < passwdLength.value) {
     // To maintain backwards compatibility with all previous versions of passwordmaker,
     // the first call to _generatepassword() must use the plain "key".
     // Subsequent calls add a number to the end of the key so each iteration
     // doesn't generate the same hash value.
     password += (count == 0) ?
       generatepassword(hashAlgorithm, passwdMaster.value,
         passwdUrl.value + usernameTB.value + counter.value, whereToUseL33t, l33tvalue,
         passwdLength.value, charset.object.getValue(), passwordPrefix.value, passwordSuffix.value) :
       generatepassword(hashAlgorithm, passwdMaster.value + '\n' + count, 
         passwdUrl.value + usernameTB.value + counter.value, whereToUseL33t, l33tvalue,
         passwdLength.value, charset.object.getValue(), passwordPrefix.value, passwordSuffix.value);
     count++;
   }
     
   if (passwordPrefix.value)
     password = passwordPrefix.value + password;
   if (passwordSuffix.value)
     password = password.substring(0, passwdLength.value-passwordSuffix.value.length) + passwordSuffix.value;
   passwdGenerated.value = password.substring(0, passwdLength.value);
}
  
function generatepassword(hashAlgorithm, key, data, whereToUseL33t, l33tLevel, passwordLength, charset, prefix, suffix) {

  // for non-hmac algorithms, the key is master pw and url concatenated
  var usingHMAC = hashAlgorithm.indexOf("hmac") > -1;
  if (!usingHMAC)
    key += data; 

  // apply l33t before the algorithm?
  if (whereToUseL33t == "both" || whereToUseL33t == "before-hashing") {
    key = PasswordMaker_l33t.convert(l33tLevel, key);
    if (usingHMAC) {
      data = PasswordMaker_l33t.convert(l33tLevel, data); // new for 0.3; 0.2 didn't apply l33t to _data_ for HMAC algorithms
    }
  }

  // apply the algorithm
  var password = "";
  switch(hashAlgorithm) {
    case "sha256":
      password = PasswordMaker_SHA256.any_sha256(key, charset);
      break;
    case "hmac-sha256":
      password = PasswordMaker_SHA256.any_hmac_sha256(key, data, charset, true);
      break;
	case "hmac-sha256_fix":
	  password = PasswordMaker_SHA256.any_hmac_sha256(key, data, charset, false);
	  break;
    case "sha1":
      password = PasswordMaker_SHA1.any_sha1(key, charset);
      break;
    case "hmac-sha1":
      password = PasswordMaker_SHA1.any_hmac_sha1(key, data, charset);
      break;
    case "md4":
      password = PasswordMaker_MD4.any_md4(key, charset);
      break;
    case "hmac-md4":
      password = PasswordMaker_MD4.any_hmac_md4(key, data, charset);
      break;
    case "md5":
      password = PasswordMaker_MD5.any_md5(key, charset);
      break;
    case "md5_v6":
      password = PasswordMaker_MD5_V6.hex_md5(key, charset);
      break;
    case "hmac-md5":
      password = PasswordMaker_MD5.any_hmac_md5(key, data, charset);
      break;
    case "hmac-md5_v6":
      password = PasswordMaker_MD5_V6.hex_hmac_md5(key, data, charset);
      break;
    case "rmd160":
      password = PasswordMaker_RIPEMD160.any_rmd160(key, charset);
      break;
    case "hmac-rmd160":
      password = PasswordMaker_RIPEMD160.any_hmac_rmd160(key, data, charset);
      break;
  }
  // apply l33t after the algorithm?
  if (whereToUseL33t == "both" || whereToUseL33t == "after-hashing")
    return PasswordMaker_l33t.convert(l33tLevel, password);
  return password;
}

function getPasswordStrength() {

  var pw = document.getElementById("genpasswd").value;

  if (pw.length == 1 || pw.length == 2)
    return 0;

  // char frequency
  var uniques = new Array();
  for (var i=0;i<pw.length;i++) {
    for (var j=0; j<uniques.length; j++) {
      if (i==j)
        continue;
      if (pw[i] == uniques[j])
        break;
    }
    if (j==uniques.length)
      uniques.push(pw[i]);
  }
  var r0 = uniques.length / pw.length;
  if (uniques.length == 1)
    r0 = 0;

  //length of the password - 1pt per char over 5, up to 15 for 10 pts total
  var r1 = pw.length;
  if (r1 >= 15)
    r1 = 10;
  else if (r1 < 5)
    r1 = -5;
  else
    r1 -= 5;

  var quarterLen = Math.round(pw.length / 4);

  //ratio of numbers in the password
  var c = pw.replace (/[0-9]/g, "");
  var num=(pw.length - c.length);
  c = num > quarterLen*2 ? quarterLen : Math.abs(quarterLen-num);
  var r2 = 1 - (c / quarterLen);

  //ratio of symbols in the password
  c = pw.replace (/\W/g, "");
  num=(pw.length - c.length);
  c = num > quarterLen*2 ? quarterLen : Math.abs(quarterLen-num);
  var r3 = 1 - (c / quarterLen);

  //ratio of uppercase in the password
  c = pw.replace (/[A-Z]/g, "");
  num=(pw.length - c.length);
  c = num > quarterLen*2 ? quarterLen : Math.abs(quarterLen-num);
  var r4 = 1 - (c / quarterLen);

  //ratio of lowercase in the password
  c = pw.replace (/[a-z]/g, "");
  num=(pw.length - c.length);
  c = num > quarterLen*2 ? quarterLen : Math.abs(quarterLen-num);
  var r5 = 1 - (c / quarterLen);

  var pwstrength = (((r0+r2+r3+r4+r5) / 5) *100) + r1;

  // make sure we're give a value between 0 and 100
  if (pwstrength < 0)
    pwstrength = 0;
  
  if (pwstrength > 100)
    pwstrength = 100;
  return pwstrength;
}
