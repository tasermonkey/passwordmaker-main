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

var passwordMaker = {
  appcontent : null,
  domains : null,

  allAccounts : null,
  
  advancedOptionsDialog : "false", // which dialog to open -- advanced options or basic
  passwordShortcut : "pop-all", // off, pop-all, empty-only, clear-all
  whereLeetLBPredicateRes : null,
  leetLevelLBPredicateRes : null,
  hashAlgorithmLBPredicateRes : null,
  passwordLengthPredicateRes : null,
  urlToUsePredicateRes : null, //http://passwordmaker.mozdev.org/rdf#urlToUse
  usernameTBPredicateRes : null,
  counterPredicateRes : null,
  namePredicateRes : null,
  descriptionPredicateRes : null,
  protocolCBPredicateRes : null,
  subdomainCBPredicateRes : null,
  domainCBPredicateRes : null,
  pathCBPredicateRes : null,

  //string bundle
  stringBundle : Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService).createBundle("chrome://passwdmaker/locale/passwdmaker.properties"),


  //global settings
  globalSettingsSubjectRes : null, //http://passwordmaker.mozdev.org/globalSettings
  masterPasswordPredicateRes : null, //http://passwordmaker.mozdev.org/rdf#masterPassword
  masterPasswordKeyPredicateRes : null,
  masterPasswordStoragePredicateRes : null,
  maskMasterPasswordPredicateRes : null,
  autoClearClipboardPredicateRes : null,
  autoClearClipboardSecondsPredicateRes : null,
  autoPopulatePredicateRes : null,
  viewPwdFieldsPredicateRes : null,
  removeAutoCompletePredicateRes : null,
  confirmMPWPredicateRes : null,
  statusbarIndicatorPredicateRes : null,
  advancedOptionsDialogPredicateRes : null,
  
  charsetPredicateRes : null,
  prefixPredicateRes : null,
  suffixPredicateRes : null,
  passwordShortcutPredicateRes : null,
  //settingsFilePathPredicateRes : null,
  hideMasterPasswordFieldPredicateRes : null,
  domainsDatasource : null,
  
  // Cached (along with some other RDF facts) for performance
  viewPwdFields : null,
  removeAutoComplete : null,
  
  statusBarPanel : null,
  statusBarTip : null,
  
  // These are not the "Default Settings" (which a user can change) but rather
  // internal hard-coded defaults.
  DEFAULT_LEET : "off",
  DEFAULT_LEET_LEVEL: 1,
  DEFAULT_HASHALG : "md5",
  DEFAULT_LENGTH : "8",
  DEFAULT_NAME : null,
  DEFAULT_DESCRIPTION : null,
  DEFAULT_PROTOCOL : "false",
  DEFAULT_SUBDOMAIN : "false",
  DEFAULT_DOMAIN : "true",
  DEFAULT_PATH : "false",
  DEFAULT_URLTOUSE : "",
  DEFAULT_CHARSET : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+={}|[]\\:\";'<>?,./", // base95 or 93 or whatever
  DEFAULT_PREFIX : "",
  DEFAULT_SUFFIX : "",
  DEFAULT_USERNAME : "",
  DEFAULT_COUNTER : "",
  DEFAULT_AUTOPOPULATE : "false",
  ENTER_MPW : null,
  
  remotesContainer : null,
  accountsContainer : null,
  domainsContainer : null,
  prompts : Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService),  
  mpw : null,
  defaultAccount : null,
  
  init : function() {  
    this.DEFAULT_NAME = this.stringBundle.GetStringFromName("passwdmaker.default_name");
    this.DEFAULT_DESCRIPTION = this.stringBundle.GetStringFromName("passwdmaker.default_description");  
    this.ENTER_MPW = this.stringBundle.GetStringFromName("passwdmaker.enter_mpw");
    this.installIcons();
    this.appcontent = document.getElementById("appcontent");   // Browser    
    this.whereLeetLBPredicateRes = PwdMkr_RDFUtils.makePredicate("whereLeetLB");
    this.leetLevelLBPredicateRes = PwdMkr_RDFUtils.makePredicate("leetLevelLB");
    this.hashAlgorithmLBPredicateRes = PwdMkr_RDFUtils.makePredicate("hashAlgorithmLB");
    this.passwordLengthPredicateRes = PwdMkr_RDFUtils.makePredicate("passwordLength");
    this.urlToUsePredicateRes = PwdMkr_RDFUtils.makePredicate("urlToUse");
    this.usernameTBPredicateRes = PwdMkr_RDFUtils.makePredicate("usernameTB");
    this.counterPredicateRes = PwdMkr_RDFUtils.makePredicate("counter");
    this.namePredicateRes = PwdMkr_RDFUtils.makePredicate("name");
    this.descriptionPredicateRes = PwdMkr_RDFUtils.makePredicate("description");
    this.protocolCBPredicateRes = PwdMkr_RDFUtils.makePredicate("protocolCB");
    this.subdomainCBPredicateRes = PwdMkr_RDFUtils.makePredicate("subdomainCB");
    this.domainCBPredicateRes = PwdMkr_RDFUtils.makePredicate("domainCB");
    this.pathCBPredicateRes = PwdMkr_RDFUtils.makePredicate("pathCB");
    this.charsetPredicateRes = PwdMkr_RDFUtils.makePredicate("charset");
    this.prefixPredicateRes = PwdMkr_RDFUtils.makePredicate("prefix");
    this.suffixPredicateRes = PwdMkr_RDFUtils.makePredicate("suffix");
    this.autoPopulatePredicateRes = PwdMkr_RDFUtils.makePredicate("autoPopulate");

    this.defaultAccount = new Object();    
    this.defaultAccount.subjectRes = PwdMkr_RDFUtils.makeResource("http://passwordmaker.mozdev.org/defaults");
    this.defaultAccount.matches = null;
    
    //global settings
    this.globalSettingsSubjectRes = PwdMkr_RDFUtils.makeResource("http://passwordmaker.mozdev.org/globalSettings");
    this.masterPasswordPredicateRes = PwdMkr_RDFUtils.makePredicate("masterPassword");
    this.masterPasswordKeyPredicateRes = PwdMkr_RDFUtils.makePredicate("masterPasswordKey");
    this.masterPasswordStoragePredicateRes = PwdMkr_RDFUtils.makePredicate("masterPasswordStorage");
    this.maskMasterPasswordPredicateRes = PwdMkr_RDFUtils.makePredicate("maskMasterPassword");
    this.autoClearClipboardPredicateRes = PwdMkr_RDFUtils.makePredicate("autoClearClipboard");
    this.autoClearClipboardSecondsPredicateRes = PwdMkr_RDFUtils.makePredicate("autoClearClipboardSeconds");
    this.advancedOptionsDialogPredicateRes = PwdMkr_RDFUtils.makePredicate("advancedOptionsDialog");
    this.passwordShortcutPredicateRes = PwdMkr_RDFUtils.makePredicate("passwordShortcut");
    //this.settingsFilePathPredicateRes = PwdMkr_RDFUtils.makePredicate("settingsFilePath");
    this.hideMasterPasswordFieldPredicateRes = PwdMkr_RDFUtils.makePredicate("hideMasterPasswordField");
    this.viewPwdFieldsPredicateRes = PwdMkr_RDFUtils.makePredicate("viewPwdFields");
    this.removeAutoCompletePredicateRes = PwdMkr_RDFUtils.makePredicate("removeAutoComplete");    
    this.confirmMPWPredicateRes = PwdMkr_RDFUtils.makePredicate("confirmMPW");
    this.statusbarIndicatorPredicateRes = PwdMkr_RDFUtils.makePredicate("statusbarIndicator");   
    
    this.initGlobals();

    // Initialize containers 
    this.remotesContainer = PwdMkr_RDFUtils.makeSequence("remotes");
    this.accountsContainer = PwdMkr_RDFUtils.makeSequence("accounts");
    this.domainsContainer = PwdMkr_RDFUtils.makeSequence("domains");
    
    
    // Get MPW if it's been saved to disk
    this.setMPW(new MasterPassword(PwdMkr_RDFUtils.getTarget(this.globalSettingsSubjectRes, this.masterPasswordPredicateRes), // Might be null if user doesn't like to save the master pw
      PwdMkr_RDFUtils.getTarget(this.globalSettingsSubjectRes, this.masterPasswordKeyPredicateRes)), false);

    // Which dialog is the preferred one (basic or advanced)?
    this.advancedOptionsDialog = PwdMkr_RDFUtils.getTarget(this.globalSettingsSubjectRes, this.advancedOptionsDialogPredicateRes);

    // Password Shortcut (ALT-`)
    this.passwordShortcut = PwdMkr_RDFUtils.getTarget(passwordMaker.globalSettingsSubjectRes, passwordMaker.passwordShortcutPredicateRes);

    this.upgradeTo16();
    this.cacheDomains();
    this.cacheAccounts();

    this.viewPwdFields = PwdMkr_RDFUtils.getTarget(this.globalSettingsSubjectRes, this.viewPwdFieldsPredicateRes) == "true";
    this.removeAutoComplete = PwdMkr_RDFUtils.getTarget(this.globalSettingsSubjectRes, this.removeAutoCompletePredicateRes) == "true";    
    
    // Start listening for pageLoads
    this.appcontent.addEventListener("load", this.pageLoad, true);
    // stop listening
    //this.appcontent.removeEventListener("load", this.pageLoad, true);

    // listen for context-menu
    document.getElementById("contentAreaContextMenu").addEventListener("popupshowing", this.contextPopupShowing, false);
    pwdMakerStatusBar.init();
  },
  
  /**
   * Convert 1.5.1's urlToMatch predicates to serialized Match objects
   */
  upgradeTo16 : function() {
    var resEnum = PwdMkr_RDFUtils.datasource.GetAllResources();
    while (resEnum.hasMoreElements()) {
      var subjectRes = resEnum.getNext(); // e.g., http://passwordmaker.mozdev.org/yahoo_accounts
      var urlToMatchPredicateRes = PwdMkr_RDFUtils.makePredicate("urlToMatch");
	    var urlToMatch = PwdMkr_RDFUtils.getTarget(subjectRes, urlToMatchPredicateRes);
	    if (urlToMatch) {
	      /*urlToMatch = urlToMatch.replace("?", "\\?");
	      urlToMatch = urlToMatch.replace("*", "\\*");	      
	      urlToMatch = urlToMatch.replace(".", "\\.");	      
	      urlToMatch = urlToMatch.replace("$", "\\$");	      
	      urlToMatch = urlToMatch.replace("^", "\\^");
	      urlToMatch = urlToMatch.replace("+", "\\+");	      
	      urlToMatch = urlToMatch.replace("[", "\\[");	      	      	      
	      urlToMatch = urlToMatch.replace("]", "\\]");	      	      	      	      
	      urlToMatch = urlToMatch.replace("{", "\\{");	      	      	      	      
	      urlToMatch = urlToMatch.replace("}", "\\}");	      	      	      	      
	      urlToMatch = urlToMatch.replace("|", "\\|");*/	      	      	      	      
	      urlToMatch = "*" + urlToMatch + "*";
	    	PwdMkr_RDFUtils.updateTarget(subjectRes, "pattern0", urlToMatch);
	    	PwdMkr_RDFUtils.updateTarget(subjectRes, "patterntype0", "wildcard");
	    	PwdMkr_RDFUtils.updateTarget(subjectRes, "patterndesc0", "Automatically converted as part of PasswordMaker 1.6 upgrade");	  
	    	PwdMkr_RDFUtils.updateTarget(subjectRes, "patternenabled0", "true");
	    	PwdMkr_RDFUtils.removeTarget(subjectRes, urlToMatchPredicateRes);	    
	    }      
    }
  },

  /**
   * Set the _masterPassword variable from the supplied argument.
   * This supplied argument must be a MasterPassword object.
   */
  setMPW : function(oMPW, updateUI) {
    passwordMaker.mpw = oMPW && oMPW.encryptedData && oMPW.key ? oMPW:null;
    if (updateUI) {
      var w = passwordMaker.findWindow();
      if (w)    
        w.refreshMPW();
    }
  },
    
  initGlobals : function() {
    // Get the accounts sequence, or create it if it doesn't exist
    var accountsSubjectRes = PwdMkr_RDFUtils.makeResource("http://passwordmaker.mozdev.org/accounts");
    
    var accountsContainer = PwdMkr_RDFUtils.rdfContainerUtils.MakeSeq(PwdMkr_RDFUtils.datasource, accountsSubjectRes);
    if (PwdMkr_RDFUtils.rdfContainerUtils.IsEmpty(PwdMkr_RDFUtils.datasource, accountsSubjectRes)) {
      // TODO: change the above line so it specifically checks for defaultAccount, not if the container is empty
      // Make the defaults resources.
      var d = this.defaultAccount.subjectRes;
      PwdMkr_RDFUtils.updateTarget(d, this.whereLeetLBPredicateRes, this.DEFAULT_LEET);
      PwdMkr_RDFUtils.updateTarget(d, this.leetLevelLBPredicateRes, this.DEFAULT_LEET_LEVEL);
      PwdMkr_RDFUtils.updateTarget(d, this.hashAlgorithmLBPredicateRes, this.DEFAULT_HASHALG);    
      PwdMkr_RDFUtils.updateTarget(d, this.passwordLengthPredicateRes, this.DEFAULT_LENGTH);    
      PwdMkr_RDFUtils.updateTarget(d, this.namePredicateRes, this.DEFAULT_NAME);    
      PwdMkr_RDFUtils.updateTarget(d, this.descriptionPredicateRes, this.DEFAULT_DESCRIPTION);    
      PwdMkr_RDFUtils.updateTarget(d, this.protocolCBPredicateRes, this.DEFAULT_PROTOCOL);    
      PwdMkr_RDFUtils.updateTarget(d, this.subdomainCBPredicateRes, this.DEFAULT_SUBDOMAIN);    
      PwdMkr_RDFUtils.updateTarget(d, this.domainCBPredicateRes, this.DEFAULT_DOMAIN);    
      PwdMkr_RDFUtils.updateTarget(d, this.pathCBPredicateRes, this.DEFAULT_PATH);    
      PwdMkr_RDFUtils.updateTarget(d, this.charsetPredicateRes, this.DEFAULT_CHARSET);    
      PwdMkr_RDFUtils.updateTarget(d, this.prefixPredicateRes, this.DEFAULT_PREFIX);    
      PwdMkr_RDFUtils.updateTarget(d, this.suffixPredicateRes, this.DEFAULT_SUFFIX);    
      PwdMkr_RDFUtils.updateTarget(d, this.autoPopulatePredicateRes, this.DEFAULT_AUTOPOPULATE);    
      accountsContainer.AppendElement(d);
    }
  
    // Do the globalsettings exist? Make them if not. @TODO: change this code to use saveGlobals() instead
    if (!PwdMkr_RDFUtils.hasTarget(this.globalSettingsSubjectRes, this.masterPasswordStoragePredicateRes))
      PwdMkr_RDFUtils.updateTarget(this.globalSettingsSubjectRes, this.masterPasswordStoragePredicateRes, "do-not-store");
    if (!PwdMkr_RDFUtils.hasTarget(this.globalSettingsSubjectRes, this.maskMasterPasswordPredicateRes))
      PwdMkr_RDFUtils.updateTarget(this.globalSettingsSubjectRes, this.maskMasterPasswordPredicateRes, "false");
    if (!PwdMkr_RDFUtils.hasTarget(this.globalSettingsSubjectRes, this.autoClearClipboardPredicateRes))
      PwdMkr_RDFUtils.updateTarget(this.globalSettingsSubjectRes, this.autoClearClipboardPredicateRes, "true");
    if (!PwdMkr_RDFUtils.hasTarget(this.globalSettingsSubjectRes, this.autoClearClipboardSecondsPredicateRes))
      PwdMkr_RDFUtils.updateTarget(this.globalSettingsSubjectRes, this.autoClearClipboardSecondsPredicateRes, 10);
    if (!PwdMkr_RDFUtils.hasTarget(this.globalSettingsSubjectRes, this.advancedOptionsDialogPredicateRes))
      PwdMkr_RDFUtils.updateTarget(this.globalSettingsSubjectRes, this.advancedOptionsDialogPredicateRes, "false");
    if (!PwdMkr_RDFUtils.hasTarget(this.globalSettingsSubjectRes, this.passwordShortcutPredicateRes))
      PwdMkr_RDFUtils.updateTarget(this.globalSettingsSubjectRes, this.passwordShortcutPredicateRes, "pop-all"); // 0.6.1    
    if (!PwdMkr_RDFUtils.hasTarget(this.globalSettingsSubjectRes, this.hideMasterPasswordFieldPredicateRes))
      PwdMkr_RDFUtils.updateTarget(this.globalSettingsSubjectRes, this.hideMasterPasswordFieldPredicateRes, "false"); // 0.7.1
    if (!PwdMkr_RDFUtils.hasTarget(this.globalSettingsSubjectRes, this.viewPwdFieldsPredicateRes))
      PwdMkr_RDFUtils.updateTarget(this.globalSettingsSubjectRes, this.viewPwdFieldsPredicateRes, "false"); // 0.8.4
    if (!PwdMkr_RDFUtils.hasTarget(this.globalSettingsSubjectRes, this.removeAutoCompletePredicateRes))
      PwdMkr_RDFUtils.updateTarget(this.globalSettingsSubjectRes, this.removeAutoCompletePredicateRes, "false"); // 0.8.4
    if (!PwdMkr_RDFUtils.hasTarget(this.globalSettingsSubjectRes, this.confirmMPWPredicateRes))
      PwdMkr_RDFUtils.updateTarget(this.globalSettingsSubjectRes, this.confirmMPWPredicateRes, "true"); // 0.8.4
    if (!PwdMkr_RDFUtils.hasTarget(this.globalSettingsSubjectRes, this.statusbarIndicatorPredicateRes))
      PwdMkr_RDFUtils.updateTarget(this.globalSettingsSubjectRes, this.statusbarIndicatorPredicateRes, "true"); // 0.9
    PwdMkr_RDFUtils.flush();
  },
  
  /**
   * Load the list of top-level domains which require second-level
   * domains (e.g., uk) or third, fourth, fifth-level (etc...) domains
   * into this.domains associative array.
   */
  cacheDomains : function() {
    var domainIdPredicateRes = PwdMkr_RDFUtils.makePredicate("domainid");
    this.domains = new Array();
    var compositeDS = Components.classes["@mozilla.org/rdf/datasource;1?name=composite-datasource"].getService(Components.interfaces.nsIRDFCompositeDataSource);
    compositeDS.AddDataSource(PwdMkr_RDFUtils.datasource);
    compositeDS.AddDataSource(PwdMkr_RDFUtils.rdfService.GetDataSourceBlocking("chrome://passwdmaker/content/domains.rdf"));
  
    // DO NOT USE PwdMkr_RDFUtils.makeSequence() HERE BECAUSE THE SEQUENCE
    // MUST BE MADE AGAINST THE COMPOSITE DS, NOT JUST PwdMkr_RDFUtils.datasource !!!
    var domainsContainer = PwdMkr_RDFUtils.rdfContainerUtils.MakeSeq(compositeDS, PwdMkr_RDFUtils.makeResource("http://passwordmaker.mozdev.org/domains"));
    var domains = domainsContainer.GetElements(); // NOT the same as the this.domains variable
    while (domains.hasMoreElements()) {
      var country = domains.getNext();
      if (country instanceof Components.interfaces.nsIRDFResource) {
        var countryContainer = PwdMkr_RDFUtils.rdfContainerUtils.MakeSeq(compositeDS, country);
        var subdomains = countryContainer.GetElements();
        while (subdomains.hasMoreElements()) {
          var subdomain = subdomains.getNext();
          var t = subdomain;
          if (subdomain instanceof Components.interfaces.nsIRDFResource) {
            if (!PwdMkr_RDFUtils.rdfContainerUtils.IsContainer(compositeDS, subdomain)) {
              // Get the domainid target
              var target = this._getLiteral(t, domainIdPredicateRes); // for passwordmaker.rdf (custom domains)
              if (target == null)
                target = subdomain.Value.substring(subdomain.Value.lastIndexOf("/")+1); // for domains.rdf (default domains)
              this.domains[target] = true;     
            }
          }
        }
      }
    }
  },

  cacheAccounts : function() {
    // Cache all accounts in memory for quick access
    passwordMaker.allAccounts = new Array();
    passwordMaker.defaultAccount.autoPop = false;    
    var resEnum = PwdMkr_RDFUtils.datasource.GetAllResources();
    while (resEnum.hasMoreElements()) {
      var subjectRes = resEnum.getNext(); // e.g., http://passwordmaker.mozdev.org/yahoo_accounts
      if (passwordMaker.defaultAccount.subjectRes == subjectRes) {
        passwordMaker.defaultAccount.fields = passwordMaker.deserializeFields(subjectRes);
        passwordMaker.defaultAccount.autoPop = PwdMkr_RDFUtils.getTarget(subjectRes, passwordMaker.autoPopulatePredicateRes) == "true";
      }
      else
        passwordMaker._loadAccount(subjectRes, passwordMaker.allAccounts);
    }
  },
  
  _loadAccount : function(subjectRes, arr) {
	  var idx = arr.length;
	  arr[idx] = new Object();
	  arr[idx].subjectRes = subjectRes;
	  arr[idx].patternsArray = passwordMaker.deserializePatterns(subjectRes);
	  arr[idx].autoPop = PwdMkr_RDFUtils.getTarget(subjectRes, passwordMaker.autoPopulatePredicateRes) == "true";      
	  var fields = passwordMaker.deserializeFields(subjectRes);
	  if (fields && fields.length > 0)
	    arr[idx].fields = fields;  
  }, 
  
  /**
   * This method CAN return null!
   */
  deserializeFields : function(subjectRes) {
    var ret;
    var count=0, fieldname;
    while(fieldname = PwdMkr_RDFUtils.getTarget(subjectRes, "fieldname" + count)) {
      if (!ret)
        ret = new Array();
      var field = new Object();
      field.fieldname = fieldname;
      field.fieldvalue = PwdMkr_RDFUtils.getTarget(subjectRes, "fieldvalue" + count);
      field.fieldtype = PwdMkr_RDFUtils.getTarget(subjectRes, "fieldtype" + count);
      if (field.fieldtype == "password"); // Eh? This line is useless!     07-29-06 EJ: I think the semi-colon is a typo
        field.fieldkey = PwdMkr_RDFUtils.getTarget(subjectRes, "fieldkey" + count);
      field.fieldid = PwdMkr_RDFUtils.getTarget(subjectRes, "fieldid" + count);      
      field.fieldnotification = PwdMkr_RDFUtils.getTarget(subjectRes, "fieldnotification" + count) == "true";      
      field.fielddesc = PwdMkr_RDFUtils.getTarget(subjectRes, "fielddesc" + count);      
      field.formname = PwdMkr_RDFUtils.getTarget(subjectRes, "formname" + count++);
      field.formname = field.formname == "" ? null : field.formname;
      field.subjectRes = subjectRes;  
      ret[ret.length] = field;
    }
    return ret;
  },

  /**
   * This method CAN return null!
   */  
  deserializePatterns : function(subjectRes) {
    var ret;
    var count=0, pat;
    while(pat = PwdMkr_RDFUtils.getTarget(subjectRes, "pattern" + count)) {
      !ret && (ret = new Array());
      var pattern = new Object();
      pattern.pattern = pat;
      pattern.type = PwdMkr_RDFUtils.getTarget(subjectRes, "patterntype" + count);
      pattern.enabled = PwdMkr_RDFUtils.getTarget(subjectRes, "patternenabled" + count, "true") == "true";      
      pattern.notes = PwdMkr_RDFUtils.getTarget(subjectRes, "patterndesc" + count++);    
      pattern.regex = this.buildRegEx(pat, pattern.type);
      ret[ret.length] = pattern;
    }
    return ret;  
  },

  buildRegEx : function(pat, type) {
    if (type == "wildcard") {
      pat = pat.replace(/[$.+()^]/g, '\\$&');
      pat = pat.replace(/\*/g, '.*');
      pat = pat.replace(/\?/g, '.');
    }
    pat[0] != "^" && (pat = "^" + pat);
    pat[pat.length-1] != "$" && (pat = pat + "$");
  	try {
	 	  return new RegExp(pat);  	
	 	}
	 	catch(e) {
	 	  dump(e + "\n");
	 	}
  },   

  /**
   * Callback function called by Mozilla when context-menu appears
   */
  contextPopupShowing : function() {
    var target = gContextMenu.target;
    // target can be null when opening something like
    // chrome://passwdmaker/content/uris.xul directly in the browser.
    if (target) {
      //var type = target.type; // always lower-case
      document.getElementById("passwordmaker-popup").hidden = 
        !(target.tagName == "INPUT" || target.tagName == "TEXTAREA");
      // Save a reference to the object being clicked
      passwordMaker.clickedElement = gContextMenu.target;
    }
  },

  /**
   * Callback function called by Mozilla when the context-menu
   * item has been clicked
   */
  onContextMenuClick : function() {
    if (passwordMaker.clickedElement) {
      var fields = new Array();
      passwordMaker._getElementDetails(passwordMaker.clickedElement, fields);
      passwordMaker._processRequest(passwordMaker._matchByURL(passwordMaker.getURI(), true, false).accounts,
        passwordMaker._parseFields(fields), "context-click");              
      passwordMaker.clickedElement = null; // Remove reference to the saved element which was saved in contextPopupShowing()
    }
  },

  /**
   * Called for all populate requests!
   */
  _processRequest : function(matches, fields, populateAction) {
    // Prompt user to choose account (if necessary)  
    var aMatch = passwordMaker._promptUserToChooseAccount(matches);
    if (aMatch) {
      pwdMakerStatusBar.update(aMatch.subjectRes, passwordMaker.readAccountSettings(aMatch.subjectRes));
      
      // Populate passwords first so user is forced to enter MPW if he hasn't already.
      // This prevents unauthorized ppl from populating username & other fields.
      passwordMaker._populatePasswords(fields.passwords, aMatch, populateAction);
      passwordMaker._populateUsernames(fields.usernames, aMatch, populateAction);
      if (aMatch.fields) { // NOT aMatch.fields.others.length > 0
        // TODO: prompt user for MPW *and make sure it's correct*
        passwordMaker._populateOthers(fields.others, aMatch, populateAction);
        passwordMaker._submit(fields.submits, aMatch, populateAction);        
      }
    }
  },
  
  /**
   * Coolkey
   */
  _processShortcut : function(doc) {
    var fields = passwordMaker._getAllInputFields(doc);
          
    if (passwordMaker.passwordShortcut == "clear-all") {
      // Clear the usernames
      for (var i=0; i<fields.usernames.length; i++)
        fields.usernames[i].field.value = "";
                
      // Clear the passwords
      for (var i=0; i<fields.passwords.length; i++)
        fields.passwords[i].field.value = "";

      // Clear the others
      for (var i=0; i<fields.others.length; i++) {
        switch (fields.others[i].fieldtype.toString().toLowerCase()) {
          case "text":
          case "textarea":
          case "password":          
            fields.others[i].field.value = "";
            break;
          case "checkbox":
          case "radio":          
            fields.others[i].field.checked = false;
            break;
          case "select":
            fields.others[i].field.selectedIndex = -1;
            break;
        }
      }
      return;
    }
    else if (passwordMaker.passwordShortcut == "empty-only") {
      // If there's nothing empty, just return because we don't
      // want to prompt the user to choose an account / enter mpw.
      var foundEmptyField = false;
      for (var i=0; !foundEmptyField && i<fields.usernames.length; i++)
        foundEmptyField = fields.usernames[i].field.value == "";
      for (var i=0; !foundEmptyField && i<fields.passwords.length; i++)
        foundEmptyField = fields.passwords[i].field.value == "";
      for (var i=0; !foundEmptyField && i<fields.others.length; i++) {
        switch (fields.others[i].fieldtype.toString().toLowerCase()) {
          case "text":
          case "textarea":
          case "password":          
            foundEmptyField = fields.others[i].field.value == "";
            break;
//        case "checkbox":
//        case "radio":          
//            foundEmptyField = !fields.others[i].field.checked;
//            break;
          case "select":
            foundEmptyField = fields.others[i].field.selectedIndex == -1;
            break;
        }
      }
      // If there are no empty fields to populate, so don't bother continuing
      if (!foundEmptyField)
        return;        
    }
    passwordMaker._processRequest(passwordMaker._matchByURL(doc.URL, true, false).accounts, fields, "coolkey-" + passwordMaker.passwordShortcut);
  },
  
  /**
   * Callback function called by Mozilla when a page loads
   */
  pageLoad : function(evt) {
    pwdMakerStatusBar.clear();
    
    // doc is document that triggered onload event
    var doc = evt.originalTarget;
    
    // Get only url-matched accounts WITH auto-populate or "other" fields    
    var matches = passwordMaker._matchByURL(doc.URL,
      passwordMaker.defaultAccount.autoPop || passwordMaker.defaultAccount.fields,
      true);    

    var fields;
    if (matches.accounts.length > 0) {
      fields = passwordMaker._getAllInputFields(doc);
      // Are there populatable fields on the page and 1 or more accounts which want to pop them?
      if (((fields.passwords.length > 0 || fields.usernames.length > 0) && matches.popUserPass) || (matches.popOthers && fields.others.length > 0))
        passwordMaker._processRequest(matches.accounts, fields, "pageload-pop-all");
    }
    if (passwordMaker.viewPwdFields || passwordMaker.removeAutoComplete)
      passwordMaker._modifyAttributes(fields, doc);
  },
  
  getCalculatedURIUsedForDefault : function() {
    var defaults = passwordMaker.readAccountSettings(passwordMaker.defaultAccount.subjectRes);
    return passwordMaker.calculateURI(defaults.protocol == "true",
     defaults.subdomain == "true",
     defaults.domain == "true",
     defaults.path == "true", //@TODO: change this to port when supported in the GUI
     defaults.path == "true", window['passwordmaker-uri']);
  },

  /**
   * Modify autcomplete and type attributes of input elements
   */
  _modifyAttributes : function(fields, doc) {
    if (!fields)
      fields = passwordMaker._getAllInputFields(doc);
    if (passwordMaker.viewPwdFields) {
      for (var i=0; i<fields.passwords.length; i++) {
        var f = fields.passwords[i];
        f.fieldtype = "text";          
        f.field.setAttribute("type", "text"); 
        f.field.setAttribute("oldtype", "password"); 
        // Protect pw fields from autocomplete (security).
        // This is important because below we turn on autocomplete at the form (parent level).
        f.field.setAttribute("autocomplete", "off");
      }
    }
    if (passwordMaker.removeAutoComplete) {
      for (var i=0; i<fields.others.length; i++) {    
        if (fields.others[i].fieldtype.toString().toLowerCase() != "password") {        
          // Turn on/off autocomplete, but don't turn it on for passwords (security). 
          fields.others[i].field.setAttribute("autocomplete", "on");
        }
      }
      // For forms
      var forms = new Array();
      passwordMaker._getElementsByTagName(doc, "form", forms);
      for (var f in forms)
        forms[f].field.setAttribute("autocomplete", "on");      
    }
  },
  
  _getAllInputFields : function(doc) {
    var ret = new Array();
    passwordMaker._getElementsByTagName(doc, "input", ret);
    passwordMaker._getElementsByTagName(doc, "textarea", ret);
    passwordMaker._getElementsByTagName(doc, "select", ret);    
    return passwordMaker._parseFields(ret);
  },
  
  /**
   * Unlike document.getElementsByTagName(), this fcn includes frames.
   */
  _getElementsByTagName : function(doc, fieldtype, ret) {
    var fields = doc.getElementsByTagName(fieldtype);
    for (var i=0; i<fields.length; i++)
      passwordMaker._getElementDetails(fields[i], ret);
      
    // Check frames
    var frames = doc.getElementsByTagName("frame");
    for (var i=0; i<frames.length; i++) {
      passwordMaker._getElementsByTagName(frames[i].contentDocument, fieldtype, ret);
      /*fields = frames[i].contentDocument.getElementsByTagName(fieldtype);
      for (var j=0; j<fields.length; j++)
        passwordMaker._getElementDetails(fields[j], ret)*/
    }
    // Check frames
    var frames = doc.getElementsByTagName("iframe");
    for (var i=0; i<frames.length; i++) {
      passwordMaker._getElementsByTagName(frames[i].contentDocument, fieldtype, ret);
      /*fields = frames[i].contentDocument.getElementsByTagName(fieldtype);
      for (var j=0; j<fields.length; j++)
        passwordMaker._getElementDetails(fields[j], ret)*/
    }     
  },

  _getElementDetails : function(field, ret) {
    var f = new Object();
    f.fieldname = field.getAttribute("name");
    f.fieldtype = field.nodeName.toLowerCase() == "input" ? field.getAttribute("type") : field.nodeName.toLowerCase();
    if (!f.fieldtype || f.fieldtype == "")
      f.fieldtype = "text";
    
    // Check for password fields which have been manipulated by _modifyAttributes() to be text fields
    if (f.fieldtype.toString().toLowerCase() == "text")
      f.fieldtype == field.getAttribute("oldtype") ? field.getAttribute("oldtype") : f.fieldtype;
    
    f.fieldid = field.getAttribute("id");
    if (!f.fieldid)
      f.fieldid = "";
    f.formname = field.form ? field.form.getAttribute("name") : passwordMaker.findFormName(field); // can be null
    f.field = field; // the field itself
    ret.push(f);
  },

  /** Can return null if form HAS no name **/
  findFormName : function(node) {
    if (node.nodeName == "FORM")
      return node.getAttribute("name");
    return node.parentNode ? passwordMaker.findFormName(node.parentNode) : null;
  },
  
  fields : null,
  _parseFields : function(fields) {
    var ret = {usernames: new Array(), passwords: new Array(), submits: new Array(), others: new Array()};
    for (var i=0; i<fields.length; i++) {
      if (fields[i].fieldtype.toString().toLowerCase() == "text" && fields[i].field.getAttribute("oldtype") != "password" && fields[i].fieldname && 
        fields[i].fieldname.match(/ID|un|name|user|usr|log|email|mail|acct|ssn/i))
          ret.usernames[ret.usernames.length] = fields[i];

      if (fields[i].fieldtype.toString().toLowerCase() == "password" || fields[i].field.getAttribute("oldtype") == "password")      
        ret.passwords[ret.passwords.length] = fields[i];          
//      else if (fields[i].fieldtype.match(/submit|button|image/i) && (fields[i].src.match(/log|sub|sign/i) || fields[i].fieldvalue.match(/log|sub|sign/i) || fields[i].fieldname.match(/log|sub|sign/i)))
//        ret.submits[ret.submits.length] = fields[i];
      ret.others[ret.others.length] = fields[i];
    }
    passwordMaker.fields = ret;
    return ret;
  },
  
  /**
   * Called on alt-` keyboard click
   */
  populateFields : function() {
    // off, pop-all, empty-only, clear-all
    if (passwordMaker.passwordShortcut == "off")
      return;

    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
    var recentWindow = wm.getMostRecentWindow("navigator:browser");
    if (recentWindow) {
      passwordMaker._processShortcut(recentWindow.content.document);
    }
  },
    
  /**
   * Given a subject and predicate, return the literal
   * of the associated target (we're assuming there's
   * only a single target). If the target doesn't exist
   * or isn't a literal, return defaultVal (which often
   * may be null).
   */
  _getLiteral : function(subjectRes, predicateRes, defaultVal) {
    var targetRes = PwdMkr_RDFUtils.datasource.GetTarget(subjectRes, predicateRes, true);
    return targetRes instanceof Components.interfaces.nsIRDFLiteral ? targetRes.Value : defaultVal;
  },
  
  readAccountSettings : function(subjectRes) {
    // TODO: convert the use of _getLiteral() to PwdMkr_RDFUtils.getTarget()
    var ret = new Array();
    ret.name = passwordMaker._getLiteral(subjectRes, passwordMaker.namePredicateRes, "");
    ret.description = passwordMaker._getLiteral(subjectRes, passwordMaker.descriptionPredicateRes, "");
    ret.hashAlgorithm = passwordMaker._getLiteral(subjectRes, passwordMaker.hashAlgorithmLBPredicateRes, passwordMaker.DEFAULT_HASHALG);
    ret.whereLeet = passwordMaker._getLiteral(subjectRes, passwordMaker.whereLeetLBPredicateRes, passwordMaker.DEFAULT_LEET);
    ret.leetLevel = passwordMaker._getLiteral(subjectRes, passwordMaker.leetLevelLBPredicateRes, passwordMaker.DEFAULT_LEET_LEVEL);
    ret.passwordLength = passwordMaker._getLiteral(subjectRes, passwordMaker.passwordLengthPredicateRes, passwordMaker.DEFAULT_LENGTH);
    if (subjectRes == passwordMaker.defaultAccount.subjectRes) {
      ret.protocol = passwordMaker._getLiteral(subjectRes, passwordMaker.protocolCBPredicateRes, passwordMaker.DEFAULT_PROTOCOL);
      ret.subdomain = passwordMaker._getLiteral(subjectRes, passwordMaker.subdomainCBPredicateRes, passwordMaker.DEFAULT_SUBDOMAIN);
      ret.domain = passwordMaker._getLiteral(subjectRes, passwordMaker.domainCBPredicateRes, passwordMaker.DEFAULT_DOMAIN);
      ret.path = passwordMaker._getLiteral(subjectRes, passwordMaker.pathCBPredicateRes, passwordMaker.DEFAULT_PATH);
    }
    else {
      //ret.urlToMatch = passwordMaker._getLiteral(subjectRes, passwordMaker.urlToMatchPredicateRes, "");
      ret.urlToUse = passwordMaker._getLiteral(subjectRes, passwordMaker.urlToUsePredicateRes, passwordMaker.DEFAULT_URLTOUSE); 
    }
    ret.charset = passwordMaker._getLiteral(subjectRes, passwordMaker.charsetPredicateRes, passwordMaker.DEFAULT_CHARSET);
    ret.prefix = passwordMaker._getLiteral(subjectRes, passwordMaker.prefixPredicateRes, passwordMaker.DEFAULT_PREFIX);
    ret.suffix = passwordMaker._getLiteral(subjectRes, passwordMaker.suffixPredicateRes, passwordMaker.DEFAULT_SUFFIX);
    ret.username = passwordMaker._getLiteral(subjectRes, passwordMaker.usernameTBPredicateRes, passwordMaker.DEFAULT_USERNAME);
    ret.counter = passwordMaker._getLiteral(subjectRes, passwordMaker.counterPredicateRes, passwordMaker.DEFAULT_COUNTER);
    ret.autoPopulate = passwordMaker._getLiteral(subjectRes, passwordMaker.autoPopulatePredicateRes, passwordMaker.DEFAULT_AUTOPOPULATE);
    ret.masterPasswordHash = PwdMkr_RDFUtils.getTarget(subjectRes, "mpwHash2", null); // appended "2" because value used in 1.7 betas isn't compatible with 1.7
    ret.masterPasswordSalt = PwdMkr_RDFUtils.getTarget(subjectRes, "mpwSalt2", null);  // appended "2" because value used in 1.7 betas isn't compatible with 1.7
    return ret;  
  },
  
  /**
   * Generate the site-specific password and return it. If there are any
   * problems, return null.
   */
  _generateSiteSpecificPassword : function(subjectRes) {

    var decryptedMasterPassword = PwdMkr_MPW.getDecryptedMPW(passwordMaker.mpw, subjectRes);
    if (decryptedMasterPassword == null)
      return null; // user might simply have hit the cancel button when prompted.

    var ret = passwordMaker.readAccountSettings(subjectRes);

    var uri = "";
    if (subjectRes == passwordMaker.defaultAccount.subjectRes) {
      // Determine which part(s) of the URI to use in the password generation algorithm
      uri = passwordMaker.calculateURI(ret.protocol == "true",
              ret.subdomain == "true",
              ret.domain == "true",
              ret.path == "true", //@TODO: change this to port when supported in the GUI
              ret.path == "true");                                        
    }
    else
      uri = ret.urlToUse;

    // Generate the site-specific password
    ret = passwordMaker.generatepassword(ret.hashAlgorithm, decryptedMasterPassword,
                          uri + ret.username + ret.counter, ret.whereLeet, ret.leetLevel,
                          ret.passwordLength, ret.charset, ret.prefix, ret.suffix);

    // Proactively delete sensitive data
    PwdMkr_MPW.wipe(decryptedMasterPassword);
    return ret; 
  },
      
  /**
   * Find account matches by URL
   */
  _matchByURL : function(url, useDefaultIfNoMatch, onlyAutoPopAccounts) {
    var matches = {accounts: new Array(), popUserPass: false, popOthers: false};
    for (var i=0; url && i<passwordMaker.allAccounts.length; i++) { // todo: move |url| out of this expr so it's not evaluated everytime
      var pArray = passwordMaker.allAccounts[i].patternsArray;
    	if (!pArray) continue;
	    for (var j=0; j<pArray.length; j++) {
	      if (!pArray[j].enabled || !pArray[j].regex) continue;  // skip if the pattern is disabled or for some reason the regex is null
	      if (pArray[j].regex.test(url)) {
  	      if (onlyAutoPopAccounts) {
    	      var push = false;
      	    if (passwordMaker.allAccounts[i].autoPop) {          
        	    push = true;
          	  if (!matches.popUserPass)
            	  matches.popUserPass = true;
	          }
  	        if (passwordMaker.allAccounts[i].fields) {
    	        push = true;
      	      if (!matches.popOthers)
        	      matches.popOthers = true;
	          }
  	        if (push)
    	        matches.accounts[matches.accounts.length] = passwordMaker.allAccounts[i];
      	  }
        	else
          	matches.accounts[matches.accounts.length] = passwordMaker.allAccounts[i];
	      }
	    }
    }
    if (matches.accounts.length == 0 && useDefaultIfNoMatch) {
      matches.popUserPass = passwordMaker.defaultAccount.autoPop;
      matches.popOthers = passwordMaker.defaultAccount.fields; 
      matches.accounts[0] = passwordMaker.defaultAccount;
    }
    return matches;
  },
  
  _populateUsernames : function(unFields, aMatch, action) {
    var username = PwdMkr_RDFUtils.getTarget(aMatch.subjectRes, passwordMaker.usernameTBPredicateRes);
    if (!username)
      return; // does this ever happen?
    var pop = action == "coolkey-pop-all" || (action == "pageload-pop-all" && aMatch.autoPop) || action == "context-click";
    for (var i=0; i<unFields.length; i++) {
      if (pop || (action == "coolkey-empty-only" && unFields[i].field.value == ""))
        unFields[i].field.value = username;
    }
  },

  /**
   * Populate password fields with the generated password.
   */
  _populatePasswords : function(pwFields, aMatch, action) {
    var pw;
    var pop = action == "coolkey-pop-all" || (action == "pageload-pop-all" && aMatch.autoPop) || action == "context-click";    
    for (var i=0; i<pwFields.length; i++) {
      if (pop || (action == "coolkey-empty-only" && pwFields[i].field.value == "")) {
        // generate the password for this page if it hasn't already been generated
        if (!pw) {
          pw = passwordMaker._generateSiteSpecificPassword(aMatch.subjectRes);
          if (!pw) // user clicked cancel when prompted for mpw
            return false;
        }
        pwFields[i].field.value = pw;
      }
    }
    return true;
  },
  
  /**
   * "allFields" here really just means "all populatable fields".
   * This method could be shortened with Javascript 1.6 array extras
   * if we didn't have to support Mozilla 1.7 and Netscape 8!
   */
  _populateOthers : function(allFields, aMatch, action) {
    // Reset the popped properties
    for (var j=0; j<aMatch.fields.length; j++)
      aMatch.fields[j].popped = false;
  
    var pop = action == "context-click" || action == "coolkey-pop-all" || "pageload-pop-all";
    for (var i=0; i<allFields.length; i++) {
      for (var j=0; j<aMatch.fields.length; j++) {
        if (allFields[i].fieldname == aMatch.fields[j].fieldname && 
            allFields[i].formname == aMatch.fields[j].formname && 
            allFields[i].fieldtype == aMatch.fields[j].fieldtype &&
            allFields[i].fieldid == aMatch.fields[j].fieldid) {
          switch (allFields[i].fieldtype.toString().toLowerCase()) {
            case "text":
            case "textarea":
              if (pop || (action == "coolkey-empty-only" && allFields[i].field.value == "")) {
                // These fields might have been converted to 
                allFields[i].field.value = aMatch.fields[j].fieldkey ? 
                  PwdMkr_MPW.decrypt(aMatch.fields[j].fieldvalue, aMatch.fields[j].fieldkey) :
                  aMatch.fields[j].fieldvalue;
              }
              break;
            case "password":
              if (pop || (action == "coolkey-empty-only" && allFields[i].field.value == ""))
                allFields[i].field.value = PwdMkr_MPW.decrypt(aMatch.fields[j].fieldvalue, aMatch.fields[j].fieldkey);
              break;
            case "checkbox":
              allFields[i].field.checked = aMatch.fields[j].fieldvalue == "checked";
              break;
            case "radio":
              // Check only the radiobox whose value is correct. Uncheck the others.
              allFields[i].field.checked = allFields[i].field.value == aMatch.fields[j].fieldvalue;
              break;
            case "select":
              if (pop || (action == "coolkey-empty-only" && allFields[i].field.selectedIndex == -1))              
                allFields[i].field.value = aMatch.fields[j].fieldvalue;
              break;
          }
          aMatch.fields[j].popped = true;
        }
      }
    }
    // Anything unpopped and requires user notification?
    // If action == "context-click", user only wanted to populate 1 specific field so don't bother him with notification    
    if (action != "context-click") {
      var notify = new Array();
      for (var j=0; j<aMatch.fields.length; j++) {
        if (!aMatch.fields[j].popped && aMatch.fields[j].fieldnotification)
          notify[notify.length] = aMatch.fields[j];
      }
      if (notify.length)
        window.openDialog("chrome://passwdmaker/content/unpopped.xul", "",
          "chrome, dialog, modal, resizable=yes", {inn:{passwordMaker:passwordMaker,fieldsArray:notify}}).focus();
    }
  },

  _submit : function() {
  },
  
  _promptUserToChooseAccount : function(matches) {
    if (matches.length > 1) {
      // There are multiple accounts for this URL. Prompt the user for which one to use
      var params = {inn:{matches:matches, passwordMaker:passwordMaker}, out:null};
      window.openDialog("chrome://passwdmaker/content/chooseaccount.xul", "",
          "chrome, dialog, modal, resizable=yes", params).focus();
      return params.out ?         
        params.out.selection: // User clicked OK
        null;  // User clicked cancel
    }
    else
      return matches[0];
  },

  /**
   * Open the main PasswordMaker dialog
   */
  open : function() {
    // If there's a passwordmaker dialog window already open,
    // just focus it and return.
    var wnd = passwordMaker.findWindow();
    if (wnd) {
      try {
        wnd.focus();
      }
      catch (e) {
        // nsIFilePicker dialog is open. Best we can do is flash the window.
        wnd.getAttentionWithCycleCount(4);
      }
    }
    else {
      // Open passwordmaker dialog.
      // We don't really need a 10 msec delay here, but this lets us
      // easily re-use all the code in the _open() method.
      setTimeout(passwordMaker._open, 10);
    }
  },
  
  /**
   * Find and return the PasswordMaker dialog if it's open (or null if it's not)
   */
  findWindow : function() {
    var windowManager =
      Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
    var passwordMakerWindow =
      windowManager.getMostRecentWindow("passwordmaker");

    if (passwordMakerWindow) {
      var enumerator = windowManager.getEnumerator(null);
      while (enumerator.hasMoreElements()) {
        var win = enumerator.getNext();
        var winID = win.document.documentElement.id;
        if (winID == "commonDialog" && win.opener == passwordMakerWindow)
          return win;
      }
      return passwordMakerWindow;
    }
    return null;
  },

  /**
   * setTimeout() callback function.
   */
  _open : function() {
    // Basic options dialog is resizable because we open it with
    // a specific size in pixels (how to specify in ems?) The entire
    // dialog contents use ems, but if we open in pixels it could look
    // weird on some resolutions/font sizes, so we give the user the
    // option to resize it. Opening the dialog in ems would get around
    // this problem and we could make resizable false.
    passwordMaker.dlg = window.open("chrome://passwdmaker/content/options.xul", "", "minimizable,dialog,chrome,resizable");
    passwordMaker.dlg.focus();
  },

  /**
   * Switch from basic options to advanced, or vice-versa.
   * Update the preferences.
   */
  toggleOptionsDialog : function() {
    this.advancedOptionsDialog = this.advancedOptionsDialog == "true" ? "false" : "true";
    PwdMkr_RDFUtils.updateTarget(passwordMaker.globalSettingsSubjectRes, "advancedOptionsDialog", this.advancedOptionsDialog);
  },

  /**
   * Called by calculateURI()
   */
  _parseURI : function(aURI) {
    var temp = aURI.match("([^://]+://)([^/:]*):?([0-9]*)(.*)");  // \d isn't working in place of [0-9], why not?
    if (!temp)
      throw this;
    return { protocol: temp[1],
             domains : temp[2].split("."), // temp[2] is the url without protocol, port, path, query parms, anchor
             port    : temp[3],
             path    : temp[4]};
  },

  getURI : function() {
    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
    var recentWindow = wm.getMostRecentWindow("navigator:browser");
    if (recentWindow)
      return new String(recentWindow.content.document.location);
    else
      return "";
  },

  calculateURI : function(includeProtocol, includeSubdomain, includeDomain, includePort, includePath, aURI) {
    if (!aURI)
      aURI = passwordMaker.getURI();
      
    if (includeProtocol && includeSubdomain && includeDomain && includePath && includePath)
      return aURI;

    if (!includeProtocol && !includeSubdomain && !includeDomain && !includePath && !includePath)
      return "";
    
    var uriComponents;
    try {
      uriComponents = this._parseURI(aURI);
    }
    catch (e) {
      return aURI; // aURI isn't parsable; e.g., about:config, javascript:, about:blank
    }

    var ret = includeProtocol ? uriComponents.protocol : ""; // set the protocol or empty string

    // Check if, for example, domains['co.uk'] == true
    var TLDrequiresSLD = eval("passwordMaker.domains['" + uriComponents.domains[uriComponents.domains.length-2] + "." +
                            uriComponents.domains[uriComponents.domains.length-1] + "']");


    // TODO: logic for third-level domains !

    if (includeSubdomain) {
      // The subdomains are all domains except the final two, unless
      // the TLD is a ccTLD which requires a SLD. In the latter case,
      // the subdomains are all domains except the final three.
      var len = TLDrequiresSLD ? uriComponents.domains.length-3 : uriComponents.domains.length-2;
      for (var i=0; i<len; i++) {
        ret += uriComponents.domains[i];
        // Add a dot if this isn't the final subdomain
        if (i+1 < len)
          ret += ".";
      }			
    }

    if (includeDomain) {
      if (ret != "" && ret[ret.length-1] != "." && ret[ret.length-1] != "/")
        ret += ".";

      if (uriComponents.domains.length == 1) {
        // e.g., localhost (no .com or other domains)
        ret += uriComponents.domains[0];
      }
      else {
        // The domain for a ccTLD which requires SLD is really SLD+ccTLD;
        // e.g., ac.uk instead of just .uk
        if (TLDrequiresSLD)
          ret += uriComponents.domains[uriComponents.domains.length-3] + ".";
        ret += uriComponents.domains[uriComponents.domains.length-2] + "." + uriComponents.domains[uriComponents.domains.length-1];
      }
    }

    if (includePort)
      ret += ":" + uriComponents.port;

    if (includePath)
      ret += uriComponents.path;

    return ret;
  },
  
  onFocus : function() {
    //var wnd = this.findWindow();
    //if (wnd)   
      //wnd.updateUsingURL();
  },
  
  refresh : function() {
    PwdMkr_RDFUtils.datasource.QueryInterface(Components.interfaces.nsIRDFRemoteDataSource);
    PwdMkr_RDFUtils.datasource.Refresh(true);
    passwordMaker.init();
  },

  /**
   * Generate the password from the key, a hash algorithm,
   * and (optionally) applying l33t speak afterwards. If we're
   * using an HMAC algorithm, we need a key and data, not just a key.
   */
  _generatepassword : function(hashAlgorithm, key, data, whereToUseL33t, l33tLevel, passwordLength, charset, prefix, suffix) {
    
    // Never *ever, ever* allow the charset's length<2 else
    // the hash algorithms will run indefinitely
    if (charset == null || charset.length < 2)
      charset = passwordMaker.DEFAULT_CHARSET;
    if (hashAlgorithm.indexOf("0.6") > -1)
      charset = "0123456789abcdef";
  
    /*dump("Generating password for:\n");
    dump("   hashAlgorithm=" + hashAlgorithm + "\n");
    dump("   key=" + key + "\n");
    dump("   data=" + data + "\n");
    dump("   whereToUseL33t=" + whereToUseL33t + "\n");
    dump("   l33tLevel=" + l33tLevel + "\n");
    dump("   passwordLength=" + passwordLength + "\n");
    dump("   charset=" + charset + "\n");
    dump("   prefix=" + prefix + "\n");
    dump("   suffix=" + suffix + "\n");*/
  
    // for non-hmac algorithms, the key is master pw and url concatenated
    var usingHMAC = hashAlgorithm.indexOf("hmac") > -1;
    if (!usingHMAC)
      key += data; 
  
    // apply l33t before the algorithm?
    if (whereToUseL33t == "both" || whereToUseL33t == "before-hashing") {
      key = PasswordMaker_l33t.convert(l33tLevel, key);
      if (usingHMAC)
        data = PasswordMaker_l33t.convert(l33tLevel, data); // new for 0.3; 0.2 didn't apply l33t to _data_ for HMAC algorithms
    }
  
    // apply the algorithm
    var password;
    switch(hashAlgorithm) {
      case "sha256":
        password = PasswordMaker_SHA256.any_sha256(key, charset);
        break;
      case "hmac-sha256":
        password = PasswordMaker_SHA256.any_hmac_sha256_bug(key, data, charset);
        break;
      case "hmac-sha256-fixed":
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
      case "md5-v0.6":
        password = PasswordMaker_MD5_V6.hex_md5(key);
        break;      
      case "hmac-md5":
        password = PasswordMaker_MD5.any_hmac_md5(key, data, charset);
        break;
      case "hmac-md5-v0.6":
        password = PasswordMaker_MD5_V6.hex_hmac_md5(key, data);
        break;       
      case "rmd160":
        password = PasswordMaker_RIPEMD160.any_rmd160(key, charset);
        break;
      case "hmac-rmd160":
        password = PasswordMaker_RIPEMD160.any_hmac_rmd160(key, data, charset);
        break;
      default:
        password = "coding error; contact author";
        return;
    }
  
    // apply l33t after the algorithm? 
    if (whereToUseL33t == "both" || whereToUseL33t == "after-hashing")
      return PasswordMaker_l33t.convert(l33tLevel, password);
    return password;
  },

  /**
   * Wrapper around _generatepassword() which calls it
   * n times in order to support passwords of arbitrary length.
   * Introduced in version 1.3.3.
   */
  generatepassword : function(hashAlgorithm, key, data, whereToUseL33t, l33tLevel, passwordLength, charset, prefix, suffix) {
    var password = "";
    var count = 0;
    while (password.length < passwordLength) {
      // To maintain backwards compatibility with all previous versions of passwordmaker,
      // the first call to _generatepassword() must use the plain "key".
      // Subsequent calls add a number to the end of the key so each iteration
      // doesn't generate the same hash value.
      password += (count == 0) ?
        passwordMaker._generatepassword(hashAlgorithm, key, data, whereToUseL33t, l33tLevel, passwordLength, charset, prefix, suffix) :
        passwordMaker._generatepassword(hashAlgorithm, key + '\n' + count, data, whereToUseL33t, l33tLevel, passwordLength, charset, prefix, suffix);
      count++;
    }
    if (prefix)
      password = prefix + password;
    if (suffix) {
      var pw = password.substring(0, passwordLength-suffix.length) + suffix;
      return pw.substring(0, passwordLength);
    }
    //dump("   generated password=" + password.substring(0, passwordLength) + "\n\n");
    return password.substring(0, passwordLength);
  },
  
  /**
   * Launch the native application associated with mailto: links.
   */
  sendMail : function(mailtoUrl) {
    // Copied from browser.js's MailIntegration class
  
    var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
    var uri = ioService.newURI(mailtoUrl, null, null);
  
    // Now pass this url to the operating system
    // a generic method which can be used to pass arbitrary urls to the operating system.
    // aURL --> a nsIURI which represents the url to launch
    var extProtocolSvc = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"].getService(Components.interfaces.nsIExternalProtocolService);
    if (extProtocolSvc)
        extProtocolSvc.loadUrl(uri);
  },

  /**
   * Open URL in a tab in a browser, but re-use an existing tab for a given URL if it's already
   * open (prevents the proliferation of many tabs for the same URL, even if the URL is chrome).
   * This code is used by both the about box and the passwdmaker dialog box.
   *
   * Not fully working.
   */
  openAndReuseOneTabPerURL : function(url) {
    //TODO: use technique at http://forums.mozillazine.org/viewtopic.php?t=343929
    //instead of this stuff which never even worked in both Firefox AND Mozilla...
    
    // I wrote this up at http://kb.mozillazine.org/Reusing_tabs_for_the_same_URL
    
    /*var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
    var browserEnumerator = wm.getEnumerator("navigator:browser");
  
    // Check each browser instance for our URL
    var found = false;
    while (browserEnumerator.hasMoreElements() && !found) {
      var browserInstance = browserEnumerator.getNext().document.getElementById("content"); 
      // Check each tab of this browser instance
      var currentTab, index = 0, numTabs = browserInstance.mPanelContainer.childNodes.length;
      while (index < numTabs && !found) {
        currentTab = browserInstance.getBrowserAtIndex(index);
        if (url == currentTab.currentURI.spec) {
          // The URL is already opened. Select its tab.
          browserInstance.selectedTab = currentTab;
          // Focus *this* browser
          browserInstance.focus();
          found = true;
        }
        index++;
      }
    }
  
    // Our URL isn't open. Open it now.
    if (!found) {
      var recentWindow = wm.getMostRecentWindow("navigator:browser");
      if (recentWindow) {
        // Use an existing browser window
        recentWindow.delayedOpenTab(url);
      }
      else {
        // No browser windows are open, so open a new one.
        window.open(url);
      }
    }*/
    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
    var recentWindow = wm.getMostRecentWindow("navigator:browser");
    if (recentWindow) {
      // Use an existing browser window
      //recentWindow.delayedOpenTab(url);
      recentWindow.gBrowser.selectedTab = recentWindow.gBrowser.addTab(url);
      return recentWindow.gBrowser.selectedTab;    
    }
    else {
      // No browser windows are open, so open a new one.
      return window.open(url);
    }
  },
  
  /**
   * Function for displaying dialog box with yes/no buttons (not OK/Cancel buttons),
   * or any arbitrary button labels.
   */
  ask : function(parent, text, btn1Text, btn2Text) {
    if (!btn1Text)
      btn1Text = this.stringBundle.GetStringFromName("passwdmaker.ask.01");
    if (!btn2Text)
      btn2Text = this.stringBundle.GetStringFromName("passwdmaker.ask.02");
    return passwordMaker.prompts.confirmEx(parent, "PasswordMaker", text,
      passwordMaker.prompts.BUTTON_TITLE_IS_STRING * passwordMaker.prompts.BUTTON_POS_0 +
      passwordMaker.prompts.BUTTON_TITLE_IS_STRING * passwordMaker.prompts.BUTTON_POS_1,
      btn1Text, btn2Text, null, null, {}) == 0; // 0 means first button ("yes") was pressed
  },

  /**
   * Icon moving code (workaround for EM bug 242757).
   * This makes our icon appear on our dialog window
   * (otherwise the default icon is used).
   *
   * Windows And Linux only for now. Not sure what is needed for OSX.
   *
   * Thanks go out to asqueella and JedBrown for the QuickNote extension
   * and this help:
   * http://forums.mozillazine.org/viewtopic.php?t=219952
   */
  installIcons : function() {
    var iconFileName;
    var platform = navigator.platform.toLowerCase();
  
    if (platform.indexOf("win32") != -1)
      iconFileName = "passwordmakerdlg.ico";
    else if (platform.indexOf("linux") != -1)
      iconFileName = "passwordmakerdlg.xpm";
    else
      iconFileName = "passwordmakerdlg.ico"; // don't know what yet to do on Mac and other platforms
  
    // Target directory for icons is %MozDir%/chrome/icons/default/
    var destDir = PWDMKRDirIO.get("AChrom");
    destDir.append("icons");
    destDir.append("default");
  
    var destFile = destDir.clone();
    destFile.append(iconFileName);
  
    // Original file is at %Profile%/extensions/{5872365E-67D1-4AFD-9480-FD293BEBD20D}/defaults/_filename_
    var origDir = PWDMKRDirIO.get("ProfD");
    origDir.append("extensions");
    origDir.append("{5872365E-67D1-4AFD-9480-FD293BEBD20D}");
    origDir.append("defaults");
    var origFile = origDir.clone();
    origFile.append(iconFileName);
    passwordMaker.installFile(destFile, destDir, origFile);
  },
  
  installFile : function(destFile, destDir, origFile) {
    try {
      if (!destFile.exists() && origFile.exists())
        origFile.copyTo(destDir, null);
    }
    catch (e) {
      dump(e);
    }
  },
	
 	PFF : " ",
 	getDefaultPath : function() {
    var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
    var dir = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsILocalFile);
    file.initWithPath(dir.path);
    file.appendRelativePath("passwordmaker.rdf"); 
    return file; 
  },
 	
  getSettingsURI : function(type) {
    var o = null;
    try {
      o = PasswordMakerPrefsWrapper.getChar("settings");
    }
    catch(e) {}
    if (o) {
      o == this.PFF && (o = this.getDefaultPath());
      var file = this.transformer(o, Components.interfaces.nsIFile);
    }
    else {
      // Default settings file/path
  	  o = this.setSettingsURI(this.getDefaultPath());
    }
    return this.transformer(o, type);
  },

  setSettingsURI : function(o) {
    var o2 = this.transformer(o, "uri-string");
    try {
  	  this.writeSettings(o2);
  	  // Only update the preference if writeSettings() succeeded
		 var prefsService = Components.classes["@mozilla.org/preferences-service;1"].
		      getService(Components.Interfaces.nsIPrefService).getBranch("extensions.passwordmaker.");		   	  
      prefsService.setCharPref("settings", o==this.PFF ? this.PFF : o2);  	  
    }
    catch(e) {
      this.prompts.alert(this, "Error:\n\n" + e);
    }
    return o==this.PFF ? this.PFF : o2;
  },

  isUsingPFF : function() {
    return PasswordMakerPrefsWrapper.getChar("settings") == this.PFF;
  },
  
  sprintf : function() {
    var text = arguments[0];
    for(var i = 1; i < arguments.length; i++) {
      var pattern = "\\{" + (i-1) + "\\}"; 
      text = text.replace(new RegExp(pattern, "g"), arguments[i]); 
    }
    return text;
  }
};
