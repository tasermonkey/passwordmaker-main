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

var newDomainCmd, removeDomainSelectionCmd;

function initDomainsPanel() {
  newDomainCmd = document.getElementById("newDomainCmd");
  removeDomainSelectionCmd = document.getElementById("removeDomainSelectionCmd");  
  domainsTree.database.AddDataSource(PwdMkr_RDFUtils.datasource);
  domainsTree.builder.rebuild();
  //if (domainsTree.view)
    //domainsTree.view.selection.select(0);
}

function onDomainsTreeSelected() {
  if (domainsTree.currentIndex == -1) {
	removeDomainSelectionCmd.setAttribute("disabled", true);
	newDomainCmd.setAttribute("disabled", true);
    return;
  }
  // If not a folder, generate password
  newDomainCmd.setAttribute("disabled",
  	domainsTree.view.getItemAtIndex(domainsTree.currentIndex).getAttribute("container") != "true");
  removeDomainSelectionCmd.setAttribute("disabled", false);  	
}

function onNewDomainFolder() {
  createNewFolder("domainid", "domaindesc", passwordMaker.domainsContainer);
}

function onNewDomain() {
  var temp = getActiveTreeInfo();

  var folderInfo = "";
  while (folderInfo == "") {
    folderInfo = promptForTwoItems();
    if (!folderInfo)
      return;  // user cancelled

    folderInfo.name = folderInfo.name.replace(" ", ""); // trim any space
    folderInfo.name = folderInfo.name.toLowerCase();
    if (folderInfo.name[0] == ".")
      folderInfo.name = folderInfo.name.substring(1); // trim leading dot, if any

    if (folderInfo.name.indexOf(".") == -1 ) {
      folderInfo = "";
      passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("domains.onNewDomain.01"));
    }
    else if (folderInfo.name.indexOf("'") > -1 || folderInfo.name.indexOf("\"") > -1) {
      folderInfo = "";
      passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("domains.onNewDomain.02"));
    }
    else {
      for (var j in passwordMaker.domains) {
        if (j == folderInfo.name) {
          passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.sprintf(passwordMaker.stringBundle.GetStringFromName("domains.onNewDomain.03"), j));
          folderInfo = "";
          return;
        }
      }
    }
  }

  var containerRes = PwdMkr_RDFUtils.rdfContainerUtils.MakeSeq(PwdMkr_RDFUtils.datasource, temp.subjectRes);

  // Build the resources...
  // domain name
  var domainRes = PwdMkr_RDFUtils.makeResource();
  PwdMkr_RDFUtils.updateTarget(domainRes, "domainid", folderInfo.name);

  // domain description
  PwdMkr_RDFUtils.updateTarget(domainRes, "domaindesc", folderInfo.description);

  // Add the resource to the container (folder)
  containerRes.AppendElement(domainRes);
  PwdMkr_RDFUtils.flush();

  passwordMaker.domains[folderInfo.name] = true;

  // Open the selected item (the parent folder of the new domain we just created)
  // if it's not already open.
  if (!domainsTree.view.isContainerOpen(domainsTree.currentIndex))
    domainsTree.view.toggleOpenState(domainsTree.currentIndex);

  // @TODO: Select the last item in the now-open folder (the newly-created account)
}

function onRemoveDomainSelection() {
  var temp = getActiveTreeInfo();

  var cells = getTreeCells(domainsTree);
  var domainName = cells[0].getAttribute("label");
  var targetRes = PwdMkr_RDFUtils.rdfService.GetLiteral(domainName);
  var domainIdPredicateRes = PwdMkr_RDFUtils.makePredicate("domainid");

  // User can't delete system-defined domains
  if (!PwdMkr_RDFUtils.datasource.HasAssertion(temp.subjectRes, domainIdPredicateRes, targetRes, true)) {
    passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("domains.onRemoveDomainSelection.01"));
    return;
  }
  deleteTreeItem();
  delete passwordMaker.domains[domainName];
}
