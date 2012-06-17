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
 * Servlet implementation class InitialRequest
 */
@WebServlet("/InitialRequest")
public class InitialRequest extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public InitialRequest() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession(true);
		if(!session.isNew()) {
			ClientConnection client = (ClientConnection) session.getAttribute("clientInfo");
			if (client != null) {
				PrintWriter out = response.getWriter();
				JSONObject tmp;
				JSONArray jsonArray = new JSONArray();
				tmp = new JSONObject();
				try {
					tmp.append("name", "The");
					tmp.append("id", 0);
					tmp.append("state", 0);
					jsonArray.put(tmp);
					
					tmp = new JSONObject();
					
					tmp.append("name", "Cake");
					tmp.append("id", 1);
					tmp.append("state", 1);
					jsonArray.put(tmp);
					
					tmp = new JSONObject();
					
					tmp.append("name", "Is");
					tmp.append("id", 2);
					tmp.append("state", 2);
					jsonArray.put(tmp);
					
					tmp = new JSONObject();
					
					tmp.append("name", "A");
					tmp.append("id", 3);
					tmp.append("state", 4);
					jsonArray.put(tmp);
					
					tmp = new JSONObject();
					
					tmp.append("name", "Lie");
					tmp.append("id", 4);
					tmp.append("state", 0);
					jsonArray.put(tmp);
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				System.out.println(jsonArray.toString());
				out.write(jsonArray.toString());
			} else {
				response.sendRedirect(LocationList.LOGINPAGE);
			}
		} else {
			response.sendRedirect(LocationList.LOGINPAGE);
		}
	}

}
