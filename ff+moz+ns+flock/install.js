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

// XpiInstaller
// By Pike (Heavily inspired by code from Henrik Gemal and Stephen Clavering)

var XpiInstaller = {

	// --- Editable items begin ---
	extFullName: 'PasswordMaker', // The name displayed to the user (don't include the version)
	extShortName: 'passwdmaker', // The leafname of the JAR file (without the .jar part)
	extVersion: '1.7.2',
	extAuthor: 'LeahScape, Inc.',
	extLocaleNames: ['en-US','de-DE','es-ES','fr-FR','nl-NL','pl-PL','pt-BR','zh-CN'],
	extSkinNames: ['classic', 'modern'], // e.g. ['classic', 'modern']
	extPostInstallMessage: 'Success! Please restart your browser to finish the installation, then use the tools menu or the new toolbar icon to access PasswordMaker.',
	// --- Editable items end ---

	profileInstall: true,
	silentInstall: false,

	install: function()
	{
		var jarName = this.extShortName + '.jar';
		var profileDir = Install.getFolder('Profile', 'chrome');

		// Parse HTTP arguments
		this.parseArguments();

		// Check if extension is already installed in profile
		if (File.exists(Install.getFolder(profileDir, jarName)))
		{
			if (!this.silentInstall)
			{
				Install.alert('Updating existing Profile install of ' + this.extFullName + ' to version ' + this.extVersion + '.');
			}
			this.profileInstall = true;
		}
		else if (!this.silentInstall)
		{
			// Ask user for install location, profile or browser dir?
			this.profileInstall = Install.confirm('Install ' + this.extFullName + ' ' + this.extVersion + ' to your Profile directory (OK) or your Browser directory (Cancel)?');
		}

		// Init install
		var dispName = this.extFullName + ' ' + this.extVersion;
		var regName = '/' + this.extAuthor + '/' + this.extShortName;
		Install.initInstall(dispName, regName, this.extVersion);

		// Find directory to install into
		var installPath;
		if (this.profileInstall) installPath = profileDir;
		else installPath = Install.getFolder('chrome');

		// Add JAR file
		Install.addFile(null, 'chrome/' + jarName, installPath, null);

		// Register chrome
		var jarPath = Install.getFolder(installPath, jarName);
		var installType = this.profileInstall ? Install.PROFILE_CHROME : Install.DELAYED_CHROME;

		// Register content
		Install.registerChrome(Install.CONTENT | installType, jarPath, 'content/' + this.extShortName + '/');

		// Register locales
		for (var locale in this.extLocaleNames)
		{
			var regPath = 'locale/' + this.extLocaleNames[locale] + '/';
			Install.registerChrome(Install.LOCALE | installType, jarPath, regPath);
		}

		// Register skins
		for (var skin in this.extSkinNames)
		{
			var regPath = 'skin/' + this.extSkinNames[skin] + '/' + this.extShortName + '/';
			Install.registerChrome(Install.SKIN | installType, jarPath, regPath);
		}

		// Perform install
		var err = Install.performInstall();
		if (err == Install.SUCCESS || err == Install.REBOOT_NEEDED)
		{
			if (!this.silentInstall && this.extPostInstallMessage)
			{
				Install.alert(this.extPostInstallMessage);
			}
		}
		else
		{
			this.handleError(err);
			return;
		}
	},

	parseArguments: function()
	{
		// Can't use string handling in install, so use if statement instead
		var args = Install.arguments;
		if (args == 'p=0')
		{
			this.silentInstall = true;
		}
		else if (args == 'p=1')
		{
			this.silentInstall = true;
		}
	},

	handleError: function(err)
	{
		if (!this.silentInstall)
		{
			Install.alert('Error: Could not install ' + this.extFullName + ' ' + this.extVersion + ' (Error code: ' + err + ')');
		}
		Install.cancelInstall(err);
	}
};

XpiInstaller.install();
