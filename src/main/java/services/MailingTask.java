package services;

import configuration.TdpRecruitmentApplicationConfiguration;
import configuration.TdpRecruitmentEmailConfiguration;

import javax.mail.*;
import java.util.Properties;

public class MailingTask implements Runnable {

    private TdpRecruitmentApplicationConfiguration config;
    private Message msg;

    public MailingTask(TdpRecruitmentApplicationConfiguration config) {
        this.config = config;
    }

    public MailingTask sendMessage(Message message) {
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
