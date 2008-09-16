/**
  PasswordMaker - Creates and manages passwords
  Copyright (C) 2005 Eric H. Jung and LeahScape, Inc.
  All Rights Reserved.
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
  
  Thanks to Harry Whitfield for initial versions and inspiration.
**/

function ImageMenu(menuName, menuItems, menuActionName, img, sizeAdjust, select) {
  this.menuItems = new Array();
  for (var i=0; i<menuItems.length; i++)
    this.menuItems[i] = menuItems[i];
  this.menuAction = menuActionName;
  this.hOff = eval(img + ".hOffset");
  this.vOff = parseInt(eval(img + ".vOffset + " + (13*sizeAdjust)));
  this.menuName = menuName;
  this.img = img;
  this.updateSelection(select);
}

ImageMenu.prototype.updateSelection = function(s) {
  for (i in this.menuItems) {
    if (this.menuItems[i].src == s) {
      this.selected = this.menuItems[i].displayText;
      this.selectedSrc = this.menuItems[i].src; // TODO: just save the ImageMenuItem instead of its elements
      break;
    }
  }
  return null;
}

ImageMenu.prototype.select = function() {
  var contextItems = new Array();
  for (i in this.menuItems) {
    contextItems[i] = this.menuItems[i].menuItem;
    contextItems[i].checked = this.menuItems[i].displayText == this.selected;
    //dump(this.menuName.selected + '=' + this.img + '.src="' + this.menuItems[i].src + '";' + this.menuAction + '()');
    contextItems[i].onSelect = this.img + '.src="' + this.menuItems[i].src + '";' + this.menuName + '.updateSelection("' + this.menuItems[i].src + '");' + this.menuAction + '()';
  }
  popupMenu(contextItems, this.hOff, this.vOff);
  updateNow();
}
