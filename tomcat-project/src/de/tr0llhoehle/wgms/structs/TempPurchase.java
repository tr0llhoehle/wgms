package de.tr0llhoehle.wgms.structs;

import java.math.BigDecimal;
import java.sql.Timestamp;


public class TempPurchase {
	public TempPurchase(int id, BigDecimal value, Timestamp time) {
		
		this.value = value;
		this.time = time;
		this.id = id;
	}

	private java.math.BigDecimal value;
	private Timestamp time;
	private int id;

	public java.math.BigDecimal getValue() {
		return value;
	}

	public void setValue(java.math.BigDecimal value) {
		this.value = value;
	}

	public Timestamp getTime() {
		return time;
	}

	public void setTime(Timestamp time) {
		this.time = time;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

}
