package de.tr0llhoehle.wgms.structs;

public class TempShoppingListItem {

	public TempShoppingListItem(int itemId, String description) {
		this.itemId = itemId;
		this.description = description;
	}

	private int itemId;
	private String description;

	public int getItemId() {
		return itemId;
	}

	public void setItemId(int itemId) {
		this.itemId = itemId;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}
