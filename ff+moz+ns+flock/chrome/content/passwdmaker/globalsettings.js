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
var clearClipboardCB, clearClipboard, maskGeneratedPasswordCB, pwShortcutLB, hideMPWFieldCB,
  confirmMPWCB, viewPwdFieldsCB, removeAutoCompleteCB, statusbarIndicatorCB;

function initGlobalSettingsPanel() {

  // Select the last-selected tab
  var tabs = document.getElementById("tabs");
  if (tabs) {
    // tb is null if this is the basic options dialog
    tabs.selectedIndex = PwdMkr_RDFUtils.getTarget(passwordMaker.globalSettingsSubjectRes, "selectedTabIndex", 0);  
  }
  
  // Get references to the UI elements
  clearClipboardCB = document.getElementById("clearClipboardCB");
  clearClipboard = document.getElementById("clearClipboard");
  maskGeneratedPasswordCB = document.getElementById("maskGeneratedPasswordCB");
  pwShortcutLB = document.getElementById("pwShortcutLB");
  hideMPWFieldCB = document.getElementById("hideMPWFieldCB");
  viewPwdFieldsCB = document.getElementById("viewPwdFieldsCB");
  removeAutoCompleteCB = document.getElementById("removeAutoCompleteCB");
  statusbarIndicatorCB = document.getElementById("statusbarIndicatorCB");
  
  // Masking
  maskGeneratedPasswordCB.checked = passwordMaker._getLiteral(passwordMaker.globalSettingsSubjectRes, passwordMaker.maskMasterPasswordPredicateRes) == "true";
  
  // Auto-clear clipboard
  clearClipboardCB.checked = passwordMaker._getLiteral(passwordMaker.globalSettingsSubjectRes, passwordMaker.autoClearClipboardPredicateRes) == "true";

  // Auto-clear clipboard secs
  clearClipboard.value = passwordMaker._getLiteral(passwordMaker.globalSettingsSubjectRes, passwordMaker.autoClearClipboardSecondsPredicateRes);

  // Password Shortcut (ALT-`)
  pwShortcutLB.value = passwordMaker._getLiteral(passwordMaker.globalSettingsSubjectRes, passwordMaker.passwordShortcutPredicateRes);
  hideMPWFieldCB.checked = passwordMaker._getLiteral(passwordMaker.globalSettingsSubjectRes, passwordMaker.hideMasterPasswordFieldPredicateRes) == "true";
  if (!passwordMaker.mpw && hideMPWFieldCB.checked) {
    // Can't ever be checked if the mpw is empty
    hideMPWFieldCB.checked = false;
    PwdMkr_RDFUtils.updateTarget(passwordMaker.globalSettingsSubjectRes, "hideMasterPasswordField", "false");
  }
  if (hideMPWFieldCB.checked) {
  	if (!passwordMaker.mpw) {
	    // Can't ever be checked if the mpw is empty
	    hideMPWFieldCB.checked = false;
	    PwdMkr_RDFUtils.updateTarget(passwordMaker.globalSettingsSubjectRes, "hideMasterPasswordField", "false");
		}
		else
			onHideMPWField(true);
  }
  
  confirmMPWCB.checked = passwordMaker._getLiteral(passwordMaker.globalSettingsSubjectRes, passwordMaker.confirmMPWPredicateRes) == "true";
  viewPwdFieldsCB.checked = passwordMaker.viewPwdFields;
  removeAutoCompleteCB.checked = passwordMaker.removeAutoComplete;
  statusbarIndicatorCB.checked = passwordMaker._getLiteral(passwordMaker.globalSettingsSubjectRes, passwordMaker.statusbarIndicatorPredicateRes) == "true";

  onClearClipboardCB();
}

// Save last-focused tab
function updateTabIndex() {
  // When the dialog if first opened, Mozilla calls this
  // callback fcn but passwdmakerOverlay.init() hasn't been called yet.
  if (passwordMaker.globalSettingsSubjectRes)
    PwdMkr_RDFUtils.updateTarget(passwordMaker.globalSettingsSubjectRes, "selectedTabIndex", document.getElementById("tabs").selectedIndex);
}

function onViewPwdFields() {
  PwdMkr_RDFUtils.updateTarget(passwordMaker.globalSettingsSubjectRes, "viewPwdFields", viewPwdFieldsCB.checked ? "true":"false");
  // update global cached setting
  if (passwordMaker.viewPwdFields = viewPwdFieldsCB.checked)
    notify(passwordMaker.stringBundle.GetStringFromName("globalsettings.onViewPwdFields.01"));    
}

function notify(str) {
  passwordMaker.prompts.alert(this, "PasswordMaker",
    passwordMaker.sprintf(passwordMaker.stringBundle.GetStringFromName("globalsettings.notify.01"), str));
}

function onRemoveAutoComplete() {
  PwdMkr_RDFUtils.updateTarget(passwordMaker.globalSettingsSubjectRes, "removeAutoComplete", removeAutoCompleteCB.checked ? "true":"false");
  // update global cached setting 
  if (passwordMaker.removeAutoComplete = removeAutoCompleteCB.checked) {
    if (passwordMaker.ask(this,
      passwordMaker.stringBundle.GetStringFromName("globalsettings.onRemoveAutoComplete.01"),
      passwordMaker.stringBundle.GetStringFromName("globalsettings.onRemoveAutoComplete.02"), passwordMaker.stringBundle.GetStringFromName("globalsettings.onRemoveAutoComplete.03")))
        passwordMaker.openAndReuseOneTabPerURL("http://www.mozilla.org/support/firefox/options#privacy");
   notify(passwordMaker.stringBundle.GetStringFromName("globalsettings.onRemoveAutoComplete.04"));
  }
}

function onHideMPWField(starting) {
  if (!starting) {
    if (hideMPWFieldCB.checked) {
      if (passwordMaster.value == "") {
        passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("globalsettings.onHideMPWField.02"));
        hideMPWFieldCB.checked = false;
      }
    }
    else
      showMPWField();
    PwdMkr_RDFUtils.updateTarget(passwordMaker.globalSettingsSubjectRes, "hideMasterPasswordField", hideMPWFieldCB.checked ? "true":"false");
  }
  document.getElementById('set-hidden-broadcaster').setAttribute('hidden', hideMPWFieldCB.checked);
  onConfirmMPW(starting);
}

function onConfirmMPW(starting) {
  !starting && PwdMkr_RDFUtils.updateTarget(passwordMaker.globalSettingsSubjectRes, "confirmMPW", confirmMPWCB.checked ? "true":"false");
  if (confirmMPWCB.checked && !hideMPWFieldCB.checked)
      document.getElementById("mpwConfirmationRow").hidden = false;  // don't show if user wants the MPW field hidden
  else if (!confirmMPWCB.checked)
     document.getElementById("mpwConfirmationRow").hidden = true;
  generatepassword();    
}

function showMPWField() {
  // User wants to turn off masking
  // Firefox unchecked the checbkox, even though the user
  // hasn't entered the master pw yet. Check it here so
  // the UI matches the current state of affairs.
  hideMPWFieldCB.checked = true;
  if (promptMPW(passwordMaster.value))
    hideMPWFieldCB.checked = false;
}

/**
 * Method which fires when the Clear Clipboard checkbox
 * has been clicked.
 */
function onClearClipboardCB() {
  clearClipboard.disabled = !clearClipboardCB.checked;
  if (clearClipboardCB.checked && clearClipboard.value == "")
    clearClipboard.value = "10";
  PwdMkr_RDFUtils.updateTarget(passwordMaker.globalSettingsSubjectRes, "autoClearClipboard", clearClipboardCB.checked ? "true":"false");
}

function onClearClipboard() {
  if (/\D/.test(clearClipboard.value))
    clearClipboard.value="10";
  PwdMkr_RDFUtils.updateTarget(passwordMaker.globalSettingsSubjectRes, "autoClearClipboardSeconds", clearClipboard.value);
}

function onPWShortcutLBChanged() {
  PwdMkr_RDFUtils.updateTarget(passwordMaker.globalSettingsSubjectRes, "passwordShortcut", pwShortcutLB.value);
  passwordMaker.passwordShortcut = pwShortcutLB.value;
}

function onMaskGeneratedPasswordButton() {
  if (!maskGeneratedPasswordCB.checked) {
    // User wants to turn off masking
    if (passwordMaster.value != "") {
      // A master password has been set, so we can't allow
      // them to turn off masking just yet
      // Firefox unchecked the checbkox, even though the user
      // hasn't entered the master pw yet. Check it here so
      // the UI matches the current state of affairs.
      maskGeneratedPasswordCB.checked = true;
      // Prompt user for the master password before turning off
      // generated password masking
      if (promptMPW(passwordMaster.value))
        maskGeneratedPasswordCB.checked = false;
    }
  }
  PwdMkr_RDFUtils.updateTarget(passwordMaker.globalSettingsSubjectRes, "maskMasterPassword", maskGeneratedPasswordCB.checked ? "true":"false");
  passwordGenerated.setAttribute("type", maskGeneratedPasswordCB.checked ? "password" : "");
}

function onStatusbarIndicatorCB() {
  pwdMakerStatusBar.toggleShowHide(statusbarIndicatorCB.checked);
}

function onSetSettingsPath() {
  var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
  fp.init(window, "Select directory and filename for settings", nsIFilePicker.modeSave);
  if (fp.show() == nsIFilePicker.returnOK)
    alert(fp.file.path);
}

function promptMPW(mpw) {
  var okclicked = true;
  try {
    while (okclicked) {
      var input = {value:""};
      okclicked = passwordMaker.prompts.promptPassword(this, "PasswordMaker",
        passwordMaker.stringBundle.GetStringFromName("globalsettings.promptMPW.01"), input, null, {});
      if (okclicked) {
        if (input.value == mpw)
          return true;
        else
          passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("globalsettings.promptMPW.02"));
      }
    }
    return false;
  }
  finally {
    PwdMkr_MPW.wipe(mpw); // proactively clear sensitive memory
  }
}
  
function onSettingsURLBtn() {
  const nsIFilePicker = Components.interfaces.nsIFilePicker;
  var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
  fp.init(window, "Select the file in which to store the settings", nsIFilePicker.modeSave);
  fp.defaultString = "passwordmaker.rdf";
  if (fp.show() != nsIFilePicker.returnCancel) {
    try {
      origFile.copyTo(destDir, null);
	  	passwordMaker.setSettingsURI(fp.file);    
		  if (passwordMaker.ask(window, "Settings file has been moved. Delete original?")) {
			}
    }
    catch (e) {
      alert("Error: " + e);
    }
  }
}

function onUsingPFF(usingPFF) {
  document.getElementById("settingsURLBtn").disabled = usingPFF;
	passwordMaker.setSettingsURI(usingPFF?passwordMaker.PFF:passwordMaker.getDefaultPath());
}
