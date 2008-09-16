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

var pwdMakerStatusBar = {

/*
	<statusbar id="status-bar">
		<tooltip id="passwordmaker-status-tip"
		  onpopupshowing="pwdMakerStatusBar.onTooltipShowing(this)"
		  style="max-height: none; max-width: none;"/>
		<statusbarpanel onclick="passwordMaker.open();" tooltip="passwordmaker-status-tip"
		  id="passwordmaker-status" class="statusbarpanel-menu-iconic"
  		src="chrome://passwdmaker/content/images/ring-16x16-disabled.png"
	  	xxinsertafter="statusbarpanel-progress,security-button,privacy-button,offline-status,popupIcon,statusbar-display,component-bar,"/>
  </statusbar>
*/

  statusElem : null,
  tooltip : null,
  disabledIcon : "chrome://passwdmaker/content/images/ring-16x16-disabled.png",
  uriForDefault : null,
  
  init : function() {
    pwdMakerStatusBar.statusElem = document.createElement("statusbarpanel");
    pwdMakerStatusBar.statusElem.setAttribute("onclick", "passwordMaker.open();");
    pwdMakerStatusBar.statusElem.setAttribute("tooltip", "passwordmaker-status-tip");    
    pwdMakerStatusBar.statusElem.setAttribute("id", "passwordmaker-status");        
    pwdMakerStatusBar.statusElem.setAttribute("class", "statusbarpanel-menu-iconic");    
    pwdMakerStatusBar.statusElem.setAttribute("src", "chrome://passwdmaker/content/images/ring-16x16-disabled.png");           
    
    pwdMakerStatusBar.tooltip = document.createElement("tooltip");
    pwdMakerStatusBar.tooltip.setAttribute("id", "passwordmaker-status-tip");
    pwdMakerStatusBar.tooltip.setAttribute("onpopupshowing", "pwdMakerStatusBar.onTooltipShowing(this);");
    pwdMakerStatusBar.tooltip.setAttribute("style", "max-height: none; max-width: none;");    
    pwdMakerStatusBar.tooltip.setAttribute("noautohide", "true");    
    
    pwdMakerStatusBar.showHideStatusbar();
  },

  showHideStatusbar : function() {
    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
    var recentWindow = wm.getMostRecentWindow("navigator:browser");
    if (recentWindow) {
      statusBar = recentWindow.document.getElementById("status-bar");
      if (passwordMaker._getLiteral(passwordMaker.globalSettingsSubjectRes, passwordMaker.statusbarIndicatorPredicateRes) == "true") {
        if (!recentWindow.document.getElementById("passwordmaker-status")) {
          // Only append if it hasn't already been appended       
          statusBar.appendChild(recentWindow.pwdMakerStatusBar.statusElem);
          statusBar.appendChild(recentWindow.pwdMakerStatusBar.tooltip);
        }
      }
      else {
        // Only remove if it hasn't already been removed
        if (recentWindow.document.getElementById("passwordmaker-status")) { 
          statusBar.removeChild(recentWindow.pwdMakerStatusBar.tooltip);
          statusBar.removeChild(recentWindow.pwdMakerStatusBar.statusElem);      
        }
      } 
    }
  },
    
  toggleShowHide : function(checked) {
    PwdMkr_RDFUtils.updateTarget(passwordMaker.globalSettingsSubjectRes, "statusbarIndicator", checked ? "true":"false");
    pwdMakerStatusBar.showHideStatusbar();  
  },
  
  clear : function() {
    pwdMakerStatusBar.statusElem.setAttribute("src", pwdMakerStatusBar.disabledIcon);
    if (pwdMakerStatusBar.tooltip.firstChild != null)
      pwdMakerStatusBar.tooltip.removeChild(pwdMakerStatusBar.tooltip.firstChild);
  },
  
  update : function(subjectRes, settings) {
      pwdMakerStatusBar.statusElem.setAttribute("src",
        subjectRes == passwordMaker.defaultAccount.subjectRes ? "chrome://passwdmaker/content/images/ring-16x16-enabled.png" :
        "chrome://passwdmaker/content/images/ring-16x16-tilted.png");
        
    window['passwordmaker.statusbar.subjectRes'] = subjectRes;
    window['passwordmaker.statusbar.settings'] = settings;    
  },
  
  onTooltipShowing : function(tooltip) {
      
    // Thanks, FoxClocks
    if (pwdMakerStatusBar.tooltip.firstChild != null)
      pwdMakerStatusBar.tooltip.removeChild(pwdMakerStatusBar.tooltip.firstChild); 

    if (pwdMakerStatusBar.statusElem.getAttribute("src") == pwdMakerStatusBar.disabledIcon) {
      var desc = document.createElement("description");
      desc.setAttribute("value", passwordMaker.stringBundle.GetStringFromName("statusbar.onTooltipShowing.01"));
      pwdMakerStatusBar.tooltip.appendChild(desc);
      return;
    }
      
		var tooltipGrid = document.createElement("grid");
		tooltipGrid.setAttribute("flex", "1");
		pwdMakerStatusBar.tooltip.appendChild(tooltipGrid);

		var gridColumns = document.createElement("columns");
		gridColumns.appendChild(document.createElement("column"));
		gridColumns.appendChild(document.createElement("column"));
		tooltipGrid.appendChild(gridColumns);

		var gridRows = document.createElement("rows");
		tooltipGrid.appendChild(gridRows);

    pwdMakerStatusBar._makeHeaderRow(passwordMaker.stringBundle.GetStringFromName("statusbar.onTooltipShowing.02"), gridRows);
    pwdMakerStatusBar._makeRow("", "", gridRows);

    var ret = window['passwordmaker.statusbar.settings'];
    pwdMakerStatusBar._makeRow(passwordMaker.stringBundle.GetStringFromName("statusbar.onTooltipShowing.03"), pwdMakerStatusBar._makeFriendlyString(ret.name), gridRows);    
    pwdMakerStatusBar._makeRow(passwordMaker.stringBundle.GetStringFromName("statusbar.onTooltipShowing.04"), pwdMakerStatusBar._makeFriendlyString(ret.description), gridRows);        
    pwdMakerStatusBar._makeRow(passwordMaker.stringBundle.GetStringFromName("statusbar.onTooltipShowing.05"), pwdMakerStatusBar._makeFriendlyString(ret.username), gridRows);
    if (window['passwordmaker.statusbar.subjectRes'] == passwordMaker.defaultAccount.subjectRes) {
      //pwdMakerStatusBar._makeRow("Protocol", ret.protocol, gridRows);
      //pwdMakerStatusBar._makeRow("Subdomain", pwdMakerStatusBar._makeFriendlyString(ret.subdomain), gridRows);      
      //pwdMakerStatusBar._makeRow("Domain", pwdMakerStatusBar._makeFriendlyString(ret.domain), gridRows);
      //pwdMakerStatusBar._makeRow("Path, etc.", pwdMakerStatusBar._makeFriendlyString(ret.path), gridRows);       
      pwdMakerStatusBar._makeRow(passwordMaker.stringBundle.GetStringFromName("statusbar.onTooltipShowing.06"), pwdMakerStatusBar._makeFriendlyString(passwordMaker.getCalculatedURIUsedForDefault()),
        gridRows);
    }
    else { 
      pwdMakerStatusBar._makeRow(passwordMaker.stringBundle.GetStringFromName("statusbar.onTooltipShowing.07"), pwdMakerStatusBar._makeFriendlyString(ret.urlToUse), gridRows);    
    }
    pwdMakerStatusBar._makeRow(passwordMaker.stringBundle.GetStringFromName("statusbar.onTooltipShowing.08"), ret.passwordLength, gridRows);
    pwdMakerStatusBar._makeRow(passwordMaker.stringBundle.GetStringFromName("statusbar.onTooltipShowing.09"), pwdMakerStatusBar._makeFriendlyString(ret.charset), gridRows);
    pwdMakerStatusBar._makeRow(passwordMaker.stringBundle.GetStringFromName("statusbar.onTooltipShowing.10"), pwdMakerStatusBar._makeFriendlyString(ret.prefix), gridRows);
    pwdMakerStatusBar._makeRow(passwordMaker.stringBundle.GetStringFromName("statusbar.onTooltipShowing.11"), pwdMakerStatusBar._makeFriendlyString(ret.suffix), gridRows);
    pwdMakerStatusBar._makeRow(passwordMaker.stringBundle.GetStringFromName("statusbar.onTooltipShowing.12"), pwdMakerStatusBar._makeFriendlyString(ret.counter), gridRows);   
    pwdMakerStatusBar._makeRow(passwordMaker.stringBundle.GetStringFromName("statusbar.onTooltipShowing.13"), ret.whereLeet=="off"?passwordMaker.stringBundle.GetStringFromName("statusbar.onTooltipShowing.14"):ret.whereLeet=="before-hashing"?
      passwordMaker.stringBundle.GetStringFromName("statusbar.onTooltipShowing.15"):ret.whereLeet=="after-hashing"?passwordMaker.stringBundle.GetStringFromName("statusbar.onTooltipShowing.16"):passwordMaker.stringBundle.GetStringFromName("statusbar.onTooltipShowing.17"), gridRows);        
    pwdMakerStatusBar._makeRow(passwordMaker.stringBundle.GetStringFromName("statusbar.onTooltipShowing.18"), ret.whereLeet=="off"?passwordMaker.stringBundle.GetStringFromName("statusbar.onTooltipShowing.19"):ret.leetLevel, gridRows);   
    pwdMakerStatusBar._makeRow(passwordMaker.stringBundle.GetStringFromName("statusbar.onTooltipShowing.20"), ret.hashAlgorithm, gridRows);      
    pwdMakerStatusBar._makeRow(passwordMaker.stringBundle.GetStringFromName("statusbar.onTooltipShowing.21"), pwdMakerStatusBar._makeFriendlyString(ret.autoPopulate), gridRows); 
  },
  
  _makeFriendlyString : function(str) {
    if (!str)
      return "";    
    if (str == "")
      return "";
    if (str == "true")
      return "yes";
    if (str == "false")
      return "no";
    if (str.length > 20)
      return str.substring(0, 20) + "...";
    return str;
  },
  
  _makeHeaderRow : function(col, gridRows) {
		var label = document.createElement("label");
		label.setAttribute("value", col);      
    label.setAttribute("style", "font-weight: bold; text-decoration: underline; color: #3366FF;");
    gridRows.appendChild(label);    
  },
    
  _makeRow : function(col1, col2, gridRows) {
		var gridRow = document.createElement("row");
		var label = document.createElement("label");
		label.setAttribute("value", col1);    
		gridRow.appendChild(label);
		label = document.createElement("label");
		label.setAttribute("value", col2);
 		gridRow.appendChild(label);
		gridRows.appendChild(gridRow);  
  }
};