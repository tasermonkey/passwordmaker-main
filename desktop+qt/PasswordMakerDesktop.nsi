; PasswordMaker Desktop Edition Install Script
; Written by Miquel Burns

/*
	Some defines used for easy updating the version info
	VERSION is a the text version. This should match what's used in the program itself
	FVERSION is the version number for the installer's filename.
	DVERSION is an integer representaion of the version. The format should be 0xXXYYZZ
		XX - Major version in hex
		YY - Minor version in hex
		ZZ - Bug/patch version in hex
	VIVERSION is the version shown on the summary page if the user should ever look there
		Must be in a x.x.x.x format or else Windows will reject it
*/
!define VERSION "0.4 Beta"
!define FVERSION "0.4"
!define DVERSION 0x000400
!define VIVERSION "0.4.00.0"
;--------------------------------
;Includes

	!include "MUI.nsh" ; Ohh! Pretty!
    !include "LogicLib.nsh" ; For if statements.

;--------------------------------
;General

	;Name and file
	Name "PasswordMaker Desktop Edition"
	OutFile "PasswordMakerInstall-${FVERSION}.exe"

	;Default installation folder
	InstallDir "$PROGRAMFILES\PasswordMaker.org\Desktop Edition"

	;Get installation folder from registry if available
	InstallDirRegKey HKLM "Software\PasswordMakerDesktop" "installedDir"

;--------------------------------
;Interface Settings

	!define MUI_ABORTWARNING
	RequestExecutionLevel admin ;Dear Vista (and higher), we want to write to the program files directory, please inform the user of our request.
	XPStyle on

;--------------------------------
;Version Info stuff

	VIAddVersionKey ProductName "PasswordMaker Desktop Edition ${VERSION} Installer"
	VIAddVersionKey LegalCopyright "2007 LeahScape Inc."
	VIAddVersionKey FileDescription "PasswordMaker Desktop Edition ${VERSION} Installer"
	VIAddVersionKey FileVersion "${VIVERSION}"
	VIAddVersionKey CompanyName "LeahScape Inc."
	VIProductVersion "${VIVERSION}" ;Format needs to be in 0.0.0.0 format

;--------------------------------
;Pages

	!insertmacro MUI_PAGE_WELCOME
	!insertmacro MUI_PAGE_LICENSE "LICENSE.txt"
	!insertmacro MUI_PAGE_COMPONENTS
	!insertmacro MUI_PAGE_DIRECTORY
	!insertmacro MUI_PAGE_INSTFILES
	!insertmacro MUI_PAGE_FINISH

	!insertmacro MUI_UNPAGE_WELCOME
	!insertmacro MUI_UNPAGE_CONFIRM
	!insertmacro MUI_UNPAGE_INSTFILES
	!insertmacro MUI_UNPAGE_FINISH

;--------------------------------
;Languages

	!insertmacro MUI_LANGUAGE "English"

;--------------------------------
;Installer Sections

Section "PasswordMaker Desktop Edition Core (required)" SecCore
	;Uninstall old version if it's there (0.1 not included)
	ClearErrors
	ReadRegDWORD $0 HKLM "Software\PasswordMakerDesktop" "installedVersion"
	IfErrors NoOld ;Old version not found
	${If} $0 = ${DVERSION}
		;Same version number. Assume this is a reinstall
	${EndIf}
	${If} $0 > ${DVERSION}
		;Newer version, warn the user
		MessageBox MB_YESNO|MB_ICONQUESTION \
			"A newer version was installed. Continuing will uninstall it and install this version. Are you sure?" \
			IDNO quit
	${EndIf}
	ReadRegStr $0 HKLM "Software\PasswordMakerDesktop" "installedDir"
	IfErrors NoOld ;Old version didn't install correctly or something
	SetOutPath $0
	ExecWait '"$0\uninstall.exe" /S'
	
	NoOld:
	ClearErrors
	UserInfo::GetName
	IfErrors AdminOk
	Pop $0
	UserInfo::GetAccountType
	Pop $1
	StrCmp $1 "Admin" AdminOk
		Abort "Current install script requires administrator rights"

	AdminOk:
	SetShellVarContext all
	SectionIn RO
	;SetOutPath "$INSTDIR\sqldrivers"
	;File "sqldrivers\qsqlite4.dll"
	SetOutPath $INSTDIR
	File "mingwm10.dll"
	;File "QtSql4.dll"
	;File "QtXml4.dll"
	;File "QtScript4.dll"
	;File "QtGui4.dll"
	;File "QtCore4.dll"
	File "LICENSE.txt"
	File "passwordmaker.exe"
	CreateDirectory "$SMPROGRAMS\PasswordMaker"
	CreateShortCut "$SMPROGRAMS\PasswordMaker\PasswordMaker Desktop Edition.lnk"\
		"$INSTDIR\passwordmaker.exe" "" "" "" "" ""\
		"PasswordMaker Desktop Edition Version ${VERSION}"
	
	WriteRegDWORD HKLM "Software\PasswordMakerDesktop" "installedVersion" ${DVERSION}
	WriteRegStr HKLM "Software\PasswordMakerDesktop" "installedDir" "$INSTDIR"
	
	; Write the uninstall keys for Windows
	SetOutPath $INSTDIR
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\PWMDesktopEdition" "DisplayName" "PasswordMaker Desktop Edition ${VERSION}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\PWMDesktopEdition" "UninstallString" '"$INSTDIR\uninstall.exe"'
	WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\PWMDesktopEdition" "NoModify" 1
	WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\PWMDesktopEdition" "NoRepair" 1
	WriteUninstaller "uninstall.exe"
	CreateShortCut "$SMPROGRAMS\PasswordMaker\Uninstall PasswordMaker Desktop Edition.lnk"\
		"$INSTDIR\uninstall.exe"
	Goto done
	quit:
		Abort
	done:
SectionEnd


Section "Desktop Shortcut" SecDesktop
	SetShellVarContext all
	CreateShortCut "$DESKTOP\PasswordMaker Desktop Edition.lnk"\
		"$INSTDIR\passwordmaker.exe"
SectionEnd

/* Keep commited out for now */
/*Section "Quick Launch Shortcut" SecQuickLaunch
	CreateShortCut "$QUICKLAUNCH\PasswordMaker Desktop Edition.lnk" "$INSTDIR\passwordmaker.exe"
SectionEnd*/

;--------------------------------
;Descriptions

	;Language strings
	LangString DESC_SecCore ${LANG_ENGLISH} "PasswordMaker Desktop Edition ${VERSION} files."
	LangString DESC_SecDesktop ${LANG_ENGLISH} "Adds an icon to the Desktop."

	;Assign language strings to sections
	!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
	!insertmacro MUI_DESCRIPTION_TEXT ${SecCore} $(DESC_SecCore)
	!insertmacro MUI_DESCRIPTION_TEXT ${SecDesktop} $(DESC_SecDesktop)
	!insertmacro MUI_FUNCTION_DESCRIPTION_END

;--------------------------------
;Uninstaller Section

Section "Uninstall"
	SetShellVarContext all
	;Remove registry keys
	DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\PWMDesktopEdition"
	DeleteRegKey HKLM "Software\PasswordMakerDesktop"

	; Remove files and uninstaller
	Delete "$INSTDIR\passwordmaker.exe"
	Delete "$INSTDIR\LICENSE.txt"
	;Delete "$INSTDIR\QtCore4.dll"
	;Delete "$INSTDIR\QtGui4.dll"
	;Delete "$INSTDIR\QtXml4.dll"
	;Delete "$INSTDIR\QtSql4.dll"
	;Delete "$INSTDIR\QtScript4.dll"
	;Delete "$INSTDIR\sqldrivers\qsqlite4.dll"
	Delete "$INSTDIR\mingwm10.dll"
	Delete "$INSTDIR\uninstall.exe"

	; Remove directories used
	RMDir "$SMPROGRAMS\PasswordMaker"
	;RMDir "$INSTDIR\sqldrivers"
	RMDir "$INSTDIR"

	; Remove shortcuts, if any
	Delete "$SMPROGRAMS\PasswordMaker\PasswordMaker Desktop Edition.lnk"
	Delete "$SMPROGRAMS\PasswordMaker\Uninstall PasswordMaker Desktop Edition.lnk"
	Delete "$DESKTOP\PasswordMaker Desktop Edition.lnk"
SectionEnd
