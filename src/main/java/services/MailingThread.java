package services;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;
import configuration.TdpRecruitmentApplicationConfiguration;
import configuration.TdpRecruitmentEmailConfiguration;
import org.simplejavamail.email.Email;
import org.simplejavamail.mailer.Mailer;
import org.simplejavamail.mailer.config.TransportStrategy;

import javax.activation.MailcapCommandMap;
import javax.activation.MimetypesFileTypeMap;
import javax.mail.*;
import javax.mail.internet.*;
import java.io.IOException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Properties;

public class MailingThread extends Thread {

    private TdpRecruitmentApplicationConfiguration config;
    private String recipient;
    private Long personId;
    private Message msg;

    public MailingThread(TdpRecruitmentApplicationConfiguration config, String recipient, Long id, Message msg) {
        this.config = config;
        this.recipient = recipient;
        this.personId = id;
        this.msg = msg;

    }

    @Override
    public void run() {

        TdpRecruitmentEmailConfiguration config = this.config.getSmtpConfig();
        String domain = this.config.getDomain();

        String host = config.getHost();
        Integer port = config.getPort();
        String from = config.getFrom();

        Properties props = new Properties();
        props.put("mail.smtp.auth", "false");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.port", port);

        Session session = Session.getDefaultInstance(props);

        try {
            msg.setFrom(new InternetAddress(from));

            Transport transport = session.getTransport("smtp");
            transport.connect();
            transport.sendMessage(msg, msg.getAllRecipients());
            transport.close();


//            Transport.send(msg);
        } catch (AddressException e) {
            e.printStackTrace();
        } catch (MessagingException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

}
