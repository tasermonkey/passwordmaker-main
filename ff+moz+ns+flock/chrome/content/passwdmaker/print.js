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

var printWindow;
var isExporting; // true if exporting to HTML/RDF; false if printing
const CI=Components.interfaces;
function printSettings() {
  var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(CI.nsIWindowMediator);
  var win = wm.getMostRecentWindow("navigator:browser");
  printWindow = wm.getMostRecentWindow("navigator:browser");
  printWindow.gBrowser.selectedTab = printWindow.gBrowser.addTab("about:blank");
  printWindow.gBrowser.selectedBrowser.addEventListener("load",
    function() {
      var doc = printWindow.gBrowser.contentDocument;
      doc.removeChild(doc.getElementsByTagName("html")[0]);
      isExporting = false;

      var dom = new DOMParser().parseFromString(rdfToHTML(), "text/xml");    
      doc.appendChild(dom.documentElement);
      setTimeout(function() {
        // Display the print dialog -- thanks http://lxr.mozilla.org/aviary101branch/source/toolkit/components/printing/content/printUtils.js
        var printSettings, webBrowserPrint;
        try {      
          webBrowserPrint = printWindow._content.QueryInterface(CI.nsIInterfaceRequestor)
            .getInterface(CI.nsIWebBrowserPrint);
          // Get print settings
          var PSSVC = Components.classes["@mozilla.org/gfx/printsettings-service;1"]
                              .getService(CI.nsIPrintSettingsService);
          printSettings = PSSVC.globalPrintSettings;
          if (!printSettings.printerName)
            printSettings.printerName = PSSVC.defaultPrinterName;
      
          // First get any defaults from the printer 
          PSSVC.initPrintSettingsFromPrinter(printSettings.printerName, printSettings);
          // now augment them with any values from last time
          PSSVC.initPrintSettingsFromPrefs(printSettings, true, printSettings.kInitSaveAll);        
        }
        catch (e) {
          dump(e + "\n");
          return;
        }
        try {
          webBrowserPrint.print(printSettings, null);
        } catch (e) {
          // Pressing cancel is expressed as an NS_ERROR_ABORT return value,
          // causing an exception to be thrown which we catch here.
          // Unfortunately this will also consume helpful failures, so add a
          // dump("print: "+e+"\n"); // if you need to debug
        }}, 2000);
    }, true);  
}

function rdfToHTML() {
  var includeMPW = false;
  if (passwordMaker.mpw)
    includeMPW = passwordMaker.ask(this, passwordMaker.stringBundle.GetStringFromName("print.rdfToHTML.01"));
  var incGenPwds = passwordMaker.ask(this, passwordMaker.stringBundle.GetStringFromName("print.rdfToHTML.02"));
  var incRemPwds = passwordMaker.ask(this, passwordMaker.stringBundle.GetStringFromName("print.rdfToHTML.03"));  
  
  var content =
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\"><html xmlns=\"http://www.w3.org/1999/xhtml\"><head><title>PasswordMaker. One Password To Rule Them All.</title><link rel=\"icon\" href=\"http://passwordmaker.org/favicon.ico\"/><link rel=\"shortcut icon\" href=\"http://passwordmaker.org/favicon.ico\"/><link rel=\"stylesheet\" href=\"";
    content += isExporting ? "http://passwordmaker.org/styles/print.css\"" : "chrome://passwdmaker/content/print.css\"";
    
  content += " type=\"text/css\"/></head><body><div id=\"canvasWrapper\"><div id=\"canvas\"><a href=\"http://passwordmaker.org/\"><img src=\"http://passwordmaker.org/images/pageheader.jpg\" style=\"border:none;\" alt=\"\"/></a><div id=\"contentWrapper\"><div id=\"content\"><div id=\"insertAfter\" class=\"standard\"/>";
  
  if (includeMPW)
    content += "<div class=\"title\">" + passwordMaker.stringBundle.GetStringFromName("print.rdfToHTML.04") + "</div><span class=\"mpwVal\">" +
      PwdMkr_MPW.getDecryptedMPW(passwordMaker.mpw) + "</span>";

  content += _printContainer(passwordMaker.stringBundle.GetStringFromName("print.rdfToHTML.05"), "accounts", incGenPwds, _buildAccountAsHTML);
  content += _buildGlobalSettings();
  content += _printContainer(passwordMaker.stringBundle.GetStringFromName("print.rdfToHTML.06"), "remotes", incRemPwds, _buildRemoteAsHTML);
  return content + "</div></div></div></div></body></html>";
}

function _buildGlobalSettings() {
  var content = "<br/><div class=\"title\">" + passwordMaker.stringBundle.GetStringFromName("print._buildGlobalSettings.01") + "</div>";
  content += _buildRDFLiteralAsHTML(passwordMaker.globalSettingsSubjectRes, 
    passwordMaker.maskMasterPasswordPredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildGlobalSettings.02"), "globalSetting", "globalSettingVal");
  content += _buildRDFLiteralAsHTML(passwordMaker.globalSettingsSubjectRes, 
    passwordMaker.hideMasterPasswordFieldPredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildGlobalSettings.03"), "globalSetting", "globalSettingVal");    
  content += _buildRDFLiteralAsHTML(passwordMaker.globalSettingsSubjectRes, 
    passwordMaker.confirmMPWPredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildGlobalSettings.04"), "globalSetting", "globalSettingVal");      
  content += _buildRDFLiteralAsHTML(passwordMaker.globalSettingsSubjectRes, 
    passwordMaker.viewPwdFieldsPredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildGlobalSettings.05"), "globalSetting", "globalSettingVal");     
  content += _buildRDFLiteralAsHTML(passwordMaker.globalSettingsSubjectRes, 
    passwordMaker.removeAutoCompletePredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildGlobalSettings.06"), "globalSetting", "globalSettingVal");     
  content += _buildRDFLiteralAsHTML(passwordMaker.globalSettingsSubjectRes, 
    passwordMaker.autoClearClipboardPredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildGlobalSettings.07"), "globalSetting", "globalSettingVal");     
  content += _buildRDFLiteralAsHTML(passwordMaker.globalSettingsSubjectRes, 
    passwordMaker.autoClearClipboardSecondsPredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildGlobalSettings.08"), "globalSetting", "globalSettingVal");
  content += _buildRDFLiteralAsHTML(passwordMaker.globalSettingsSubjectRes, 
    passwordMaker.statusbarIndicatorPredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildGlobalSettings.09"), "globalSetting", "globalSettingVal");

  var literal = passwordMaker._getLiteral(passwordMaker.globalSettingsSubjectRes, passwordMaker.passwordShortcutPredicateRes);
  switch (literal) {
    case "pop-all" : literal = passwordMaker.stringBundle.GetStringFromName("print._buildGlobalSettings.10"); break;
    case "off" : literal = passwordMaker.stringBundle.GetStringFromName("print._buildGlobalSettings.11"); break;
    case "empty-only" : literal = passwordMaker.stringBundle.GetStringFromName("print._buildGlobalSettings.12"); break;
    case "clear-all" : literal = passwordMaker.stringBundle.GetStringFromName("print._buildGlobalSettings.13"); break;
  }
  return content + "<span class=\"globalSetting\">" + passwordMaker.stringBundle.GetStringFromName("print._buildGlobalSettings.14") + "</span><span class=\"globalSettingVal\">" + literal + "</span>";
}

function _printContainer(containerName, containerStr, includePwd, buildFcn) {
  var content = "<div class=\"title\">" + containerName + "</div>";
  try {
    if (PwdMkr_RDFUtils.isEmpty(containerStr))
      content += "<span class=\"emptyVal\">" + passwordMaker.stringBundle.GetStringFromName("print._printContainer.01") + "</span><br/>";
    else {    
      var folders = PwdMkr_RDFUtils.makeSequence(containerStr).GetElements();
      while (folders.hasMoreElements()) {
        var folder = folders.getNext();
        if (folder instanceof CI.nsIRDFResource) {
          content += _buildRDFLiteralAsHTML(folder, passwordMaker.namePredicateRes, "", "groupName", "groupNameVal");
          content += _buildRDFLiteralAsHTML(folder, passwordMaker.descriptionPredicateRes, "", "groupNotes", "groupNotesVal") + "<br/>";
          if (PwdMkr_RDFUtils.rdfContainerUtils.IsContainer(PwdMkr_RDFUtils.datasource, folder)) {
            var container = Components.classes["@mozilla.org/rdf/container;1"].createInstance(CI.nsIRDFContainer);
            container.Init(PwdMkr_RDFUtils.datasource, folder);      
            var accounts = container.GetElements();
            while (accounts.hasMoreElements()) {
              var account = accounts.getNext();
              content += buildFcn(account, includePwd) + "<br/><br/>";
            }
          }
          else {
            // The defaults or any other top-level non-container resource
            content += buildFcn(folder) + "<br/><br/>"; // not really a folder!
          }        
        }
      }
    }
  }
  catch(e) {
    dump(e + "\n");
    content += "<span class=\"emptyVal\">" + passwordMaker.stringBundle.GetStringFromName("print._printContainer.01") + "</span><br/>";
  }
  return content;
}

function _buildRemoteAsHTML(account, includePwd) {
  var content = "";
  account = account.QueryInterface(CI.nsIRDFResource);
  content += _buildRDFLiteralAsHTML(account, passwordMaker.namePredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildRemoteAsHTML.01"), "remoteSetting", "remoteSettingVal");
  content += _buildRDFLiteralAsHTML(account, passwordMaker.descriptionPredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildRemoteAsHTML.02"), "remoteSetting", "remoteSettingVal");
  content += _buildRDFLiteralAsHTML(account, PwdMkr_RDFUtils.makePredicate("urlToUse"), passwordMaker.stringBundle.GetStringFromName("print._buildRemoteAsHTML.03"), "remoteSetting", "remoteSettingVal", true);
  content += _buildRDFLiteralAsHTML(account, PwdMkr_RDFUtils.makePredicate("useWebDAV"), passwordMaker.stringBundle.GetStringFromName("print._buildRemoteAsHTML.04"), "remoteSetting", "remoteSettingVal");  
  content += _buildRDFLiteralAsHTML(account, PwdMkr_RDFUtils.makePredicate("usernameTB"), passwordMaker.stringBundle.GetStringFromName("print._buildRemoteAsHTML.05"), "remoteSetting", "remoteSettingVal");  
  if (includePwd) {
    var encPassword = PwdMkr_RDFUtils.getTarget(account, "masterPassword", null); 
    var key = PwdMkr_RDFUtils.getTarget(account, "masterPasswordKey", null);     
    if (encPassword && key) {
      content += _buildAsHTML(PwdMkr_MPW.decrypt(encPassword, key),
        passwordMaker.stringBundle.GetStringFromName("print._buildRemoteAsHTML.06"), "remoteSetting", "remoteSettingVal");
    }
  }
  content += _buildRDFLiteralAsHTML(account, PwdMkr_RDFUtils.makePredicate("directory"), passwordMaker.stringBundle.GetStringFromName("print._buildRemoteAsHTML.07"), "remoteSetting", "remoteSettingVal");
  return content + _buildRDFLiteralAsHTML(account, PwdMkr_RDFUtils.makePredicate("file"), passwordMaker.stringBundle.GetStringFromName("print._buildRemoteAsHTML.08"), "remoteSetting", "remoteSettingVal");
}

function _buildAccountAsHTML(account, includeGenPassword) {
  var content = "";
  account = account.QueryInterface(CI.nsIRDFResource);
  if (account != passwordMaker.defaultAccount.subjectRes) {
    content += _buildRDFLiteralAsHTML(account, passwordMaker.namePredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildAccountAsHTML.01"), "accountSetting", "accountSettingVal");
    content += _buildRDFLiteralAsHTML(account, passwordMaker.descriptionPredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildAccountAsHTML.02"), "accountSetting", "accountSettingVal");
  }
  content += _buildRDFLiteralAsHTML(account, passwordMaker.whereLeetLBPredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildAccountAsHTML.03"), "accountSetting", "accountSettingVal");          
  content += _buildRDFLiteralAsHTML(account, passwordMaker.leetLevelLBPredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildAccountAsHTML.04"), "accountSetting", "accountSettingVal");
  content += _buildRDFLiteralAsHTML(account, passwordMaker.hashAlgorithmLBPredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildAccountAsHTML.05"), "accountSetting", "accountSettingVal");
  content += _buildRDFLiteralAsHTML(account, passwordMaker.passwordLengthPredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildAccountAsHTML.06"), "accountSetting", "accountSettingVal");
  if (account == passwordMaker.defaultAccount.subjectRes) {
    content += _buildRDFLiteralAsHTML(account, passwordMaker.protocolCBPredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildAccountAsHTML.07"), "accountSetting", "accountSettingVal");          
    content += _buildRDFLiteralAsHTML(account, passwordMaker.subdomainCBPredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildAccountAsHTML.08"), "accountSetting", "accountSettingVal");
    content += _buildRDFLiteralAsHTML(account, passwordMaker.domainCBPredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildAccountAsHTML.09"), "accountSetting", "accountSettingVal");
    content += _buildRDFLiteralAsHTML(account, passwordMaker.pathCBPredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildAccountAsHTML.10"), "accountSetting", "accountSettingVal");          
  }
  else {     
    content += _buildRDFLiteralAsHTML(account, passwordMaker.urlToUsePredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildAccountAsHTML.11"), "accountSetting", "accountSettingVal", true);          
  }
  content += _buildRDFLiteralAsHTML(account, passwordMaker.usernameTBPredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildAccountAsHTML.12"), "accountSetting", "accountSettingVal");                    
  content += _buildRDFLiteralAsHTML(account, passwordMaker.counterPredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildAccountAsHTML.13"), "accountSetting", "accountSettingVal");
  content += _buildRDFLiteralAsHTML(account, passwordMaker.charsetPredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildAccountAsHTML.14"), "accountSetting", "accountSettingVal");
  content += _buildRDFLiteralAsHTML(account, passwordMaker.prefixPredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildAccountAsHTML.15"), "accountSetting", "accountSettingVal");
  content += _buildRDFLiteralAsHTML(account, passwordMaker.suffixPredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildAccountAsHTML.16"), "accountSetting", "accountSettingVal");
  content += _buildRDFLiteralAsHTML(account, passwordMaker.autoPopulatePredicateRes, passwordMaker.stringBundle.GetStringFromName("print._buildAccountAsHTML.17"), "accountSetting", "accountSettingVal");                              
  if (includeGenPassword && account != passwordMaker.defaultAccount.subjectRes) {    
    var genPW = passwordMaker._generateSiteSpecificPassword(account);
    content += "<span class=\"accountSetting\">" + passwordMaker.stringBundle.GetStringFromName("print._buildAccountAsHTML.18") + "</span><span class=\"genPasswordVal\">";
    // Don't use CDATA sections if writing to HTML file
    content += isExporting ? genPW : ("<![CDATA[" + genPW + "]]>");
    content += "</span>";
  }
  return content;
}

function _buildRDFLiteralAsHTML(subject, predicate, predicateAsString, predicateClass, literalClass, isLink) {
  var literal;
  if (subject == null || predicate == null)
    literal = passwordMaker.stringBundle.GetStringFromName("print._buildRDFLiteralAsHTML.01");
  else {
    var literal = passwordMaker._getLiteral(subject, predicate);
    if (literal == "false")
      literal = passwordMaker.stringBundle.GetStringFromName("print._buildRDFLiteralAsHTML.02");
    if (literal == "true")
      literal = passwordMaker.stringBundle.GetStringFromName("print._buildRDFLiteralAsHTML.03");
    if (predicateAsString == passwordMaker.stringBundle.GetStringFromName("print._buildAccountAsHTML.03")) {
		switch(literal) {
			case "off": literal = passwordMaker.stringBundle.GetStringFromName("print._buildRDFLiteralAsHTML.04"); break;
			case "before-hashing": literal = passwordMaker.stringBundle.GetStringFromName("print._buildRDFLiteralAsHTML.05"); break;
			case "after-hashing": literal = passwordMaker.stringBundle.GetStringFromName("print._buildRDFLiteralAsHTML.06"); break;
			case "both": literal = passwordMaker.stringBundle.GetStringFromName("print._buildRDFLiteralAsHTML.07"); break;
		}
	}
  }
  return _buildAsHTML(literal, predicateAsString, predicateClass, literalClass, isLink);
}

function _buildAsHTML(literal, predicateAsString, predicateClass, literalClass, isLink) {
  var ret =  "<span class=\"" + predicateClass + "\">" + predicateAsString + "</span>";
  if (!literal)
    ret += "<span class=\"emptyVal\">" + passwordMaker.stringBundle.GetStringFromName("print._buildAsHTML.01");
  else {  
    // escape XML entities
  	literal = literal.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
    if (isLink) {
      if (isExporting) {
        // Make links clickable in HTML
        ret += literal.substring(0, 4) == "http" ?
          "<span class=\"" + literalClass + "\"><a href=\"" + literal + "\">" + literal + "</a>" : // already clickable
          "<span class=\"" + literalClass + "\"><a href=\"http://" + literal + "\">" + literal + "</a>"; // force clickable
      }
      else {
        // Links shouldn't be clickable so they use the right style
        ret += "<span class=\"" + literalClass + "\"><a href=\"" + literal + "\">" + literal + "</a>";
      }
    }
    else {
      if (isExporting) {
        // Don't use CDATA sections for HTML
        ret += "<span class=\"" + literalClass + "\">" + literal;
      }
      else {
        ret += "<span class=\"" + literalClass + "\"><![CDATA[" + literal + "]]>";
      }
    }
  }
  return ret + "</span><br/>";
}