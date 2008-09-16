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

var matches, passwordMaker, accountsTree;
function onLoad() {
  matches = window.arguments[0].inn.matches;
  passwordMaker = window.arguments[0].inn.passwordMaker;
  accountsTree = document.getElementById("accountsTree");
  accountsTree.view = {
    rowCount : matches.length,
    getCellText : function(row, column){
      var s = column.id ? column.id : column;      
      var subj = matches[row].subjectRes;
      switch(s) {
        case "nameCol":return passwordMaker._getLiteral(subj, passwordMaker.namePredicateRes);
        case "descriptionCol":return passwordMaker._getLiteral(subj, passwordMaker.descriptionPredicateRes);
        case "usernameCol":return passwordMaker._getLiteral(subj, passwordMaker.usernameTBPredicateRes);
        case "whereLeetLBCol":return passwordMaker._getLiteral(subj, passwordMaker.whereLeetLBPredicateRes);
        case "leetLevelLBCol":return passwordMaker._getLiteral(subj, passwordMaker.leetLevelLBPredicateRes);
        case "hashAlgorithmLBCol":return passwordMaker._getLiteral(subj, passwordMaker.hashAlgorithmLBPredicateRes);
        case "passwordLengthCol":return passwordMaker._getLiteral(subj, passwordMaker.passwordLengthPredicateRes);
        case "urlToUseCol":return passwordMaker._getLiteral(subj, passwordMaker.urlToUsePredicateRes);
        case "counterCol":return passwordMaker._getLiteral(subj, passwordMaker.counterPredicateRes);
        case "autoPopulateCol":return passwordMaker._getLiteral(subj, passwordMaker.autoPopulatePredicateRes);
        case "charsetCol":return passwordMaker._getLiteral(subj, passwordMaker.charsetPredicateRes);
        case "prefixCol":return passwordMaker._getLiteral(subj, passwordMaker.prefixPredicateRes);
        case "suffixCol":return passwordMaker._getLiteral(subj, passwordMaker.suffixPredicateRes);        
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
  accountsTree.view.selection.select(0);
  document.getElementById("label").value = passwordMaker.sprintf(passwordMaker.stringBundle.GetStringFromName("chooseaccount.onLoad.01"), matches.length);
  sizeToContent();
}
  
function onOK() {
  window.arguments[0].out = new Object();
  window.arguments[0].out.selection = window.arguments[0].inn.matches[accountsTree.currentIndex];
  var username = document.getElementById("username").value;  
  window.arguments[0].out.selection.altUsername = username == "" ? null:username; // for tanstaafl
  return true;
}

function onKeyPress(evt) {
  /*if (evt.charCode == KeyboardEvent.DOM_VK_NUMPAD0 && !evt.shiftKey && !evt.metaKey && !evt.ctrlKey) {
    var easterEgg = document.getElementById("easterEgg");
    easterEgg.hidden = !easterEgg.hidden;
    if (!easterEgg.hidden)
      easterEgg.focus(); // Why isn't this working?
  }*/
	if (evt.charCode) {
	  var row = parseInt(evt.charCode-KeyboardEvent.DOM_VK_0)-1;
	    row > -1 && row <= accountsTree.view.rowCount-1 &&
  	    accountsTree.view.selection.select(row);
    }
  else if (evt.keyCode) {
    var handled;
    switch(evt.keyCode) {
     case KeyboardEvent.DOM_VK_UP:
  	    case KeyboardEvent.DOM_VK_LEFT:
  		    accountsTree.currentIndex>0 && accountsTree.view.selection.select(accountsTree.currentIndex-1);
  		    handled = true;
  		    break;
  		  case KeyboardEvent.DOM_VK_DOWN:
  		  case KeyboardEvent.DOM_VK_RIGHT:  
  		    accountsTree.currentIndex<accountsTree.view.rowCount-1 &&  		      
   		      accountsTree.view.selection.select(accountsTree.currentIndex+1);
  		    handled = true;  		    
  	  }
    }
    if (handled) {
	    evt.stopPropagation();
  	  evt.preventDefault();
  	  return false;
    }
  return true;
}
