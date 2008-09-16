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

var username, password, url, webDAV, autoDownload, autoUpload, autoUploadWhenDirty, merge,
  backupDir, filePattern, name, description, passwordMaker;

function onLoad() {
  name = document.getElementById("name");
  description = document.getElementById("description");  
  username = document.getElementById("username");
  password = document.getElementById("password");  
  url = document.getElementById("url");
  webDAV = document.getElementById("webDAV");  
  autoDownload = document.getElementById("autoDownload");    
  autoUpload = document.getElementById("autoUpload");
  autoUploadWhenDirty = document.getElementById("autoUploadWhenDirty");  
  merge = document.getElementById("merge");
  backupDir = document.getElementById("backupDir");
  filePattern = document.getElementById("filePattern");
  
  passwordMaker = window.arguments[0].inn.passwordMaker;
  
  name.value = window.arguments[0].inn.name;
  description.value = window.arguments[0].inn.description;          
  url.value = window.arguments[0].inn.url;
  username.value = window.arguments[0].inn.username;    
  password.value = window.arguments[0].inn.password;            
  webDAV.checked = window.arguments[0].inn.webDAV;            
  autoDownload.checked = window.arguments[0].inn.autoDownload;            
  autoUpload.checked = window.arguments[0].inn.autoUpload;            
  autoUploadWhenDirty.checked = window.arguments[0].inn.autoUploadWhenDirty;            
  merge.checked = window.arguments[0].inn.merge;            
  backupDir.value = window.arguments[0].inn.backupDir;            
  filePattern.value = window.arguments[0].inn.filePattern; 

  enableCredentials();
}

function onOK() {
  window.arguments[0].out = {name:name.value, description:description.value,
    url:url.value, username:username.value, password:password.value,
    webDAV:webDAV.checked, autoDownload:autoDownload.checked,
    autoUpload:autoUpload.checked, autoDownloadWhenDirty:autoUploadWhenDirty.checked,
    merge:merge.checked, backupDir:backupDir.value, filePattern:filePattern.value};
  return true;
}

function onSetBackupDir() {
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, passwordMaker.stringBundle.GetStringFromName("remotesettings.onSetBackupDir.01"), nsIFilePicker.modeGetFolder);
    if (fp.show() == nsIFilePicker.returnOK)
      backupDir.value = fp.file.path;
}

function onBackup() {
  PwdMkr_UpDownUtils.doBackup(backupDir.value, filePattern.value);
}

function onUpdownload(action, fromAdvancedOptions)	{

  var _url, _username, _password, _webDAV, _backupDir, _filePattern;
  if (fromAdvancedOptions) {
    var params = getSelectedSettings(getActiveTreeInfo(), getTreeCells(remotesTree));
    _url = params.inn.url;
    _username = params.inn.username;
    _password = params.inn.password;
    _webDAV = params.inn.webDAV;
    _backupDir = params.inn.backupDir;
    _filePattern = params.inn.filePattern;    
  }
  else {
    _url = url.value;
    _username = username.value;
    _password = password.value;
    _webDAV = webDAV.checked;
    _backupDir = backupDir.value;
    _filePattern = filePattern.value;
  }	
	var enable = true;
	try {
		var uri = PwdMkr_UpDownUtils.buildURI(_url, _username, _password, _webDAV);
		if (!uri) {
			passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("remotesettings.onUpdownload.01"));
			return;
		}

		if (action == "upload") {
		  passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("remotesettings.onUpdownload.02"));
			PwdMkr_Uploader.start(_getRDFAsString(), uri, uploadCallback);
			enable = false;
	  }
		else {
		  if (!passwordMaker.ask(this, passwordMaker.stringBundle.GetStringFromName("remotesettings.onUpdownload.03")))
 		    return;
		  var ret = PwdMkr_UpDownUtils.doBackup(_backupDir, _filePattern);
		  if (typeof(ret) == "object") {
		    passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.sprintf(passwordMaker.stringBundle.GetStringFromName("remotesettings.onUpdownload.04"), ret.src, ret.dest));
 		    return;
		  }
			if (_webDAV || uri.scheme.indexOf("ftp") == 0)
				PwdMkr_Downloader.start(uri, downloadCallback);
			else {
				var req = new XMLHttpRequest();
				req.open("GET", uri.spec, false);
				req.send(null);
				downloadCallback(null, req.status == 200 ? "0" : req.status, req.responseXML);
			}
		}
	}
	catch(e) {
  	passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.sprintf(passwordMaker.stringBundle.GetStringFromName("remotesettings.onUpdownload.05"), e));
	}
	finally {
		if (enable)
			enableScreen();
	}
}
	
function uploadCallback(step, status) {
	if (step == "done") {
		var msg = status == 0 ? passwordMaker.stringBundle.GetStringFromName("remotesettings.uploadCallback.01") : passwordMaker.sprintf(passwordMaker.stringBundle.GetStringFromName("remotesettings.uploadCallback.02"), status.toString(16));
		passwordMaker.prompts.alert(this, "PasswordMaker", msg);
	}
	
//	document.getElementById("downloadCmd").disabled = 
	//  document.getElementById("uploadCmd").disabled = false;
}

function downloadCallback(step, status, dom) {
  if (status != 0) {
    passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.sprintf(passwordMaker.stringBundle.GetStringFromName("remotesettings.downloadCallback.01"), status.toString(16)));
    return;
  }
  if (PwdMkr_Downloader.data == null && dom == null) {
    passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("remotesettings.downloadCallback.02"));
    return;
  }
  try {
    if (dom == null) {
      var parser = new DOMParser();
      dom = parser.parseFromString(PwdMkr_Downloader.data, "text/xml");
    }
    if (dom.documentElement.nodeName == "parsererror")
      passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("remotesettings.downloadCallback.03"));
    else {
      var serializer = new XMLSerializer();
      var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
                     .createInstance(Components.interfaces.nsIFileOutputStream);
      var file = Components.classes["@mozilla.org/file/directory_service;1"]
                 .getService(Components.interfaces.nsIProperties)
                 .get("ProfD", Components.interfaces.nsIFile); // get profile folder
      file.append("passwordmaker.rdf");   // filename
      if (file.exists())
        file.remove(false); 
      foStream.init(file, 0x02 | 0x08 | 0x20, 0664, 0);   // write, create, truncate
      serializer.serializeToStream(dom, foStream, "");   // rememeber, doc is the DOM tree
      foStream.close();
      
      passwordMaker.refresh();
      init();  // in passwordMakerOverlay.js     
      passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("remotesettings.downloadCallback.04"));      
    }
  }
  catch(e) {
    passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.sprintf(passwordMaker.stringBundle.GetStringFromName("remotesettings.downloadCallback.05"), e));
  }
  finally {
//  	document.getElementById("downloadCmd").disabled = 
  //	  document.getElementById("uploadCmd").disabled = false;	
  }
}
	
function enableCredentials() {
	var isHttp = url.value.match(/^https?:\/\//) != null;
	webDAV.disabled = !isHttp;
	username.disabled = password.disabled =	(isHttp && !webDAV.checked) ||
  	(!isHttp && !url.value.match(/^ftp:\/\//));
}
function enableScreen() {
}

function _getRDFAsString() {
  var file = PWDMKRDirIO.get("ProfD"); // %Profile% dir
  file.append("passwordmaker.rdf");
  return PWDMKRFileIO.read(file);
}
