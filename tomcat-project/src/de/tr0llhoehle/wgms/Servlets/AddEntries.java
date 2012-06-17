package de.tr0llhoehle.wgms.Servlets;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import de.tr0llhoehle.wgms.ClientConnection;
import de.tr0llhoehle.wgms.structs.LocationList;

/**
 * Servlet implementation class addEntries
 */
@WebServlet("/AddEntries")
public class AddEntries extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public AddEntries() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession(true);
		if (!session.isNew()) {
			ClientConnection client = (ClientConnection) session.getAttribute("clientInfo");
			if (client != null) {
				String data = request.getParameter("data");
				JSONArray jsonArray;
				JSONArray jsonSendArray = new JSONArray();
				try {
					jsonArray = new JSONArray(data);

					
					JSONObject jsonObject;
					for (int i = 0; i < jsonArray.length(); i++) {
						String name = jsonArray.getString(i);
						System.out.println("new Item: " + name);
						int uid = client.getList().addItem(client, name);
						jsonSendArray.put(uid);
					}
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

				PrintWriter out = response.getWriter();
				/*
				 * data = data.substring(1, data.length()-1);
				 * 
				 * data = data.replaceAll("\"", ""); data = data.replace("\\",
				 * "");
				 */
				System.out.println("Add Entries:" + jsonSendArray.toString());
				out.write(jsonSendArray.toString());
			} else {
				response.sendRedirect(LocationList.LOGINPAGE);
			}
		} else {
			response.sendRedirect(LocationList.LOGINPAGE);
		}
	}

}
