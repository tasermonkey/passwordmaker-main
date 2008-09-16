@echo off

echo "Making non-portable version"
qmake
if ERRORLEVEL 1 goto ERROR
mingw32-make clean
if ERRORLEVEL 1 goto ERROR
mingw32-make
if ERRORLEVEL 1 goto ERROR

echo "Making portable version"
qmake PORTABLE=1
if ERRORLEVEL 1 goto ERROR
mingw32-make clean
if ERRORLEVEL 1 goto ERROR
mingw32-make
if ERRORLEVEL 1 goto ERROR
mingw32-make -f upx.mak
if ERRORLEVEL 1 goto ERROR
qmake
goto END

:ERROR
echo "Error with build"

:END