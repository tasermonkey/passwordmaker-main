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

/**************************************************
* ECMAScript leetspeak - Version 1.0 by           *
* Eric H. Jung <grimholtz@yahoo.com>              *
*                                                 *
* Ported from Oliver Gobin's <og@ogobin.org>      *
* PHP leetspeak - Version 1.0                     *
* http://www.ogobin.org/bin/scripts/31337.php.inc *
*                                                 *
* What is leetspeak?                              *
* http://www.wikipedia.org/wiki/Leet              *
* http://www.heise.de/ct/00/11/003/               *
***************************************************/

if (typeof(PasswordMaker_l33t) != "boolean") {
	var PasswordMaker_l33t = true;
	var PasswordMaker_l33t = {
    alphabet : new Array(/a/g, /b/g, /c/g, /d/g, /e/g, /f/g, /g/g, /h/g, /i/g, /j/g, /k/g, /l/g, /m/g, /n/g, /o/g, /p/g, /q/g, /r/g, /s/g, /t/g, /u/g, /v/g, /w/g, /x/g, /y/g, /z/g),
    levels : new Array(
      new Array("4", "b", "c", "d", "3", "f", "g", "h", "i", "j", "k", "1", "m", "n", "0", "p", "9", "r", "s", "7", "u", "v", "w", "x", "y", "z"),
      new Array("4", "b", "c", "d", "3", "f", "g", "h", "1", "j", "k", "1", "m", "n", "0", "p", "9", "r", "5", "7", "u", "v", "w", "x", "y", "2"),
      new Array("4", "8", "c", "d", "3", "f", "6", "h", "'", "j", "k", "1", "m", "n", "0", "p", "9", "r", "5", "7", "u", "v", "w", "x", "'/", "2"),
      new Array("@", "8", "c", "d", "3", "f", "6", "h", "'", "j", "k", "1", "m", "n", "0", "p", "9", "r", "5", "7", "u", "v", "w", "x", "'/", "2"),
      new Array("@", "|3", "c", "d", "3", "f", "6", "#", "!", "7", "|<", "1", "m", "n", "0", "|>", "9", "|2", "$", "7", "u", "\\/", "w", "x", "'/", "2"),
      new Array("@", "|3", "c", "|)", "&", "|=", "6", "#", "!", ",|", "|<", "1", "m", "n", "0", "|>", "9", "|2", "$", "7", "u", "\\/", "w", "x", "'/", "2"),
      new Array("@", "|3", "[", "|)", "&", "|=", "6", "#", "!", ",|", "|<", "1", "^^", "^/", "0", "|*", "9", "|2", "5", "7", "(_)", "\\/", "\\/\\/", "><", "'/", "2"),
      new Array("@", "8", "(", "|)", "&", "|=", "6", "|-|", "!", "_|", "|\(", "1", "|\\/|", "|\\|", "()", "|>", "(,)", "|2", "$", "|", "|_|", "\\/", "\\^/", ")(", "'/", "\"/_"),
      new Array("@", "8", "(", "|)", "&", "|=", "6", "|-|", "!", "_|", "|\{", "|_", "/\\/\\", "|\\|", "()", "|>", "(,)", "|2", "$", "|", "|_|", "\\/", "\\^/", ")(", "'/", "\"/_")),

    /**
     * Convert the string in _message_ to l33t-speak
     * using the l33t level specified by _leetLevel_.
     * l33t levels are 1-9 with 1 being the simplest
     * form of l33t-speak and 9 being the most complex.
     *
     * Note that _message_ is converted to lower-case if
     * the l33t conversion is performed.
     * Future versions can support mixed-case, if we need it.
     *
     * Using a _leetLevel_ <= 0 results in the original message
     * being returned.
     *
     */
    convert : function(leetLevel, message) {
      if (leetLevel > 0) {
        var ret = message.toLowerCase();
        for (var item = 0; item < this.alphabet.length; item++)
          ret = ret.replace(this.alphabet[item], this.levels[leetLevel-1][item]);
        return ret;
      }
      return message;
    }
  }
}