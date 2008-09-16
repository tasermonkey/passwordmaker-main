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

var passwordMaker;

function onOK() {
  var p = document.getElementById("pattern").value.replace(/^\s*|\s*$/g,"");
  if (p == "") {
    alert(passwordMaker.stringBundle.GetStringFromName("pattern.onOK.01"));
    return false;
  }
  else {
  	var isRegEx = document.getElementById("regex").selected;
  	if (isRegEx) {
	    try {  
		    new RegExp((p[0]=="^"?"":"^") + p + (p[p.length-1]=="$"?"":"$"));
	    }
	    catch(e) {
		    alert(passwordMaker.sprintf(passwordMaker.stringBundle.GetStringFromName("pattern.onOK.02"), document.getElementById("pattern").value));    
	    	return false;
	    }
	  }
    window.arguments[0].out = {name:document.getElementById("name").value,
      pattern:p, type:isRegEx?"regex":"wildcard", enabled:document.getElementById("enabled").checked};
    return true;
  }
}

function onLoad() {
	dump(window.arguments[0].inn.passwordMaker + "\n");
	passwordMaker = window.arguments[0].inn.passwordMaker;
  sizeToContent();
  document.getElementById("name").value = window.arguments[0].inn.name;
  document.getElementById("pattern").value = window.arguments[0].inn.pattern;
  document.getElementById("type").selectedIndex = window.arguments[0].inn.type == "wildcard" ? 0 : 1;
  document.getElementById("enabled").checked = window.arguments[0].inn.enabled;
}
