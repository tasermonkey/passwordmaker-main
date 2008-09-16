function pswdmOpenLink(URL){
	if(!URL){return;}
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
           .getService(Components.interfaces.nsIWindowMediator);
	var win = wm.getMostRecentWindow("navigator:browser");
	var pswdmGetBrowser = win.getBrowser();
	var currBlank = (pswdmGetBrowser &&
	(pswdmGetBrowser.mCurrentTab.linkedBrowser &&
	(pswdmGetBrowser.mCurrentTab.linkedBrowser.contentDocument.location == "about:blank")) ||
	(!pswdmGetBrowser.mCurrentTab.linkedBrowser &&
	(pswdmGetBrowser.mCurrentTab.label == "(Untitled)")));
	if (currBlank)
		{
			var resultsWindow = win.loadURI(URL);
		} else {
			var resultsWindow = win.openNewTabWith(URL, this.docURL, null, null);
    }//if
    return true;
}
