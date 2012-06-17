package de.tr0llhoehle.wgms.Servlets;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import de.tr0llhoehle.wgms.ClientConnection;
import de.tr0llhoehle.wgms.DbmsConnector;
import de.tr0llhoehle.wgms.ShoppingList;
import de.tr0llhoehle.wgms.structs.LocationList;

/**
 * Servlet implementation class Login
 */
@WebServlet("/Login")
public class Login extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Login() {
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
		session.invalidate();
		session = request.getSession(true);
		PrintWriter out = response.getWriter();
		String username = request.getParameter("name");
		String password = request.getParameter("password");
		System.out.println("User login: " + username);
		if (this.verifyUser(username, password)) {
			ClientConnection clientInfo = new ClientConnection();
			//TODO add shopping List to client
			clientInfo.setList(ShoppingList.getInstance());
			ShoppingList.getInstance().addClient(clientInfo);
			session.setAttribute("clientInfo", clientInfo);
			out.write("success");
		} else {
			out.write("fault");
		}
		
		
	}
	
	protected boolean verifyUser(String username, String password) {
		//return true;
		return password.equals(DbmsConnector.getInstance().getPassword(username));
	}

}
