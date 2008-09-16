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
*/

if (typeof(PasswordMakerPrefsWrapper) != 'boolean') {
	var PasswordMakerPrefsWrapper = true;
	var PasswordMakerPrefsWrapper = {

    /**
     * Retrieves the state of an individual string preference.
     * Returns the value of the preference if it exists in either the current or
     * default preference tree. Returns the default argument
     * if the preference does not exist in either of those trees, or is not of string type.
     * If no default argument is specified, null is returned in its place.
     */
    getChar : function(prefName, defawlt) { //eval('"'
      var ret;
      try {
        ret = this._prefsService.getPrefType(prefName);
        if (ret == this._prefsService.PREF_STRING)
          ret = this._prefsService.getCharPref(prefName)
        else
          ret = defawlt;
      }
      catch (e) {
        ret = defawlt;
      }
      if (typeof(ret) == "string")
        return ret;
      else if (typeof(ret) == "number")
        return eval('"' + ret + '"');
      return null;
    },

    /**
     * Clear the state of an individual preference
     */
    clear : function(prefName) {
      try {
        this._prefsService.clearUserPref(prefName);
      }
      catch (e) {
      }
    }
  }

  PasswordMakerPrefsWrapper._prefsService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
  PasswordMakerPrefsWrapper._prefsService = PasswordMakerPrefsWrapper._prefsService.getBranch("extensions.passwordmaker.");

}