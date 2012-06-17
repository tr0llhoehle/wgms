package de.tr0llhoehle.wgms;

import java.util.ArrayList;

import org.json.JSONArray;

public class ShoppingList {

	protected ArrayList<ClientConnection> attachedClients;
	protected ArrayList<Item> list;
	protected static ShoppingList instance;
	private int id = 0;

	public static ShoppingList getInstance() {
		if (instance == null) {
			instance = new ShoppingList();
		}
		return instance;
	}

	public ShoppingList() {
		this.attachedClients = new ArrayList<ClientConnection>();
		this.list = new ArrayList<Item>();
	}

	public synchronized void addClient(ClientConnection client) {
		this.attachedClients.add(client);
	}

	public synchronized void removeClient(ClientConnection client) {
		this.list.remove(client);
	}

	public synchronized void addListItem(Item item) {
		this.list.add(item);
	}

	public synchronized void addChangeToQueue(ClientConnection fromCLient, Item item) {
		for (ClientConnection client : this.attachedClients) {
			if (!client.equals(fromCLient)) {
				client.addListChange(item);
			}
		}
	}

	public synchronized void checkItem(ClientConnection fromCLient, int id) {
		for (Item item : this.list) {
			if (id == item.getId()) {
				if (item.getState() == 2) {
					item.setState(1);
					addChangeToQueue(fromCLient, item);
				}
			}
		}
	}

	public synchronized void uncheckItem(ClientConnection fromCLient, int id) {
		for (Item item : this.list) {
			if (id == item.getId()) {
				if (item.getState() == 1) {
					item.setState(2);
					addChangeToQueue(fromCLient, item);
				}
			}
		}
	}

	public synchronized int addItem(ClientConnection fromCLient, String name) {
		Item item = new Item(name, this.id++, 2);
		this.addListItem(item);
		this.addChangeToQueue(fromCLient, item);
		return this.id - 1;
	}

	public synchronized void deleteItem(ClientConnection fromCLient, int id) {
		for (Item item : this.list) {
			if (id == item.getId()) {
				if (item.getState() != 3) {
					item.setState(3);
					addChangeToQueue(fromCLient, item);
				}
			}
		}
	}

	public synchronized JSONArray toJSONArray() {
		JSONArray tmp = new JSONArray();
		for (Item item : this.list) {
			tmp.put(item.toJSONObject());
		}
		return tmp;
	}

}
