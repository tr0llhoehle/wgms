package de.tr0llhoehle.wgms;

import java.util.ArrayList;

public class ShoppingList {
	

	protected ArrayList<ClientConnection> attachedClients;
	
	public ShoppingList() {
		this.attachedClients = new ArrayList<ClientConnection>();
	}
	
	public void addClient(ClientConnection client) {
		this.attachedClients.add(client);
	}
	
	public void addChangeToQueue(ClientConnection fromCLient, String change) {
		for (ClientConnection client : this.attachedClients) {
			if (!client.equals(fromCLient)) {
				client.addListChange(change);
			}
		}
	}

}
