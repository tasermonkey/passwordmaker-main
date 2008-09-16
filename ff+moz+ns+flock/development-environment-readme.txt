How to setup a PasswordMaker development environment in Firefox on Windows:

1. Modify your Firefox shortcut to include these command-line arguments:
     -console -profileManager
     e.g.: "C:\Program Files\Mozilla Firefox\firefox.exe" -console -profileManager
   Now whenever you start Firefox, you can see stdout in the console.
   This is important because all dump() statements in PasswordMaker
   write to stdout. The profileManager argument allows you to create/delete
   profiles which you'll need for step 2.

2. Start FF and create a new profile.

3. Install the latest version of Ted's Extension Developer's Extension from
   http://ted.mielczarek.org/code/mozilla/extensiondev/

4. Restart FF so the extension is installed.

5. Go to Tools->Extension Developer->Toggle debugging prefs. This will
   do things like turn off XUL caching, enable dump() statement output, etc.

6. Close FF.

7. Find the new profile on your hard drive. Go to its extensions\ directory;
   e.g., C:\Documents and Settings\EricJu\Application Data\Mozilla\Firefox\
            Profiles\g1jro8hx.dev\extensions
   and create a file named {5872365e-67d1-4afd-9480-fd293bebd20d}
   It's contents should be the path to your passwordmaker dev directory; e.g.:
     <drive>:\dev\passwordmaker\ff+moz+ns+flock\trunk
   
8. Start FF. You should be able to access PasswordMaker. Now any change you
   make to non-overlay code takes effect immediately. However, you must close
   and re-open dialogs for dialog-included JS and XUL changes to be visible.
   If you make changes to overlay code, you must restart FF for the changes
   to take effect.

9. Use dump() statements to output stuff to stdout; alert() statements to
   alert. There are more elaborate debugging tools these days, but we don't
   use any yet.

See http://forums.mozillazine.org/viewtopic.php?t=360892 (page 2) for more info
