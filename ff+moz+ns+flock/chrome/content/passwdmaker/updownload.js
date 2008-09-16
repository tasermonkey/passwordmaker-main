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

var PwdMkr_UpDownUtils = {

  doBackup : function(backupDir, filePattern) {
    var dir = Components.classes["@mozilla.org/file/local;1"]
        .createInstance(Components.interfaces.nsILocalFile);
    dir.initWithPath(backupDir);  
    var filename;    
    try {
      var f1 = Components.classes["@mozilla.org/file/local;1"]
        .createInstance(Components.interfaces.nsILocalFile);
      var pwmkrRDF = PWDMKRDirIO.get("ProfD"); // %Profile% dir
      pwmkrRDF.append("passwordmaker.rdf");    
      f1.initWithFile(pwmkrRDF);
  
      var t = new Date();
      var filename = filePattern.replace(/%y|%M|%d|%H|%h|%m|%s|%S|%a/g,
        function(str) {
          switch(str) {
            case "%y": return t.getFullYear();break;
            case "%M": return t.getMonth()+1 < 10 ? ('0' + (t.getMonth()+1)):(t.getMonth()+1);break;          
            case "%d": return t.getDate() < 10 ? ('0' + t.getDate()):t.getDate();break;                    
            case "%H": return t.getHours() < 10 ? ('0' + t.getHours()):t.getHours();break;
            case "%h": return t.getHours()-12 < 10 ? ('0' + t.getHours()-12):t.getHours()-12;break;
            case "%a": return t.getHours() < 12 ? "AM":"PM";break;          
            case "%m": return t.getMinutes() < 10 ? ('0' + t.getMinutes()):t.getMinutes();break;          
            case "%s": return t.getSeconds() < 10 ? ('0' + t.getSeconds()):t.getSeconds();break;          
            case "%S": return t.getMilliseconds() < 10 ? ('00' + t.getMilliseconds()):(t.getMilliseconds()<100 ? ('0' + t.getMilliseconds()) : t.getMilliseconds());break;          
          }
        }
      );
      f1.copyTo(dir, filename);
      return "true";
    }
    catch (e) {
      dump(e);
      return {src:f1.path, dest:backupDir.value + PWDMKRDirIO.sep + filename};
    }
  },

  buildURI : function(url, username, password, isWebDAV) {
  	try {
  		var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
  		var uri = ioService.newURI(url, "UTF-8", null);
  		if (isWebDAV || uri.scheme.indexOf("ftp") == 0)
  			uri.userPass = username + ':' + password;
  		return uri;
  	}
  	catch(e) {
  		return null;
  	}
  }  
};

var PwdMkr_Uploader = {
  _channel : null,
  _callback : null,
  _scheme : "",
  _errorData : "",
  _path : null,
  _inputStream : null,

  start : function(text, url, callback) {
    try {
      this._callback = callback;
      this._scheme = url.scheme;
      var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
      var channel = ioService.newChannelFromURI(url).QueryInterface(Components.interfaces.nsIUploadChannel);
      this._inputStream = Components.classes["@mozilla.org/io/string-input-stream;1"].createInstance(Components.interfaces.nsIStringInputStream);

      this._inputStream.setData(text, -1);
      channel.setUploadStream(this._inputStream, "text/xml; charset=UTF-8", -1);
      channel.asyncOpen(this, null);
      this._callback("send", null);
    }
    catch (e) {
      dump(e);
      this._callback("send", -1);
    }
  },

  cancel : function() {
    //dump("cancel\n");
    /*    if(this._channel != null)
        {
          this._channel.cancel(0x804b0002);
        }
        delete this._channel;
        this._channel = null;*/
  },

  onDataAvailable : function (channel, ctxt, input, sourceOffset, count) {
    //dump("onDataAvailable\n");
    const sis = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
    sis.init(input);
    this._errorData += sis.read(count);
    this._inputStream.close();

    //    alert(this._errorData);
  },

  onStartRequest: function (channel, ctxt) {
    //dump("onStartRequest\n");
  },

  onStopRequest: function (channel, ctxt, status) {
    dump("onStopRequest " + status + "\n");
    try {
      if(this._scheme != "ftp") {
        var res = channel.QueryInterface(Components.interfaces.nsIHttpChannel).responseStatus;
        if ((res == 200) || (res == 201) || (res == 204))
          status = 0;
        /*
          200:OK
          201:Created
          204:No Content
          This is an uploading channel, no need to "GET" the file contents.
        */
        if (this._errorData)
          status = res;
          
        dump("_errordData= "+this._errorData);
        
        if ((this._errorData) && (res == 200))
          dump("error data is: " + this._errorData);
      }
//    delete this._channel;
      delete channel;
      this._inputStream.close();
//    this._channel = null;
      dump("onStopRequest1 " + status + "\n");
      this._callback("done", status);
    }
    catch (e) {
      dump(e);
      this._callback("done", -1);
    }
  }
};

var PwdMkr_Downloader = {
  _channel : null,
  streamLoader : null,
  data : null,
  length : null,  
  _callback : null,
  _startTime : 0,
  _endTime : 0,

  start:function(aURI,aCallback) {
    if( !aURI )
      return false;

    this._callback=aCallback;

    try {
      var ioService  = Components.classes["@mozilla.org/network/io-service;1"]
                      .getService(Components.interfaces.nsIIOService);
      this.streamLoader=Components.classes["@mozilla.org/network/stream-loader;1"]
                    .createInstance(Components.interfaces.nsIStreamLoader);
      this._channel = ioService.newChannelFromURI( aURI );
      if(aURI.scheme=="http" || aURI.scheme=="https")
        this._channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;
      this.streamLoader.init(this._channel, this , null);
      this._startTime=(new Date()).getTime();
    }
    catch(e) {
      dump(e);
      this._callback("done", -1);    
    }
  },

  cancel:function() {
    if(this._channel)
      this._channel.cancel(0x804b0002);
  },

  onStreamComplete :function ( loader , ctxt , status , resultLength , result ) {
    this.data="";
    this._endTime=(new Date()).getTime();
    if(status==0) {
      this.length=resultLength;
      if(typeof(result)=="string")
        this.data=result;
      else {
        while(result.length > (256*192) )
          this.data += String.fromCharCode.apply(this,result.splice(0,256*192));
        this.data += String.fromCharCode.apply(this,result);
      }
    }
	
	var unicodeConverter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
	unicodeConverter.charset = "UTF-8";
	this.data = unicodeConverter.ConvertToUnicode(this.data) + unicodeConverter.Finish();
    
    //dump(this.data+"\n");
    //dump(status+"\n");
    this._callback("done", status);
  },

  get time() {
    return this._endTime-this._startTime;
  }
};