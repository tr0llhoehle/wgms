package de.tr0llhoehle.wgms.Servlets;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONException;

import de.tr0llhoehle.wgms.ClientConnection;
import de.tr0llhoehle.wgms.structs.LocationList;

/**
 * Servlet implementation class deleteEntries
 */
@WebServlet("/DeleteEntries")
public class DeleteEntries extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DeleteEntries() {
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
				String data = request.getParameter("data");
				try {
					
/*data = data.substring(1, data.length()-1);
					
					data = data.replaceAll("\"", "");
					data = data.replace("\\", "");*/
					JSONArray jsonArray = new JSONArray(data);
					
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			} else {
				response.sendRedirect(LocationList.LOGINPAGE);
			}
		} else {
			response.sendRedirect(LocationList.LOGINPAGE);
		}
	}

}
