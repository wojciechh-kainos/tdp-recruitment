package services;

import configuration.TdpRecruitmentApplicationConfiguration;
import configuration.TdpRecruitmentEmailConfiguration;

import javax.mail.*;
import java.util.Properties;

public class MailingThread extends Thread {

    private TdpRecruitmentApplicationConfiguration config;
    private Message msg;

    public MailingThread(TdpRecruitmentApplicationConfiguration config) {
        this.config = config;
    }

    public MailingThread sendMessage(Message message) {
        this.msg = message;
        return this;
    }

    @Override
    public void run() {
        TdpRecruitmentEmailConfiguration config = this.config.getSmtpConfig();

        String host = config.getHost();
        Integer port = config.getPort();
        String from = config.getFrom();
        String password = config.getPassword();

        Properties props = new Properties();
        props.put("mail.smtp.auth", (password != null) ? "true" : "false");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.port", port);
        Session session = Session.getDefaultInstance(props);
        session.setDebug(true);// TODO: remove before merging with master

        try {
            Transport transport = session.getTransport("smtp");
            transport.connect(host, port, from, password);
            transport.sendMessage(msg, msg.getAllRecipients());
            transport.close(); // TODO: Move method invocation to 'finally' block
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
