# PasswordMaker - Creates and manages passwords
# Copyright (C) 2005 Eric H. Jung and LeahScape, Inc.
# http://passwordmaker.org/
# grimholtz@yahoo.com
# 
# This library is free software; you can redistribute it and/or modify it
# under the terms of the GNU Lesser General Public License as published by
# the Free Software Foundation; either version 2.1 of the License, or (at
# your option) any later version.
#
# This library is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
# FITNESSFOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License
# for more details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with this library; if not, write to the Free Software Foundation,
# Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
# 
# Written by Miquel Burns <miquelfire@gmail.com> and Eric H. Jung

LINK = $(CXX)
DEFINES = -DUSE_MHASH -DTIXML_USE_STL
CFLAGS = -O2 -Wall $(DEFINES)
CXXFLAGS = -O2 -frtti -fexceptions -Wall $(DEFINES)
INCPATH = -I.
LIBS = -lmhash

SOURCE = shared/hasher.cpp leet.cpp main.cpp passwordmaker.cpp pwmdefaults.cpp tinystr.cpp tinyxml.cpp tinyxmlerror.cpp tinyxmlparser.cpp
OBJECTS = $(SOURCE:.cpp=.o)
TARGET = passwordmaker

$(TARGET):  $(OBJECTS) 
	$(LINK) -o "$(TARGET)" $(OBJECTS)  $(LIBS)

.SUFFIXES: .c .cpp .cc .cxx

.cpp.o:
	$(CXX) -c $(CXXFLAGS) $(INCPATH) -o $@ $<

.cc.o:
	$(CXX) -c $(CXXFLAGS) $(INCPATH) -o $@ $<

.cxx.o:
	$(CXX) -c $(CXXFLAGS) $(INCPATH) -o $@ $<

.c.o:
	$(CC) -c $(CFLAGS) $(INCPATH) -o $@ $<

include unix/depends

.PHONY: depend clean

depend:
	$(CXX) -MM $(CXXFLAGS) $(INCPATH) $(SOURCE) > unix/depends 

clean:
	rm $(OBJECTS) $(TARGET)


