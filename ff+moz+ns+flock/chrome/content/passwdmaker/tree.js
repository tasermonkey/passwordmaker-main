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

/** Common tree fcns **/

var accountsTree, remotesTree, domainsTree,
  copySelectionCmd, moveSelectionCmd;

function initTrees() {
  domainsTree = document.getElementById("domainsTree");  
  accountsTree = document.getElementById("accountsTree");
  remotesTree = document.getElementById("remotesTree");
  copySelectionCmd = document.getElementById("copySelectionCmd");
  moveSelectionCmd = document.getElementById("moveSelectionCmd");      
  _initTree(accountsTree);
  _initTree(remotesTree);
}

//var treeBuilderObserver = {
//   onToggleOpenState: function(aRow) {
//   }
//};

function _initTree(tree) {
  // Remove all datasources then add the single datasource.
  // This prevents the datasource being added multiple times
  // for example when user downloads passwordsmaker.rdf over and over
  var e = tree.database.GetDataSources();
  while (e.hasMoreElements())
    tree.database.RemoveDataSource(e.getNext());
  
  tree.database.AddDataSource(PwdMkr_RDFUtils.datasource);
  tree.builder.rebuild();
  if (tree.view)
    tree.view.selection.select(0);

  // Only add click listener ONCE--this method can be
  // called multiple times if user keeps downloading passwordmaker.rdf.
  tree.removeEventListener("click", clickListener, true);
  tree.addEventListener("click", clickListener, true);
  //var treeBuilder = tree.builder.QueryInterface(Components.interfaces.nsIXULTreeBuilder);
  //tree.builder.QueryInteface(Components.interfaces.nsIXULTreeBuilderObserver);
  //treeBuilder.removeObserver(treeBuilderObserver);  
  //treeBuilder.addObserver(treeBuilderObserver);
}

function clickListener(event) {
  var row = {}, col = {}, childElt = {};
  this.treeBoxObject.getCellAt(event.clientX, event.clientY, row, col, childElt);
  if (event.detail == 2 && childElt.value != "twisty" && row.value > -1 && col.value) {
    onAccountSettings(false);
    event.stopPropagation();
  }
  else if (event.detail == 1 && childElt.value == "twisty" && row.value > -1) {
    // TODO: save open/close state
  }
}

function onTreeSelection() {
  var temp = getActiveTreeInfo();
  if (temp.tree.currentIndex == -1) {
    // Nothing selected. select the first item if there IS a first item.
    if (temp.tree.view.rowCount > 0)
      temp.tree.view.selection.select(0);
    return false;
  }  
  
  // if a folder...
  var isFolder = temp.tree.view.getItemAtIndex(temp.tree.currentIndex).getAttribute("container") == "true";
  newAccountCmd.setAttribute("disabled", !isFolder); // Allow creation of new accounts 
  copySelectionCmd.setAttribute("disabled", isFolder);   
  moveSelectionCmd.setAttribute("disabled", isFolder);
  return true;
}

function promptForTwoItems(name, desc) {
  var params = {inn: {name:name, description:desc}, out:null};

  window.openDialog("chrome://passwdmaker/content/treeprompt.xul",
    "", "chrome, dialog, modal, resizable=yes", params).focus();

  if (params.out) {
    // User clicked OK
    while (params.out && params.out.name == "") {
      // MUST enter a name
      passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("tree.promptForTwoItems.01"));
      params.out = null;
      window.openDialog("chrome://passwdmaker/content/treeprompt.xul", "", "chrome, dialog, modal, resizable=yes",
        params).focus();
    }
    return params.out;
  }
}

function createNewFolder(nameURI, descURI, containerSeq, folderRes, nameVal, descVal) {
  var folderInfo = promptForTwoItems(nameVal, descVal);
  if (!folderInfo)
    return; // user cancelled

  // Build the folder resource...
  // Folder Name
  if (!folderRes)
    folderRes = PwdMkr_RDFUtils.makeResource();
    
  PwdMkr_RDFUtils.updateTarget(folderRes, nameURI, folderInfo.name);
  PwdMkr_RDFUtils.updateTarget(folderRes, descURI, folderInfo.description);

  // Make the new sequence/container
  var newContainer = PwdMkr_RDFUtils.makeSequence(folderRes);
  // Append it to the parent container (e.g., the accounts sequence)
  containerSeq.AppendElement(folderRes);
  PwdMkr_RDFUtils.flush();
  return folderRes;
}

function onCreateNewFolder() {   
  var temp = getActiveTreeInfo();
  var folderRes = createNewFolder("name", "description", temp.container);
//  var i = temp.tree.builderView.getIndexOfResource(folderRes);
//  dump("i = " + i + "\n");
//  temp.tree.treeBoxObject.invalidateRow(i);  
}

function getActiveTreeInfo(tree) {
  var ret = {};
  ret.tree = tree;
  if (!ret.tree) { 
    switch (document.getElementById("tabs").selectedItem.id) {
      case "accounts" : {
        ret.tree = accountsTree;
        ret.container = passwordMaker.accountsContainer
        ret.isAccounts = true;
        break;
      }
      case "upload-download" : {
        ret.tree = remotesTree;
        ret.container = passwordMaker.remotesContainer;
        ret.isRemotes = true;
        break;
      }
      case "special-domains" : {
        ret.tree = domainsTree;
        ret.container = passwordMaker.domainsContainer
        ret.isDomains = true;
        break;
      }
    }
  }
  // Get the RDF resource associated with the selected tree item.
  // Check ret.tree.view before getting the currentIndex because,
  // if the tree is empty, ret.tree.currentIndex causes a "this.view has no properties"
  // JS error in chrome://global/content/bindings/tree.xml 
  if (ret.tree && ret.tree.view && ret.tree.currentIndex > -1) {
    // Get id of selected item in tree
    var subjectId = ret.tree.builderView.getItemAtIndex(ret.tree.currentIndex).getAttribute("id"); // e.g., rdf:#$JZPes
    ret.subjectRes = PwdMkr_RDFUtils.makeResource(subjectId);
    //dump("id = " + subjectId + "\n");
    ret.isContainer = PwdMkr_RDFUtils.rdfContainerUtils.IsContainer(PwdMkr_RDFUtils.datasource, ret.subjectRes);
  }
  return ret;
}

function onMoveAccount() {
  var temp = getActiveTreeInfo();
  var params = {inn:{passwordMaker:passwordMaker, copy:false, isAccounts:temp.tree==accountsTree}, out:null};
  window.openDialog("chrome://passwdmaker/content/folders.xul", "",
    "chrome, dialog, modal, resizable=yes", params).focus();
  move(temp.subjectRes, params.out.subjectRes, temp.tree == accountsTree);
}

function move(srcSubjectRes, destSubjectRes, isAccounts) {
  var selectedContainerRes = PwdMkr_RDFUtils.rdfContainerUtils.MakeSeq(PwdMkr_RDFUtils.datasource, destSubjectRes);

  // Remove reference to this subject in whichever container contains it.
  var arcsIn = PwdMkr_RDFUtils.datasource.ArcLabelsIn(srcSubjectRes);
  while (arcsIn.hasMoreElements()) {
    var arc = arcsIn.getNext();
    if (arc instanceof Components.interfaces.nsIRDFResource) {
      if (PwdMkr_RDFUtils.rdfContainerUtils.IsOrdinalProperty(arc)) {
        var parentRes = PwdMkr_RDFUtils.datasource.GetSource(arc, srcSubjectRes, true);
        var parentResContainer = PwdMkr_RDFUtils.rdfContainerUtils.MakeSeq(PwdMkr_RDFUtils.datasource, parentRes);
        parentResContainer.RemoveElement(srcSubjectRes, true);
        break;
      }
    }
  }
  selectedContainerRes.AppendElement(srcSubjectRes);
  PwdMkr_RDFUtils.flush();
  if (isAccounts)
    passwordMaker.cacheAccounts(); // refresh cache

  // Open the parent folder of the moved account if it's not already open.
  //if (!temp.tree.view.isContainerOpen(temp.tree.currentIndex))
    //temp.tree.view.toggleOpenState(temp.tree.currentIndex);
}

function onCopyAccount() {
  var temp = getActiveTreeInfo();

  var params = {inn:{passwordMaker:passwordMaker, copy:true, isAccounts:temp.tree==accountsTree}, out:null};

  window.openDialog("chrome://passwdmaker/content/folders.xul", "",
    "chrome, dialog, modal, resizable=yes", params).focus();

  if (params.out) {
    // User clicked OK
    var newAccountRes = PwdMkr_RDFUtils.makeResource();    
    var targets = PwdMkr_RDFUtils.datasource.ArcLabelsOut(temp.subjectRes);
    while (targets.hasMoreElements()) {
      var predicate = targets.getNext();
      PwdMkr_RDFUtils.updateTarget(newAccountRes, predicate, passwordMaker._getLiteral(temp.subjectRes, predicate));
    }    
    var containerRes = PwdMkr_RDFUtils.rdfContainerUtils.MakeSeq(PwdMkr_RDFUtils.datasource, params.out.subjectRes);
    // Add the resource to the container (folder)
    containerRes.AppendElement(newAccountRes);
    PwdMkr_RDFUtils.flush();

    // Open the selected item (the parent folder of the new account we just created)
    // if it's not already open.
    //if (!temp.tree.view.isContainerOpen(temp.tree.currentIndex))
      //temp.tree.view.toggleOpenState(temp.tree.currentIndex);     
  } 
}

/**
 * Called to create a new account in the currently selected folder.
 */
function onCreateNewAccount() {
  var temp = getActiveTreeInfo();
  var containerRes = PwdMkr_RDFUtils.makeSequence(temp.subjectRes);
  onAccountSettings(true);

  // Open the selected item (the parent folder of the new accounts we just created)
  // if it's not already open.
  if (!temp.tree.view.isContainerOpen(temp.tree.currentIndex))
    temp.tree.view.toggleOpenState(temp.tree.currentIndex);

  // Select the last item in the now-open folder (the newly-created account)
  //var newAccountId = document.getElementById(accountRes.Value);
  //var idx = temp.tree.view.getIndexOfItem(newAccountId);
  //if (idx >= 0)
    //temp.tree.view.selection.select(idx);
}

function deleteNodes(subject) {
  var isContainer = PwdMkr_RDFUtils.rdfContainerUtils.IsContainer(PwdMkr_RDFUtils.datasource, subject);
  if (isContainer) {
    // Subject is a container (folder)
    var container = PwdMkr_RDFUtils.rdfContainerUtils.MakeSeq(PwdMkr_RDFUtils.datasource, subject);
    var children = container.GetElements();
    while (children.hasMoreElements()){
      var child = children.getNext();
      if (child instanceof Components.interfaces.nsIRDFResource){
        container.RemoveElement(child, true);
        children = container.GetElements();
        prune(child);
        // Delete fields container and elements, if they exist
        child = PwdMkr_RDFUtils.makeResource(child.Value + "/fields");
        deleteNodes(child);
      }
    }
  }
  else {
    // Not a container (folder). Remove reference
    // to this subject in whichever container contains it.
    var arcsIn = PwdMkr_RDFUtils.datasource.ArcLabelsIn(subject);
    while (arcsIn.hasMoreElements()) {
      var arc = arcsIn.getNext();
      if (arc instanceof Components.interfaces.nsIRDFResource) {
        if (PwdMkr_RDFUtils.rdfContainerUtils.IsOrdinalProperty(arc)) {
          var parentRes = PwdMkr_RDFUtils.datasource.GetSource(arc, subject, true);
          var parentResContainer = PwdMkr_RDFUtils.rdfContainerUtils.MakeSeq(PwdMkr_RDFUtils.datasource, parentRes);
          parentResContainer.RemoveElement(subject, true);
        }
      }
    }
  }
  prune(subject);
  PwdMkr_RDFUtils.flush();
}

function prune(subject) {
  // Remove all remaining tuples
  var targets = PwdMkr_RDFUtils.datasource.ArcLabelsOut(subject);
  while (targets.hasMoreElements()){
    var predicate = targets.getNext();
    if (predicate instanceof Components.interfaces.nsIRDFResource)
      PwdMkr_RDFUtils.removeTarget(subject, predicate);
  }
}

function deleteTreeItem() {
  var temp = getActiveTreeInfo();

  if (!passwordMaker.ask(this, temp.isContainer?passwordMaker.stringBundle.GetStringFromName("tree.deleteTreeItem.01") :
      passwordMaker.stringBundle.GetStringFromName("tree.deleteTreeItem.02")))
    return false;

  deleteNodes(temp.subjectRes);  
  temp.container.RemoveElement(temp.subjectRes, true); // remove from the container
  PwdMkr_RDFUtils.flush();
  return true;
}

function onDeleteTreeItem() {
  var temp = getActiveTreeInfo();
  
  // http://forums.passwordmaker.org/index.php?showtopic=1069&st=0&#entry1279001
  if (temp.isAccounts && temp.tree.currentIndex == 0)
    passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("tree.onDeleteTreeItem.01"));
  else if (deleteTreeItem() && temp.isAccounts) {
    // This chunk is only necessary for the accountsTree
    // since only *it* can contain a fields container
    // Delete fields container and elements, if they exist
    //temp.subjectRes.QueryInterface(Components.interfaces.nsIRDFResource);
    //temp.subjectRes = PwdMkr_RDFUtils.makeResource(temp.subjectRes.Value + "/fields");
    deleteNodes(temp.subjectRes);
    PwdMkr_RDFUtils.flush();
    passwordMaker.cacheAccounts(); // refresh cache  
  }
}

function getTreeCells(tree, index) {
  if (index == null)
    index = tree.currentIndex;
  var selectedTreeItem = tree.view.getItemAtIndex(index);   // <treeitem/>
  var selectedTreeRow = selectedTreeItem.firstChild;   // <treerow/>
  return selectedTreeRow.childNodes;  // <treecell/> NodeList
}

function collapseOrExpandTree(expand) {
  var temp = getActiveTreeInfo();
  for(var i=0;i<temp.tree.view.rowCount;i++) {
    var isOpen = temp.tree.view.isContainerOpen(i);
    if((expand && !isOpen) || (!expand && isOpen))
      temp.tree.view.toggleOpenState(i);
  }
}

// http://www.mozilla.org/xpfe/xptoolkit/dragDrop.html
//
// treechildren::-moz-tree-cell-text(container) {
//   font-weight: bold !important;
// }


var treeObserver = {    
  startDrag : function(event) {
    var tree = getActiveTreeInfo();
    if (tree.isContainer || tree.subjectRes == passwordMaker.defaultAccount.subjectRes)
      return; // Groups can't be dragged
    // create a transferable 
    var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
    trans.addDataFlavor("passwordmaker/settings");
    var genTextData =
      Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
    genTextData.data = tree.subjectRes.Value;
    // add data to the transferable
    trans.setTransferData("passwordmaker/settings", genTextData, genTextData.data.length*2);
    // create an array for our drag items, though we only have one
    var transArray =
      Components.classes["@mozilla.org/supports-array;1"].createInstance(Components.interfaces.nsISupportsArray);
    // put it into the list as an |nsISupports|
    var genTrans = trans.QueryInterface(Components.interfaces.nsISupports);
    transArray.AppendElement(genTrans);

    /*var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
    trans.addDataFlavor("passwordmaker/tree");
    var genTextData2 =
      Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
    genTextData2.data = tree;
    // add data to the transferable
    trans.setTransferData("passwordmaker/tree", genTextData2, genTextData2.data.length*2);*/
    
    // Kick off the drag
    var dragService = Components.classes["@mozilla.org/widget/dragservice;1"].getService(Components.interfaces.nsIDragService);
    dragService.invokeDragSession(event.target, transArray, null, dragService.DRAGDROP_ACTION_COPY + dragService.DRAGDROP_ACTION_MOVE);
    //tree = tree.treeBoxObject.QueryInterface(Components.interfaces.nsITreeBoxObject);
    event.preventBubble();
  },

  row : null,
  dragOver : function(event) {
    var dragService = Components.classes["@mozilla.org/widget/dragservice;1"].getService(Components.interfaces.nsIDragService);
    var dragSession = dragService.getCurrentSession();
    if (dragSession && dragSession.isDataFlavorSupported("passwordmaker/settings")) {
      dragSession.canDrop = true;
      var treeInfo = getActiveTreeInfo();
      var destRow = treeInfo.tree.treeBoxObject.getRowAt(event.clientX, event.clientY);
      treeInfo.tree.view.getItemAtIndex(destRow).setAttribute("properties", "dropOn");
      this.row = treeInfo.tree.view.getItemAtIndex(destRow);
      event.preventBubble();
    }
  }, 
  
  dragExit : function(event) {
    //event.target.firstChild.firstChild.setAttribute("style", "");
  },
  
  drop : function(evt) {
    var dragService = Components.classes["@mozilla.org/widget/dragservice;1"].getService(Components.interfaces.nsIDragService);
    var dragSession = dragService.getCurrentSession();
    if (dragSession) {
      var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
      if (trans) {
        trans.addDataFlavor("passwordmaker/settings");
        for (var i=0; i<dragSession.numDropItems; ++i) {
          dragSession.getData(trans, i);
          var dataObj = new Object();
          var bestFlavor = new Object();
          var len = new Object();
          trans.getTransferData("passwordmaker/settings", dataObj, len);
          if (dataObj)
            dataObj = dataObj.value.QueryInterface(Components.interfaces.nsISupportsString);
          if (dataObj) {
            evt.preventBubble();
            // Pull the RDF value out of the data object
            var src = dataObj.data.substring(0, len.value/2);
            var treeInfo = getActiveTreeInfo();
            var destRow = treeInfo.tree.treeBoxObject.getRowAt(evt.clientX, evt.clientY);
            var destRes;
            var i;
            try {
              if (treeInfo.tree.view.isContainer(destRow))
                destRes = PwdMkr_RDFUtils.makeResource(treeInfo.tree.view.getItemAtIndex(destRow).id);
              else {
                // Get the parent container by reverse traversing the tree
                for (i=destRow-1; i>=0 && !treeInfo.tree.view.isContainer(i); i--);
                destRes = PwdMkr_RDFUtils.makeResource(treeInfo.tree.view.getItemAtIndex(i).id);            
              }
            }
            catch (e) {
              dump(e + "\n");
              return;
            }
            if (i == -1)
              return; // Shouldn't happen since only accounts can be dragged, not groups, and accounts *must* belong to a group
            var dragPopup = document.getElementById("dragPopup");
            //var xCoord = treeInfo.tree.boxObject.x + evt.clientX;
            //var yCoord = treeInfo.tree.boxObject.y + evt.clientY;
            //dragPopup.showPopup(null, evt.x, evt.y, "bottomleft", "topleft");
            move(PwdMkr_RDFUtils.makeResource(src), destRes);
          }
        }
      }
    }
  }
};