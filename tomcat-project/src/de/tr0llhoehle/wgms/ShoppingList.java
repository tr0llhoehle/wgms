package de.tr0llhoehle.wgms;

import java.util.ArrayList;

import org.json.JSONArray;

public class ShoppingList {
	

	protected ArrayList<ClientConnection> attachedClients;
	protected ArrayList<Item> list;
	protected static ShoppingList instance;
	
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
	
	public synchronized void addChangeToQueue(ClientConnection fromCLient, String change) {
		for (ClientConnection client : this.attachedClients) {
			if (!client.equals(fromCLient)) {
				client.addListChange(change);
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
