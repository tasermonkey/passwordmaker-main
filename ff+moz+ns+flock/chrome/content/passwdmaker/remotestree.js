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

function onRemotesTreeSelection() {
  if (!onTreeSelection())
    return;
  // if a folder... (or not)
  var disable = remotesTree.view.getItemAtIndex(remotesTree.currentIndex).getAttribute("container") == "true";
  document.getElementById("uploadCmd").setAttribute("disabled", disable);
  document.getElementById("downloadCmd").setAttribute("disabled", disable);
}

function getSelectedSettings(treeInfo, cells) {
  var temp = PwdMkr_RDFUtils.getTarget(treeInfo.subjectRes, "masterPassword");
  var key = PwdMkr_RDFUtils.getTarget(treeInfo.subjectRes, "masterPasswordKey");
  temp = temp && key ? PwdMkr_MPW.decrypt(temp, key) : "";

  params = {inn:{name:cells[0].getAttribute("label"),
    description:cells[1].getAttribute("label"),
    url:cells[2].getAttribute("label"),    
    username:cells[3].getAttribute("label"),    
    password:temp,    
    backupDir:(cells[4].getAttribute("label") == "" ? PWDMKRDirIO.get("TmpD").path : cells[4].getAttribute("label")),
    filePattern:(cells[5].getAttribute("label") == "" ? "passwordmaker.%y.%M.%d.%H.%m.%s.%S.rdf" : cells[5].getAttribute("label")),  
    webDAV:cells[6].getAttribute("label") == "true",    
    autoDownload:cells[7].getAttribute("label") == "true",    
    autoUpload:cells[8].getAttribute("label") == "true",    
    autoUploadWhenDirty:cells[9].getAttribute("label") == "true",                
    merge:cells[10].getAttribute("label") == "true",
    passwordMaker:passwordMaker}, out:null};
  return params;
}

var containerRes;
function onRemoteAccountSettings(treeInfo, cells, isNew, containerRes) {
  
  var params;
  // Get password for selected account (it's not shown in the tree
  // so we have to get it from the RDF)
  if (isNew) {
    params = {inn:{name:"", description:"", url:"", username:"", password:"",    
      backupDir:PWDMKRDirIO.get("TmpD").path, filePattern:"passwordmaker.%y.%M.%d.%H.%m.%s.%S.rdf",  
      webDAV:false, autoDownload:false, autoUpload:false, autoUploadWhenDirty:false,                
      merge:false, passwordMaker:passwordMaker}, out:null};
  }
  else
    params = getSelectedSettings(treeInfo, cells);
    
  window.openDialog("chrome://passwdmaker/content/remotesettings.xul", "",
    "chrome, dialog, modal, resizable=yes", params).focus();

  if (params.out) {
    // User clicked OK - update datasource
    if (containerRes) {    
      // Add the new subject to the selected container.
      PwdMkr_RDFUtils.addToSequence(treeInfo.subjectRes, containerRes);
    }
      
    PwdMkr_RDFUtils.updateTarget(treeInfo.subjectRes, "name", params.out.name);      
    PwdMkr_RDFUtils.updateTarget(treeInfo.subjectRes, "description", params.out.description);        
    PwdMkr_RDFUtils.updateTarget(treeInfo.subjectRes, "urlToUse", params.out.url);
    PwdMkr_RDFUtils.updateTarget(treeInfo.subjectRes, "usernameTB", params.out.username);    

    // Encrypt the password
    var encPassword = "", key = "";
    if (params.out.password != "") {
      var temp = PwdMkr_MPW.encrypt(params.out.password);
      encPassword = temp.encryptedData;
      key = temp.key;
    }
      
    PwdMkr_RDFUtils.updateTarget(treeInfo.subjectRes, "masterPassword", encPassword);            
    PwdMkr_RDFUtils.updateTarget(treeInfo.subjectRes, "masterPasswordKey", key);        
    PwdMkr_RDFUtils.updateTarget(treeInfo.subjectRes, "useWebDAV", params.out.webDAV ? "true" : "false");                    
    PwdMkr_RDFUtils.updateTarget(treeInfo.subjectRes, "autoDownload", params.out.autoDownload ? "true" : "false");        
    PwdMkr_RDFUtils.updateTarget(treeInfo.subjectRes, "autoUpload", params.out.autoUpload ? "true" : "false");                
    PwdMkr_RDFUtils.updateTarget(treeInfo.subjectRes, "autoUploadWhenDirty", params.out.autoUploadWhenDirty ? "true" : "false");                
    PwdMkr_RDFUtils.updateTarget(treeInfo.subjectRes, "merge", params.out.merge ? "true" : "false"); 
    PwdMkr_RDFUtils.updateTarget(treeInfo.subjectRes, "directory", params.out.backupDir);                
    PwdMkr_RDFUtils.updateTarget(treeInfo.subjectRes, "file", params.out.filePattern); 
  }
}
