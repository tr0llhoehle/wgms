package de.tr0llhoehle.wgms;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.Queue;

import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;

import org.json.JSONArray;
import org.json.JSONObject;

public class ClientConnection implements Serializable, HttpSessionBindingListener {
	
	protected ShoppingList shoppingList;
	protected Queue updateQueue;
	protected boolean online;
	
	public ClientConnection() {
		this.updateQueue = new LinkedList<JSONObject>();
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
	
	public ShoppingList getList() {
		return this.shoppingList;
	}
	
	public JSONArray flushQueue() {
		JSONArray tmp = new JSONArray();
		while (!this.updateQueue.isEmpty()) {
			tmp.put(updateQueue.remove());
		}
		return tmp;
	}
	
	public void addListChange(Item item) {
		this.updateQueue.add(item.toJSONObject());		
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
