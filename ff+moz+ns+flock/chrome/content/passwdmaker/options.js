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
var passwordMaster, passwordMaster2, passwordGenerated, passwordStorageLB, passwordMaker, mpwHashStatus,
  createTreeFolderBtn, newAccountCmd, usingURL, confirmMPWCB, mpwHashBtn, mpwHashCmd;

var NONE_CLICK_ACCOUNT_SETTINGS="[none - click account settings to set]";

// State
var previousPasswordStorageLBValue, clipboardContents;
const nsIFilePicker = Components.interfaces.nsIFilePicker;

/**
 * Called when the dialog box is opening.
 */
function init() {
  passwordMaker = window.opener.passwordMaker;
  
  // If the user is opening the options dialog through Firefox's Tools->Addons->Options button,
  // window.opener.passwordMaker will be null. So here we get a reference to it from any existing
  // open browser window
  !passwordMaker && (passwordMaker = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser").passwordMaker);
     
  onOptionsDialogButton(passwordMaker.advancedOptionsDialog == "true" ? "advanced" : "basic", true);

  // Get references to the UI elements
  passwordMaster = document.getElementById("passwordMaster");
  passwordMaster2 = document.getElementById("passwordMaster2");
  passwordGenerated = document.getElementById("passwordGenerated");
  mpwHashStatus = document.getElementById("mpwHashStatus");
  mpwHashBtn = document.getElementById("mpwHashBtn");
  mpwHashCmd = document.getElementById("mpwHashCmd");
  passwordStorageLB = document.getElementById("passwordStorageLB");
  createTreeFolderBtn = document.getElementById("createTreeFolderBtn");
  newAccountCmd = document.getElementById("newAccountCmd");
  usingURL = document.getElementById("usingURL");
  confirmMPWCB = document.getElementById("confirmMPWCB");

  initTrees();
  initGlobalSettingsPanel();
  initDomainsPanel();

  var maskGeneratedPassword = passwordMaker._getLiteral(passwordMaker.globalSettingsSubjectRes, passwordMaker.maskMasterPasswordPredicateRes) == "true";
  passwordGenerated.setAttribute("type", maskGeneratedPassword ? "password" : "");
  refreshMPW(true);
  document.getElementById("mpwConfirmationRow").hidden = !confirmMPWCB.checked;
  document.getElementById("multipleMPWCB").checked = PwdMkr_RDFUtils.getTarget(passwordMaker.globalSettingsSubjectRes, "useMultipleMasterPasswords") == "true";  
	onMultipleMPWCB(false);
  passwordMaster.focus();
  window.sizeToContent();
}

/**
 * Called when user makes GUI changes to the "global" area of the dialog
 * (e.g., mpw, mpw storage drop-down, "using text", etc.)
 */
function _update(starting) {
  if (passwordMaster.value == "") {
    // no mpw entered yet
    passwordStorageLB.disabled = true;
    if (passwordStorageLB.value == "store-on-disk") {
      // if dlg is opening, don't show alert. otherwise, tell user mpw has been cleared
      !starting &&
        passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay._update.01"));
      previousPasswordStorageLBValue = passwordStorageLB.value = "do-not-store";
    }
    hideMPWFieldCB.checked = false;
    !starting && PwdMkr_RDFUtils.updateTarget(passwordMaker.globalSettingsSubjectRes, "maskMasterPassword", "false");
  }
  else
    passwordStorageLB.disabled = false;
  PwdMkr_MPW.storeOrClearMasterPassword(passwordStorageLB.value, passwordMaster.value, false);
}

/**
 * Copy _str_ to the clipboard. If _str_ is "", the clipboard
 * is effectively cleared.
 */
function onCopyToClipboard(str) {
  const clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
  clipboardHelper.copyString(str);

  // Auto-clear the clipboard?
  if (passwordMaker._getLiteral(passwordMaker.globalSettingsSubjectRes, passwordMaker.autoClearClipboardPredicateRes) == "true") {
    // Yes. Store the data we've copied there so we know whether or not
    // something else has been copied into the clipboard since we put our data there.
    // Notice we're only storing it in this global var *iff* autoClearClipboard is true (more secure that way)
    clipboardContents = str;    
    //Get # of seconds
    var secs = passwordMaker._getLiteral(passwordMaker.globalSettingsSubjectRes, passwordMaker.autoClearClipboardSecondsPredicateRes);
    setTimeout(conditionallyClearClipboard, secs*1000);
  }
}

/**
 * Clear clipboard but only if
 * it still contains the data we placed there
 */
function conditionallyClearClipboard() {
  try {
    var clip = Components.classes["@mozilla.org/widget/clipboard;1"].getService(Components.interfaces.nsIClipboard);
    if (!clip)
      return;

    var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
    if (!trans)
      return;
    trans.addDataFlavor("text/unicode");
    clip.getData(trans, clip.kGlobalClipboard);
    var str = new Object(), strLength = new Object();
    trans.getTransferData("text/unicode", str, strLength);
    if (str)
      str = str.value.QueryInterface(Components.interfaces.nsISupportsString);
    var clipContents;
    if (str) {
      clipContents = str.data.substring(0,strLength.value / 2);
      if (clipContents == clipboardContents) {
        // Clear the clipboard
        const clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
        clipboardHelper.copyString("");
      }
    }
  }
  catch (e) {
    // There's probably not text/unicode data
    // on the clipboard so let it be.
  }
  finally {
    clipboardContents = null; // Clear internal data member for proactive security
  }
}

function onPasswordStorageLBChanged() {
  if (previousPasswordStorageLBValue == "store-on-disk") {
    if (passwordStorageLB.value != "store-on-disk") {
      passwordMaster.value = passwordMaster2.value = "";
      generatepassword();
      passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.onPasswordStorageLBChanged.01"));
      hideMPWFieldCB.checked = false; // http://forums.passwordmaker.org/index.php?showtopic=111
    }
  }
  else {
    if (passwordStorageLB.value == "store-on-disk") {
      if (passwordMaker.ask(this, passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.onPasswordStorageLBChanged.02"))) {
        passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.onPasswordStorageLBChanged.03"));
      }
      else {
        // User canceled
        passwordStorageLB.value = previousPasswordStorageLBValue;
        return;
      }
    }
  }
  if (previousPasswordStorageLBValue == "store-in-memory" && passwordStorageLB.value == "do-not-store") {
    passwordMaster.value = passwordMaster2.value = "";
    generatepassword()
  }
  previousPasswordStorageLBValue = passwordStorageLB.value;
}

/** GUI handler which delegates to passwordMaker.generatepassword() for actual pw generation */
function generatepassword() {
  var mpw1 = passwordMaster.value, disableCopyCmd, disableMPWHashBtn,
  	mpwsMatch = (!confirmMPWCB.checked || (confirmMPWCB.checked && mpw1 == passwordMaster2.value)),
    // Find the RDF resource for the selected account
    treeInfo = getActiveTreeInfo(accountsTree), folderSelected = treeInfo.isContainer,
    multiMPWHashes = document.getElementById("multipleMPWCB").checked;
  	
  if (mpw1 == "") {
    // mpw is blank
    _enableMPWHashBtn(false);
    _enableClipboard(false);
    _setGenPassword("passwdmaker.enter_mpw");
    _setMPWHashBtnTxt();
    return;
  }
  if (folderSelected) {
    _enableClipboard(false);
    _enableMPWHashBtn(!multiMPWHashes && mpwsMatch);
    // Set the pw to either "passwords do not match" or nothing.
	  _setGenPassword(mpwsMatch ? null : "passwdmakerOverlay.generatepassword.02");
	  _setMPWHashBtnTxt();
	  return;    
  }
  if (mpwsMatch) {
    // mpw and its confirmation are equal and not empty; folder is not selected.
    _enableMPWHashBtn(true);
    _enableClipboard(true);    
	  var cells = getTreeCells(accountsTree);
	  passwordGenerated.value = passwordMaker.generatepassword(
	    cells[4].getAttribute("label"),  // hashAlgorithmLB,
	    mpw1,
	      (usingURL.value == NONE_CLICK_ACCOUNT_SETTINGS ? "" : usingURL.value)+ 
	      cells[11].getAttribute("label") + // usernameTB
	      cells[12].getAttribute("label"), // counter
	    cells[2].getAttribute("label"), // whereLeetLB
	    cells[3].getAttribute("label"), // leetLevelLB
	    cells[5].getAttribute("label"), // passwordLength
	    cells[13].getAttribute("label"), // charset
	    cells[14].getAttribute("label"), // prefix
	    cells[15].getAttribute("label")); // suffix   
    _setMPWHashBtnTxt();	     
  }
  else {
    // mpw and its confirmation are not equal and not empty; folder is not selected.
    _enableMPWHashBtn(false);
    _enableClipboard(false);
    _setGenPassword("passwdmakerOverlay.generatepassword.02");
    _setMPWHashBtnTxt();
  }

	function _enableMPWHashBtn(e) {mpwHashBtn.setAttribute("disabled", !e);}
	function _enableClipboard(e) {document.getElementById("clipboardCopyCmd").setAttribute("disabled", !e);}
	function _setGenPassword(t) {passwordGenerated.value=t?passwordMaker.stringBundle.GetStringFromName(t):"";}
	function _setMPWHashBtnTxt() {
		var subjectRes = multiMPWHashes ?	treeInfo.subjectRes : passwordMaker.globalSettingsSubjectRes;
		var salt = PwdMkr_RDFUtils.getTarget(subjectRes, "mpwSalt2"),
      hash = PwdMkr_RDFUtils.getTarget(subjectRes, "mpwHash2"),
      newHash = PwdMkr_MPW.calculateMPWHash(passwordMaster.value, salt);
    
    if (hash) {
    	// Hash is stored on disk. Set btn to "Clear".
 			mpwHashBtn.label = passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.generatepassword.16");
 			mpwHashCmd.oncommand=onClearMPWHash;
    	if (hash == newHash) {
      	// hashes match
        mpwHashStatus.value = passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.generatepassword.07");
				_setAttr(mpwHashStatus, "match", true); // see CSS rules      
      }
      else {
        // hashes don't match
        mpwHashStatus.value = passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.generatepassword.08");
        _setAttr(mpwHashStatus, "match", false); // see CSS rules
      }
    }
    else {
		  // no hash stored  
		  mpwHashStatus.value = passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.generatepassword.09");
		  mpwHashStatus.removeAttribute("match");  // see CSS rules
		  // Set btn to "Store"
		  mpwHashBtn.label = passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.generatepassword.10");
			mpwHashCmd.oncommand=onSetMPWHash;				  
	 	}
	  function _setAttr(e, attr, x) {
		  e.setAttribute(attr, x);
		}   	
	}
}

// Set master password hash for the selected account or globally
function onSetMPWHash() {
  if (!confirmMPWCB.checked || passwordMaster.value == passwordMaster2.value) {
	  PwdMkr_MPW.storeMPWHash(document.getElementById("multipleMPWCB").checked ? getActiveTreeInfo(accountsTree).subjectRes :
			passwordMaker.globalSettingsSubjectRes, passwordMaster.value);
  	generatepassword();
  }
}

// Clear master password hash for the selected account or globally
function onClearMPWHash() {
  PwdMkr_MPW.clearMPWHash(document.getElementById("multipleMPWCB").checked ?
  	getActiveTreeInfo(accountsTree).subjectRes : passwordMaker.globalSettingsSubjectRes);	
  generatepassword();
}

function onMultipleMPWCB(persist) {
  var checked = document.getElementById("multipleMPWCB").checked;
 	document.getElementById("mpwHashStatusPrefix").value = checked ?
 		passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.generatepassword.15") :
 		passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.generatepassword.14"); 		
  // persist the change 		
  persist && PwdMkr_RDFUtils.updateTarget(passwordMaker.globalSettingsSubjectRes, "useMultipleMasterPasswords", checked);  
  generatepassword(); // update the MPW hash status 	
}

function importSettings() {
  copyFile(false);
  passwordMaker.refresh();
  init();
}

function exportSettings() {
  if (passwordMaker.ask(passwordMaker.findWindow(), passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.exportSettings.01"), "HTML", "RDF")) {
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(passwordMaker.findWindow(), passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.exportSettings.02"), nsIFilePicker.modeSave);
    //fp.setAttribute("windowtype", "passwordmaker");
    fp.defaultExtension = "html";
    fp.appendFilters(nsIFilePicker.filterAll);
    if (fp.show() == nsIFilePicker.returnCancel)
      return;
    if (fp.file.exists())
      fp.file.remove(false);
    isExporting = true; // defined in print.js
    PWDMKRFileIO.write(fp.file, rdfToHTML());
    passwordMaker.prompts.alert(window, "PasswordMaker",
      passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.exportSettings.03") + "\n" + fp.file.path);    
  }
  else {
    if (PwdMkr_RDFUtils.datasource.hasArcOut(passwordMaker.globalSettingsSubjectRes, passwordMaker.masterPasswordPredicateRes)) {
      if (!passwordMaker.ask(this,
        passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.exportSettings.04")))
        return;
    }
    copyFile(true);
  }
}

function copyFile(isExport) {
  var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
  fp.init(window, isExport?passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.copyFile.01"):passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.copyFile.02"), isExport?nsIFilePicker.modeSave:nsIFilePicker.modeOpen);
  fp.defaultExtension = "rdf";
  fp.appendFilters(nsIFilePicker.filterAll);
  var res = fp.show();
  if (res == nsIFilePicker.returnCancel)
    return;

  var f1 = Components.classes["@mozilla.org/file/local;1"]
    .createInstance(Components.interfaces.nsILocalFile);

  var f2 = Components.classes["@mozilla.org/file/local;1"]
    .createInstance(Components.interfaces.nsILocalFile);

  if (!fp.file || !f1 || !f2)
    passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.copyFile.03"));
  
  var pwmkrRDF = PWDMKRDirIO.get("ProfD"); // %Profile% dir
  pwmkrRDF.append("passwordmaker.rdf");

  try {
    f1.initWithFile(pwmkrRDF);
    if (isExport) {
      if (fp.file.exists())
        fp.file.remove(false);
      f2.initWithPath(fp.file.path.substring(0, fp.file.path.indexOf(fp.file.leafName)));
      f1.copyTo(f2, fp.file.leafName);
    }
    else {
      if (fp.file.path.substr(fp.file.path.length -4) != ".rdf") {
        passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.copyFile.04"));
        return false;
      }
      if (!validateImportFile(fp.file)) {
        passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.sprintf(passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.copyFile.05"), fp.file.path));
        return false;
      }

      if (!passwordMaker.ask(this,
          passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.copyFile.06")))
          return false;

      if (pwmkrRDF.exists())
        pwmkrRDF.remove(false);
      f2.initWithPath(fp.file.path.substring(0, fp.file.path.indexOf(fp.file.leafName)));
      fp.file.copyTo(PWDMKRDirIO.get("ProfD"), "passwordmaker.rdf");
    }
    passwordMaker.prompts.alert(this, "PasswordMaker",
      isExport ? 
      passwordMaker.sprintf(passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.copyFile.07"), fp.file.path) :
      passwordMaker.sprintf(passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.copyFile.08"), fp.file.path)); 
    return true;
  }
  catch (e) {
    dump(e);
    passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.sprintf(passwordMaker.stringBundle.GetStringFromName("passwdmakerOverlay.copyFile.09"), f1.path, fp.file.path));
    return false;
  }
}

function validateImportFile(file) {
  try {
    var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
		var datasourceURI = ioService.newFileURI(file).spec;
    var datasource = PwdMkr_RDFUtils.rdfService.GetDataSourceBlocking(datasourceURI);
    var accountsSubjectRes = PwdMkr_RDFUtils.makeResource("http://passwordmaker.mozdev.org/accounts");
    return !PwdMkr_RDFUtils.rdfContainerUtils.IsEmpty(datasource, accountsSubjectRes);
    //TODO: even more validation
  }
  catch (e) {
    dump(e);
    return false;
  }
}

/**
 * Hide/show the appropriate panels.
 */
function onOptionsDialogButton(which, starting) {
	var dlg = document.getElementById("passwordmakerdlg");
  if (which == "advanced") {
  		_showHide(false);
      var h = PwdMkr_RDFUtils.getTarget(passwordMaker.globalSettingsSubjectRes, "height", -1),
      	w = PwdMkr_RDFUtils.getTarget(passwordMaker.globalSettingsSubjectRes, "width", -1);
     	if (h == -1 && w == -1)
        sizeToContent();
      else
        window.resizeTo(w, h);
  }
  else if (which == "basic") {
		// Save dialog width/height before switching to basic mode
		// so we can restore when user switches back to advanced mode.
		// Normally, this is done with persist="width height" in XUL,
		// but we can't do that here because we have two dialog sizes (basic and advanced)
		// for a single XUL file. Note that the width/height when leaving basic mode isn't stored.
		if (!starting) {
		  PwdMkr_RDFUtils.updateTarget(passwordMaker.globalSettingsSubjectRes, "height", window.outerHeight);  
		  PwdMkr_RDFUtils.updateTarget(passwordMaker.globalSettingsSubjectRes, "width", window.outerWidth);    
		}
		_showHide(true);
		window.resizeTo(400,320);
  }
	else if (which == "toggle") {
	  onOptionsDialogButton(passwordMaker.advancedOptionsDialog == "true"?"basic":"advanced", starting);
		return;
	}
  
  function _showHide(x) {
	  document.getElementById("infoBasicPart").hidden = !x;
	  document.getElementById("hashPart").hidden = 
	    document.getElementById("spacerPart").hidden = 
	    document.getElementById("toolbarPane").hidden =       
	    document.getElementById("advancedPart").collapsed = x; 
    dlg.setAttribute("advanced", !x);	          
  }
  
  if (!starting) {
	  if (passwordMaker.advancedOptionsDialog == "true")
    	which == "basic" && passwordMaker.toggleOptionsDialog(); // persist the change 
		else
	  	which == "advanced" && passwordMaker.toggleOptionsDialog(); // persist the change 
  }
 	document.title = passwordMaker.stringBundle.GetStringFromName("options.1." + which); // change the dialog title  
}

function updateUsingURL() {
  // Update the "Using URL" label
  var url = getUrlToUse();
  if (!url || url == "")
    url = NONE_CLICK_ACCOUNT_SETTINGS;
  usingURL.value = url; 
}

function sizeBasicOptions() {
  setTimeout(
  	function() {
  		var x = window.screenX, y = window.screenY;
  		window.moveTo(-2000, -2000); // move off-screen to prevent flashing
  		window.sizeToContent();
		var lve = document.getElementById("lastVisibleElement");
		var rme = document.getElementById("passwordMaster");
		window.resizeTo(rme.boxObject.x + rme.boxObject.width + 35, lve.boxObject.y + 65);
		window.moveTo(x, y);
  	}, 10);
}

function refreshMPW(starting) {
  if (passwordMaker.mpw) {
    // User entered a master password when promtped from the context-menu or a pageLoad,
    // or it was stored as a preference and read at startup.
    passwordMaster.value = passwordMaster2.value = PwdMkr_MPW.getDecryptedMPW(passwordMaker.mpw);
  }
  else
    passwordMaster.value = passwordMaster2.value = "";
    
  passwordStorageLB.value = previousPasswordStorageLBValue = passwordMaker._getLiteral(passwordMaker.globalSettingsSubjectRes, passwordMaker.masterPasswordStoragePredicateRes); 
  _update(starting);
  generatepassword();  
}
