var tree, passwordMaker;

function onload() {
  passwordMaker = window.arguments[0].inn.passwordMaker;
  var isAccounts = window.arguments[0].inn.isAccounts; // if it's not accounts, it's remotes
  if (window.arguments[0].inn.copy)
    document.getElementById("label").value = passwordMaker.stringBundle.GetStringFromName("folders.onload.01");
  // Hide one of the trees
  dump(isAccounts + "\n");
  var row = isAccounts ? document.getElementById("remotesRow") : document.getElementById("accountsRow");
  row.hidden = true;
  tree = document.getElementById(isAccounts ? "accountsTree" : "remotesTree");
  tree.database.AddDataSource(PwdMkr_RDFUtils.datasource);
  tree.builder.rebuild();
}

function onOK() {
  var temp = getActiveTreeInfo(tree);
  if (!temp.subjectRes) {
    passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("folders.onOK.01"));
    return false;
  }
  else if (!temp.isContainer) {
    passwordMaker.prompts.alert(this, "PasswordMaker", passwordMaker.stringBundle.GetStringFromName("folders.onOK.02"));
    return false;  
  }
  window.arguments[0].out = new Object();
  window.arguments[0].out.subjectRes = temp.subjectRes;
  return true;  
}
