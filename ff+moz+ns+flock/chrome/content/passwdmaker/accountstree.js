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

function Match(p, t, n) {
  this.pattern = p;
  this.type = t;
  this.notes = n;
}

Match.prototype.serialize = function(subjectRes, i) {
  PwdMkr_RDFUtils.updateTarget(subjectRes, "pattern"+i, this.pattern);
  PwdMkr_RDFUtils.updateTarget(subjectRes, "patterntype"+i, this.type);
	PwdMkr_RDFUtils.updateTarget(subjectRes, "patterndesc"+i, this.notes);    
}

function onAccountsTreeSelection() {
  if (!onTreeSelection() || accountsTree.view.rowCount == 0)
    return;
  
  var broadcaster = document.getElementById("account-folder-selected");
  // if a folder...  
  if (accountsTree.view.getItemAtIndex(accountsTree.currentIndex).getAttribute("container") == "true") {
    broadcaster.setAttribute("disabled", true);
  }
  else {
    updateUsingURL();
    broadcaster.setAttribute("disabled", false);
  }  
  generatepassword();
}
            
// accounts-tree-specific fcn
function getUrlToUse() {    
  var cells = getTreeCells(accountsTree);
  return accountsTree.currentIndex == 0 ?
    
  // Defaults
  passwordMaker.calculateURI(cells[6].getAttribute("label") == "true", // protocolCB
    cells[7].getAttribute("label") == "true", // subdomainCB
    cells[8].getAttribute("label") == "true", // domainCB
    cells[9].getAttribute("label") == "true", // pathCB
    cells[9].getAttribute("label") == "true") : // pathCB
  
  // A specific account
  cells[10].getAttribute("label"); // urlToUse
}

function onAccountSettings(isNew) {
  var temp = getActiveTreeInfo();
   
  // Get current settings from the UI (we could get them from the RDF instead).
  // If a new account, use the default settings
  var cells;
  var containerRes;
  if (isNew) {
    // Save existing (selected by user) container
    containerRes = temp.subjectRes;       
    temp.subjectRes = PwdMkr_RDFUtils.makeResource(); // create a new res for the new acct
  }
  else {
    cells = getTreeCells(temp.tree);
    if (temp.isContainer) {
      createNewFolder("name", "description", temp.container, temp.subjectRes,
        cells[0].getAttribute("label"), cells[1].getAttribute("label"));
      return;    
    }
  }    
            
  if (temp.isAccounts) {
    if (isNew)
      cells = getTreeCells(temp.tree, 0); // Defaults
     // Only the accounts tree has a "default" account
    var isDefaultsAccount = temp.tree.currentIndex == 0;
    var selTab = PwdMkr_RDFUtils.getTarget(temp.subjectRes, "selectedTabIndex");
    if (!selTab) // For backwards compatibility
      selTab = 0;
    var accountSettings = {isDefaultsAccount : isDefaultsAccount,
      accountName : isNew ? passwordMaker.stringBundle.GetStringFromName("accountsettings.newAccount") : cells[0].getAttribute("label"),
      accountDescription : isNew ? "" : cells[1].getAttribute("label"),
      whereLeetLB : cells[2].getAttribute("label"),
      leetLevelLB : cells[3].getAttribute("label"), hashAlgorithmLB : cells[4].getAttribute("label"),
      passwordLength : cells[5].getAttribute("label"), protocolCB : cells[6].getAttribute("label"),
      subdomainCB : cells[7].getAttribute("label"), domainCB : cells[8].getAttribute("label"),
      pathCB : cells[9].getAttribute("label"),
      //urlToMatch : (isDefaultsAccount ? getUrlToUse(false):(isNew ? passwordMaker.getCalculatedURIUsedForDefault():cells[10].getAttribute("label"))),
      urlToUse : (isDefaultsAccount ? getUrlToUse(false):(isNew ? passwordMaker.getCalculatedURIUsedForDefault():cells[10].getAttribute("label"))),
      usernameTB : cells[11].getAttribute("label"),
      counter : cells[12].getAttribute("label"), charset : cells[13].getAttribute("label"), prefix : cells[14].getAttribute("label"),
      suffix : cells[15].getAttribute("label"), autoPop : cells[16].getAttribute("label"),
      selectedTab:selTab};

    var params = {inn:{accountSettings:accountSettings, passwordMaster:passwordMaster.value,
      passwordMaker:passwordMaker, fieldsArray:passwordMaker.deserializeFields(temp.subjectRes),
      patternsArray:passwordMaker.deserializePatterns(temp.subjectRes)}, out : null};
  
    window.openDialog("chrome://passwdmaker/content/accountsettings.xul", "",
      "chrome, dialog, modal, resizable=yes", params).focus();

    if (params.out) {
      
      // User clicked OK - update datasource
      accountSettings = params.out.accountSettings;
      PwdMkr_RDFUtils.updateTarget(temp.subjectRes, "name", accountSettings.accountName);   
      PwdMkr_RDFUtils.updateTarget(temp.subjectRes, "description", accountSettings.accountDescription);
      PwdMkr_RDFUtils.updateTarget(temp.subjectRes, "whereLeetLB", accountSettings.whereLeetLB);
      PwdMkr_RDFUtils.updateTarget(temp.subjectRes, "leetLevelLB", accountSettings.leetLevelLB);
      PwdMkr_RDFUtils.updateTarget(temp.subjectRes, "hashAlgorithmLB", accountSettings.hashAlgorithmLB);
      PwdMkr_RDFUtils.updateTarget(temp.subjectRes, "passwordLength", accountSettings.passwordLength);
      PwdMkr_RDFUtils.updateTarget(temp.subjectRes, "usernameTB", accountSettings.usernameTB);
      PwdMkr_RDFUtils.updateTarget(temp.subjectRes, "counter", accountSettings.counter);
      PwdMkr_RDFUtils.updateTarget(temp.subjectRes, "charset", accountSettings.charset);
      PwdMkr_RDFUtils.updateTarget(temp.subjectRes, "prefix", accountSettings.prefix);
      PwdMkr_RDFUtils.updateTarget(temp.subjectRes, "suffix", accountSettings.suffix);
      PwdMkr_RDFUtils.updateTarget(temp.subjectRes, "autoPopulate", accountSettings.autoPop ? "true" : "false");
      PwdMkr_RDFUtils.updateTarget(temp.subjectRes, "selectedTabIndex", accountSettings.selectedTab);      
      if (isDefaultsAccount) {
        // The defaults node is selected
        PwdMkr_RDFUtils.updateTarget(temp.subjectRes, "protocolCB", accountSettings.protocolCB ? "true" : "false");
        PwdMkr_RDFUtils.updateTarget(temp.subjectRes, "subdomainCB", accountSettings.subdomainCB ? "true" : "false");
        PwdMkr_RDFUtils.updateTarget(temp.subjectRes, "domainCB", accountSettings.domainCB ? "true" : "false");
        PwdMkr_RDFUtils.updateTarget(temp.subjectRes, "pathCB", accountSettings.pathCB ? "true" : "false");
      }
      else {
        // Don't write urlToUse to the defaults account (it's not relevant)
        PwdMkr_RDFUtils.updateTarget(temp.subjectRes, "urlToUse", accountSettings.urlToUse); 
      }

      if (isNew) {
        // Add the resource to the container (folder)
        PwdMkr_RDFUtils.addToSequence(temp.subjectRes, containerRes);
      }
      updatePatterns(temp.subjectRes, accountSettings.patternsArray);
      updateAutoPopFields(temp.subjectRes, accountSettings.fieldsArray);
      PwdMkr_MPW.wipe(params); // proactive clearing of sensitive data
      if (!temp.isContainer) {
        updateUsingURL();
        generatepassword();
      }
      passwordMaker.cacheAccounts(); // refresh cache
    }      
  }
  else if (temp.isRemotes) {
    onRemoteAccountSettings(temp, cells, isNew, containerRes);
  }
}

function updatePatterns(subjectRes, patternsArray) {
  // Delete any existing patterns
  var i=0;
  while(PwdMkr_RDFUtils.removeTarget(subjectRes, "pattern" + i)) {
    PwdMkr_RDFUtils.removeTarget(subjectRes, "patterntype" + i);
    PwdMkr_RDFUtils.removeTarget(subjectRes, "patternenabled" + i);    
    PwdMkr_RDFUtils.removeTarget(subjectRes, "patterndesc" + i++);
  }
  // Write the new patterns
  if (patternsArray) {
	  for (i=0; i<patternsArray.length; i++) {
  	  PwdMkr_RDFUtils.updateTarget(subjectRes, "pattern"+i, patternsArray[i].pattern);  	  
  	  PwdMkr_RDFUtils.updateTarget(subjectRes, "patterntype"+i, patternsArray[i].type);
  	  PwdMkr_RDFUtils.updateTarget(subjectRes, "patternenabled"+i, patternsArray[i].enabled ? "true" : "false");
  	  PwdMkr_RDFUtils.updateTarget(subjectRes, "patterndesc"+i, patternsArray[i].notes);  	    	  
  	}
  }
}

function updateAutoPopFields(subjectRes, fieldsArray) {
  // First delete any existing fields
  var i=0;
  while(PwdMkr_RDFUtils.removeTarget(subjectRes, "fieldname" + i)) {
    PwdMkr_RDFUtils.removeTarget(subjectRes, "fieldvalue" + i);
    PwdMkr_RDFUtils.removeTarget(subjectRes, "fieldkey" + i); // Only present for password fields
    PwdMkr_RDFUtils.removeTarget(subjectRes, "fieldtype" + i);    
    PwdMkr_RDFUtils.removeTarget(subjectRes, "fieldid" + i);    
    PwdMkr_RDFUtils.removeTarget(subjectRes, "fieldnotification" + i);    
    PwdMkr_RDFUtils.removeTarget(subjectRes, "fielddesc" + i);        
    PwdMkr_RDFUtils.removeTarget(subjectRes, "formname" + i++);    
  }
  // Now write the new fields
  for (i=0; i<fieldsArray.length; i++) {
    PwdMkr_RDFUtils.updateTarget(subjectRes, "formname"+i, fieldsArray[i].formname);
    PwdMkr_RDFUtils.updateTarget(subjectRes, "fieldname"+i, fieldsArray[i].fieldname);
    if (fieldsArray[i].fieldtype == "password" && !fieldsArray[i].fieldkey) {
      var pw = PwdMkr_MPW.encrypt(fieldsArray[i].fieldvalue);
      PwdMkr_RDFUtils.updateTarget(subjectRes, "fieldvalue"+i, pw.encryptedData);
      PwdMkr_RDFUtils.updateTarget(subjectRes, "fieldkey"+i, pw.key);
      PwdMkr_MPW.wipe(pw);
      PwdMkr_MPW.wipe(fieldsArray[i].fieldvalue);
    }
    else {
      PwdMkr_RDFUtils.updateTarget(subjectRes, "fieldvalue"+i, fieldsArray[i].fieldvalue);
	    if (fieldsArray[i].fieldkey) {
	      PwdMkr_RDFUtils.updateTarget(subjectRes, "fieldkey"+i, fieldsArray[i].fieldkey);
	    }
    }
	  PwdMkr_RDFUtils.updateTarget(subjectRes, "fieldnotification"+i, fieldsArray[i].fieldnotification);    
      PwdMkr_RDFUtils.updateTarget(subjectRes, "fielddesc"+i, fieldsArray[i].fielddesc);    
      PwdMkr_RDFUtils.updateTarget(subjectRes, "fieldtype"+i, fieldsArray[i].fieldtype);
      PwdMkr_RDFUtils.updateTarget(subjectRes, "fieldid"+i, fieldsArray[i].fieldid);    
  }
}
