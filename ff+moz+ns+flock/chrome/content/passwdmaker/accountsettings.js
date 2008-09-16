/**
  PasswordMaker - Creates and manages passwords
  Copyright (C) 2005 Eric H. Jung and LeahScape, Inc.
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

// References to the UI elements
var passwordLength, protocolCB, domainCB, subdomainCB, pathCB, leetLevelLB,
  hashAlgorithmLB, whereLeetLB, accountName, accountDescription, usernameTB, counter,
  passwordGenerated, charset, pwMeter, prefix, suffix, autoPopCB,
  previousCharsetMenuSelection;

var accountSettings, isDefaultsAccount, passwordMaster, passwordMaker;

function onload() {
  accountSettings = window.arguments[0].inn.accountSettings;
  passwordMaster = window.arguments[0].inn.passwordMaster;
  passwordMaker = window.arguments[0].inn.passwordMaker;
  isDefaultsAccount = accountSettings.isDefaultsAccount;

  // Get references to the UI elements
  passwordLength = document.getElementById("passwordLength");
  domainCB = document.getElementById("domainCB");
  protocolCB = document.getElementById("protocolCB");
  subdomainCB = document.getElementById("subdomainCB");
  pathCB = document.getElementById("pathCB");
  leetLevelLB = document.getElementById("leetLevelLB");
  hashAlgorithmLB = document.getElementById("hashAlgorithmLB");
  whereLeetLB = document.getElementById("whereLeetLB");
  accountName = document.getElementById("accountName");
  usernameTB = document.getElementById("usernameTB");
  counter = document.getElementById("counter");
  accountDescription = document.getElementById("accountDescription");
  charset = document.getElementById("charset");
  passwordGenerated = document.getElementById("passwordGenerated");
  pwMeter = document.getElementById("pwMeter");
  prefix = document.getElementById("prefix");
  suffix = document.getElementById("suffix");
  autoPopCB = document.getElementById("autoPopCB");
  
  if (passwordMaker._getLiteral(passwordMaker.globalSettingsSubjectRes, passwordMaker.maskMasterPasswordPredicateRes) == "true")
    passwordGenerated.setAttribute("type", "password");
  
  // enable/disable stuff
  if (isDefaultsAccount) {    
    accountName.disabled = accountDescription.disabled = true;
    autoPopCB.label = passwordMaker.stringBundle.GetStringFromName("accountsettings.onload.01");
    autoPopCB.tooltiptext=passwordMaker.stringBundle.GetStringFromName("accountsettings.onload.02");
  }

  accountName.value = accountSettings.accountName;
  accountDescription.value = accountSettings.accountDescription;
  whereLeetLB.value = accountSettings.whereLeetLB;
  leetLevelLB.value = accountSettings.leetLevelLB;
  hashAlgorithmLB.value = accountSettings.hashAlgorithmLB;
  passwordLength.value = accountSettings.passwordLength;
  protocolCB.checked = accountSettings.protocolCB == "true";
  subdomainCB.checked = accountSettings.subdomainCB == "true";
  domainCB.checked = accountSettings.domainCB == "true";
  pathCB.checked = accountSettings.pathCB == "true";
  previousCharsetMenuSelection = charset.value = accountSettings.charset;
  usernameTB.value = accountSettings.usernameTB;
  counter.value = accountSettings.counter;
  suffix.value = accountSettings.suffix;
  prefix.value = accountSettings.prefix;
  autoPopCB.checked = accountSettings.autoPop == "true";    
  updateLeetLevel();
  checkForVersion6Compatibility();
  initFieldsTab();
  initURLsTab();
  generatepassword();
  document.getElementById("accountTabs").selectedIndex = accountSettings.selectedTab;
}

function updateTabIndex(tabs) {
  _changeStyle(tabs.selectedItem.id == "auto-pop" ? Components.interfaces.nsIXULWindow.raisedZ : Components.interfaces.nsIXULWindow.normalZ);
}

var prevCharset = null;
function checkForVersion6Compatibility() {
  if (hashAlgorithmLB.value.indexOf("0.6") > -1) {
    prevCharset = charset.value;
    charset.value = "0123456789abcdef";
    charset.disabled = true;
  }
  else {
    charset.disabled = false;
    if (prevCharset) {
      charset.value = prevCharset; // restore previous
      prevCharset = null;
    } 
  }
}

function genRandomChars(charsetMenu) {
  charsetMenu.value = ""; // clear the word "random"
  
  // Prompt for how many
  var okclicked = true;
  var input = {value:""};
  var count;
  while (okclicked) {
    okclicked = passwordMaker.prompts.prompt(this, "PasswordMaker",
      passwordMaker.stringBundle.GetStringFromName("accountsettings.genRandomChars.01"), input, null, {});
    if (okclicked) {
      if (isNaN(input.value))
        passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("accountsettings.genRandomChars.02"));
      else {
        count = parseInt(input.value);
        if (count < 2)
          passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("accountsettings.genRandomChars.03"));      
        else
          break;      
      }
    }
  }
  if (okclicked) {
    var num = parseInt(input.value);
    var c = "";
    for (var i=0; i<count; i++) {
     // Thanks Andrew -- http://www.shawnolson.net/a/789/
      c += passwordMaker.DEFAULT_CHARSET.charAt(Math.floor(Math.random()*95+1));
    }
    charsetMenu.value = c;
  }
  else {
    // revert to previous
    charsetMenu.value = previousCharsetMenuSelection;
  }
}

function onCharsetMenuChanged(charsetMenu) {
  if (charsetMenu.selectedItem != null && charsetMenu.selectedItem.id=='random')
    genRandomChars(charsetMenu);
  else
    previousCharsetMenuSelection = charsetMenu.value;
}

function storeCharset(charsetMenu) {
    previousCharsetMenuSelection = charsetMenu.value;
}

function generatepassword() {
  if (charset.value.length > 1) {
    if (passwordMaster == "") {
    	passwordGenerated.value = passwordMaker.ENTER_MPW;
    	pwMeter.setAttribute("value", 0);
    }
    else {
	    passwordGenerated.value = passwordMaker.generatepassword(
	      hashAlgorithmLB.value,
	      passwordMaster,
	        urlToUse.value + 
	        usernameTB.value +
	        counter.value,
	      whereLeetLB.value,
	      leetLevelLB.value,
	      passwordLength.value,
	      charset.value,
	      prefix.value, suffix.value);
	    pwMeter.setAttribute("value", getPasswordStrength());
	  }
  }
  else {
    passwordGenerated.value = passwordMaker.stringBundle.GetStringFromName("accountsettings.generatepassword.01");
    pwMeter.setAttribute("value", 0);
  }
}

function onOK() {
  if (charset.value.length < 2) {
    passwordMaker.prompts.alert(this, "PasswordMaker",
      passwordMaker.stringBundle.GetStringFromName("accountsettings.onOK.01"));
    return false;
  }

  uninitFieldsTab();
  window.arguments[0].out = {accountSettings: {passwordLength : passwordLength.value, domainCB : domainCB.checked,
    protocolCB : protocolCB.checked, subdomainCB : subdomainCB.checked,
    pathCB : pathCB.checked, leetLevelLB : leetLevelLB.value, hashAlgorithmLB : hashAlgorithmLB.value,
    whereLeetLB : whereLeetLB.value, accountName : accountName.value, usernameTB : usernameTB.value,
    counter : counter.value, accountDescription : accountDescription.value, urlToUse : urlToUse.value,
    patternsArray : patternsArray, charset : charset.value, prefix : prefix.value, suffix : suffix.value,
    autoPop : autoPopCB.checked, fieldsArray:fieldsArray, selectedTab:document.getElementById("accountTabs").selectedIndex}};

  return true;
}

function onCharacterTips() {
  window.openDialog("chrome://passwdmaker/content/tips.xul", "", "chrome, dialog, modal, resizable=yes",
    {inn:{passwordMaker:passwordMaker}}).focus();
}

function updateLeetLevel() {
  leetLevelLB.disabled=whereLeetLB.selectedItem.value=='off';
}

function warn() {
  if (whereLeetLB.selectedItem.value == "after-hashing" || whereLeetLB.selectedItem.value == "both")
    passwordMaker.prompts.alert(this, "PasswordMaker",
    passwordMaker.stringBundle.GetStringFromName("accountsettings.warn.01"));
}

function getPasswordStrength() {

  var pw = passwordGenerated.value;

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

  //variety (94 standard chars)
  //var r6 = uniques.length >= 100 ? 0 : (100-uniques.length)/10;       // range: 0-10

  /*dump("r0=" + r0 + "\n");
  dump("r1=" + r1 + "\n");
  dump("r2=" + r2 + "\n");
  dump("r3=" + r3 + "\n");
  dump("r4=" + r4 + "\n");
  dump("r5=" + r5 + "\n");
  //dump("r6=" + r6 + "\n");
  dump("pwstrength = " + ((((r0+r2+r3+r4+r5) / 5) *100)+r1) + "\n");*/
  var pwstrength = (((r0+r2+r3+r4+r5) / 5) *100) + r1;

  // make sure we're give a value between 0 and 100
  if (pwstrength < 0)
    pwstrength = 0;
  
  if (pwstrength > 100)
    pwstrength = 100;
  return pwstrength;
}
