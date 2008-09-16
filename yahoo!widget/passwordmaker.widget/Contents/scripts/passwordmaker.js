/**
  PasswordMaker - Creates and manages passwords
  Copyright (C) 2005 Eric H. Jung and LeahScape, Inc.
  All Rights Reserved.
  http://passwordmaker.org/
  grimholtz@yahoo.com

  This library is free software; you can redistribute it and/or modify it
  under the terms of the GNU Lesser General Public License as published by
  the Free Software Foundation; either version 2.1 of the License, or (at
  your option) any later version.

  This library is distributed in the hope that it will be useful, but WITHOUT
  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
  FITNESSFOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License
  for more details.

  You should have received a copy of the GNU Lesser General Public License
  along with this library; if not, write to the Free Software Foundation,
  Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA 
**/

var autoClearClipboardTimer, savePreferencesTimer, autoClearMPWTimer, autoClearSettingsTimer, prevCharset,
  prefsFile = system.widgetDataFolder + "/passwordmaker.xml";
var base95 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+={}|[]\:\";'<>?,./";

/**
 * Clear clipboard of the password, but only
 * if the user hasn't already placed other data
 * in the clipboard.
 */
function onAutoClearClipboard() {
  autoClearClipboardTimer.ticking = false;
  if (passwordCopiedToClipboard == system.clipboard) {
    passwordCopiedToClipboard = system.clipboard = ""; // Also clear variables with sensitive data
    if (preferences.beepOnClearPref.value == "1")  
      beep();  
  }
}

var passwordCopiedToClipboard;
function copyPasswordToClipboard() {
  passwordCopiedToClipboard = system.clipboard = generatedPassword.data;
  if (preferences.beepOnCopyPref.value == "1")
    beep();
  autoClearClipboardTimer.ticking = true;
}

function onPreferencesChanged() {
  // Validate
  var notifyUser = false;
  if (isNaN(preferences.autoClearClipboardTimer.value)) {
    preferences.autoClearClipboardTimer.value = 10;
    notifyUser = true;
  }
  if (isNaN(preferences.autoClearMPWTimer.value)) {
    preferences.autoClearMPWTimer.value = 0;
    notifyUser = true;
  }
  if (isNaN(preferences.autoClearSettingsTimer.value)) {
    preferences.autoClearSettingsTimer.value = 0;
    notifyUser = true;
  }
  
  configureTimers();
  position();
  if (preferences.saveOtherSettingsPref.value == "1" || preferences.saveMasterPasswordPref.value == "1")
    savePreferences(); // in case user switched on/off storage of master password
  else
    filesystem.writeFile(prefsFile, ""); // clear file
  
  if (notifyUser)
    alert("You specified non-numeric values for one or more preferences which require numeric values. Those preferences have been reset to their defaults.");
  var temp = passwordMaster.data;
  passwordMaster.data = "";
  mainWnd.visible = false;    
  secureMasterPassword();
  passwordMaster.data = temp;
  mainWnd.visible = true;  
}

function loadPreferences() {
  var ret = new Object();
  try {
    var prefs = filesystem.readFile(prefsFile);
    if (prefs) {
      var objDom = new XMLDoc(prefs, function(e){print(e);});
      var rootNode = objDom.docNode;
      var temp = unescape(rootNode.getAttribute("passwdUrl"));
      ret.passwdUrl = temp && temp != 'undefined' ? temp : "";
      temp = unescape(rootNode.getAttribute("whereToUseL33t"));
      ret.whereToUseL33t = temp && temp != 'undefined' ? temp : "skins/default/not_at_all.png";
      temp = unescape(rootNode.getAttribute("l33tLevel"));
      ret.l33tLevel = temp && temp != 'undefined' ? temp : "skins/default/1.png";
      temp = unescape(rootNode.getAttribute("hashAlgorithm"));
      ret.hashAlgorithm = temp && temp != 'undefined' ? temp : "skins/default/MD5.png";
      temp = unescape(rootNode.getAttribute("passwordLength"));
      ret.passwordLength = temp && temp != 'undefined' ? temp : "8"; 
      temp = unescape(rootNode.getAttribute("charset"));
      ret.charset = temp && temp != 'undefined' ? temp : base95;
      temp = unescape(rootNode.getAttribute("username"));
      ret.username = temp && temp != 'undefined' ? temp : "";
      temp = unescape(rootNode.getAttribute("counter"));
      ret.counter = temp && temp != 'undefined' ? temp : "";
      temp = unescape(rootNode.getAttribute("prefix"));
      ret.prefix = temp && temp != 'undefined' ? temp : "";
      temp = unescape(rootNode.getAttribute("suffix"));
      ret.suffix = temp && temp != 'undefined' ? temp : "";
      temp = unescape(rootNode.getAttribute("key"));
      var key = temp && temp != 'undefined' ? temp : null;
      temp = unescape(rootNode.getAttribute("data"));
      var data = temp && temp != 'undefined' ? temp : null;
      ret.passwordMaster = (key && data) ? 
        byteArrayToString(rijndaelDecrypt(hexToByteArray(data), hexToByteArray(key), "CBC")) : "";
    }
    else {
      ret.passwordMaster = ret.suffix = ret.prefix = ret.counter = ret.username = ret.passwdUrl = "";
      ret.charset = base95;
      ret.hashAlgorithm = "skins/default/MD5.png";
      ret.l33tLevel = "skins/default/1.png";
      ret.whereToUseL33t = "skins/default/not_at_all.png";
      ret.passwordLength = 8;      
    }
  }
  catch(e) {
    print("exception: " + e);
  }
  return ret;
}

function savePreferences() {
  //dump("savePreferences()");
  savePreferencesTimer.ticking = false;
  var prefs = "<passwordmaker passwdUrl=\"" + escape(passwdUrl.data) + "\" whereToUseL33t=\"" +
    escape(whereToUseL33t.src) + "\" l33tLevel=\"" + escape(l33tLevel.src) + "\" hashAlgorithm=\"" +
    escape(hashAlgorithm.src) + "\" passwordLength=\"" + escape(passwordLength.data) + "\" charset=\"" +
    escape(charset.data) + "\" username=\"" + escape(username.data) + "\" counter=\"" + escape(counter.data) +
    "\" prefix=\"" + escape(prefix.data) + "\" suffix=\"" + escape(suffix.data) + "\"";
  
  if (preferences.saveMasterPasswordPref.value == "1") {
	  // User wants to store the master password, too
	  var key = makeKey();
	  prefs += " key=\"" + key + "\"";
	  prefs += " data=\"" + byteArrayToHex(rijndaelEncrypt(passwordMaster.data, hexToByteArray(key), "CBC")) + "\"";
  }
  prefs += "/>"
  filesystem.writeFile(prefsFile, prefs);
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

function generatePassword() {
  if (preferences.saveOtherSettingsPref.value == "1" || preferences.saveMasterPasswordPref.value == "1")
    savePreferencesTimer.ticking = true;
  resetTimers();
  
  var key = this.passwordMaster.data;
  var data = this.passwdUrl.data + this.username.data + this.counter.data;

  if (this.hashAlgorithmMenu.selected.indexOf("0.6") > -1) {
    prevCharset = this.charset.data;
    this.charset.data = "0123456789abcdef";
    this.charset.color = "#ACA899"; // grey
    this.charset.editable = false;
  }
  else {
    if (prevCharset) {
      this.charset.data = prevCharset;
      prevCharset = null;
    }
    this.charset.editable = true;
    this.charset.color = "#000000";
  }
      
  // Never *ever, ever* allow the charset's length<2 else
  // the hash algorithms will run indefinitely
  if (this.charset.data.length < 2) {
    generatedPassword.data = "Two character minimum required";
    generatedPassword.color="#FF0000";
    return;
  }
  else
    generatedPassword.color="#0000FF";

  // for non-hmac algorithms, the key is master pw and url concatenated
  var usingHMAC = this.hashAlgorithmMenu.selected.indexOf("HMAC") > -1;
  if (!usingHMAC)
    key += data; 

  // apply l33t before the algorithm?
  if (this.whereToUseL33tMenu.selected.indexOf("before") > -1) {
    key = PasswordMaker_l33t.convert(this.l33tLevelMenu.selected, key);
    if (usingHMAC) {
      data = PasswordMaker_l33t.convert(this.l33tLevelMenu.selected, data); // new for 0.3; 0.2 didn't apply l33t to _data_ for HMAC algorithms
    }
  }
  
  // apply the algorithm
  var password;
  switch(this.hashAlgorithmMenu.selected) {
    case "SHA-256":
      password = PasswordMaker_SHA256.any_sha256(key, this.charset.data);
      break;
    case "HMAC-SHA-256":
      password = PasswordMaker_SHA256.any_hmac_sha256(key, data, this.charset.data);
      break;
    case "SHA-1":
      password = PasswordMaker_SHA1.any_sha1(key, this.charset.data);
      break;
    case "HMAC-SHA-1":
      password = PasswordMaker_SHA1.any_hmac_sha1(key, data, this.charset.data);
      break;
    case "MD4":
      password = PasswordMaker_MD4.any_md4(key, this.charset.data);
      break;
    case "HMAC-MD4":
      password = PasswordMaker_MD4.any_hmac_md4(key, data, this.charset.data);
      break;
    case "MD5":
      password = PasswordMaker_MD5.any_md5(key, this.charset.data);
      break;
    case "MD5 Version 0.6":
      password = PasswordMaker_MD5_V6.hex_md5(key);
      break;            
    case "HMAC-MD5":
      password = PasswordMaker_MD5.any_hmac_md5(key, data, this.charset.data);
      break;
    case "HMAC-MD5 Version 0.6":
      password = PasswordMaker_MD5_V6.hex_hmac_md5(key, data);
      break;      
    case "RIPEMD-160":
      password = PasswordMaker_RIPEMD160.any_rmd160(key, this.charset.data);
      break;
    case "HMAC-RIPEMD-160":
      password = PasswordMaker_RIPEMD160.any_hmac_rmd160(key, data, this.charset.data);
      break;
  }
  // apply l33t after the algorithm?
  if (this.whereToUseL33tMenu.selected.indexOf("after") > -1)
    password = PasswordMaker_l33t.convert(this.l33tLevelMenu.selected, password);
  if (this.prefix.data)
    password = this.prefix.data + password;
  if (this.suffix.data) {
    var pw = password.substring(0, this.passwordLength.data-this.suffix.data.length) + this.suffix.data;
    generatedPassword.data = pw.substring(0, this.passwordLength.data);
    return;
  }
  generatedPassword.data = password.substring(0, this.passwordLength.data);
}

function isTab(currentControl, controlToGetFocus) {
  if (system.event.keyString == "Tab") {
    currentControl.rejectKeyPress();
    controlToGetFocus.focus();
    return true;
  }
  return false;
}

function onAutoClearMPWTimer() {
  passwordMaster.data = "";
  generatePassword();
  savePreferences(); // clears MPW from disk if it's saved there
}

function onAutoClearSettingsTimer() {
  // Resets everything except MPW
  passwordLength.data = "8";
  charset.data = base95;
  passwdUrl.data = suffix.data = prefix.data = counter.data = username.data = "";
  whereToUseL33t.src = "skins/default/not_at_all.png";
  l33tLevel.src = "skins/default/1.png";
  hashAlgorithm.src = "skins/default/MD5.png";
  updateNow();  
  generatePassword();
}

function resetTimers() {
  autoClearMPWTimer.reset();
  autoClearSettingsTimer.reset();
}

function initTimers() { 
  autoClearClipboardTimer = new Timer();
  autoClearClipboardTimer.ticking = false;
  autoClearClipboardTimer.onTimerFired = "this.onAutoClearClipboard();";

  autoClearMPWTimer = new Timer();
  autoClearMPWTimer.onTimerFired = "this.onAutoClearMPWTimer();";
  
  autoClearSettingsTimer = new Timer();
  autoClearSettingsTimer.onTimerFired = "this.onAutoClearSettingsTimer();";

  savePreferencesTimer = new Timer();
  savePreferencesTimer.ticking = false;
  savePreferencesTimer.onTimerFired = "this.savePreferences();";
  savePreferencesTimer.interval = 3;
  
  configureTimers();
}

function configureTimers() {
  autoClearClipboardTimer.interval = preferences.autoClearClipboardTimer.value;
  autoClearMPWTimer.interval = preferences.autoClearMPWTimer.value * 60;
  autoClearMPWTimer.ticking = preferences.autoClearMPWTimer.value > 0;
  autoClearSettingsTimer.interval = preferences.autoClearSettingsTimer.value * 60;
  autoClearSettingsTimer.ticking = preferences.autoClearSettingsTimer.value > 0;
}

var curVersion = 1.2;
function versionCheck() {
  var choice = alert("Do you want to contact the PasswordMaker website to check for updates?", "Yes", "No");
  if (choice != 1)
    return;
    
	var url = new URL();
	url.postData = "REMOTE_VERSION=" + curVersion;
	var contents = url.fetch("http://passwordmaker.org/downloads/konfabulator/version-check.php");
	try {
  	if (isNaN(contents))
  	  alert("Unable to contact http://passwordmaker.org");
  	else {
  	  var nVersion = parseFloat(contents);
  	  alert(nVersion > curVersion ?
  	    "You are using PasswordMaker for Konfabulator version " + curVersion + ", but the latest version is " + nVersion + "." :
  	    (nVersion == curVersion ? "The version of PasswordMaker for Konfabulator you are using, " + nVersion + ", is up to date." :
  	     "You are using PasswordMaker for Konfabulator version " + curVersion + ", but the server reports " + nVersion + " is the latest version. Hmmm..."));	    
  	}
  }
  catch(e) {
    alert("Unable to contact http://passwordmaker.org");
  }
}

function notifiyUserIfLeetAffectsCharset() {
  if (whereToUseL33tMenu.selected.indexOf("after") > -1)
    alert("Please note: this type of l33t may place special characters in the generated password which are not in the list of characters you've defined in the characters field.");
  generatePassword();
}

function onLoad() {
  include("scripts/imagemenu.js");  
  include("scripts/imagemenuitem.js");
  include("scripts/positioning.js");
  include("scripts/md5.js");
  include("scripts/md5_v6.js");
  include("scripts/ripemd160.js");
  include("scripts/hashutils.js");
  include("scripts/md4.js");
  include("scripts/sha256.js");
  include("scripts/l33t.js");
  include("scripts/sha1.js");
  include("scripts/aes.js");
  include("scripts/xmldom.js");    

  initTimers();
  var prefs = loadPreferences();
  position(prefs);  
    
  mainWnd.visible = true;
  secureMasterPassword();
  passwordMaster.data = prefs.passwordMaster;
  generatePassword();  
}

function secureMasterPassword() {
  /* Dumb workaround for Konfabulator bug re: "secure" textareas.
     http://www2.konfabulator.com/forums/index.php?showtopic=9669
     This code must be called AFTER mainWnd.visible = true, at least
     for this version of Konfabulator. But if set the contents of
     passwordMaster before the wnd is visible, make the wnd visible,
     then call secure = "true", the password is visible in plain text
     briefly. Therefore, we must set the password contents here only
     (after securing the text field). */
  passwordMaster.secure = "";
  passwordMaster.secure = true;
  passwordMaster.focus();  
}

// For FF/Moz/NS compatibility
function dump(s) {
  print(s);
}
