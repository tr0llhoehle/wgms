package de.tr0llhoehle.wgms;

import javax.mail.*;
import javax.mail.internet.*;

import java.util.Properties;

public class EmailSend {
	private static EmailSend instance = null;

	private Properties props = new Properties();

	public synchronized static EmailSend getInstance() {
		if (instance == null) {
			instance = new EmailSend();
		}
		return instance;
	}

	public EmailSend() {
		props.setProperty("mail.transport.protocol", "smtp");
		props.setProperty("mail.host", "localhost");
		props.setProperty("mail.user", "");
		props.setProperty("mail.password", "");
	}

	public synchronized void sendMails(String receiver, String text, String subject) throws MessagingException {
		
		
		Session mailSession = Session.getDefaultInstance(props, null);
		Transport transport = mailSession.getTransport();

		MimeMessage message = new MimeMessage(mailSession);
		message.setSubject(subject);
		message.setContent(text, "text/plain");
		message.addRecipient(Message.RecipientType.TO, new InternetAddress(
				receiver));

		transport.connect();
		transport.sendMessage(message,
				message.getRecipients(Message.RecipientType.TO));
		transport.close();
	}

	
}
