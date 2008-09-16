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

// Eric Jung - Many thanks to Andy McDonald of the FoxClocks extension
// AFM - from http://forums.mozillazine.org/viewtopic.php?t=308369

const CI = Components.interfaces, CC = Components.classes, CR = Components.results;
function PasswordMaker_XPCom() {}

PasswordMaker_XPCom.prototype = {
	classID: Components.ID("{12fc70d0-5ae7-11da-8cd6-0800200c9a66}"),
	contractID: "@leahscape.org/firefox/passwordmaker;1",
	classDescription: "PasswordMaker XPCom",
	
	QueryInterface: function(aIID) {
		if( !aIID.equals(CI.nsISupports) && !aIID.equals(CI.nsIObserver))
			throw CR.NS_ERROR_NO_INTERFACE;
			
		return this;
	},

	observe: function(aSubject, aTopic, aData) {
		switch(aTopic) {
			case "xpcom-startup":
				// this is run very early, right after XPCOM is initialized, but before
				// user profile information is applied. Register ourselves as an observer
				// for 'profile-after-change' and 'quit-application'
				//			
				var obsSvc = CC["@mozilla.org/observer-service;1"].getService(CI.nsIObserverService);
				//obsSvc.addObserver(this, "profile-after-change", false);
				obsSvc.addObserver(this, "quit-application", false);
				obsSvc.addObserver(this, "domwindowclosed", false);
				break;
			
			//case "profile-after-change":
				// This happens after profile has been loaded and user preferences have been read.
				// startup code here
				//
				//break;
			
			case "quit-application":
				// shutdown code
				//dump("quit-application\n");
				break;
				
			case "domwindowclosed":		
				//var consoleService = Components.classes['@mozilla.org/consoleservice;1']
                               //.getService(Components.interfaces.nsIConsoleService);
							   
				//consoleService.logStringMessage("PasswordMaker XPCom domwindowclosed");
        var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
        var recentWindow = wm.getMostRecentWindow("navigator:browser");
        if (!recentWindow) {
          // Close all passwordmakers (should only be one, but let's play it safe)
          var e = wm.getEnumerator("passwordmaker");
          while (e.hasMoreElements())
            e.getNext().close();
        }	
				break;
		
			//default:
				//throw Components.Exception("Unknown topic: " + aTopic);
		}
	}
};

// constructors for objects we want to XPCOMify
//
var gXpComObjects = [PasswordMaker_XPCom];
var gCatObserverName = "passwordmaker_catobserver";
var gCatContractId = PasswordMaker_XPCom.prototype.contractID;


// AFM - generic registration code
//

function NSGetModule(compMgr, fileSpec) {
	gModule._catObserverName = gCatObserverName;
	gModule._catContractId = gCatContractId;
	
	for (var i in gXpComObjects)
		gModule._xpComObjects[i] = new gFactoryHolder(gXpComObjects[i]);
		
	return gModule;
}

function gFactoryHolder(aObj) {
	this.CID        = aObj.prototype.classID;
	this.contractID = aObj.prototype.contractID;
	this.className  = aObj.prototype.classDescription;
	this.factory =
	{
		createInstance: function(aOuter, aIID)
		{
			if (aOuter)
				throw CR.NS_ERROR_NO_AGGREGATION;
				
			return (new this.constructor).QueryInterface(aIID);
		}
	};
	
	this.factory.constructor = aObj;
}

var gModule = {
	registerSelf: function (aComponentManager, aFileSpec, aLocation, aType) {
		aComponentManager.QueryInterface(CI.nsIComponentRegistrar);
		for (var key in this._xpComObjects)
		{
			var obj = this._xpComObjects[key];
			aComponentManager.registerFactoryLocation(obj.CID, obj.className,
			obj.contractID, aFileSpec, aLocation, aType);
		}
		
		var catman = CC["@mozilla.org/categorymanager;1"].getService(CI.nsICategoryManager);
		catman.addCategoryEntry("xpcom-startup", this._catObserverName, this._catContractId, true, true);
		catman.addCategoryEntry("xpcom-shutdown", this._catObserverName, this._catContractId, true, true);
	},

	unregisterSelf: function(aCompMgr, aFileSpec, aLocation) {
		var catman = CC["@mozilla.org/categorymanager;1"].getService(CI.nsICategoryManager);
		catman.deleteCategoryEntry("xpcom-startup", this._catObserverName, true);
		catman.deleteCategoryEntry("xpcom-shutdown", this._catObserverName, true);
		
		aComponentManager.QueryInterface(CI.nsIComponentRegistrar);
		for (var key in this._xpComObjects)
		{
			var obj = this._xpComObjects[key];
			aComponentManager.unregisterFactoryLocation(obj.CID, aFileSpec);
		}
	},

	getClassObject: function(aComponentManager, aCID, aIID)	{
		if (!aIID.equals(CI.nsIFactory))
			throw CR.NS_ERROR_NOT_IMPLEMENTED;
		
		for (var key in this._xpComObjects)
		{
			if (aCID.equals(this._xpComObjects[key].CID))
				return this._xpComObjects[key].factory;
		}
	
		throw CR.NS_ERROR_NO_INTERFACE;
	},

	canUnload: function(aComponentManager) { return true; },
	
	_xpComObjects: {},
	_catObserverName: null,
	_catContractId: null
};