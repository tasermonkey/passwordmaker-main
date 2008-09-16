var passwdMaster, passwdUrl, passwdGenerated, passwdLength, protocolCB,
  domainCB, subdomainCB, pathCB, leetLevelLB,
  saveMasterPasswordCB, hashAlgorithmLB, whereLeetLB, usernameTB, counter,
  charset, passwordPrefix, passwordSuffix, charMinWarning, tipsWnd,
  userCharsetValue;

var base93="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+={}|[]\\:\";\'<>?,./";
var base16="0123456789abcdef";

function init() {

  if (typeof otherOnLoadHandler == "function")
    otherOnLoadHandler();

  passwdMaster = document.getElementById("passwdMaster");
	passwdUrl = document.frames["settingsFrame1"].document.getElementById("passwdUrl");
	passwdGenerated = document.getElementById("passwdGenerated");
	passwdLength =  document.frames["settingsFrame1"].document.getElementById("passwdLength");
	domainCB =  document.frames["settingsFrame1"].document.getElementById("domainCB");
	protocolCB =  document.frames["settingsFrame1"].document.getElementById("protocolCB");
	subdomainCB =  document.frames["settingsFrame1"].document.getElementById("subdomainCB");
	pathCB =  document.frames["settingsFrame1"].document.getElementById("pathCB");
	leetLevelLB =  document.frames["settingsFrame2"].document.getElementById("leetLevelLB");
	hashAlgorithmLB =  document.frames["settingsFrame2"].document.getElementById("hashAlgorithmLB");
	saveMasterPasswordCB = document.getElementById("saveMasterPasswordCB");
	leetLevelLB =  document.frames["settingsFrame2"].document.getElementById("leetLevelLB");
	whereLeetLB =  document.frames["settingsFrame2"].document.getElementById("whereLeetLB");
  usernameTB =  document.frames["settingsFrame1"].document.getElementById("usernameTB");
  counter =  document.frames["settingsFrame2"].document.getElementById("counter");
  charset =  document.frames["settingsFrame2"].document.getElementById("charset");
  passwordPrefix=  document.frames["settingsFrame2"].document.getElementById("passwordPrefix");
  passwordSuffix =  document.frames["settingsFrame2"].document.getElementById("passwordSuffix");
  charMinWarning =  document.frames["settingsFrame2"].document.getElementById("charMinWarning");

  var settingsAsXML = unescape(getCookie("settings"));
  if (settingsAsXML != null && settingsAsXML != 'undefined') {
    var settings = Sarissa.getDomDocument();
    settings.loadXML(settingsAsXML);
    // We don't use Sarissa XPath routines because they're
    // not currently supported by KHTML-based browsers (e.g., Safari and Konqueror)
    var rootElem = settings.firstChild;
    if (rootElem) {
      saveMasterPasswordCB.checked = rootElem.getAttribute("save-master-password") == "true";
      passwdLength.value = rootElem.getAttribute("password-length");
      protocolCB.checked = rootElem.getAttribute("protocol") == "true";
      domainCB.checked = rootElem.getAttribute("domain") == "true";
      subdomainCB.checked = rootElem.getAttribute("subdomain") == "true";
      pathCB.checked = rootElem.getAttribute("path") == "true";
      leetLevelLB.selectedIndex = getIndexOfValue(leetLevelLB, rootElem.getAttribute("leet-level"));
      hashAlgorithmLB.selectedIndex = getIndexOfValue(hashAlgorithmLB, rootElem.getAttribute("hash-algorithm"));
      whereLeetLB.selectedIndex = getIndexOfValue(whereLeetLB, rootElem.getAttribute("where-leet"));
      passwdUrl.value = rootElem.getAttribute("url");
      usernameTB.value = rootElem.getAttribute("username");
      counter.value = rootElem.getAttribute("counter");
      charset.value = rootElem.getAttribute("charset") == null ? base93 : rootElem.getAttribute("charset");
      passwordPrefix.value = rootElem.getAttribute("passwordPrefix") == null ? "" : rootElem.getAttribute("passwordPrefix");
      passwordSuffix.value = rootElem.getAttribute("passwordSuffix") == null ? "" : rootElem.getAttribute("passwordSuffix");
      var key = rootElem.getAttribute("key");
      var master = rootElem.getAttribute("encrypted-master-password");
      if (key && master) {
        // Decrypt the encrypted master pw
        passwdMaster.value = byteArrayToString(rijndaelDecrypt(hexToByteArray(master), hexToByteArray(key), "CBC"));
      }

      //@TODO...
      //if (rootElem.getAttribute("maskGeneratedPassword") == "true");
        //passwdGenerated.setAttribute("type", "password");
    }
  }
  if (charset.value == "")
    charset.value = base93;
  if (passwdLength.value == "")
    passwdLength.value = 8;
	onWhereLeetLBChanged();
  preGeneratePassword();
  populateURL();

	passwdMaster.focus();
}

function getIndexOfValue(lb, value) {
  // Find the index of the option to select
  for (var i=0; i<lb.options.length; i++) {
    if (lb[i].value == value)
      return i;
  }
  return 0; // can't find it!
}

function preGeneratePassword() {
   charMinWarning.style.display = charset.value.length < 2 ? "block":"none";
   var hashAlgorithm = hashAlgorithmLB.options[hashAlgorithmLB.options.selectedIndex].value;
   var whereToUseL33t = whereLeetLB.options[whereLeetLB.options.selectedIndex].value;
   var l33tLevel = leetLevelLB.options[leetLevelLB.options.selectedIndex].value;
   
   if (!charset.disabled)
      userCharsetValue = charset.value; // Save the user's character set for when the hash algoritm does not specify one.

   if (hashAlgorithm == "md5_v6" || hashAlgorithm == "hmac-md5_v6") {
      charset.value = base16;
      charset.disabled = true;
   }
   else {
      charset.value = userCharsetValue;
      charset.disabled = false;
   }
   oldHashAlgorithm = hashAlgorithm;

   passwdGenerated.value = generatepassword(hashAlgorithm, passwdMaster.value, passwdUrl.value + usernameTB.value + counter.value, whereToUseL33t, l33tLevel,
     passwdLength.value, charset.value, passwordPrefix.value, passwordSuffix.value);
}

function generatepassword(hashAlgorithm, key, data, whereToUseL33t, l33tLevel, passwordLength, charset, prefix, suffix) {

  // Never *ever, ever* allow the charset's length<2 else
  // the hash algorithms will run indefinitely
  if (charset.length < 2)
    return "";

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
      password = PasswordMaker_SHA256.any_hmac_sha256(key, data, charset);
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
    password = PasswordMaker_l33t.convert(l33tLevel, password);
  if (prefix)
    password = prefix + password;
  if (suffix) {
    var pw = password.substring(0, passwordLength-suffix.length) + suffix;
    return pw.substring(0, passwordLength);
  }
  return password.substring(0, passwordLength);
}

function populateURL() {
  try {
    // In the case where this script is called directly, dialogArguments.params is undefined
    var temp = dialogArguments.params == undefined ? external.menuArguments.location.href :
      dialogArguments.params.uri;
    temp = temp.match("([^://]*://)([^/]*)(.*)");

    var domainSegments = temp[2].split(".");
    var displayMe = protocolCB.checked ? temp[1] : ''; // set the protocol or empty string

    if (subdomainCB.checked) {
      // The subdomain is all domainSegments
      // except the final two.
      for (var i=0; i<domainSegments.length-2;i++) {
        displayMe += domainSegments[i];
          // Add a dot if this isn't the final subdomain
        if (i+1 < domainSegments.length-2)
        displayMe += ".";
      }			
    }

    if (domainCB.checked) {
      if (displayMe != "" && displayMe[displayMe.length-1]  != ".")
        displayMe += ".";
        displayMe += domainSegments[domainSegments.length-2] + "." + domainSegments[domainSegments.length-1];
    }

    if (pathCB.checked)
      displayMe += temp[3];

    passwdUrl.value = displayMe;
  }
  catch(e) {}
  preGeneratePassword();
}

function onWhereLeetLBChanged() {
  leetLevelLB.disabled = whereLeetLB.options[whereLeetLB.options.selectedIndex].value == "off";
}

function destroy() {
  // Set cookie expiration date
  var expires = new Date();
  // Fix the bug in Navigator 2.0, Macintosh
  fixDate(expires);
  // Expire the cookie in 5 years
  expires.setTime(expires.getTime() + 5 * 365 * 24 * 60 * 60 * 1000);

  // Save the settings
  setCookie("settings", escape(exportPreferences()), expires);
}

// Return an XML document representing the state of the UI
function exportPreferences() {
  var doc = Sarissa.getDomDocument();
  var root = doc.createElement("passwordmaker-preferences");
  doc.appendChild(root);
  root.setAttribute("save-master-password", saveMasterPasswordCB.checked ? "true" : "false");
  root.setAttribute("password-length", passwdLength.value);
  root.setAttribute("protocol", protocolCB.checked ? "true" : "false");
  root.setAttribute("domain", domainCB.checked ? "true" : "false");
  root.setAttribute("subdomain", subdomainCB.checked ? "true" : "false");
  root.setAttribute("path", pathCB.checked ? "true" : "false");
  root.setAttribute("url", passwdUrl.value);
  root.setAttribute("leet-level", leetLevelLB.value);
  root.setAttribute("hash-algorithm", hashAlgorithmLB.value);
  root.setAttribute("where-leet", whereLeetLB.value);
  root.setAttribute("username", usernameTB.value);
  root.setAttribute("counter", counter.value);
  root.setAttribute("charset", charset.value);
  root.setAttribute("passwordPrefix", passwordPrefix.value);
  root.setAttribute("passwordSuffix", passwordSuffix.value);

  //root.setAttribute("mask-generated-password", maskGeneratedPassword.checked ? "true" : "false");

  if (saveMasterPasswordCB.checked) {
	  // User wants to store the master password, too
	  var key = makeKey();
	  // Encrypt the master pw for browsers like Firefox 1.0, which store
	  // cookies in plain text.
    root.setAttribute("key", key);
    root.setAttribute("encrypted-master-password", byteArrayToHex(rijndaelEncrypt(passwdMaster.value, hexToByteArray(key), "CBC")));
  }
  return Sarissa.serialize(doc);
}

function makeKey() {
  var ret = "";
  while (true) {
	var rnd = Math.random().toString();
    ret +=  rnd.substring(rnd.lastIndexOf(".")+1);
	if (ret.length >= 32)
	  return ret.substring(0, 32);
  }
}

function onClickTips() {
  if (tipsWnd != null && !tipsWnd.closed)
    tipsWnd.focus();
  else
    tipsWnd = window.open("tips.html", "tipsWnd", "width=500,length=100,menubar=no,location=no,resizable=yes,scrollbars=yes,status=no");
}

function onOK() {
  if (dialogArguments != null)
    dialogArguments.params.srcElement.value = passwdGenerated.value;
  window.close();
}

function onCopyToClipboard() {
  /*var copyArea = document.getElementById("copyArea");
  copyArea.value = passwdGenerated.value;
  var r = copyArea.createTextRange();
  r.select();
  r.execCommand("copy");*/
  window.clipboardData.setData("Text", passwdGenerated.value);
}

