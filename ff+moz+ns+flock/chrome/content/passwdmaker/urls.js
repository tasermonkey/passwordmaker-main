var patternsArray, patternsTree, urlToUse;

function initURLsTab() {
	patternsTree = document.getElementById("patternsTree");
  patternsArray = window.arguments[0].inn.patternsArray;
  
  if (isDefaultsAccount) {
    urlToUse = document.getElementById("calculatedUrlToUse");
    document.getElementById("urlToUseContainer").hidden = document.getElementById("hideForDefault").hidden = true;
  }
  else {
	  urlToUse = document.getElementById("urlToUse");  
    document.getElementById("urlComponentsParent").hidden = true;
	  if (!patternsArray) // CAN be null
	    patternsArray = new Array();
    _updatePatternsTreeView();	              
  }
	urlToUse.value = accountSettings.urlToUse;    
	document.getElementById("pattern-selected-broadcaster").setAttribute("disabled", true);	
} 

function calculateURI() {
  urlToUse.value =
    passwordMaker.calculateURI(protocolCB.checked,
    subdomainCB.checked,
    domainCB.checked,
    pathCB.checked,
    pathCB.checked);
}

function onAddPattern() {
	_onPattern({inn:{name:"", pattern:"", type:"wildcard", enabled:true}, out:null}, patternsArray.length);
}

function _onPattern(params, idx) {
	params.inn.passwordMaker = passwordMaker;
  window.openDialog("chrome://passwdmaker/content/pattern.xul", "",
    "chrome, dialog, modal, resizable=yes", params).focus();
  if (params.out) {
  	patternsArray[idx] = {pattern:params.out.pattern, type:params.out.type, notes:params.out.name, enabled:params.out.enabled};
	  _updatePatternsTreeView();
  }	
}

function onEditPattern() {
  var idx = patternsTree.currentIndex;
  _onPattern({inn:{name:patternsArray[idx].notes, pattern:patternsArray[idx].pattern, type:patternsArray[idx].type, enabled:patternsArray[idx].enabled}, out:null}, idx);
}

function onPatternsTreeSelected() {
  document.getElementById("pattern-selected-broadcaster").setAttribute("disabled", patternsTree.currentIndex == -1);
}

function onCopyPattern() {
  patternsArray[patternsArray.length] = patternsArray[patternsTree.currentIndex];
  _updatePatternsTreeView();	
}

function onRemovePattern() {
  if (!passwordMaker.ask(this,"Delete pattern named \"" + patternsArray[patternsTree.currentIndex].notes + "\"?"))
    return;

	var idx = patternsTree.currentIndex;
  for (var i=0, temp=[]; i<patternsArray.length; i++) {
    if (i != idx) temp[temp.length] = patternsArray[i];
  }
  patternsArray = []; //this.list.splice(0, this.length);
  for (var i=0; i<temp.length && (patternsArray[patternsArray.length]=temp[i]); i++);
  _updatePatternsTreeView(); // force instant tree view refresh
}

// e is for elephant!

function _updatePatternsTreeView() {
  patternsTree.view = {
    rowCount : patternsArray.length,
    getCellText : function(row, column) {
      var s = column.id ? column.id : column;
      if (patternsArray[row]) {
        switch(s) {
          case "enabledCol":return patternsArray[row].enabled ? passwordMaker.stringBundle.GetStringFromName("urls._updatePatternsTreeView.01") : passwordMaker.stringBundle.GetStringFromName("urls._updatePatternsTreeView.02");        
          case "patternNotesCol":return patternsArray[row].notes;
          case "patternCol":return patternsArray[row].pattern;        
          case "patternTypeCol":return patternsArray[row].type=="wildcard" ? passwordMaker.stringBundle.GetStringFromName("urls._updatePatternsTreeView.03") : passwordMaker.stringBundle.GetStringFromName("urls._updatePatternsTreeView.04");  
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
  onPatternsTreeSelected(); // update btns  
}