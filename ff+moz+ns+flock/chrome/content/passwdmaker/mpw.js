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

function MasterPassword(encryptedMasterPassword, key) {
  this.encryptedData = encryptedMasterPassword;
  this.key = key;
}

var PwdMkr_MPW = {

  wipe : function(o) {
    delete o;
  },
  
  /**
   * Make a string of 32 pseudo-random characters and return it.
   * This string is used as the key with which to encrypt the MPW.
   */
  _makeKey32 : function() {
    var ret = "";
    while (ret.length < 32) {
      var rnd = Math.random().toString(16);
      ret += rnd.substring(rnd.lastIndexOf(".") + 1);
    }
    return ret.substring(0, 32);
  },

  /**
   * Returns the decrypted master password string or null.
   * Prompt the user if we don't have a mpw object.
   */
  getDecryptedMPW : function(mpw, subjectRes) {
    return mpw ? 
      this.decrypt(mpw.encryptedData, mpw.key) :
      this._passwordPrompt(subjectRes);
  },

  decrypt : function(encryptedMasterPassword, key) {
    return encryptedMasterPassword && key ? 
      PwdMkr_AES.byteArrayToString(PwdMkr_AES.rijndaelDecrypt(PwdMkr_AES.hexToByteArray(encryptedMasterPassword), PwdMkr_AES.hexToByteArray(key), "CBC")) :
      null;
  },

  storeOrClearMasterPassword : function(action, clearTextMasterPassword, updateUI) {
    PwdMkr_RDFUtils.updateTarget(passwordMaker.globalSettingsSubjectRes, "masterPasswordStorage", action);    
    if (action == "do-not-store" || clearTextMasterPassword == "" || clearTextMasterPassword == null) {
      // Clear any existing master pw (encrypted form) and its key, if one exists.
      // From disk...
      PwdMkr_RDFUtils.removeTarget(passwordMaker.globalSettingsSubjectRes, passwordMaker.masterPasswordPredicateRes);
      PwdMkr_RDFUtils.removeTarget(passwordMaker.globalSettingsSubjectRes, passwordMaker.masterPasswordKeyPredicateRes);
  
      // From memory...
      passwordMaker.setMPW(null, updateUI);
    }
    else {
      // Store the master pw in memory (encrypted form)
      var obj = this.encrypt(clearTextMasterPassword);
      passwordMaker.setMPW(obj, updateUI); // update master pw/key 
  
      if (action == "store-on-disk" && obj) {
        // Store the master pw (encypted form) on disk
        PwdMkr_RDFUtils.updateTarget(passwordMaker.globalSettingsSubjectRes, passwordMaker.masterPasswordPredicateRes, obj.encryptedData);
        PwdMkr_RDFUtils.updateTarget(passwordMaker.globalSettingsSubjectRes, passwordMaker.masterPasswordKeyPredicateRes, obj.key);
      }
    } 
  },

  calculateMPWHash : function (clearTextMPW, salt) {
    return clearTextMPW == null || salt == null ? null :
    	PasswordMaker_SHA256.any_hmac_sha256(clearTextMPW, salt, passwordMaker.DEFAULT_CHARSET);
  },

  storeMPWHash : function(subjRes, clearTextMPW) {
    var salt = this._makeKey32();
    PwdMkr_RDFUtils.updateTarget(subjRes, "mpwSalt2", salt);
    PwdMkr_RDFUtils.updateTarget(subjRes, "mpwHash2", this.calculateMPWHash(clearTextMPW, salt));
  },
  
  clearMPWHash : function(subjRes) {
    PwdMkr_RDFUtils.removeTarget(subjRes, "mpwHash2");
    PwdMkr_RDFUtils.removeTarget(subjRes, "mpwSalt2");    
  },

  encrypt : function(clearText) {
    if (clearText == null || clearText == "")
      return null;
    key = this._makeKey32();
    var encryptedData = PwdMkr_AES.byteArrayToHex(PwdMkr_AES.rijndaelEncrypt(clearText, PwdMkr_AES.hexToByteArray(key), "CBC"));
    return new MasterPassword(encryptedData, key);
  },
  
  /**
   * Prompt user for the master password, ask if he wants to save it, etc.
   * Return the master pw in clear text or null if user cancelled.
   * Also, store the master password in the passwordMaker.mpw variable
   * if the user doesn't want to be prompted anymore.
   */
  _passwordPrompt : function(subjectRes) {
	  dump("value = " + PwdMkr_RDFUtils.getTarget(passwordMaker.globalSettingsSubjectRes, "useMultipleMasterPasswords") == "true");
	  dump("\n");
	  var mpwHashSubjRes = PwdMkr_RDFUtils.getTarget(passwordMaker.globalSettingsSubjectRes, "useMultipleMasterPasswords") == "true" ?
	  	subjectRes : passwordMaker.globalSettingsSubjectRes;
    var params = {inn:{passwordStorageLBValue:
                       PwdMkr_RDFUtils.getTarget(passwordMaker.globalSettingsSubjectRes, passwordMaker.masterPasswordStoragePredicateRes),
                       passwordMaker:passwordMaker,
                       settings:passwordMaker.readAccountSettings(subjectRes),
                       salt:PwdMkr_RDFUtils.getTarget(mpwHashSubjRes, "mpwSalt2"),
                       hash:PwdMkr_RDFUtils.getTarget(mpwHashSubjRes, "mpwHash2"),
                       hashFunction:this.calculateMPWHash,
                      },
                  out:null};

    // Return null or a decrypted password
    window.openDialog("chrome://passwdmaker/content/passwordprompt.xul",
     "", "chrome, dialog, modal, resizable=yes", params).focus();

    if (params.out) {
      PwdMkr_MPW.storeOrClearMasterPassword(params.out.passwordStorage, params.out.masterPassword, true);
      return params.out.masterPassword;
    }
    return null;
  }
};
