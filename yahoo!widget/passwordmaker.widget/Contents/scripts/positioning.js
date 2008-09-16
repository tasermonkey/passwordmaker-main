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

var sizeAdjust;

// These vars can be changed to reposition controls
var lMargin, rMargin, tMargin, separatorDistance;

// Menus
var whereToUseL33tMenu, l33tLevelMenu, hashAlgorithmMenu, charsetBtnMenu;

// Text, textareas, and images
var  passwordMaster, passwordMasterBorder, passwordMasterLabel,
  passwdUrl, passwdUrlBorder, passwdUrlLabel,
  whereToUseL33t, whereToUseL33tLabel,
  l33tLevel, l33tLevelLabel,
  hashAlgorithm, hashAlgorithmLabel,
  passwordLength, passwordLengthBorder, passwordLengthLabel,
  charset, charsetBorder, charsetLabel, charsetBtn, charsetBtnBorder,
  username, usernameBorder, usernameLabel,
  counter, counterBorder, counterLabel,
  prefix, prefixBorder, prefixLabel,
  suffix, suffixBorder, suffixLabel,
  generatedPassword, generatedPasswordBorder, generatedPasswordLabel, generatedPassword2Label,
  copyLabel;

// The skin images
var skinImages = new Array(
  // name, width, height, hOffset, vOffset, src, opacity
  new Array("Background", "325", "400", "0", "0", "skins/default/background.png", 255),
  new Array("Top_L", "163", "200", "0", "0", "skins/default/Top_L.png", 255),
  new Array("Top_R", "163", "200", "162", "0", "skins/default/Top_R.png", 255),
  new Array("Bottom_L", "163", "200", "0", "200", "skins/default/Bottom_L.png", 255),
  new Array("Bottom_R", "163", "200", "162", "200", "skins/default/Bottom_R.png", 255),
  new Array("Bottom_HI", "325","5", "0", "395", "skins/default/Bottom_HI.png", 76.5),
  new Array("Title", "191", "41", "67", "7", "skins/default/Title.png", 255),
  new Array("Center_Image_2",  "216", "195", "57", "101", "skins/default/Center_Image_2.png", 75),
  new Array("Top_HI", "325", "8", "0", "0", "skins/default/Top_HI.png", 102));        

var useLevelMenuItems = new Array(
  new ImageMenuItem("skins/default/not_at_all.png", "not at all"),
  new ImageMenuItem("skins/default/before.png", "before generating password"),
  new ImageMenuItem("skins/default/after.png", "after generating password"),
  new ImageMenuItem("skins/default/before_and_after.png", "before and after generating password"));

var l33tLevelMenuItems = new Array(
  new ImageMenuItem("skins/default/1.png", "1"),
  new ImageMenuItem("skins/default/2.png", "2"),
  new ImageMenuItem("skins/default/3.png", "3"),
  new ImageMenuItem("skins/default/4.png", "4"),
  new ImageMenuItem("skins/default/5.png", "5"),
  new ImageMenuItem("skins/default/6.png", "6"),
  new ImageMenuItem("skins/default/7.png", "7"),
  new ImageMenuItem("skins/default/8.png", "8"),
  new ImageMenuItem("skins/default/9.png", "9"));

var hashAlgorithmMenuItems = new Array(
  new ImageMenuItem("skins/default/MD4.png", "MD4"),
  new ImageMenuItem("skins/default/HMAC-MD4.png", "HMAC-MD4"),
  new ImageMenuItem("skins/default/MD5.png", "MD5"),
  new ImageMenuItem("skins/default/MD5-ver-0.6.png", "MD5 Version 0.6"),
  new ImageMenuItem("skins/default/HMAC-MD5.png", "HMAC-MD5"),
  new ImageMenuItem("skins/default/HMAC-MD5-ver-0.6.png", "HMAC-MD5 Version 0.6"),
  new ImageMenuItem("skins/default/SHA-1.png", "SHA-1"),
  new ImageMenuItem("skins/default/HMAC-SHA-1.png", "HMAC-SHA-1"),
  new ImageMenuItem("skins/default/SHA-256.png", "SHA-256"),
  new ImageMenuItem("skins/default/HMAC-SHA-256.png", "HMAC-SHA-256"),
  new ImageMenuItem("skins/default/RIPEMD-160.png", "RIPEMD-160"),
  new ImageMenuItem("skins/default/HMAC-RIPEMD-160.png", "HMAC-RIPEMD-160"));
  
var charsetBtnMenuItems = new Array(
  new ImageMenuItem("skins/default/elipsis.png", "Default"),
  new ImageMenuItem("skins/default/elipsis.png", "0123456789abcdef"),  
  new ImageMenuItem("skins/default/elipsis.png", "0123456789"),
  new ImageMenuItem("skins/default/elipsis.png", "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"),
  new ImageMenuItem("skins/default/elipsis.png", "Random"));
 
function position(prefs) {
  //print(preferences.size.value);
  sizeAdjust = preferences.size.value / 100;
  lMargin = 30 * sizeAdjust;
  rMargin = 40 * sizeAdjust;
  tMargin = 70 * sizeAdjust;
  separatorDistance = 25 * sizeAdjust;
   
	mainWnd.height = 400 * sizeAdjust; 
	mainWnd.width = 325 * sizeAdjust;

  if (!prefs)
    prefs = new Object();
    
	positionSkin();
	positionInputFields(prefs);
	positionMenus(prefs);
}

function positionInputFields(prefs) {

  positionInputField("passwordMaster",
  			 0,
  			 prefs.passwordMaster,
  			 "Master Password",
  			 "resetTimers();isTab(passwordMaster, passwdUrl);",
  			 "if(!isTab(passwordMaster, passwdUrl)) generatePassword();",
  			 "Your ONE Password to Rule Them All");
  			 
  positionInputField("passwdUrl",
  			 1,
  			 prefs.passwdUrl,
  			 "URL",
  			 "resetTimers();isTab(passwdUrl, passwordLength);",
  			 "if(!isTab(passwdUrl, passwordLength)) generatePassword();", "URL");

  positionInputField("passwordLength",
  			 5,
  			 prefs.passwordLength,
  			 "Password Length",
  			 "resetTimers();isTab(passwordLength, charset);",
  			 "if (!isTab(passwordLength, charset)) {if (isNaN(system.event.key)) passwordLength.rejectKeyPress(); else if (passwordLength.data == '') passwordLength.data = '8'; else generatePassword();}",
  			 "Length of generated password");  

  positionInputField("charset",
  			 6,
  			 prefs.charset,
  			 "Characters",
  			 "resetTimers();isTab(charset, username);",
  			 "generatePassword();",
  			 "Characters of which the password is comprised");
  			 
  // Shrink the charset field so the elipsis image ("...")
  // can fit next to it. 17 is the native width of the elipsis image.
  // 5 is the horizontal distance we're defining between the charset
  // inputfield and the elipsis image.
  charset.width -= (17 * sizeAdjust) + (5 * sizeAdjust); 
  charsetBorder.width -= (17 * sizeAdjust) + (5 * sizeAdjust);  

  positionInputField("username",
  			 7,
  			 prefs.username,
  			 "Username",
  			 "resetTimers();isTab(username, counter);",
  			 "generatePassword();",
  			 "Username for this account");

  positionInputField("counter",
  			 8,
  			 prefs.counter,
  			 "Modifier",
  			 "resetTimers();isTab(counter, prefix);",
  			 "generatePassword();",
  			 "Modifier for this account");

  positionInputField("prefix",
  			 9,
  			 prefs.prefix,
  			 "Prefix",
  			 "resetTimers();isTab(prefix, suffix);",
  			 "generatePassword();",
  			 "Characters with which to prefix the generated password");   

  positionInputField("suffix",
  			 10,
  			 prefs.suffix,
  			 "Suffix",
  			 "resetTimers();isTab(suffix, passwordMaster);",
  			 "generatePassword();",
  			 "Characters with which to suffix the generated password"); 

  positionInputField("generatedPassword",
  			 11,
  			 "",
  			 "Generated",
  			 "",
  			 "",
  			 "Generated Password - double-click to copy to clipboard"); 
  
  positionLabel("generatedPassword2",
  			 11.5,
  			 "Password",
  			 "Generated Password - double-click to copy to clipboard"); 

  positionLabel("copy",
  			 12.3,
  			 "Double-click anywhere to copy password to clipboard",
  			 "Double-click anywhere to copy password to clipboard"); 
  copyLabel.size = 10 * sizeAdjust;	
  copyLabel.style	= "";
}

function positionMenus(prefs) {
  			 
  positionMenu("whereToUseL33t", // item
  			 2, // position
  			 154, // width
  			 prefs.whereToUseL33t, // oldSrc
  			 "Use l33t", // labelData
  			 "Where should l33t-speak be applied?");  // tooltip

  var selectMe = whereToUseL33tMenu ? whereToUseL33tMenu.selectedSrc : prefs.whereToUseL33t;
  whereToUseL33tMenu = new ImageMenu("whereToUseL33tMenu", useLevelMenuItems,
         "notifiyUserIfLeetAffectsCharset", "whereToUseL33t", sizeAdjust, selectMe);

  positionMenu("l33tLevel", // item
  			 3, // position
  			 24, // width
  			 prefs.l33tLevel, // oldSrc
  			 "l33t Level",  // labelData
  			 "How much l33t should be used?");  // tooltip

  selectMe = l33tLevelMenu ? l33tLevelMenu.selectedSrc : prefs.l33tLevel;
  l33tLevelMenu = new ImageMenu("l33tLevelMenu", l33tLevelMenuItems,
        "generatePassword", "l33tLevel", sizeAdjust, selectMe);
  
  positionMenu("hashAlgorithm", // item
  			 4, // position
  			 119, // width
  			 prefs.hashAlgorithm, // oldSrc
  			 "Hash Algorithm", // labelData
  			 "Which function should be used to calculate the generated password?"); // tooltip

  selectMe = hashAlgorithmMenu ? hashAlgorithmMenu.selectedSrc : prefs.hashAlgorithm;
  hashAlgorithmMenu = new ImageMenu("hashAlgorithmMenu", hashAlgorithmMenuItems,
        "generatePassword", "hashAlgorithm", sizeAdjust, selectMe);

  // The charsetBtn ("...") is a special menu because its image never changes.
  // It also has no label, unlike the other menus.
  positionMenu("charsetBtn", // item
  			 6, // horizonal position
  			 17, // native width
  			 "skins/default/elipsis.png", // oldSrc
  			 null, // labelData -- no label for this guy
  			 "Choose from a list of predefined character sets"); // tooltip

  selectMe = charsetBtnMenu ? charset.data : prefs.charset;  			       
  charsetBtnMenu = new ImageMenu("charsetBtnMenu", charsetBtnMenuItems,
        "generatePassword", "charsetBtn", sizeAdjust, selectMe);      

  // Image Menu overrides
  charsetBtnMenu.updateSelection = charsetBtnMenuUpdateSelection;
  charsetBtnMenu.select = charsetBtnMenuSelect;
  charsetBtn.width = 17*sizeAdjust;  
  
  // positionMenu() "overrides"; i.e. the attributes were set
  // there, but inappropriately.
  charsetBtn.hOffset = charset.hOffset + charset.width + (5 * sizeAdjust);
  charsetBtn.vOffset = charset.vOffset-1;     
}

function positionSkin() {
  for (var i=0; i<skinImages.length; i++) {
    skinImages[i][7] = new Image();
    skinImages[i][7].alignment = "left";
    skinImages[i][7].src = skinImages[i][5];
    skinImages[i][7].name = skinImages[i][0];
    skinImages[i][7].width = skinImages[i][1] * sizeAdjust;
    skinImages[i][7].height = skinImages[i][2] * sizeAdjust;
    skinImages[i][7].hOffset = skinImages[i][3] * sizeAdjust;
    skinImages[i][7].vOffset = skinImages[i][4] * sizeAdjust;
    skinImages[i][7].opacity = skinImages[i][6];
    skinImages[i][7].zOrder = 0;
  }
}

/**
 * An "input field" is defined as a TextArea, a border around the TextArea (as a 1px Image()),
 * and a label (Text()) which explains the purpose of the TextArea. TODO: Make a
 * Javascript "InputField" class.
 *
 * Many thanks to Harry Whitfield (http://www2.konfabulator.com/forums/index.php?showuser=2322)
 * for his work on this section for the Mac OS/X world specifically, and for
 * Konfabulatorism recommendations in general.
 *
 * Please note the ORDER in which these lines occur are very significant, especially to the
 * OS/X edition of Konfabulator. Do not reorder these statements.
 */
function positionInputField(theItemName, pos, oldData, labelData, onKeyPress, onKeyUp, tooltip) {

	eval("if (" + theItemName + ") { oldData = " + theItemName + ".data; };");
	
  // TextArea
  eval(theItemName + " = new TextArea();");
  eval("var theItem = " + theItemName + ";");
	
	theItem.alignment = "left";
	theItem.font = "Arial";
	theItem.size = 11 * sizeAdjust;		
	theItem.columns = 25;		
	theItem.lines = 1;
	theItem.color = "#000000";
	theItem.opacity = 255;
	theItem.bgColor = "#FFFFFF";	 
	theItem.bgOpacity = 255;
	updateNow(); // forces Konf. to calculate theItem.width
	theItem.hOffset = mainWnd.width - rMargin - theItem.width;		
	theItem.vOffset = tMargin - theItem.height + separatorDistance*pos;
	theItem.zOrder = 2;
	theItem.onKeyPress = onKeyPress;
	theItem.onKeyUp = onKeyUp;
	theItem.tooltip = tooltip;

  // Border around the TextArea
  eval(theItemName + "Border = new Image();");
  eval("var theItemBorder = " + theItemName + "Border" + ";");
	theItemBorder.alignment = "left";
	theItemBorder.src = "skins/default/dot.png";
	theItemBorder.opacity = 255;
	theItemBorder.height = theItem.height + 2;
	theItemBorder.width = theItem.width + 2;
	theItemBorder.hOffset = theItem.hOffset - 1;
	theItemBorder.vOffset = theItem.vOffset - 1;
	theItemBorder.zOrder = 1;
	
	// Setting the data of the TextArea apparently
	// resizes the TextArea's width, so here we store
	// the desired width, set the data, then set the width back.
	var temp = theItem.width;
	theItem.data = oldData;
	theItem.width = temp;
	
	positionLabel(theItemName, pos, labelData, tooltip);
}

/**
 * Please note the ORDER in which these lines occur are very significant, especially to the
 * OS/X edition of Konfabulator. Do not reorder these statements.
 */
function positionLabel(theItemName, pos, labelData, tooltip) {

  // Label explaining the purpose of a TextArea
  eval(theItemName + "Label = new Text();");  
  eval("var theItemLabel = " + theItemName + "Label" + ";");  

	theItemLabel.alignment = "left";
	theItemLabel.font = "Arial";
	theItemLabel.size = 11 * sizeAdjust;
	theItemLabel.style = "bold";
	theItemLabel.color = "#000000";
	theItemLabel.opacity = 255;
	theItemLabel.bgColor = "#FFFFFF";
	theItemLabel.bgOpacity = 0;
	theItemLabel.hOffset = lMargin;
	theItemLabel.vOffset = tMargin + separatorDistance*pos;
	theItemLabel.zOrder = 2;
	theItemLabel.tooltip = tooltip;
	theItemLabel.data = labelData;
}

/**
 * A "menu" is defined as 
 *
 * Many thanks to Harry Whitfield (http://www2.konfabulator.com/forums/index.php?showuser=2322)
 * for his work on this section for the Mac OS/X world specifically, and for
 * Konfabulatorism recommendations in general.
 *
 * Please note the ORDER in which these lines occur are very significant, especially to the
 * OS/X edition of Konfabulator. Do not reorder these statements.
 */
function positionMenu(theItemName, pos, width, oldSrc, labelData, tooltip) {
	eval("if (" + theItemName + ") { oldSrc = " + theItemName + ".src; };");

  eval(theItemName + " = new Image();");
  eval("var theItem = " + theItemName + ";");

  theItem.alignment = "left";
  theItem.src = oldSrc;   
  theItem.tooltip=tooltip;
  theItem.opacity=255;
  theItem.onMouseDown="resetTimers();" + theItemName + "Menu.select();";
  theItem.height = 14*sizeAdjust;
  theItem.width = width*sizeAdjust;
  theItem.hOffset = mainWnd.width-rMargin-passwordMaster.width;    
  theItem.vOffset = tMargin - theItem.height + separatorDistance*pos;
  
  if (labelData)
    positionLabel(theItemName, pos, labelData, tooltip);
}

// Image Menu override
function charsetBtnMenuSelect() {
  var contextItems = new Array();
  for (i in this.menuItems) {
    contextItems[i] = this.menuItems[i].menuItem;
    var comparisonText = this.menuItems[i].displayText;
    if (this.menuItems[i].displayText == "Default")
      comparisonText = base95;
    contextItems[i].checked =  comparisonText == charset.data;
    contextItems[i].onSelect = this.img + '.src="' + this.menuItems[i].src + '";' + this.menuName + '.updateSelection("' + this.menuItems[i].displayText + '");' + this.menuAction + '()';
  }
  popupMenu(contextItems, this.hOff, this.vOff);
  updateNow();
}

// Image Menu override
function charsetBtnMenuUpdateSelection(s) {
  for (i in this.menuItems) {
    if (this.menuItems[i].displayText == s) {
      this.selected = s;
      break;
    }
  }
  if (s == "Random") {
    var count;
    while (true) {
      count = prompt("Please enter the number of random characters to generate:", "8", "PasswordMaker", "OK", "Cancel"); 
      if (!count) {
        //charset.data = prevCharset2;
        return;
      }
      if (isNaN(count)) {
        alert("That is not a number.");
        continue;
      }
      count = parseInt(count);
      if (count < 2)
        alert("Please enter a number more than one.");
      else
        break;
    }
    var c = "";
    for (var i=0; i<count; i++)
      c += base95.charAt(random(0, 95));
    charset.data = c;
  }
  else if (s == "Default")
    charset.data = base95;
  else
    charset.data = s;
  return null;
}