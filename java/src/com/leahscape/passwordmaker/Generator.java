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

package com.leahscape.passwordmaker;

import java.security.NoSuchAlgorithmException;

/**
 * @author Greg Hendrickson
 * @author Eric Jung
 */
public class Generator {
    private String masterPassword;
    private Account account;
    private String generatedPassword;
    private Leet leeter = new Leet();
    private Hasher hasher = new Hasher();

    public void generate() throws NoSuchAlgorithmException {
        // For non-hmac algorithms, the key is master pw and url concatenated
        String key = masterPassword;
        StringBuffer buf = new StringBuffer(512);
        buf.append(account.getUrl());
        buf.append(account.getUsername());
        buf.append(account.getModifier());
        String data = buf.toString();
        boolean usingHMAC = account.usesHMAC();
        if (!usingHMAC)
            key += data;
        
        // Apply l33t before the algorithm?
        if (leeter.isBefore(account.getUseLeet())) {
            key = leeter.convert(account.getLeetLevel(), key);
            if (usingHMAC) {
                data = leeter.convert(account.getLeetLevel(), data);
            }
        }
        // Apply the algorithm
        String password = hasher.execute(key, account.getCharset(), account.getHashAlgorithm());
        // Apply l33t after the algorithm?
        if (leeter.isAfter(account.getUseLeet()))
            password = leeter.convert(account.getLeetLevel(), password);
        
        if (account.getPrefix().length() > 0) {
            password = account.getPrefix() + password;
        }
        if (account.getSuffix().length() > 0) {
            String pw = password.substring(0, account.getLength() - account.getSuffix().length()) + account.getSuffix();
            generatedPassword = pw.substring(0, account.getLength());
            return;
        }
        generatedPassword = password.substring(0, account.getLength() > password.length() ? password.length() : account
                .getLength());
    }

    /**
     * @param account
     *            The account to set.
     */
    public void setAccount(Account account) {
        this.account = account;
    }

    /**
     * @param masterPassword
     *            The masterPassword to set.
     */
    public void setMasterPassword(String masterPassword) {
        this.masterPassword = masterPassword;
    }

    /**
     * @return Returns the generatedPassword.
     */
    public String getGeneratedPassword() {
        return generatedPassword;
    }
}
