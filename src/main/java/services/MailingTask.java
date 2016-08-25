package services;

import configuration.TdpRecruitmentEmailConfiguration;

import javax.mail.*;
import java.util.Properties;

public class MailingTask implements Runnable {

    private TdpRecruitmentEmailConfiguration config;
    private Message msg;

    public MailingTask(TdpRecruitmentEmailConfiguration config, Message message) {
        this.config = config;
        this.msg = message;
    }

    @Override
    public void run() {
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

        Transport transport = null;

        try {
            transport = session.getTransport("smtp");
            transport.connect(host, port, from, password);
            transport.sendMessage(msg, msg.getAllRecipients());
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            try {
                if (transport != null) transport.close();
            } catch (MessagingException e) {
                e.printStackTrace();
            }
        }
    }

}
