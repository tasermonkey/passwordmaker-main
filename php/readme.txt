PasswordMaker - Creates and manages passwords.
PHP/Mobile Edition
http://passwordmaker.org/

Copyright 2005, 2006, 2007 LeahScape, Inc.
All Rights Reserved.
grimholtz@yahoo.com


LICENSE
=======

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


AUTHORS
=======
Miquel Burns - http://www.miquelfire.com/
Eric H. Jung - grimholtz@yahoo.com


ABOUT
=====

The purpose of PASSWORDMAKER is to enable you to securely and easily log in to
Internet applications, such as websites, instant messaging, ftp, and others.
With the proliferation of online resouces, you probably have usernames and
passwords for banks, bill pay systems, email accounts, credit card websites,
instant messenger, investment accounts, photo sites, blogging tools, and
countless others. Most people have a few passwords they use for all of these
accounts because it's easier to remember just a few. But this is incredibly risky.

What if you could use passwords unique as fingerprints for each and every one
of your accounts, yet not have to remember those fingerprints? PASSWORDMAKER
does just that. By using complex mathematical formulae, PASSWORDMAKER outputs
the same unique passwords for you each and every time you provide it with the
same input. And these passwords are unique across the globe (providing they are
of sufficient length).

But only a genius could memorize so many unique passwords. Don't write them
down on sticky notes for others to find; no, PASSWORDMAKER calculates them for
you over and over again -- as needed -- without storing them so nothing be
hacked, lost or stolen.

USAGE
=====
The core of this edition is the passwordmaker_class.php file. This file is
designed to allow to be used in just about any PHP application. This package
includes two sample applications, a command-line powered one (note: There's
a C++ version that is recommended instead) and a web page one targeting
moble phones.

To use the command-line powered one, just run the passwordmaker.php script with
the parameters. On Linux, you can set the execacutible bit and run it directly
(provided php cli is at /usr/bin, otherwise you'll have to edit the first line).
On all platforms, find out the location of the cli PHP and run
php -f passwordmaker.php

To use the mobile edition, just upload passwordmaker_class.php, mobile.xhtml,
and mobile-submit.php to a directory on a PHP powered web host. Then you can
access the form to get your passwords. You may rename mobile.xhtml if you like.

RELEASE HISTORY
===============
1.5 - 22 Apr 2008 - Allows for using the fixed HMAC-SHA-256 algorithm. Old on is still supported.
1.4.1 - 14 Jan 2008 - Fixed defaults for mobile edition to match Firefox extension of PasswordMaker
1.4 - 31 Dec 2007 - Able to run without mHash. Will use mHash if it's there. (Not used with the buggy HMAC-SHA256 however.)
	Really merged Modile Edition for releases.
	Fixed bug with arbitrary length passwords.
1.3.1 - 22 May 2007 -  Fixed leet levels 8 and 9.
	Combined with Mobile edition for releases.
	Fixed an error with handling arguements as pointed out here: http://forums.passwordmaker.org/index.php/topic,1303.0.html
	Reformatted the file to use tabs instead of spaces
1.3   - 10 May 2006 -  Support of MD5 0.6
1.2.2 - 01 Feb 2006 -  Fixed a bug where unlimited password support was broken due to a varible not being incremented.
1.2.1 - 01 Feb 2006 -  Fixed a syntax bug introduced by arbitrary length password support (version 1.2). This resulted in incorrectly generated passwords.
1.2   - 27 Jan 2006 -  Supports arbitrary length passwords like the other versions. Really fixed default character set this time.
1.1   - Date unknown - Fixed bug with default character set and improved error messages.
1.0.1 - 17 Dec 2005  - ?                        
1.0.  - Various 2005 - Initial release posted in various threads at http://forums.passwordmaker.org in 2005
