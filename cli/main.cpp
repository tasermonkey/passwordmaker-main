/**
 * PasswordMaker - Creates and manages passwords
 * Copyright (C) 2005 Eric H. Jung and LeahScape, Inc.
 * http://passwordmaker.org/
 * grimholtz@yahoo.com
 *
 * This library is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or (at
 * your option) any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESSFOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this library; if not, write to the Free Software Foundation,
 * Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 * 
 * Written by Miquel Burns <miquelfire@gmail.com> and Eric H. Jung
*/

// test.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"
#include "passwordmaker.h"
#include "tclap/CmdLine.h"
#include "pwmdefaults.h"
#ifdef WIN32
#define WIN32_LEAN_AND_MEAN 
#include <windows.h>
#endif
using namespace std;
using namespace TCLAP;

struct SettingsStruct {
	string mpw, useLeet, algorithm, charset, username, modifier,
		prefix, suffix, url, filepath, account;
	int length, leetLevel, account_skip;
	bool hmac, trim, verbose;
};

SettingsStruct getSettings(int argc, char* argv[], pwmDefaults defaults)
{
	// Define the command line object. See TCLAP docs at http://tclap.sourceforge.net/
	CmdLine cmd("PasswordMaker", ' ', "1.4.2");
	ValueArg<string> mpw("m", "mpw", "Master Password", false, defaults.getMasterPassword(), "string", cmd);

	vector<int> allowedLeetLevel;
	allowedLeetLevel.push_back(1);
	allowedLeetLevel.push_back(2);
	allowedLeetLevel.push_back(3);
	allowedLeetLevel.push_back(4);
	allowedLeetLevel.push_back(5);
	allowedLeetLevel.push_back(6);
	allowedLeetLevel.push_back(7);
	allowedLeetLevel.push_back(8);
	allowedLeetLevel.push_back(9);
	ValueArg<int> leetLevel("e", "level", "l33t level", false, defaults.getLeetLevel(), allowedLeetLevel, cmd);	
	
	// TODO: Find a way to converting to upper/lower case or making these args case insen
	vector<string> allowedLeet;
	allowedLeet.push_back("none");
	allowedLeet.push_back("before");
	allowedLeet.push_back("after");
	allowedLeet.push_back("both");
	
	ValueArg<string> whereLeet("l", "l33t", "Where to use l33t", false, defaults.getUseLeet(), allowedLeet, cmd);
	ValueArg<string> username("u", "username", "Username", false, defaults.getUserName(), "string", cmd);
	ValueArg<string> prefix("p", "prefix", "Password Prefix", false, defaults.getPrefix(), "string", cmd);
	ValueArg<string> suffix("s", "suffix", "Password Suffix", false, defaults.getSuffix(), "string", cmd);
	ValueArg<string> modifier("d", "modifier", "Password Modifier", false, defaults.getModifier(), "string", cmd);
	ValueArg<int> length("g", "length", "Password Length", false, defaults.getPasswordLength(), "integer", cmd);
	ValueArg<string> charset("c", "chars", "Characters", false, defaults.getCharset(), "string", cmd);
	// Short flag needed
	ValueArg<string> account("", "account", "Account", false, "", "string", cmd);
	// Short flag needed
	ValueArg<int> account_skip("", "account_skip", "Account skip", false, 0, "interger", cmd);

	vector<string> allowedAlgorithms;
	allowedAlgorithms.push_back("MD4");
	allowedAlgorithms.push_back("MD5");
	allowedAlgorithms.push_back("SHA1");
	allowedAlgorithms.push_back("SHA256");
	allowedAlgorithms.push_back("RIPEMD160");
	ValueArg<string> algorithm("a", "alg", "Hash Algorithm", false, defaults.getAlgorithm(), allowedAlgorithms, cmd);
	ValueArg<string> url("r", "url", "URL (equivalent to \"Use This URL\" in the Firefox/Mozilla extension)", false, defaults.getURL(), "string", cmd); // RDF, doesn't export a default URL

	// Define the switches
	SwitchArg hmac("x", "HMAC", "Use the HMAC version of the specified hash algorithm", defaults.getHmac(), cmd);
	SwitchArg trimLeading0("0", "trimzeros", "Trim leading zeros from the generated password", defaults.getTrim(), cmd);
	SwitchArg verbose("b", "verbose", "Echo command-line arguments", false, cmd);

	ValueArg<string> filepath("f", "file", "Path/filename to a settings file", false, "passwordmaker.rdf", "string", cmd);

	try	{
		// Parse the args
		cmd.parse(argc, argv);
	}
	catch (ArgException &e)	{ 
		cerr << "error: " << e.error() << " for arg " << e.argId() << endl;
		exit(1);
	}

	SettingsStruct settings;
	settings.mpw = mpw.getValue();
	settings.useLeet = whereLeet.getValue();
	settings.algorithm = algorithm.getValue();
	settings.charset = charset.getValue();
	settings.username = username.getValue();
	settings.modifier = modifier.getValue();
	settings.prefix = prefix.getValue();
	settings.suffix = suffix.getValue();
	settings.url = url.getValue();
	settings.length = length.getValue();
	settings.leetLevel = leetLevel.getValue();
	settings.hmac = hmac.getValue();
	settings.trim = trimLeading0.getValue();
	settings.verbose = verbose.getValue();
	settings.filepath = filepath.getValue();
	settings.account = account.getValue();
	settings.account_skip = account_skip.getValue();
	return settings;
}

SettingsStruct getDefaults(int argc, char* argv[])
{
	// Define the command line object. See TCLAP docs at http://tclap.sourceforge.net/
	pwmDefaults defaults;
	return getSettings(argc, argv, defaults);
}

void setOutputVisible(bool visible) {
	#ifdef WIN32
	DWORD cm = NULL;
	HANDLE hin = GetStdHandle(STD_INPUT_HANDLE);
	if (!GetConsoleMode(hin, &cm)) {
		cout << "Doh!" << endl;
		return;
	}
	switch (visible) {
	case true:
		cm |= ENABLE_ECHO_INPUT;
		break;
	case false:
		cm = cm & ~(ENABLE_ECHO_INPUT);
		break;
	}
	SetConsoleMode(hin, cm);
	#else
	switch(visible) {
	case true:
		system("stty echo");
		break;
	case false:
		system("stty -echo");
		break;
	}
	#endif
}

int main(int argc, char* argv[])
{
	SettingsStruct temp_default = getDefaults(argc, argv);
	pwmDefaults defaults(temp_default.filepath, temp_default.account, temp_default.account_skip);
	SettingsStruct settings = getSettings(argc, argv, defaults);

	if (settings.mpw == "\x01") {
		char tmpw[255]; // Hope this is enough for a master password
		cout << "Master Password: ";
		setOutputVisible(false);
		cin.getline(tmpw, 254);
		setOutputVisible(true);
		cout << endl;
		settings.mpw = tmpw;
	}

	// Generate
	PasswordMaker pwm;

	// Setting the path for the hasher to find getHash.js on SpiderMonkey builds
	string path = argv[0];
	string::size_type index;
	static const string::size_type npos = (string::size_type)-1;

	index = path.find_last_of("/");
	if (index == npos) {
		index = path.find_last_of("\\");
	}
	if (index != npos) {
		path.erase(path.begin() + index + 1, path.end());
		pwm.setPath(path);
	}
	if (!pwm.initialized())
	{
#ifdef USE_SPIDERMONKEY
		// Note: If js.dll can't be found, main() is not even called
		cerr << "PasswordMaker could not initialize. Cannot find 'getHash.js'." << endl;
#elif USE_MHASH
		cerr << "PasswordMaker could not initialize. mHash appears to be broken somehow on this system." << endl;
#endif
		return 1;
	}
	if (settings.verbose)
	{
		// Output the command-line args
		cout << "Master Password: " << settings.mpw << endl;
		cout << "Use l33t: " << settings.useLeet << endl;
		cout << "l33t level: " << settings.leetLevel << endl;
		cout << "Hash Algorithm: " <<
			(settings.hmac ? "HMAC-" : "") << settings.algorithm << endl;
		cout << "URL: " << settings.url << endl;
		cout << "Generated Password Length: " << settings.length << endl;
		cout << "Username: " << settings.username << endl;
		cout << "Modifier: "  << settings.modifier << endl;
		cout << "Characters: " << settings.charset << endl;
		cout << "Generated Password Prefix: " << settings.prefix << endl;
		cout << "Generated Password Suffix: " << settings.suffix << endl;
	}

	hashType algo = PWM_SHA256;
	if (!settings.algorithm.compare("MD4")) algo = PWM_MD4;
	if (!settings.algorithm.compare("MD5")) algo = PWM_MD5;
	if (!settings.algorithm.compare("SHA1")) algo = PWM_SHA1;
	if (!settings.algorithm.compare("SHA256")) algo = PWM_SHA256;
	if (!settings.algorithm.compare("RIPEMD160")) algo = PWM_RIPEMD160;

	leetType useLeet = LEET_NONE;
	if (!settings.useLeet.compare("none")) useLeet = LEET_NONE;
	if (!settings.useLeet.compare("before")) useLeet = LEET_BEFORE;
	if (!settings.useLeet.compare("after")) useLeet = LEET_AFTER;
	if (!settings.useLeet.compare("both")) useLeet = LEET_BOTH;

	cout << 
		pwm.generatePassword(settings.mpw, algo, settings.hmac, settings.trim, settings.url,
		settings.length, settings.charset, useLeet,
		settings.leetLevel, settings.username, settings.modifier,
		settings.prefix, settings.suffix) << endl;
	return 0;
}

