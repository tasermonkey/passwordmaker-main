#!/usr/bin/env python
# coding: utf-8
"""
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
  
  Written by Miquel Burns and Eric H. Jung

  PHP version written by Pedro Gimeno Fortea
      <http://www.formauri.es/personal/pgimeno/>
  and updated by Miquel Matthew 'Fire' Burns
      <miquelfire@gmail.com>
  Ported to Python by Aurelien Bompard
      <http://aurelien.bompard.org>  

  This version should work with python > 2.3. The pycrypto module enables
  additionnal algorithms.

  Can be used both on the command-line and with a GUI based on TKinter
"""

import sys, hmac, optparse, math


class PMError(Exception): pass

def generatepassword(hashAlgorithm, key, data, whereToUseL33t, l33tLevel, passwordLength, charset, prefix="", suffix=""):
    # Never *ever, ever* allow the charset's length<2 else
    # the hash algorithms will run indefinitely
    if len(charset) < 2:
        return ""
    alg = hashAlgorithm.split("_")
    if len(alg) > 1 and alg[1] == "v6":
        trim = False
        charset = '0123456789abcedf'
    else:
        trim = True
        hashAlgorithm = alg[0]
    # Check for validity of algorithm 
    valid_algs = getValidAlgs()
    if hashAlgorithm not in valid_algs:
        raise PMError("Unknown or misspelled algorithm: %s. Valid algorithms: %s" % (hashAlgorithm, ", ".join(valid_algs)))

    # apply the algorithm
    hashclass = PM_HashUtils()
    password = ''
    count = 0;
    tkey = key # Copy of the master password so we don't interfer with it.
    while len(password) < passwordLength and count < 1000:
        if count == 0:
            key = tkey
        else:
            key = "%s\n%s" % (tkey, count)
        # for non-hmac algorithms, the key is master pw and url concatenated
        if hashAlgorithm.count("hmac") == 0:
            data = key+data
        if hashAlgorithm == "sha256":
            password += hashclass.any_sha256(data, charset, trim)
        elif hashAlgorithm == "hmac-sha256":
            password += hashclass.any_hmac_sha256(key, data, charset, trim)
        elif hashAlgorithm == "sha1":
            password += hashclass.any_sha1(data, charset, trim)
        elif hashAlgorithm == "hmac-sha1":
            password += hashclass.any_hmac_sha1(key, data, charset, trim)
        elif hashAlgorithm == "md4":
            password += hashclass.any_md4(data, charset, trim);
        elif hashAlgorithm == "hmac-md4":
            password += hashclass.any_hmac_md4(key, data, charset, trim)
        elif hashAlgorithm == "md5":
            password += hashclass.any_md5(data, charset, trim);
        elif hashAlgorithm == "hmac-md5":
            password += hashclass.any_hmac_md5(key, data, charset, trim);
        elif hashAlgorithm == "rmd160":
            password += hashclass.any_rmd160(data, charset, trim);
        elif hashAlgorithm == "hmac-rmd160":
            password += hashclass.any_hmac_rmd160(key, data, charset, trim);
        else:
            raise PMError("Unknown or misspelled algorithm: %s. Valid algorithms: %s" % (hashAlgorithm, ", ".join(valid_algs)))
        count += 1

    if prefix:
        password = prefix + password
    if suffix:
        password = password[:passwordLength-len(suffix)] + suffix
    return password[:passwordLength]

class PM_HashUtils:
    def rstr2any(self, input, encoding, trim=True):
        """Convert a raw string to an arbitrary string encoding. Set trim to false for keeping leading zeros"""
        divisor = len(encoding)
        remainders = []
     
        # Convert to an array of 16-bit big-endian values, forming the dividend
        dividend = []
        # pad this
        while len(dividend) < math.ceil(len(input) / 2):
            dividend.append(0)
        inp = input # Because Miquel is a lazy twit and didn't want to do a search and replace
        for i in range(len(dividend)):
            dividend[i] = (ord(inp[i * 2]) << 8) | ord(inp[i * 2 + 1])
 
        # Repeatedly perform a long division. The binary array forms the dividend,
        # the length of the encoding is the divisor. Once computed, the quotient
        # forms the dividend for the next step. We stop when the dividend is zero.
        # All remainders are stored for later use.
        if trim:
            while len(dividend) > 0:
                quotient = []
                x = 0
                for i in range(len(dividend)):
                    x = (int(x) << 16) + dividend[i]
                    q = math.floor(x / divisor)
                    x -= q * divisor
                    if len(quotient) > 0 or q > 0:
                        quotient.append(q)
                remainders.append(x)
                dividend = quotient
        else:
            full_length = math.ceil(float(len(input) * 8) / (math.log(len(encoding)) / math.log(2)));
            for j in range(len(full_length)):
             quotient = []
             x = 0
             for i in range(len(dividend)):
                 x = (x << 16) + dividend[i]
                 q = floor(x / divisor)
                 x -= q * divisor
                 if len(quotient) > 0 or q > 0:
                     quotient[len(quotient)] = q
             remainders[j] = x
             dividend = quotient
 
        # Convert the remainders to the output string 
        output = ""
        for i in range(len(remainders)-1, 0, -1):
            output += encoding[int(remainders[i])];
        
        return output

    def any_md5(self, s, e, t):
        if float(sys.version[:3]) >= 2.5:
            import hashlib
            hash = hashlib.md5(s).digest()
        else:
            import md5
            hash = md5.new(s).digest()
        return self.rstr2any(hash, e, t)

    def any_hmac_md5(self, k, d, e, t):
        if float(sys.version[:3]) >= 2.5:
            import hashlib
            hashfunc = hashlib.md5
        else:
            import md5
            hashfunc = md5
        return self.rstr2any(hmac.new(k, d, hashfunc).digest(), e, t)

    def any_sha1(self, s, e, t):
        if float(sys.version[:3]) >= 2.5:
            import hashlib
            hash = hashlib.sha1(s).digest()
        else:
            import sha
            hash = sha.new(s).digest()
        return self.rstr2any(hash, e, t)

    def any_hmac_sha1(self, k, d, e, t):
        if float(sys.version[:3]) >= 2.5:
            import hashlib
            hashfunc = hashlib.sha1
        else:
            import sha
            hashfunc = sha
        return self.rstr2any(hmac.new(k, d, hashfunc).digest(), e, t)

    def any_sha256(self, s, e, t):
        if float(sys.version[:3]) >= 2.5:
            import hashlib
            hash = hashlib.sha256(s).digest()
        else:
            from Crypto.Hash import SHA256
            hash = SHA256.new(s).digest()
        return self.rstr2any(hash, e, t)

    def any_hmac_sha256(self, k, d, e, t):
        if float(sys.version[:3]) >= 2.5:
            import hashlib
            hashfunc = hashlib.sha256
        else:
            import Crypto.Hash.SHA256
            hashfunc = Crypto.Hash.SHA256
        return self.rstr2any(hmac.new(k, d, hashfunc).digest(), e, t)

    def any_md4(self, s, e, t):
        from Crypto.Hash import MD4
        return self.rstr2any(MD4.new(s).digest(), e, t)

    def any_hmac_md4(self, k, d, e, t):
        import Crypto.Hash.MD4
        return self.rstr2any(hmac.new(k, d, Crypto.Hash.MD4).digest(), e, t)

    def any_rmd160(self, s, e, t):
        from Crypto.Hash import RIPEMD
        return self.rstr2any(RIPEMD.new(s).digest(), e, t)

    def any_hmac_rmd160(self, k, d, e, t):
        import Crypto.Hash.RIPEMD
        return self.rstr2any(hmac.new(k, d, Crypto.Hash.RIPEMD).digest(), e, t)


def getValidAlgs():
    valid_algs = ["md5", "hmac-md5", "sha1", "hmac-sha1"]
    if float(sys.version[:3]) >= 2.5: # We have hashlib
        valid_algs.extend(["sha256", "hmac-sha256"])
    try: # Do we have pycrypto ? <http://www.amk.ca/python/code/crypto>
        import Crypto
        for alg in ["md4", "hmac-md4", "sha256", "hmac-sha256", "rmd160", "hmac-rmd160"]:
            if alg not in valid_algs:
                valid_algs.append(alg)
    except ImportError:
        pass
    return valid_algs


def gui():
    import Tkinter
    class Application(Tkinter.Frame):
        def __init__(self, master=None):
            Tkinter.Frame.__init__(self, master)
            self.grid()
            self.createWidgets()
        def createWidgets(self):
            # Create the widgets
            self.url_label = Tkinter.Label(self, justify="left", text="URL")
            self.url_text = Tkinter.Entry(self)
            self.mpw_label = Tkinter.Label(self, justify="left", text="Master")
            self.mpw_text = Tkinter.Entry(self, show="*")
            self.alg_label = Tkinter.Label(self, justify="left", text="Algorithm")
            self.alg_text = Tkinter.Entry(self)
            self.alg_text.insert(0, "md5")
            self.user_label = Tkinter.Label(self, justify="left", text="Username")
            self.user_text = Tkinter.Entry(self)
            self.mod_label = Tkinter.Label(self, justify="left", text="Modifier")
            self.mod_text = Tkinter.Entry(self)
            self.len_label = Tkinter.Label(self, justify="left", text="Length")
            self.len_text = Tkinter.Entry(self)
            self.len_text.insert(0, "8")
            self.charset_label = Tkinter.Label(self, justify="left", text="Characters")
            self.charset_text = Tkinter.Entry(self)
            self.charset_text.insert(0, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+={}|[]\\:\";\'<>?,./")
            self.pfx_label = Tkinter.Label(self, justify="left", text="Prefix")
            self.pfx_text = Tkinter.Entry(self)
            self.sfx_label = Tkinter.Label(self, justify="left", text="Suffix")
            self.sfx_text = Tkinter.Entry(self)
            self.generate_button = Tkinter.Button (self, text="Generate", command=self.generate)
            self.passwd_label = Tkinter.Label(self, justify="left", text="Password")
            self.passwd_text = Tkinter.Entry(self, fg="blue")
            # Place on the grid
            self.url_label.grid(row=0,column=0)
            self.url_text.grid(row=0,column=1)
            self.mpw_label.grid(row=1,column=0)
            self.mpw_text.grid(row=1,column=1)
            self.alg_label.grid(row=2,column=0)
            self.alg_text.grid(row=2,column=1)
            self.user_label.grid(row=3,column=0)
            self.user_text.grid(row=3,column=1)
            self.mod_label.grid(row=4,column=0)
            self.mod_text.grid(row=4,column=1)
            self.len_label.grid(row=5,column=0)
            self.len_text.grid(row=5,column=1)
            self.charset_label.grid(row=6,column=0)
            self.charset_text.grid(row=6,column=1)
            self.pfx_label.grid(row=7,column=0)
            self.pfx_text.grid(row=7,column=1)
            self.sfx_label.grid(row=8,column=0)
            self.sfx_text.grid(row=8,column=1)
            self.generate_button.grid(row=9,column=0,columnspan=2,pady=5)
            self.passwd_label.grid(row=10,column=0)
            self.passwd_text.grid(row=10,column=1,sticky="nsew")
        def generate(self):
            self.generate_button.flash()
            leet = None
            leetlevel = 0
            try:
                pw = generatepassword(self.alg_text.get(),
                                      self.mpw_text.get(),
                                      self.url_text.get() + self.user_text.get() + self.mod_text.get(),
                                      leet,
                                      leetlevel - 1,
                                      int(self.len_text.get()),
                                      self.charset_text.get(),
                                      self.pfx_text.get(),
                                      self.sfx_text.get(),
                                     )
            except PMError, e:
                pw = str(e)
            current_passwd = self.passwd_text.get()
            if len(current_passwd) > 0:
                self.passwd_text.delete(0,len(current_passwd))
            self.passwd_text.insert(0,pw)
    app = Application()
    app.master.title("PasswordMaker")
    app.mainloop()


def cmd():
    usage = "Usage: %prog [options]"
    parser = optparse.OptionParser(usage=usage)
    parser.add_option("-a", "--alg", dest="alg", default="sha256",
                      help="Hash algorithm [hmac-] md4/md5/sha1/sha256/rmd160 [_v6] (default sha256)")
    parser.add_option("-m", "--mpw", dest="mpw", help="Master password (default: ask)", default="")
    parser.add_option("-r", "--url", dest="url", help="URL (default blank)", default="")
    parser.add_option("-u", "--user", dest="user", help="Username (default blank)", default="")
    parser.add_option("-d", "--modifier", dest="mod", help="Password modifier (default blank)", default="")
    parser.add_option("-g", "--length", dest="len", help="Password length (default 12)", default=12, type="int")
    parser.add_option("-c", "--charset", dest="charset", help="Characters to use in password (default [A-Za-z0-9])",
                      default="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789")
    parser.add_option("-p", "--prefix", dest="pfx", help="Password prefix (default blank)", default="")
    parser.add_option("-s", "--suffix", dest="sfx", help="Password suffix (default blank)", default="")
    (options, args) = parser.parse_args()
    if options.mpw == "":
        import getpass
        options.mpw = getpass.getpass("Master password: ")
    # we don't support leet yet
    leet = None
    leetlevel = 0
    try:
        print generatepassword(options.alg,
                               options.mpw,
                               options.url + options.user + options.mod,
                               leet,
                               leetlevel - 1,
                               options.len,
                               options.charset,
                               options.pfx,
                               options.sfx,
                              )
    except PMError, e:
        print e
        sys.exit(1)


# Main
if __name__ == "__main__":
    if len(sys.argv) == 1:
        gui()
    else:
        cmd()

