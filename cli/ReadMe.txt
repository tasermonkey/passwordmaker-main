PasswordMaker - Creates and manages passwords.
Command-Line Edition
http://passwordmaker.org/

Copyright 2005, 2006 LeahScape, Inc.
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


INSTRUCTIONS
============

Handle with care. Dry clean only.

PasswordMaker searches for and reads a file named passwordmaker.rdf in the
current directory. If found, the password is generated using the "Defaults"
settings as specified in this file. Command-line arguments override (take
precedence over) passwordmaker.rdf settings. Command-line arguments, in turn,
override (take precendence over) built-in default settings.

If a command-line argument is missing or not specified in the "Defaults" of
passwordmaker.rdf or the file pointed to by -f/--file, these built-in defaults are
used in its place:

    masterPassword : none
    url            : none
    algorithm      : MD5
    hmac           : no
    trim           : yes
    length         : 8
    characters     : ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+={}|[]\:";'<>?,./
    useLeet        : none
    leetLevel      : 0
    username       : none
    modifier       : none
    prefix         : none
    suffix         : none


USAGE
=====

   passwordmaker  [-f <string>] [-b] [-0] [-x] [-r <string>] [-a <MD4|MD5
                  |SHA1|SHA256|RIPEMD160>] [--account_skip <interger>]
                  [--account <string>] [-c <string>] [-g <integer>] [-d
                  <string>] [-s <string>] [-p <string>] [-u <string>] [-l
                  <none|before|after|both>] [-e <1|2|3|4|5|6|7|8|9>] [-m
                  <string>] [--] [-v] [-h]


Where:

   -f <string>,  --file <string>
     (value required)  Path/filename to a settings file

   -b,  --verbose
     Echo command-line arguments

   -0,  --trimzeros
     Trim leading zeros from the generated password

   -x,  --HMAC
     Use the HMAC version of the specified hash algorithm

   -r <string>,  --url <string>
     (value required)  URL (equivalent to "Use This URL" in the
     Firefox/Mozilla extension)

   -a <MD4|MD5|SHA1|SHA256|RIPEMD160>,  --alg <MD4|MD5|SHA1|SHA256
      |RIPEMD160>
     (value required)  Hash Algorithm

   --account_skip <interger>
     (value required)  Account skip

   --account <string>
     (value required)  Account

   -c <string>,  --chars <string>
     (value required)  Characters

   -g <integer>,  --length <integer>
     (value required)  Password Length

   -d <string>,  --modifier <string>
     (value required)  Password Modifier

   -s <string>,  --suffix <string>
     (value required)  Password Suffix

   -p <string>,  --prefix <string>
     (value required)  Password Prefix

   -u <string>,  --username <string>
     (value required)  Username

   -l <none|before|after|both>,  --l33t <none|before|after|both>
     (value required)  Where to use l33t

   -e <1|2|3|4|5|6|7|8|9>,  --level <1|2|3|4|5|6|7|8|9>
     (value required)  l33t level

   -m <string>,  --mpw <string>
     (value required)  Master Password

   --,  --ignore_rest
     Ignores the rest of the labeled arguments following this flag.

   -v,  --version
     Displays version information and exits.

   -h,  --help
     Displays usage information and exits.

Example:

   passwordmaker.exe -m foobar -r google.com -u ericjung -g 12 -a SHA1 -x
   
   Assuming passwordmaker.rdf is not found, this example generates a password
   with the following settings:
   
    masterPassword : foobar
    url            : google.com
    algorithm      : HMAC-SHA1
    trim           : yes
    length         : 12
    characters     : ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+={}|[]\:";'<>?,./
    useLeet        : none
    leetLevel      : 0
    username       : ericjung
    modifier       : none
    prefix         : none
    suffix         : none
    
    The generated password is BBg*6R#y7}c3
   
   

RELEASE HISTORY
===============

1.4.2 - 14 January 2008 - Changed defaults to match Firefox extension of PasswordMaker
1.4.1 - 22 May 2007 - The master password does not echo the characters typed
						Unix method was provided here (at the same time as this
						request was made): http://forums.passwordmaker.org/index.php/topic,1294.0.html
1.4   - 23 July 2006 - Master password is prompted for if it's not present on
						command-line options. Fixed leet levels 8 and 9.
1.3   - 26 April 2006 - Added account support and building instructions. Slight
                         tweaks to unix makefile to make it compatible with OS X.
1.2   - 06 Feburary 2006 - Added mhash support. A *n?x makefile is included as well.
1.1   - 30 January 2006 - Added "-f" option to specify the path & filename to
                         a passwordmaker settings file. Expanded ReadMe.txt
                         documentation. Support for unlimited password length.
1.0   - 10 January 2006 - Initial release.
