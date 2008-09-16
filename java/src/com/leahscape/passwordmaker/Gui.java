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
import java.io.*;
import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeEvent;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.SystemColor;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.GridLayout;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JTabbedPane;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.JFileChooser;
import javax.swing.JList;
import javax.swing.ListModel;
import javax.swing.ListSelectionModel;
import javax.swing.DefaultListModel;
import javax.swing.JButton;
import javax.swing.SwingUtilities;
import javax.swing.UIManager;
/**
 * PasswordMaker GUI class for J2SE edition.
 * 
 * @author Greg Hendrickson (lordgreggregatgmailcom)
 * @author Eric Jung (eric.jung@yahoo.com)
**/
public class Gui extends JFrame // implements ActionListener
{
    private JPanel page1,page2,page3,main3,bottom,bottomer,bottom3,top2,top3;
    private JList colorList,accountList;
    private JComboBox hashBox, a1337box, a1337lbox,a1337lbox2;
    private JButton saveb,loadb,deleteb,saveb3,loadb3,deleteb3;
    private JTextField urlt, lengtht, usert, modt, pret,filet,filet3, sut, charst, gent,leett,leetot;
    private JPasswordField masterp;
    private Generator generator = new Generator();
    private KeyListener khandler,khandler2;
    private ItemListener ihandler,ihandler2;
    private Color red1,red2,red3,blue1,blue2,blue3,green1,green2,green3,warm1,warm2,warm3,cool1,cool2,cool3,system1,system2,system3,lauragreg1,lauragreg2,lauragreg3;
	private static Gui singleton;
	private DefaultListModel accountData;
	private ObjectOutputStream s,r;
	private JFileChooser accountChooser;
	private Leet leeter = new Leet();
	private String baseDir;
    public Gui() {
        setTitle("PasswordMaker - One Password To Rule Them All!");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        //setIconImage(java.awt.Toolkit.getDefaultToolkit().getImage(getClass().getResource("ring.gif")));
        // Make sure we have nice window decorations.
        setDefaultLookAndFeelDecorated(true);
        setSize(600, 670);
        makeTab1();
        makeColors();
        makeTab2();
        makeTab3();
        makeTabber();
    }
    public void makeTabber() {
        JPanel topPanel = new JPanel();
        topPanel.setLayout(new BorderLayout());
        JTabbedPane tabber = new JTabbedPane();
        tabber.addTab("Generate", null, page1, "Generates the Password");
        tabber.addTab("Accounts", null, page3, "Saves the Account");
        tabber.addTab("Settings", null, page2, "Settings");
        // Future versions will have more tabs
        tabber.setMnemonicAt(0, 'g');
        topPanel.add(tabber);
        getContentPane().add(topPanel, BorderLayout.CENTER);
    }
    public void writeAccount()
   	{
      try
      {
        //char base[] = baseDir.toCharArray();
        try{
        	String destination = (accountChooser.getCurrentDirectory().toString()) +"\\"+filet.getText();
            System.out.println(destination);
           
        
        if( destination.endsWith( ".act") )
         {
	         s = new ObjectOutputStream(
	            new FileOutputStream( destination ) );
	            
	        //s.writeObject("Witre object string");
			s.writeObject(new Account(urlt.getText(), (String) a1337box.getSelectedItem(),
	                        ((Integer) a1337lbox.getSelectedItem()).intValue(), (String) hashBox.getSelectedItem(), charst
	                                .getText(), Integer.parseInt(lengtht.getText()), usert.getText(), modt.getText(), pret
	                                .getText(), sut.getText()));
			s.flush();
			s.close();
		}
		else
		{
			filet.setText(filet.getText()+".act");
			writeAccount();
		}	

		}
		catch(IndexOutOfBoundsException e)
		{
			JOptionPane.showMessageDialog(singleton,"Error, file must be inside \"Accounts\" folder");

		}
		
		writeDB();
      }
      catch ( IOException ioException )
      {
         System.err.println( "Error write account." );
      } // end catch
      accountChooser.rescanCurrentDirectory(); 
    } // end method openFile
  	public void writeDB()
  	{
  		try
  		{
  			if( accountData.contains(filet.getText())==false)
  			{
  			
  		
  			accountData.addElement(filet.getText());
  		 			
  			
  			ObjectOutputStream out1 = new ObjectOutputStream(
                           new FileOutputStream("Accounts.dbs"));
          	out1.writeObject( accountData);
          	out1.flush();
          	out1.close();
          	}
    		
                       
        	}
        catch(IOException ioException )
        {
        	System.err.println("Eroor 1101");
        }
  	}
  	public void readDB()
  	{
 		try
  		{
  			 		
  					 			
  			
  			ObjectInputStream in1 = new ObjectInputStream(
                           new FileInputStream("Accounts.dbs"));
                           
            accountData =(DefaultListModel)in1.readObject();
			              
             
          	in1.close();
          	
    		
                       
        }
        catch(IOException ioException )
        {
        	System.err.println("Eroor 1102");
        }
        catch(ClassNotFoundException ce)
        {
        	System.err.println("cls not found");
        }
  	}
  	public void readAccount()
  	{
  		try
  		{
  			//char base[] = baseDir.toCharArray();
  			//botom line for jlist
  			//String target = ("Accounts/"+(String)accountList.getSelectedValue()) + ".act";
  			
  			//this line for file choser
  			//String target = ("Accounts/"+filet.getText());
  			
  			
			String target = (accountChooser.getCurrentDirectory().toString()) +"\\"+filet.getText();
         	if(target.endsWith( ".act") )
         	{
  			FileInputStream in = new FileInputStream(target);
			ObjectInputStream r = new ObjectInputStream(in);
			//String today = (String)s.readObject();
			//Account account1 = new Account();
			Account ca =(Account)r.readObject();
			setAccount(ca);
			r.close();
			}
			else
			{
				filet.setText(filet.getText()+".act");
				readAccount();
			}
			
			
  		}
  		catch (Throwable e) 
  		{
                JOptionPane.showMessageDialog(singleton, "Error: " + e.getMessage());
                e.printStackTrace();
        }
        filet.setText((accountChooser.getName(accountChooser.getSelectedFile())));

        generatePassword();
        		
  	}
  	public void deleteAccount()
  	{
  		String target = ((accountChooser.getCurrentDirectory().toString())+"\\"+filet.getText());
  		File dfile = (new File(target));
  		accountData.removeElement(((String)accountList.getSelectedValue()));
  		try {
	    	dfile.delete();
	    	System.out.println("Successfully deleted " + dfile.toString());
			}
		catch (SecurityException e) {
	    System.out.println("Caught security exception trying to delete file " + dfile.toString());
       		}	
       	dfile.deleteOnExit();
  		
  		
  		boolean isdeleted =   dfile.delete();
  		System.out.print(dfile);
       	System.out.println( "  deleted " + isdeleted);
  		try{
	  		ObjectOutputStream out2 = new ObjectOutputStream(new FileOutputStream("Accounts.dbs"));
	        out2.writeObject( accountData);
	        out2.flush();
	        out2.close();
	        }
	    catch(IOException ioException )
        {
        	System.err.println("Eroor 1103");
        }
        accountChooser.rescanCurrentDirectory();
  	}	
  	public void setAccount(Account ca)
  	{
  		urlt.setText(ca.getUrl());
		a1337lbox.setSelectedIndex(((int)ca.getLeetLevel()-1));
		int x=0;
		String s[] ={"not at all","before generating password","after generating password","before and after generating password"};
		for(int i=0; i<4;i++)
		{
			if(ca.getUseLeet().compareToIgnoreCase(s[i])==0)
			{
				x=i;
			}
		}
		//System.out.println("a 1337 box " + x);
		a1337box.setSelectedIndex(x);
		
		for(int i=0; i<12;i++)
		{
			if(ca.getHashAlgorithm().compareToIgnoreCase((String)(hashBox.getItemAt(i)))==0)
			{
				x=i;
			}
		}
		//System.out.println("a hash box " + x);
		hashBox.setSelectedIndex(x);
		
		charst.setText(ca.getCharset());
		s[0]=""+ca.getLength();
		lengtht.setText(s[0]);
		usert.setText(ca.getUsername());
		modt.setText(ca.getModifier());
		pret.setText(ca.getPrefix());
		sut.setText(ca.getSuffix());
		filet.setText(((String)accountList.getSelectedValue()));
  	}
    public void makeTab1() {
        khandler = new KeyListener() {
            public void keyPressed(KeyEvent e) {

            }

            public void keyReleased(KeyEvent e) {
                generatePassword();
                accountChooser.setSelectedFile(new File(filet.getText()));
                filet3.setText(filet.getText());

          
                //writeAccount();
            }

            public void keyTyped(KeyEvent e) {
            }
        };
        ihandler = new ItemListener() {
            public void itemStateChanged(ItemEvent e) {
                //System.out.println(a1337box.getSelectedItem());
                if (e.getSource().equals(a1337box) && e.getStateChange() == ItemEvent.SELECTED
                        && ((String) a1337box.getSelectedItem()).indexOf("after") > -1)
                    JOptionPane
                            .showMessageDialog(
                                    singleton,
                                    "Please note: this type of l33t may place special\ncharacters in the generated password which are\nnot in the list of characters you've defined in\nthe characters field.");
                a1337lbox.setEnabled(a1337box.getSelectedIndex() != 0);
                generatePassword();
            }
        };
        saveb = new JButton("Save");
    	saveb.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
            	if(filet.getText().compareTo("")!=0)
            	{
            		writeAccount();
            	}
            	else 
            	{
            		JOptionPane.showMessageDialog(singleton,"Please input a file name");
            	}
            	}
            }
        );
        loadb = new JButton("Load");
    	loadb.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
            	readAccount();
            	}
            }
        );
        deleteb = new JButton("Delete");
    	deleteb.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
            	deleteAccount();
            	}
            }
        );
        //String[] data = {"one", "two", "free", "four"};
		accountData = new DefaultListModel();
        //accountData.addElement("Alan Sommerer");	
        readDB();


		
		accountList = new JList(accountData);
		accountList.setSelectionMode(ListSelectionModel.SINGLE_INTERVAL_SELECTION);
		//accountList.setLayoutOrientation(JList.HORIZONTAL_WRAP);
		accountList.setVisibleRowCount(-1);
		accountList.setDragEnabled(true);
		
		accountList.addMouseListener(new MouseAdapter() {
		    public void mouseClicked(MouseEvent e) {
		        if (e.getClickCount() == 2) {
		            int index = accountList.locationToIndex(e.getPoint());
		            readAccount();
		         }
		  	  }
			});


		
		
        JScrollPane listScroller = new JScrollPane(accountList);
        listScroller.setPreferredSize(new Dimension(120, 80));
        
        
        /* Starting wokr on a j file chooser
         * it should be able to let me pic directories
         * and then let me write to it
         * it should also b able to get the file name form it so i can load it
         * and filter so it only see .act files
         */
         
        
        accountChooser = new JFileChooser(new File(""));
        try {
       		// Create a File object containing the canonical path of the
        	// desired directory
        	
        	
        	File f = new File(new File("Accounts\\.").getCanonicalPath());
        
        	boolean g=f.mkdir();
        	baseDir = new File(new File(".").getCanonicalPath()).toString();
    		
        	// Set the current directory
        	accountChooser.setCurrentDirectory(f);
        	accountChooser.addChoosableFileFilter(new actFileFilter());
        	accountChooser.setApproveButtonMnemonic('g');
        	accountChooser.setAcceptAllFileFilterUsed(false);
        	accountChooser.setApproveButtonText("Greg test text");
        	accountChooser.setControlButtonsAreShown(false);
        	
        	
    		} catch (IOException e) {}
    	accountChooser.addPropertyChangeListener(new PropertyChangeListener() {
	        public void propertyChange(PropertyChangeEvent evt) {
	            if (JFileChooser.DIRECTORY_CHANGED_PROPERTY.equals(evt.getPropertyName())) {
	                JFileChooser chooser = (JFileChooser)evt.getSource();
	                File oldDir = (File)evt.getOldValue();
	                File newDir = (File)evt.getNewValue();
	    			accountChooser.rescanCurrentDirectory();
	                // The current directory should always be the same as newDir
	                File curDir = chooser.getCurrentDirectory();
		            }
		            accountChooser.rescanCurrentDirectory();
                    filet.setText((accountChooser.getName(accountChooser.getSelectedFile())));

		            
		        }
		    }) ;
		accountChooser.addMouseListener(new MouseAdapter() {
		    public void mouseClicked(MouseEvent e) {
		        if (e.getClickCount() == 2) {
		            
		            readAccount();
		         }
		  	  }
			});
	               	
        
        masterp = new JPasswordField("", 30);
        masterp.setForeground(Color.blue);
        masterp.addKeyListener(khandler);
        a1337box = new JComboBox(new String[] { "not at all", "before generating password",
                "after generating password", "before and after generating password" });
        a1337box.addKeyListener(khandler);
        a1337lbox = new JComboBox(new Integer[] { new Integer(1), new Integer(2), new Integer(3), new Integer(4),
                new Integer(5), new Integer(6), new Integer(7), new Integer(8), new Integer(9) });
        a1337lbox.setEnabled(false);
        a1337lbox.addKeyListener(khandler);
        a1337box.addItemListener(ihandler);
        a1337lbox.addItemListener(ihandler);
        hashBox = new JComboBox(Hasher.algorithms.keySet().toArray());
        hashBox.addItemListener(ihandler);
        urlt = new JTextField("", 20);
        urlt.addKeyListener(khandler);
        lengtht = new JTextField("8", 5);
        lengtht.addKeyListener(khandler);
        usert = new JTextField("", 20);
        filet = new JTextField("", 22);
        filet.addKeyListener(khandler);
        usert.addKeyListener(khandler);
        modt = new JTextField("", 20);
        modt.addKeyListener(khandler);
        pret = new JTextField("", 20);
        pret.addKeyListener(khandler);
        sut = new JTextField("", 20);
        sut.addKeyListener(khandler);
        charst = new JTextField((String) Account.charsets.get("all"), 20);
        charst.addKeyListener(khandler);
        gent = new JTextField("", 20);
        gent.setForeground(Color.red);
        gent.setText("Please enter a master password");
        bottomer=new JPanel();
        bottomer.setLayout(new FlowLayout());
        bottomer.add(new JLabel("Account Name:"));
        bottomer.add(filet);
        //bottomer.add(new JLabel(".act"));
        bottomer.add(saveb);
        bottomer.add(loadb);
        bottomer.add(deleteb);  
        
        //bottomer.add(listScroller);
        
        
        bottom = new JPanel();
        //bottomerer = new JPanel();
        
        //bottomerer.add(accountChooser);
        
        
        // top.setLayout(new GridLayout(2,1,0,20));
        bottom.setLayout(new FlowLayout());
        bottom.add(new JLabel("Master Password:"));
        bottom.add(masterp);
        //bottom.setMinimumSize(new Dimension(400, 30));
        
       	bottom.setLayout(new GridLayout(12, 2, 0, 10));
       
        bottom.add(new JLabel("Use l33t"));
        bottom.add(a1337box);
        bottom.add(new JLabel("l33t level"));
        bottom.add(a1337lbox);
        bottom.add(new JLabel("Hash Algorithm"));
        bottom.add(hashBox);
        bottom.add(new JLabel("URL"));
        bottom.add(urlt);
        bottom.add(new JLabel("Password Length"));
        bottom.add(lengtht);
        bottom.add(new JLabel("Username"));
        bottom.add(usert);
        bottom.add(new JLabel("Modifier"));
        bottom.add(modt);
        bottom.add(new JLabel("Prefix"));
        bottom.add(pret);
        bottom.add(new JLabel("Suffix"));
        bottom.add(sut);
        bottom.add(new JLabel("Characters"));
        bottom.add(charst);
        bottom.add(new JLabel("Generated Password"));
        // bottom.add(generate);
        bottom.add(gent);
        //bottom.setSize(100,100);
        //bottom.setMinimumSize(new Dimension(220, 100));
        bottom.setPreferredSize(new Dimension(590, 370));
        
        try {
            UIManager.setLookAndFeel(UIManager.getInstalledLookAndFeels()[2].getClassName());
            SwingUtilities.updateComponentTreeUI(this);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        page1 = new JPanel();
        //page1.setMinimumSize(new Dimension(620, 740));
        page1.setPreferredSize(new Dimension(620,340));
        page1.add(bottom);
        page1.add(bottomer);
        //page1.add(bottomerer);
        // page1.setSize(1700,700);
    }
    /**
     * Create the GUI and show it. For thread safety, this method should be invoked from the event-dispatching
     * thread.
     */
    private static void createAndShowGUI() {
        // Create and set up the window.
        singleton = new Gui();
        // Display the window.
        singleton.pack();
        singleton.setVisible(true);
    }
    /**
     * Create an Account object from the current UI settings, generate the password and set the generated
     * password in the UI.
     */
    public void generatePassword() {
        if (masterp.getPassword().length == 0)
            gent.setText("Please enter a master password");
        else {
            generator.setMasterPassword(new String(masterp.getPassword()));
            try {
                generator.setAccount(new Account(urlt.getText(), (String) a1337box.getSelectedItem(),
                        ((Integer) a1337lbox.getSelectedItem()).intValue(), (String) hashBox.getSelectedItem(), charst
                                .getText(), Integer.parseInt(lengtht.getText()), usert.getText(), modt.getText(), pret
                                .getText(), sut.getText()));
                generator.generate();
            }
            catch (Throwable e) {
                JOptionPane.showMessageDialog(singleton, "Error: " + e.getMessage());
                e.printStackTrace();
            }
            gent.setText(generator.getGeneratedPassword());
        }
    }
    public static void main(String[] args) {
        // Schedule a job for the event-dispatching thread:
        // creating and showing this application's GUI.
        javax.swing.SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                createAndShowGUI();
            }
        });
    }
    public void makeColors()
    {
    	red1    	= new Color(255, 0,   0 );
    	red2    	= new Color(200, 0,   0 );
    	red3    	= new Color(0, 0,   0 );
    	blue1		= new Color(0,160,255);
    	blue2		= new Color(0,0,175);
    	blue3		= new Color(0,0,60);
    	green2		= new Color(50,125,30);
    	green1		= new Color(0,255,0);
    	green3		= new Color(0,55,0);
    	warm2		= new Color(236,124,0);
    	warm1		= new Color(240,240,0);
    	warm3		= new Color(255,0,0);
    	cool3		= new Color(0,100,0);
    	cool2		= new Color(0,0,230);
    	cool1		= new Color(222,0,190);
    	system2		= saveb.getBackground();
    	system1		= page1.getBackground();
    	//system1     = SystemColor.control;
    	//system2		= SystemColor.controlShadow;
    	system3		= SystemColor.controlText;
    	// In dedication to my love -Greg
    	lauragreg1	= new Color(100,0,100);
		lauragreg2	= new Color(200,0,0);
    	lauragreg3	= new Color(255,0,0);


    }
    public void makeTab2()
    {
    	
		page2 = new JPanel();
    	top2=new JPanel();
    	top3=new JPanel();
    	khandler2 = new KeyListener() {
            public void keyPressed(KeyEvent e) {
            }

            public void keyReleased(KeyEvent e) {
                System.out.println("Generate the leet");
                leetot.setText(leeter.convert((a1337lbox2.getSelectedIndex()+1),leett.getText()));
            }

            public void keyTyped(KeyEvent e) {
            }
        };
        ihandler2 = new ItemListener() {
            public void itemStateChanged(ItemEvent e) {
                                leetot.setText(leeter.convert((a1337lbox2.getSelectedIndex()+1),leett.getText()));

            }
        };
        a1337lbox2 = new JComboBox(new Integer[] { new Integer(1), new Integer(2), new Integer(3), new Integer(4),
                new Integer(5), new Integer(6), new Integer(7), new Integer(8), new Integer(9) });
        a1337lbox2.addItemListener(ihandler2);

		colorList = new JList(new String[] { "Red", "Blue","Green", "Warm","Cool","Laura & Greg","System"} );
		colorList.setSelectedIndex(0);
		colorList.addMouseListener(new MouseAdapter() {
		    public void mouseClicked(MouseEvent e) {
		        if (e.getClickCount() == 2) {
		            int index = colorList.locationToIndex(e.getPoint());
		            colorize();
		         }
		  	  }
			});
       
    	JButton colorize = new JButton("Color Initiate");
    	colorize.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
            	colorize();
            	
            }
            
        });
    	
        JLabel leetl = new JLabel("Text");
        JLabel leetol= new JLabel("1337ed");
        leett = new JTextField(20);
        leetot= new JTextField(20);
        leett.addKeyListener(khandler2);
        top3.setLayout(new GridLayout(4,2,0,20));
        top3.add(leetl);
        top3.add(leett);
        top3.add(new JLabel("1337 Level"));
        top3.add(a1337lbox2);
        top3.add(leetol);
        top3.add(leetot);
        
        
        
        top2.add(colorize);
        top2.add(colorList);
                
    	JTabbedPane setTabber = new JTabbedPane();
        setTabber.addTab("Color Sceme", top2);
        setTabber.addTab("1337 Converter", top3);
        setTabber.setForegroundAt(0, Color.red);
        setTabber.setBackgroundAt(0, Color.orange);
        page2.add(setTabber);
    }
    public void colorize()
  	{
		Color [][] colors = new Color [][]{{red1,red2,red3},
										{blue1,blue2,blue3},
										{green1,green2,green3},
										{warm1,warm2,warm3},
										{cool1,cool2,cool3},
										{lauragreg1,lauragreg2,lauragreg3},
										{system1,system2,system3}};
										
         System.out.println("You chose to colorise ");
                
                
        page2.setBackground(colors[colorList.getSelectedIndex()][0]);
        page3.setBackground(colors[colorList.getSelectedIndex()][0]);
       	main3.setBackground(colors[colorList.getSelectedIndex()][1]);
        bottom.setBackground(colors[colorList.getSelectedIndex()][1]);
        bottomer.setBackground(colors[colorList.getSelectedIndex()][1]);
        bottom3.setBackground(colors[colorList.getSelectedIndex()][1]);
		top2.setBackground(colors[colorList.getSelectedIndex()][1]);
		top3.setBackground(colors[colorList.getSelectedIndex()][1]);
		page2.setForeground(colors[colorList.getSelectedIndex()][2]);
		top2.setForeground(colors[colorList.getSelectedIndex()][2]);
		page1.setBackground(colors[colorList.getSelectedIndex()][0]);
		urlt.setBackground(colors[colorList.getSelectedIndex()][0]);
		lengtht.setBackground(colors[colorList.getSelectedIndex()][0]);
		usert.setBackground(colors[colorList.getSelectedIndex()][0]);
		modt.setBackground(colors[colorList.getSelectedIndex()][0]);
		pret.setBackground(colors[colorList.getSelectedIndex()][0]);
		sut.setBackground(colors[colorList.getSelectedIndex()][0]);
		charst.setBackground(colors[colorList.getSelectedIndex()][0]);
		leett.setBackground(colors[colorList.getSelectedIndex()][0]);
		filet.setBackground(colors[colorList.getSelectedIndex()][0]);
		filet3.setBackground(colors[colorList.getSelectedIndex()][0]);
		leetot.setBackground(colors[colorList.getSelectedIndex()][0]);
		gent.setBackground(colors[colorList.getSelectedIndex()][0]);
		masterp.setBackground(colors[colorList.getSelectedIndex()][0]);
		masterp.setForeground(colors[colorList.getSelectedIndex()][1]);
		gent.setForeground(colors[colorList.getSelectedIndex()][2]);
		a1337lbox.setBackground(colors[colorList.getSelectedIndex()][0]);
		accountList.setBackground(colors[colorList.getSelectedIndex()][0]);
		a1337lbox2.setBackground(colors[colorList.getSelectedIndex()][0]);
		a1337box.setBackground(colors[colorList.getSelectedIndex()][0]);
		hashBox.setBackground(colors[colorList.getSelectedIndex()][0]);
		hashBox.setForeground(colors[colorList.getSelectedIndex()][2]);
		accountList.setForeground(colors[colorList.getSelectedIndex()][2]);
		a1337lbox.setForeground(colors[colorList.getSelectedIndex()][2]);
		a1337lbox2.setForeground(colors[colorList.getSelectedIndex()][2]);				
		a1337box.setForeground(colors[colorList.getSelectedIndex()][2]);               
		urlt.setForeground(colors[colorList.getSelectedIndex()][2]);
		lengtht.setForeground(colors[colorList.getSelectedIndex()][2]);
		leett.setForeground(colors[colorList.getSelectedIndex()][2]);
		filet.setForeground(colors[colorList.getSelectedIndex()][2]);
		filet3.setForeground(colors[colorList.getSelectedIndex()][2]);
		leetot.setForeground(colors[colorList.getSelectedIndex()][2]);
		usert.setForeground(colors[colorList.getSelectedIndex()][2]);
		modt.setForeground(colors[colorList.getSelectedIndex()][2]);
		pret.setForeground(colors[colorList.getSelectedIndex()][2]);
		sut.setForeground(colors[colorList.getSelectedIndex()][2]);
		charst.setForeground(colors[colorList.getSelectedIndex()][2]);
		gent.setForeground(colors[colorList.getSelectedIndex()][2]);
		masterp.setForeground(colors[colorList.getSelectedIndex()][2]);
		saveb.setBackground(colors[colorList.getSelectedIndex()][0]);
		loadb.setBackground(colors[colorList.getSelectedIndex()][0]);
		deleteb.setBackground(colors[colorList.getSelectedIndex()][0]);
		saveb3.setBackground(colors[colorList.getSelectedIndex()][0]);
		loadb3.setBackground(colors[colorList.getSelectedIndex()][0]);
		deleteb3.setBackground(colors[colorList.getSelectedIndex()][0]);
		deleteb.setForeground(colors[colorList.getSelectedIndex()][2]);
		loadb.setForeground(colors[colorList.getSelectedIndex()][2]);
		saveb.setForeground(colors[colorList.getSelectedIndex()][2]);
		deleteb3.setForeground(colors[colorList.getSelectedIndex()][2]);
		loadb3.setForeground(colors[colorList.getSelectedIndex()][2]);
		saveb3.setForeground(colors[colorList.getSelectedIndex()][2]);
		accountChooser.setForeground(colors[colorList.getSelectedIndex()][2]);  	
		accountChooser.setBackground(colors[colorList.getSelectedIndex()][1]);
  	}
  	class actFileFilter extends javax.swing.filechooser.FileFilter {
    public boolean accept(File f) {
	        return f.isDirectory() || f.getName().toLowerCase().endsWith(".act");
	    }
    public String getDescription() {
	        return "Account files";
	    }
	}	    
	public void makeTab3()
	{
		page3=new JPanel();
		main3=new JPanel();
		bottom3=new JPanel();
		
		saveb3 = new JButton("Save");
    	saveb3.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
            	if(filet.getText().compareTo("")!=0)
            	{
            		writeAccount();
            	}
            	else 
            	{
            		JOptionPane.showMessageDialog(singleton,"Please input a file name");
            	}
            	}
            }
        );
        loadb3 = new JButton("Load");
    	loadb3.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
            	readAccount();
            	}
            }
        );
        deleteb3 = new JButton("Delete");
    	deleteb3.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
            	deleteAccount();
            	}
            }
        );
        
        filet3 = new JTextField("", 22);
        filet3.addKeyListener(new KeyListener(){
        	public void keyReleased(KeyEvent e){
        		filet.setText(filet3.getText());
        	}
        	public void keyTyped(KeyEvent e){
        	}
        	public void keyPressed(KeyEvent e){
        	}
        });
		
		
		
		main3.setLayout(new FlowLayout());
        main3.add(new JLabel("Account Name:"));
       	main3.add(filet3);
        //bottomer.add(new JLabel(".act"));
        main3.add(saveb3);
        main3.add(loadb3);
        main3.add(deleteb3);  
        
        
        bottom3.add(accountChooser);
        
        page3.add(main3);
        page3.add(bottom3);
        page3.setPreferredSize(new Dimension(620, 450));
        
		
	
    }
}