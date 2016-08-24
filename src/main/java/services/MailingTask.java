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
