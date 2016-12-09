package services;

import configuration.TdpRecruitmentEmailConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.mail.*;
import java.util.Properties;

public class MailingTask implements Runnable {

    private TdpRecruitmentEmailConfiguration config;
    private Message msg;
    private static final Logger logger = LoggerFactory.getLogger(MailingTask.class);

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
        Transport transport = null;

        try {
            transport = session.getTransport("smtp");
            transport.connect(host, port, from, password);
            transport.sendMessage(msg, msg.getFrom());
        } catch (Exception e) {
            logger.warn("Mailing error  => {}", e.getMessage());
        } finally {
            try {
                if (transport != null) transport.close();
            } catch (MessagingException e) {
                logger.warn("Mailing error  => {}", e.getMessage());
            }
        }
    }

}
