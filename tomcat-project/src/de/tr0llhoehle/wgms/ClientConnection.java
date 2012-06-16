package de.tr0llhoehle.wgms;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.Queue;

import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;

public class ClientConnection implements Serializable, HttpSessionBindingListener {
	
	protected ShoppingList shoppingList;
	protected Queue updateQueue;
	
	public ClientConnection(ShoppingList shoppingList) {
		this.shoppingList = shoppingList;
		this.updateQueue = new LinkedList<String>();
	}
	
	public String flushQueue() {
		//TODO build JSON String from queue entries
		return null;
	}
	
	public void addListChange(String change) {
		//TODO add change-String (JSON?) to the queue
	}

	@Override
	public void valueBound(HttpSessionBindingEvent arg0) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void valueUnbound(HttpSessionBindingEvent arg0) {
		// TODO Auto-generated method stub
		
	}
	

}
