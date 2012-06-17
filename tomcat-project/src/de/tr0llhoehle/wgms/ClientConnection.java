package de.tr0llhoehle.wgms;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.Queue;

import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;

public class ClientConnection implements Serializable, HttpSessionBindingListener {
	
	protected ShoppingList shoppingList;
	protected Queue updateQueue;
	protected boolean online;
	
	public ClientConnection() {
		this.updateQueue = new LinkedList<String>();
		this.online = false;
	}
	
	public void setOnline() {
		this.online = true;
	}
	
	public boolean online() {
		return this.online;
	}
	
	public void setList(ShoppingList list) {
		this.shoppingList = list;
	}
	
	public String flushQueue() {
		//TODO build JSON String from queue entries
		return null;
	}
	
	public void addListChange(Item item) {
		//TODO add change-String (JSON?) to the queue
	}

	@Override
	public void valueBound(HttpSessionBindingEvent arg0) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void valueUnbound(HttpSessionBindingEvent arg0) {
		this.shoppingList.removeClient(this);		
	}
	

}
