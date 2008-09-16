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

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.Provider;
import java.security.Security;
import java.util.HashMap;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

/**
 * Hash an arbitrary string using an arbitrary character set (not just hex or Base64) with an arbitrary
 * algorithm. <p/>Example usage: <br/><br/>Hash ericjung 01234567879abcdef MD5 <p/>See <a
 * href="http://java.sun.com/j2se/1.4.2/docs/guide/security/CryptoSpec.html#AppA"> Appendix A in the Java
 * Cryptography Architecture API Specification & Reference </a> for standard algorithm names. Some examples
 * are: MD2, MD5, SHA1, SHA-256, SHA-384, SHA-512, HMAC-SHA512 <p/> If you're looking for a Java Security
 * Provider, try the open-source API provided by <a href="http://www.bouncycastle.org/">The Legion of the
 * Bouncy Castle"</a>, which implements many different algorithms--including all HMAC.
 * 
 * @author Eric Jung <grimholtz@yahoo.com>
 */
public class Hasher {
    public final static HashMap algorithms = new HashMap(12);
    private Provider bc;
    
    public Hasher() {
        Security.addProvider(new BouncyCastleProvider());
        bc = Security.getProvider("BC");
        algorithms.put("MD4", "MD4");
        algorithms.put("HMAC-MD4", "HMAC-MD4");
        algorithms.put("MD5", "MD5");
        algorithms.put("MD5 Version 0.6", "MD5");
        algorithms.put("HMAC-MD5", "HMAC-MD5");
        algorithms.put("HMAC-MD5 Version 0.6", "HMAC-MD5");
        algorithms.put("SHA1", "SHA1");
        algorithms.put("HMAC-SHA1", "HMAC-SHA1");
        algorithms.put("SHA-256", "SHA-256");
        algorithms.put("HMAC-SHA-256", "HMAC-SHA256");
        algorithms.put("RIPEMD-160", "RIPEMD160");
        algorithms.put("HMAC-RIPEMD-160", "HMAC-RIPEMD160");  
    }

    public String execute(String hashMe, String charset, String algorithm) throws NoSuchAlgorithmException {
        System.out.println(algorithms.get(algorithm));
        return rstr2any(new String(MessageDigest.getInstance((String)algorithms.get(algorithm), bc).digest(hashMe.getBytes())), charset);
        // byte [] ba = MessageDigest.getInstance(algorithm).digest(hashMe.getBytes());
        // return new String(Base64.encode(ba));
    }

    /**
     * Convert a raw string to an arbitrary string encoding, including leading zeros
     */
    private String rstr2any(String input, String encoding) {
        int divisor = encoding.length();
        /* Convert to an array of 16-bit big-endian values, forming the dividend */
        int[] dividend = new int[(int) Math.ceil(input.length() / 2)];
        for (int i = 0; i < dividend.length; i++) {
            dividend[i] = (((int) input.charAt(i * 2)) << 8) | ((int) input.charAt(i * 2 + 1));
        }
        /*
         * Repeatedly perform a long division. The binary array forms the dividend, the length of the encoding
         * is the divisor. Once computed, the quotient forms the dividend for the next step. We stop when the
         * dividend is zero. All remainders are stored for later use.
         */
        int full_length = (int) Math.ceil(input.length() * 8 / (Math.log(encoding.length()) / Math.log(2)));
        int[] remainders = new int[full_length];
        for (int j = 0; j < full_length; j++) {
            int[] quotient = new int[dividend.length];
            int qCounter = 0;
            int x = 0;
            for (int i = 0; i < dividend.length; i++) {
                x = (x << 16) + dividend[i];
                int q = (int) Math.floor(x / divisor);
                x -= q * divisor;
                if (quotient.length > 0 || q > 0)
                    quotient[qCounter++] = q;
            }
            remainders[j] = x;
            dividend = quotient;
        }
        /* Convert the remainders to the output string */
        StringBuffer output = new StringBuffer();
        for (int i = remainders.length - 1; i >= 0; i--)
            output.append(encoding.charAt(remainders[i]));
        return output.toString();
    }

    /**
     * Convert an array of little-endian words to a string
     */
    /*
     * private String binl2rstr(String input) { StringBuffer ret = new StringBuffer(); for (int i = 0; i <
     * input.length() * 32; i += 8) ret.append((char) ((input.charAt(i >> 5) >>> (i % 32)) & 0xFF)); return
     * ret.toString(); }
     */
    /**
     * Entry point.
     * 
     * @param args
     * @throws NoSuchAlgorithmException
     */
    public static void main(String[] args) throws NoSuchAlgorithmException {
        if (args.length != 3) {
            System.err.println("Usage: Hash str1 str2 str3");
            System.err.println("where str1 is the string to be hashed,");
            System.err.println("where str2 is the character set,");
            System.err.println("and where str3 is the hash algorithm");
            System.err.println("Example: Hash ericjung 01234567879abcdef MD5");
            System.exit(-1);
        }
        new Hasher().execute(args[0], args[1], args[2]);
        System.exit(0);
    }
}