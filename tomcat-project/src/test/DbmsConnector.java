package test;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Properties;

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
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			connected = false;
		}
	}

	public void closeConnection() {
		try {
			c.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		c = null;
	}

	public String getPassword(String username) {
		if (username == null || username.trim().equals("")) {
			return null;
		}

		try {
			PreparedStatement getPwd = c
					.prepareStatement("SELECT password FROM users WHERE username EQUALS ?");
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
		if (itemId == null || itemId.trim().equals("")) {
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
		if (itemId == null || itemId.trim().equals("")) {
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

	public void insertItem(String shoppingListId, String description) {
		PreparedStatement checkItem = c.prepareStatement("INSERT INTO items");

	}

}
