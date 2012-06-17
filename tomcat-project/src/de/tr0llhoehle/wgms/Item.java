package de.tr0llhoehle.wgms;

import java.io.Serializable;

import org.json.JSONException;
import org.json.JSONObject;

public class Item implements Serializable{

	protected String name;
	protected int id;
	protected int state;
	
	public Item(String name, int id, int state) {
		this.name = name;
		this.id = id;
		this.state = state;
	}
	
	public JSONObject toJSONObject() {
		JSONObject tmp = new JSONObject();
		try {
			tmp.append("name", name);
			tmp.append("id", id);
			tmp.append("state", state);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return tmp;
	}

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

	public String getName() {
		return name;
	}

	public int getId() {
		return id;
	}
	
}
