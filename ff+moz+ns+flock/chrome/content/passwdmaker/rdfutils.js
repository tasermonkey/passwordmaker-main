var PwdMkr_RDFUtils = {
  
  rdfContainer : Components.classes["@mozilla.org/rdf/container;1"].createInstance(Components.interfaces.nsIRDFContainer),
  rdfContainerUtils : Components.classes["@mozilla.org/rdf/container-utils;1"]
    .getService(Components.interfaces.nsIRDFContainerUtils),
  rdfService : Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService),    
  datasource : null,
  datasourceFlusher : null,
  prompts : Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService),

  init : function() {
  	var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
  	var tempLocalFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
    // Get the resource from disk. Check pref first
  	//var dir = PasswordMakerPrefsWrapper.getChar("settings", null);
  	//if (dir)
    	//dir = PWDMKRFileIO.open(dir);
  	//else
    var dir = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsILocalFile);
  	tempLocalFile.initWithPath(dir.path);
    var datasourceURI;
  
  	try {
  		datasourceURI = ioService.newFileURI(tempLocalFile).spec;
  	}
  	catch(e) {
    	var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);  
      prompts.alert(window, "PasswordMaker", passwordMaker.sprintf(passwordMaker.stringBundle.GetStringFromName("rdfutils.init.01"), e));
    }
  
  	if (!datasourceURI.match(/\/$/))
      datasourceURI += "/";
    datasourceURI += "passwordmaker.rdf";
  
    // Init the datasource, flusher, etc.
    this.datasource = this.rdfService.GetDataSourceBlocking(datasourceURI);
    this.datasourceFlusher = this.datasource.QueryInterface(Components.interfaces.nsIRDFRemoteDataSource);
  },
  
  /**
   * Get a setting (literal) or return the default if it's not found
   */
  getTarget : function(subject, predicate, defawlt) {
    var literal;
    try {
      predicate = this._strToPredicateRes(predicate);
      literal = this.datasource.GetTarget(subject, predicate, true);
      if (literal) {
        literal.QueryInterface(Components.interfaces.nsIRDFLiteral);
        return literal.Value;
      }
      return defawlt;
    }
    catch(e) {
      this._dumpException(e, subject, predicate, literal);
      return defawlt;    
    }
  },
  
  makePredicate : function(predicateStr) {
    return this.rdfService.GetResource("http://passwordmaker.mozdev.org/rdf#" + predicateStr);  
  },

  makeResource : function(str) {
    return str ? this.rdfService.GetResource(str) : this.rdfService.GetAnonymousResource();
  },  
  
  makeSequence : function(subject) {
    subject = this._strToSubjectRes(subject);
    var ret = this.rdfContainerUtils.MakeSeq(this.datasource, subject);
    this.flush();
    return ret;
  },
  
  /**
   * Called to update a single target. Works whether or not the target already exists.
   */
  updateTarget : function(subject, predicate, literalStr) {  
    //dump(subject + "\n");
    //dump(predicate + "\n");
    //dump(literalStr + "\n");    
    try {
      subject = this._strToSubjectRes(subject);
      predicate = this._strToPredicateRes(predicate);
      var newTargetRes = this.rdfService.GetLiteral(literalStr);    
      var oldTargetRes = this.datasource.GetTarget(subject, predicate, true);
      if (!oldTargetRes) {
        this.datasource.Assert(subject, predicate, newTargetRes, true);
      }
      else {
        this.datasource.Change(subject, predicate, oldTargetRes, newTargetRes);
      }
    }
    catch (e) {
      this._dumpException(e, subject, predicate, oldTargetRes);
      dump("new target = " + (newTargetRes&&newTargetRes.Value?newTargetRes.Value:"") + "\n");
    }
    finally {
      this.flush();
    }
  },
  
  _dumpException : function(e, subject, predicate, target) {
    dump(e + "\n");
    dump("subject = " + (subject?subject.Value:"null") + "\n");
    dump("predicate = " + (predicate?predicate.Value:"null") + "\n");
    dump("target = " + (typeof(target) == "string" ? target:(target&&target.Value?target.Value:"")) + "\n");
  },
  
  removeTarget : function(subject, predicate) {
    var target;
    try {
      subject = this._strToSubjectRes(subject);
      predicate = this._strToPredicateRes(predicate);
      target = this.datasource.GetTarget(subject, predicate, true);  
      if (target) {
        this.datasource.Unassert(subject, predicate, target);
        this.flush();
        return true; // we removed something
      }
    }
    catch (e) {
      this._dumpException(e, subject, predicate, target);
    }
  },
  
  //------- Start Sequence Utilities -------\\
  
  removeSequence : function(sequenceStr) {
    var sequenceSubjectRes = this.makeResource(sequenceStr);  
    sequence = this.makeSequence(sequenceStr);

    var subject, predicate;
    try {  
      var subjects = sequence.GetElements();
      while (subjects.hasMoreElements()) {
        subject = subjects.getNext();
        var predicates = this.datasource.ArcLabelsOut(subject);
        while (predicates.hasMoreElements()) {
          predicate = predicates.getNext();
          removeTarget(subject, predicate);
        }
        sequence.RemoveElement(subject, true); // remove from the sequence        
      }
      var arcsIn = this.datasource.ArcLabelsIn(sequenceSubjectRes);
      while (arcsIn.hasMoreElements()) {
        var arc = arcsIn.getNext();
        if (arc instanceof Components.interfaces.nsIRDFResource) {
          if (this.rdfContainerUtils.IsOrdinalProperty(arc)) {
            var parentRes = this.datasource.GetSource(arc, sequenceSubjectRes, true);
            var parentResContainer = this.rdfContainerUtils.MakeSeq(this.datasource, parentRes);
            parentResContainer.RemoveElement(sequenceSubjectRes, true);
          }
        }
      }            
      this.flush();
    }
    catch (e) {
      this._dumpException(e, subject, predicate);
    }
  },
  
  addToSequence : function(subject, sequence) {
    try {
      sequence = this.makeSequence(sequence);
      sequence.AppendElement(subject);
      this.flush();
    }
    catch (e) {
      dump(e + "\n");
    }
  },

  isEmpty : function(seq) {
    return this.rdfContainerUtils.IsEmpty(this.datasource, this._strToSubjectRes(seq));
  },  
  
  //------- End Sequence Utilities -------\\
  
  flush : function() {
    this.datasourceFlusher.Flush();
  },
  
  hasTarget : function(subject, predicate) {
    predicate = this._strToPredicateRes(predicate);
    return this.datasource.hasArcOut(subject, predicate);
  },
  
  _strToPredicateRes : function(predicate) {
    return typeof(predicate) == "string" ? this.makePredicate(predicate) : predicate;
  }, 
  
  _strToSubjectRes : function(subject) {
    return typeof(subject) == "string" ?
      (subject.indexOf("http://passwordmaker.mozdev.org/") > -1 ?
      this.rdfService.GetResource(subject) :
      this.rdfService.GetResource("http://passwordmaker.mozdev.org/" + subject)) :
      subject;
  },
};
PwdMkr_RDFUtils.init();