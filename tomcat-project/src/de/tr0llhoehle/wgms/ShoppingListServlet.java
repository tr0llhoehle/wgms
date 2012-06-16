package de.tr0llhoehle.wgms;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet implementation class ShoppingListServlet
 */
@WebServlet("/ShoppingListServlet")
public class ShoppingListServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ShoppingListServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
	}
	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession(true);
		PrintWriter out = response.getWriter();
		if (session.isNew()) {
			out.write("new session");
			String username = request.getParameter("name");
			String password = request.getParameter("password");
			if (this.verifyUser(username, password)) {
				ClientConnection clientInfo = new ClientConnection();
				out.write("login correct");
				//TODO add shopping List to client
				session.setAttribute("clientInfo", clientInfo);
			} else {
				out.write("Login incorrect");
				response.sendRedirect("webapp");
			}
		} else {
			ClientConnection clientInfo = (ClientConnection) session.getAttribute("clientInfo");
			if (clientInfo != null) {
				out.write("you are logged in");
				
				
			} else {
				session.invalidate();
				out.write("you are not logged in");
				response.sendRedirect("webapp");
			}
		}
		out.flush();
		out.close();
	}

	protected boolean verifyUser(String username, String password) {
		return true;
		//return password.equals(DbmsConnector.getInstance().getPassword(username));
	}

}
