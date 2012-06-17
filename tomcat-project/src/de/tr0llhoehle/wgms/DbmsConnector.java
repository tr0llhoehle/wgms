package de.tr0llhoehle.wgms;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Properties;

import de.tr0llhoehle.wgms.structs.TempPurchase;
import de.tr0llhoehle.wgms.structs.TempShoppingList;
import de.tr0llhoehle.wgms.structs.TempShoppingListItem;

public class DbmsConnector {
	// The JDBC Connector Class.
	private static final String dbClassName = "com.mysql.jdbc.Driver";

	// database = wgms
	private static final String CONNECTION = "jdbc:mysql://127.0.0.1/wgms";
	// private static final String USER = "troll";
	// private static final String PASS = "troll";

	private static final String USER = "wgms";
	private static final String PASS = "heZ7ayGBYsFKxsVj";

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

	private synchronized void openConnection() {
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

	public synchronized void closeConnection() {
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

	public synchronized String getEmail(String username) {
		if (username == null || username.trim().equals("") || !connected) {
			return null;
		}

		try {
			PreparedStatement getEmail = c
					.prepareStatement("SELECT email FROM users WHERE username = ?");
			getEmail.setString(1, username.trim());
			ResultSet result = getEmail.executeQuery();
			String email = null;
			while (result.next()) {
				email = result.getString("email");
			}

			// getEmail.close();
			return email;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();

		}
		return null;
	}

	public synchronized String getPassword(String username) {
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

			// getPwd.close();
			return password;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();

		}
		return null;
	}

	public synchronized void checkItem(int id) {
		this.checkItem(String.valueOf(id));
	}

	public synchronized void checkItem(String itemId) {
		if (itemId == null || itemId.trim().equals("") || !connected) {
			return;
		}

		try {
			PreparedStatement checkItem = c
					.prepareStatement("UPDATE items SET checked = 1 WHERE item_id = ?");
			checkItem.setString(1, itemId.trim());
			checkItem.executeUpdate();
			// checkItem.close();

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();

		}

	}

	public synchronized void uncheckItem(int id) {
		this.uncheckItem(String.valueOf(id));
	}

	public synchronized void uncheckItem(String itemId) {
		if (itemId == null || itemId.trim().equals("") || !connected) {
			return;
		}

		try {
			PreparedStatement checkItem = c
					.prepareStatement("UPDATE items SET checked = 0 WHERE item_id = ?");
			checkItem.setString(1, itemId.trim());
			checkItem.executeUpdate();
			// checkItem.close();

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();

		}

	}

	public synchronized void insertItem(String description, int shoppingListId,
			String userName) {
		this.insertItem(description, String.valueOf(shoppingListId), userName);
	}

	public synchronized void insertItem(String description,
			String shoppingListId, String userName) {
		if (shoppingListId == null || shoppingListId.trim().equals("")
				|| description == null || description.trim().equals("")
				|| !connected) {
			return;
		}

		try {
			PreparedStatement checkItem = c
					.prepareStatement("INSERT INTO items Values(null,?,?,null,'0', (SELECT user_id FROM users WHERE username = ?),null)");
			checkItem.setString(1, description);
			checkItem.setString(2, shoppingListId);
			checkItem.setString(3, userName);
			checkItem.executeUpdate();

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	public synchronized ArrayList<TempPurchase> getUserPurchases(String userName) {

		if (userName == null || userName.trim().equals("") || !connected) {
			return null;
		}

		ArrayList<TempPurchase> lists = new ArrayList<TempPurchase>();

		try {
			PreparedStatement getList = c
					.prepareStatement("SELECT purchase_id, value, purchase_date FROM purchases WHERE user_id = (SELECT user_id FROM users WHERE username =?)");
			getList.setString(1, userName);
			getList.executeQuery();
			ResultSet result = getList.executeQuery();
			// ResultSetMetaData meta = result.getMetaData();
			// if (meta == null) {
			// return null;
			// }
			while (result.next()) {

				lists.add(new TempPurchase(result.getInt("purchase_id"), result
						.getBigDecimal("value"), result
						.getTimestamp("purchase_date")));
			}
			return lists;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	public synchronized ArrayList<TempShoppingList> getUserLists(String userName) {

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

	public synchronized boolean isItemChecked(int id) {
		return this.isItemChecked(String.valueOf(id));

	}

	public synchronized boolean isItemChecked(String itemID) {
		if (itemID == null || itemID.trim().equals("") || !connected) {
			return false;
		}
		boolean isChecked = false;
		try {
			PreparedStatement getChecked = c
					.prepareStatement("SELECT checked FROM items WHERE item_id = ?");
			getChecked.setString(1, itemID.trim());
			ResultSet result = getChecked.executeQuery();

			while (result.next()) {
				isChecked = result.getBoolean("checked");
			}

			// getChecked.close();
			return isChecked;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();

		}
		return isChecked;

	}

	public synchronized ArrayList<TempShoppingListItem> getPurchaseItems(
			int listId) {
		String id = String.valueOf(listId);
		return this.getPurchaseItems(id);
	}

	public synchronized ArrayList<TempShoppingListItem> getPurchaseItems(
			String listId) {

		if (listId == null || listId.trim().equals("") || !connected) {
			return null;
		}

		ArrayList<TempShoppingListItem> items = new ArrayList<TempShoppingListItem>();

		try {
			PreparedStatement getList = c
					.prepareStatement("SELECT item_id, description FROM items WHERE purchase_id = ?");
			getList.setString(1, listId.trim());
			getList.executeQuery();
			ResultSet result = getList.executeQuery();
			// ResultSetMetaData meta = result.getMetaData();
			// if (meta == null) {
			// return null;
			// }
			while (result.next()) {

				items.add(new TempShoppingListItem(result.getInt("item_id"),
						result.getString("description")));
			}
			return items;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	public synchronized ArrayList<TempShoppingListItem> getListsItems(int listId) {
		String id = String.valueOf(listId);
		return this.getListsItems(id);
	}

	public synchronized ArrayList<TempShoppingListItem> getListsItems(
			String listId) {

		if (listId == null || listId.trim().equals("") || !connected) {
			return null;
		}

		ArrayList<TempShoppingListItem> items = new ArrayList<TempShoppingListItem>();

		try {
			PreparedStatement getList = c
					.prepareStatement("SELECT item_id, description FROM items WHERE shopping_list_id = ? AND purchase_id IS NULL ORDER BY checked");
			getList.setString(1, listId.trim());
			getList.executeQuery();
			ResultSet result = getList.executeQuery();
			// ResultSetMetaData meta = result.getMetaData();
			// if (meta == null) {
			// return null;
			// }
			while (result.next()) {

				items.add(new TempShoppingListItem(result.getInt("item_id"),
						result.getString("description")));
			}
			return items;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	public synchronized void shoppingDone(String username, int shoppingListId,
			BigDecimal value) {
		this.shoppingDone(username, String.valueOf(shoppingListId), value);
	}

	public synchronized void shoppingDone(String username,
			String shoppingListId, BigDecimal value) {
		if (username == null || username.trim().equals("")
				|| shoppingListId == null || shoppingListId.trim().equals("")
				|| !connected) {
			return;
		}

		try {
			PreparedStatement createPurchase = c
					.prepareStatement(
							"INSERT INTO purchases (value, user_id)VALUES (? ,(SELECT user_id FROM users WHERE username = ?))",
							Statement.RETURN_GENERATED_KEYS);
			createPurchase.setBigDecimal(1, value);
			createPurchase.setString(2, username.trim());

			createPurchase.executeUpdate();

			// ResultSet result =
			// createPurchase.executeQuery("SELECT LAST_INSERT_ID()");
			ResultSet result = createPurchase.getGeneratedKeys();

			int autoIncValue = -1;

			if (result.next()) {
				// get created key
				autoIncValue = result.getInt(1);
				// System.out.println(autoIncValue);

				// update items
				PreparedStatement updateItems = c
						.prepareStatement("UPDATE items SET purchase_id =?, checked = 0 WHERE shopping_list_id = ? AND purchase_id IS NOT NULL");
				updateItems.setString(1, String.valueOf(autoIncValue));
				updateItems.setString(2, shoppingListId.trim());

				updateItems.executeUpdate();

			} else {
				// something very wrong
				return;
			}

			// getChecked.close();

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();

		}

	}

	public synchronized ArrayList<String> getEmailsOfFlatmates(String username) {
		if (username == null || username.trim().equals("") || !connected) {
			return null;
		}

		ArrayList<String> adresses = new ArrayList<String>();

		try {
			PreparedStatement getEmail = c
					.prepareStatement("SELECT email FROM users WHERE wg_id = (SELECT wg_id FROM users WHERE username = ?)");
			getEmail.setString(1, username.trim());
			ResultSet result = getEmail.executeQuery();
			while (result.next()) {
				adresses.add(result.getString("email"));
			}

			// getEmail.close();
			return adresses;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();

		}
		return null;
	}
}
