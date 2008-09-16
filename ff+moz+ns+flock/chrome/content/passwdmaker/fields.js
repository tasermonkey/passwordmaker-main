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

var formname, fieldname, fieldvalue, fieldtype, fieldsTree, fieldsArray,
  fieldnotification, fielddesc, fieldid, docs, browser;

function initFieldsTab() {
  fieldname = document.getElementById("fieldname");
  fieldvalue = document.getElementById("fieldvalue");
  fieldtype = document.getElementById("fieldtype");
  formname = document.getElementById("formname");
  fieldnotification = document.getElementById("fieldnotification");
  fielddesc = document.getElementById("fielddesc");
  fieldid = document.getElementById("fieldid"); 
  fieldsArray = window.arguments[0].inn.fieldsArray;
  if (!fieldsArray) // CAN be null
    fieldsArray = new Array(); 
  fieldsTree = document.getElementById("fieldsTree");
  _updateFieldsTreeView();  
  if (fieldsTree.view)
    fieldsTree.view.selection.select(0);

  docs = new Array();
  browser = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser");  
  browser.gBrowser.addProgressListener(myListener, Components.interfaces.nsIWebProgress.NOTIFY_STATE_DOCUMENT);  
  listenToDoc(browser.content.document);
}

function _changeStyle(style) {
  // Thanks, HJ!
  const CI = Components.interfaces;
  var xulwin = window.QueryInterface(CI.nsIInterfaceRequestor)
    .getInterface(CI.nsIWebNavigation)
    .QueryInterface(CI.nsIDocShellTreeItem)
    .treeOwner
    .QueryInterface(CI.nsIInterfaceRequestor)
    .getInterface(CI.nsIXULWindow);
  xulwin.zLevel = style;  
}

function listenToDoc(doc) {
  for (var i in docs) {
    if (docs[i] == doc)
      return; // already listening
  }
  doc.addEventListener("click", this.click, true);  
  docs.push(doc);
}

function uninitFieldsTab() {
  for (var i in docs)
    docs[i].removeEventListener("click", this.click, true);
  browser.gBrowser.removeProgressListener(myListener);
}

var prevType;
function onChangeFieldType(target) {
  if (fieldtype.value == "checkbox") {
    var menulist = document.createElement("menulist");
    menulist.setAttribute("id", "fieldvalue");
    menulist.setAttribute("tooltiptext", passwordMaker.stringBundle.GetStringFromName("fields.onChangeFieldType.01"));
    var menupopup = document.createElement("menupopup");
    menulist.appendChild(menupopup);
    var item1 = document.createElement("menuitem");
    item1.setAttribute("label", passwordMaker.stringBundle.GetStringFromName("fields.onChangeFieldType.03"));
    item1.setAttribute("value", "checked");    
    menupopup.appendChild(item1);
    var item2 = document.createElement("menuitem");
    item2.setAttribute("label", passwordMaker.stringBundle.GetStringFromName("fields.onChangeFieldType.04"));
    item2.setAttribute("value", "unchecked");    
    menupopup.appendChild(item2);    
    document.getElementById("fieldvalueParent").replaceChild(menulist, fieldvalue);
    fieldvalue = menulist;
  }
  else if (fieldtype.value == "select") {
    if (target) {
      var menulist = document.createElement("menulist");
      menulist.setAttribute("id", "fieldvalue");
      menulist.setAttribute("tooltiptext", passwordMaker.stringBundle.GetStringFromName("fields.onChangeFieldType.02"));
      var menupopup = document.createElement("menupopup");
      menulist.appendChild(menupopup);    
      for (var i in target.childNodes) {
        if (target.childNodes[i].nodeName == "OPTION") {
          var menuitem = document.createElement("menuitem");
          menuitem.setAttribute("label", target.childNodes[i].text);
          menuitem.setAttribute("value", target.childNodes[i].value);    
          menupopup.appendChild(menuitem);      
        }
      }
      document.getElementById("fieldvalueParent").replaceChild(menulist, fieldvalue);
      fieldvalue = menulist;         
    }
    else
      makeTextBox(false);
  }
  else
    makeTextBox(fieldtype.value == "textarea");
    
  if (prevType == "password" && fieldtype.value != "password")
    fieldvalue.value = ""; // Don't reveal password contents
  fieldvalue.setAttribute("type", fieldtype.value == "password" ? "password" : "");

  prevType = fieldtype.value;
}

function makeTextBox(multiline) {
  var tbox = document.createElement("textbox");
  tbox.setAttribute("id", "fieldvalue"); 
  tbox.setAttribute("tooltiptext", passwordMaker.stringBundle.GetStringFromName("fields.makeTextBox.01"));
  document.getElementById("fieldvalueParent").replaceChild(tbox, fieldvalue);
  fieldvalue = tbox;
  if (fieldtype.value == "textarea") {
    fieldvalue.setAttribute("multiline", true);
    fieldvalue.rows=2;
  }
  else
    fieldvalue.setAttribute("multiline", false);
}

var CVS;
function click(evt) {     
  var target = evt.target;
  CVS = target;
  if (target.nodeName == "OPTION")
    target = findSelectElement(target);
  if (target && (target.nodeName == "INPUT" || target.nodeName == "TEXTAREA" || target.nodeName == "SELECT")) {
    // Set password type (if applicable) *before* populating fieldvalue.value
    if (target.nodeName == "SELECT")
      fieldtype.value = "select"; // <select/> elements have no type attribute
    else
    	fieldtype.value = target.type ? target.type : "text";
  	onChangeFieldType(target);
  	fieldid.value = target.type ? target.id : "";
    fieldvalue.setAttribute("type", fieldtype.value == "password" ? "password" : "");  
  	fieldname.value = target.name ? target.name : "";
  	fieldvalue.value = fieldvalue.nodeName == "menulist" ? (target.value=="on" || target.value=="true" || target.value=="checked" || target.value=="yes" ? "checked":"unchecked") : (target.value ? target.value : "");
  	fieldvalue.value = target.value;
    formname.value = target.form.getAttribute("name");
  }
}

function findSelectElement(node) {
  return node ? (node.nodeName == "SELECT" ? node : findSelectElement(node.parentNode)) : null;
}

function onAddField() {
  if (fieldname.value == "") {
    passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("fields.onAddField.01"));
    clear();
    return;
  }

  // check for duplicates
  for (var i=0; i<fieldsArray.length; i++) {
    if (fieldsArray[i].fieldname == fieldname.value && fieldsArray[i].formname == formname.value) {
      passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("fields.onAddField.02"));
      clear();
      return;
    }
  }
  
  var idx = fieldsArray.length;
  fieldsArray[idx] = new Object();
  fieldsArray[idx].fieldname = fieldname.value;
  fieldsArray[idx].fieldvalue = fieldvalue.value;  
  fieldsArray[idx].fieldtype = fieldtype.selectedItem.value;    
  fieldsArray[idx].fieldid = fieldid.value;    
  fieldsArray[idx].formname = formname.value;    
  fieldsArray[idx].fieldnotification = fieldnotification.checked ? "true" : "false";
  fieldsArray[idx].fielddesc = fielddesc.value;
  
  clear();
  
  fieldsTree.treeBoxObject.rowCountChanged(fieldsTree.view.rowCount - 1, 1);
  fieldsTree.view.selection.select(fieldsTree.view.rowCount -1);
  fieldsTree.treeBoxObject.invalidateRow(fieldsTree.currentIndex);
  fieldsTree.treeBoxObject.ensureRowIsVisible(fieldsTree.currentIndex);  
  _updateFieldsTreeView();
}

function _updateFieldsTreeView() {
  fieldsTree.view = {
    rowCount : fieldsArray.length,
    getCellText : function(row, column) {
      var s = column.id ? column.id : column;
      if (fieldsArray[row]) {
        switch(s) {
          case "nameCol":return fieldsArray[row].fieldname;
          case "descCol":return fieldsArray[row].fielddesc;        
          case "valueCol":
            if (fieldsArray[row].fieldtype == "checkbox")
              return fieldsArray[row].fieldvalue == "checked" ? passwordMaker.stringBundle.GetStringFromName("fields._updateFieldsTreeView.04") : passwordMaker.stringBundle.GetStringFromName("fields._updateFieldsTreeView.05");
            else
              return fieldsArray[row].fieldtype=="password" ? passwordMaker.stringBundle.GetStringFromName("fields._updateFieldsTreeView.01") : fieldsArray[row].fieldvalue;
          case "typeCol":
            switch(fieldsArray[row].fieldtype) {
              case "text": return passwordMaker.stringBundle.GetStringFromName("fields._updateFieldsTreeView.06");
              case "textarea": return passwordMaker.stringBundle.GetStringFromName("fields._updateFieldsTreeView.07");
              case "password": return passwordMaker.stringBundle.GetStringFromName("fields._updateFieldsTreeView.08");
              case "checkbox": return passwordMaker.stringBundle.GetStringFromName("fields._updateFieldsTreeView.09");
              case "select": return passwordMaker.stringBundle.GetStringFromName("fields._updateFieldsTreeView.10");
              case "radio": return passwordMaker.stringBundle.GetStringFromName("fields._updateFieldsTreeView.11");
              default: return fieldsArray[row].fieldtype;
            }
          case "formCol":return fieldsArray[row].formname;
          case "idCol":return fieldsArray[row].fieldid;        
          case "notificationCol":return fieldsArray[row].fieldnotification.toString() == "true" ? passwordMaker.stringBundle.GetStringFromName("fields._updateFieldsTreeView.02") : passwordMaker.stringBundle.GetStringFromName("fields._updateFieldsTreeView.03");     
        }
      }
    },
    isSeparator: function() { return false; },
    isSorted: function() { return false; },
    isContainer: function() { return false; },
    setTree: function(){},
    getImageSrc: function() {return null;},
    getProgressMode: function() {},
    getCellValue: function() {},
    cycleHeader: function() {},
    getRowProperties: function() {},
    getColumnProperties: function() {},
    getCellProperties: function() {},
    getLevel: function(){ return 0; }
  };
}

function clear() {
  if (fieldsTree.view && fieldsTree.view.selection != null)
    fieldsTree.view.selection.clearSelection();
  fielddesc.value = formname.value = fieldname.value = fieldtype.value = fieldid.value = fieldvalue.value = "";
  fieldnotification.checked = true;
}

function onRemoveField() {
  var newArray = new Array();
  for (var i=0; i<fieldsArray.length; i++) {
    if (i != fieldsTree.currentIndex)
      newArray[newArray.length] = fieldsArray[i];
  }
  fieldsArray = newArray;

  clear();
  _updateFieldsTreeView();
  onFieldsTreeSelected();
}

function onFieldsTreeSelected() {
  var d = document.getElementById("deleteSelectionCmd");
  // Doesn't exist in the very beginning when dialog first emerges
  if (d)
    d.disabled = fieldsTree.currentIndex == -1;
}

var myListener = {
  QueryInterface: function(aIID) {
   if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
       aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
       aIID.equals(Components.interfaces.nsISupports))
     return this;
   throw Components.results.NS_NOINTERFACE;
  },

  onStateChange: function(aProgress, aRequest, aFlag, aStatus) {
   if(aFlag & Components.interfaces.nsIWebProgressListener.STATE_START)
   {
     // This fires when the load event is initiated
   }
   if(aFlag & Components.interfaces.nsIWebProgressListener.STATE_STOP)
   {
     // This fires when the load finishes
     listenToDoc(aProgress.DOMWindow.document);
   }
   return 0;
  },

  onLocationChange: function(aProgress, aRequest, aURI) {
   // This fires when the location bar changes i.e load event is confirmed
   // or when the user switches tabs
   listenToDoc(aProgress.DOMWindow.document);
   return 0;
  },

  onProgressChange: function() {return 0;},
  onStatusChange: function() {return 0;},
  onSecurityChange: function() {return 0;},
  onLinkIconAvailable: function() {return 0;}
};