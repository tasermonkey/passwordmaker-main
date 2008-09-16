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

var name, desc;

function onOK() {
  // trim name
  window.arguments[0].out = {name:name.value.replace(/^\s*|\s*$/g,""),
    description:desc.value};
  return true; // close the dialog
}

function onLoad() {
  name = document.getElementById("name");
  desc = document.getElementById("desc");  
  var temp = window.arguments[0].inn.name;
  name.value = temp == null ? "" : temp;
  temp = window.arguments[0].inn.description;
  desc.value = temp == null ? "" : temp;
  sizeToContent();
  name.focus();
}
