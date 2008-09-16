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
var passwordMaster, passwordMaster2, passwordStorageLB, confirmationRow, passwordSalt, passwordHash, hashFunction,
  passwordMaker; // do not make local to onOK()--used in onPasswordStorageLBChanged();

function onOK() {
  if (!confirmationRow.hidden && (passwordMaster.value != passwordMaster2.value)) {
    // mpw and mpw confirmation don't match
    passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("passwordprompt.onOK.01"));
    passwordMaster.value = passwordMaster2.value = "";
    passwordMaster.focus();
    return false;
  }
  else if (passwordMaster.value == "") {
    // mpw can't be empty
    passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("passwordprompt.onOK.02"));
    return false;
  }
  else if (passwordHash) {
    // does the entered password's hash match the stored hashed value?
    var newHash = hashFunction(passwordMaster.value, passwordSalt);
    if (newHash != passwordHash) {
       passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("passwordprompt.onOK.03"));
       passwordMaster.value = "";
       passwordMaster.focus();
       return false;
    }
  }

  window.arguments[0].out = {};
  window.arguments[0].out.masterPassword = passwordMaster.value;
  window.arguments[0].out.passwordStorage = passwordStorageLB.value;
  return true;
}

function onload() {
  passwordMaker = window.arguments[0].inn.passwordMaker;
  passwordMaster = document.getElementById("passwordMaster");
  passwordMaster2 = document.getElementById("passwordMaster2");
  passwordStorageLB = document.getElementById("passwordStorageLB");
  confirmationRow = document.getElementById("confirmationRow");

  // for options.js to work
  // Get references to the UI elements
  passwordGenerated = document.getElementById("passwordGenerated");
  createTreeFolderBtn = document.getElementById("createTreeFolderBtn");
  newAccountCmd = document.getElementById("newAccountCmd");
  usingURL = document.getElementById("usingURL");

  passwordStorageLB.value = window.arguments[0].inn.passwordStorageLBValue;

  // Show MPW confirmation?
  confirmationRow.hidden =
    passwordMaker._getLiteral(passwordMaker.globalSettingsSubjectRes, passwordMaker.confirmMPWPredicateRes) != "true";

  // Get data that permits us to check if the user-supplied
  // password equals the expected MPW
  passwordSalt = window.arguments[0].inn.salt;
  passwordHash = window.arguments[0].inn.hash;
  hashFunction = window.arguments[0].inn.hashFunction;

  // Now check if the hash should be from the specific account
  if (window.arguments[0].inn.settings.masterPasswordHash) {
    passwordHash = window.arguments[0].inn.settings.masterPasswordHash;
    passwordSalt = window.arguments[0].inn.settings.masterPasswordSalt;
  }

  if (passwordHash) {
    confirmationRow.hidden = true;
  }

  var settings = window.arguments[0].inn.settings;
  if (settings) {
    var accountsTree = document.getElementById("accountsTree");
    accountsTree.view = {
      rowCount : 1,
      getCellText : function(row, column){
        var s = column.id ? column.id : column;
        switch(s) {
          case "nameCol":return settings.name;
          case "descriptionCol":return settings.description;
          case "usernameCol":return settings.username;
          case "whereLeetLBCol":return settings.whereLeet;
          case "leetLevelLBCol":return settings.leetLevel;
          case "hashAlgorithmLBCol":return settings.hashAlgorithm;
          case "passwordLengthCol":return settings.passwordLength;
          case "urlToUseCol":return settings.urlToUse ? settings.urlToUse : "";
          case "counterCol":return settings.counter;
          case "autoPopulateCol":return settings.autoPopulate;
          case "charsetCol":return settings.charset;
          case "prefixCol":return settings.prefix;
          case "suffixCol":return settings.suffix;
        }
      },
      isSeparator: function(aIndex) { return false; },
      isSorted: function() { return false; },
      isContainer: function(aIndex) { return false; },
      setTree: function(aTree){},
      getImageSrc: function(aRow, aColumn) {return null;},
      getProgressMode: function(aRow, aColumn) {},
      getCellValue: function(aRow, aColumn) {},
      cycleHeader: function(aColId, aElt) {},
      getRowProperties: function(aRow, aColumn, aProperty) {},
      getColumnProperties: function(aColumn, aColumnElement, aProperty) {},
      getCellProperties: function(aRow, aProperty) {},
      getLevel: function(row){ return 0; }
    };
  }
  else
    document.getElementById("accountsTreeBox").hidden = true;
  sizeToContent();
  // When placed here, passwordMaster.focus() doesn't work with FF 2.0.0.10 and 2.0.0.11.
  // Work-around is to use setTimeout().
  setTimeout("document.getElementById('passwordMaster').focus()", 0);
}


