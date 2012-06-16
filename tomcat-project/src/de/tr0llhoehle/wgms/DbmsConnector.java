package de.tr0llhoehle.wgms;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Properties;

import de.tr0llhoehle.wgms.structs.TempShoppingList;

public class DbmsConnector {
	// The JDBC Connector Class.
	private static final String dbClassName = "com.mysql.jdbc.Driver";

	// database = wgms
	private static final String CONNECTION = "jdbc:mysql://127.0.0.1/wgms";
	private static final String USER = "troll";
	private static final String PASS = "troll";

	private static boolean connected = false;
	private Connection c = null;

	private static DbmsConnector instance = null;

	public DbmsConnector() {
		this.openConnection();
	}

	public synchronized static DbmsConnector getInstance() {
		if (instance == null) {
			instance = new DbmsConnector();
		}
		return instance;
	}

	private void openConnection() {
		try {
			Class.forName(dbClassName);
		} catch (ClassNotFoundException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		Properties p = new Properties();
		p.put("user", USER);
		p.put("password", PASS);

		try {
			c = DriverManager.getConnection(CONNECTION, p);
			connected = true;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			connected = false;
		}
	}

	public void closeConnection() {
		if (c == null) {

			return;
		}
		try {
			c.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		connected = false;
		c = null;
	}

	public String getPassword(String username) {
		if (username == null || username.trim().equals("") || !connected) {
			return null;
		}

		try {
			PreparedStatement getPwd = c
					.prepareStatement("SELECT password FROM users WHERE username = ?");
			getPwd.setString(1, username.trim());
			ResultSet result = getPwd.executeQuery();
			String password = null;
			while (result.next()) {
				password = result.getString("password");
			}

			getPwd.close();
			return password;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();

		}
		return null;
	}

	public void checkItem(String itemId) {
		if (itemId == null || itemId.trim().equals("") || !connected) {
			return;
		}

		try {
			PreparedStatement checkItem = c
					.prepareStatement("UPDATE items SET checked 1 WHERE item_id EQUALS ?");
			checkItem.setString(1, itemId.trim());
			checkItem.executeUpdate();
			checkItem.close();

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();

		}

	}

	public void uncheckItem(String itemId) {
		if (itemId == null || itemId.trim().equals("") || !connected) {
			return;
		}

		try {
			PreparedStatement checkItem = c
					.prepareStatement("UPDATE items SET checked 0 WHERE item_id EQUALS ?");
			checkItem.setString(1, itemId.trim());
			checkItem.executeUpdate();
			checkItem.close();

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();

		}

	}

	public void insertItem(String description, String shoppingListId,
			String userName) {
		if (shoppingListId == null || shoppingListId.trim().equals("")
				|| description == null || description.trim().equals("")
				|| !connected) {
			return;
		}

		try {
			PreparedStatement checkItem = c
					.prepareStatement("INSERT INTO items Values(null,?,?,null,'0', (SELECT userid FROM users WHERE username = ?),null)");
			checkItem.setString(1, description);
			checkItem.setString(2, shoppingListId);
			checkItem.setString(3, userName);
			checkItem.executeUpdate();

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	public ArrayList<TempShoppingList> getUserLists(String userName) {

		if (userName == null || userName.trim().equals("") || !connected) {
			return null;
		}

		ArrayList<TempShoppingList> lists = new ArrayList<TempShoppingList>();

		try {
			PreparedStatement getList = c
					.prepareStatement("SELECT shopping_list_id, title FROM shopping_lists WHERE wg_id = (SELECT wg_id FROM users WHERE username =?)");
			getList.setString(1, userName);
			getList.executeQuery();
			ResultSet result = getList.executeQuery();
			// ResultSetMetaData meta = result.getMetaData();
			// if (meta == null) {
			// return null;
			// }
			while (result.next()) {

				lists.add(new TempShoppingList(result
						.getInt("shopping_list_id"), result.getString("title")));
			}
			return lists;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

}
