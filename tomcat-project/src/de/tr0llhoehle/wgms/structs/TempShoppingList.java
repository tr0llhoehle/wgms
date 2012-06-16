package de.tr0llhoehle.wgms.structs;

public class TempShoppingList {
	private String title;
	private int id ;
	
	public TempShoppingList(int id, String title){
		this.title = title;
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
}
