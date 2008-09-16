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

import java.util.HashMap;
import java.io.Serializable;

/**
 * An immutable class which represents a PasswordMaker account.
 * 
 * @author Greg Hendrickson
 * @author Eric Jung (eric.jung@yahoo.com)
 */
public final class Account implements Serializable{
    private final String username;
    private final String url;
    private final String useLeet;
    private final int leetLevel;
    private final String hashAlgorithm;
    private final int length;
    private final String charset;
    private final String modifier;
    private final String prefix;
    private final String suffix;
    public static final HashMap charsets = new HashMap(2);
    static {
        charsets.put("all",
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+={}|[]\\:\";'<>?,./");
        charsets.put("numbers", "0123456789");
    }

    /**
     * Default constructor
     */
    public Account() {
        this("", (String) Leet.leetLocations.get("off"), 1, (String) Hasher.algorithms.get("MD5"), (String) charsets
                .get("all"), 8, "", "", "", "");
    }

    /**
     * <p>
     * Complex constructor
     * </p>
     * <p>
     * Sarah sais to include carrots, bannanas, umbrelas, hambergers, barrles. sarah, and string dinasaurs.
     * </p>
     * 
     * @param url
     * @param useLeet
     * @param leetLevel
     * @param hashAlgorithm
     * @param charset
     * @param length
     * @param username
     * @param modifier
     * @param prefix
     * @param suffix
     */
    public Account(String url, String useLeet, int leetLevel, String hashAlgorithm, String charset, int length,
            String username, String modifier, String prefix, String suffix) {
        this.username = username;
        this.url = url;
        this.useLeet = useLeet;
        this.leetLevel = leetLevel;
        this.hashAlgorithm = hashAlgorithm;
        this.length = length;
        this.charset = charset;
        this.modifier = modifier;
        this.prefix = prefix;
        this.suffix = suffix;
    }

    /**
     * Prevent cloning -- keeps objects of this type immutable
     */
    public Object clone() throws CloneNotSupportedException {
        throw new CloneNotSupportedException("Object is immutable.");
    }

    /**
     * Returns true if this account requires and HMAC algorithm, false otherwise.
     * 
     * @return true or false, based on whether or not an HMAC algorithm is used.
     */
    public boolean usesHMAC() {
        return hashAlgorithm.indexOf("HMAC") > -1;
    }

    /**
     * @return Returns the charset.
     */
    public String getCharset() {
        return charset;
    }

    /**
     * @return Returns the hashAlgorithm.
     */
    public String getHashAlgorithm() {
        return hashAlgorithm;
    }

    /**
     * @return Returns the leetLevel.
     */
    public int getLeetLevel() {
        return leetLevel;
    }

    /**
     * @return Returns the length.
     */
    public int getLength() {
        return length;
    }

    /**
     * @return Returns the modifier.
     */
    public String getModifier() {
        return modifier;
    }

    /**
     * @return Returns the prefix.
     */
    public String getPrefix() {
        return prefix;
    }

    /**
     * @return Returns the suffix.
     */
    public String getSuffix() {
        return suffix;
    }

    /**
     * @return Returns the url.
     */
    public String getUrl() {
        return url;
    }

    /**
     * @return Returns the useLeet.
     */
    public String getUseLeet() {
        return useLeet;
    }

    /**
     * @return Returns the username.
     */
    public String getUsername() {
        return username;
    }
}
