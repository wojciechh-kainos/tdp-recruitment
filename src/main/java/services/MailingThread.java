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
    private Message msg;

    public MailingThread(TdpRecruitmentApplicationConfiguration config) {
        this.config = config;
    }

    public MailingThread sendMessage(Message message){
        this.msg = message;
        return this;
    }

    @Override
    public void run() {
        TdpRecruitmentEmailConfiguration config = this.config.getSmtpConfig();

        String host = config.getHost();
        Integer port = config.getPort();
        String from = config.getFrom();

        Properties props = new Properties();
        props.put("mail.smtp.auth", "false");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.port", port);
        Session session = Session.getDefaultInstance(props);
        session.setDebug(true);// TODO: remove before merging with master

        try {
            Transport transport = session.getTransport("smtp");
            transport.connect(host, port, from, null);
            transport.sendMessage(msg, msg.getAllRecipients());
            transport.close(); // TODO: Move method invocation to 'finally' block
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

}
