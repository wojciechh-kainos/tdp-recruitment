package services;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;
import configuration.TdpRecruitmentApplicationConfiguration;
import configuration.TdpRecruitmentEmailConfiguration;
import org.simplejavamail.email.Email;
import org.simplejavamail.mailer.Mailer;
import org.simplejavamail.mailer.config.TransportStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.mail.Message;
import java.io.IOException;
import java.net.URL;

public class MailingThread extends Thread {

    private final Logger logger = LoggerFactory.getLogger(MailingThread.class);
    private TdpRecruitmentApplicationConfiguration config;
    private String recipient;
    private String activationLink;

    public MailingThread(TdpRecruitmentApplicationConfiguration config, String recipient, String activationLink) {
        this.config = config;
        this.recipient = recipient;
        this.activationLink = activationLink;

    }

    @Override
    public void run() {

        TdpRecruitmentEmailConfiguration config = this.config.getSmtpConfig();
        String domain = this.config.getDomain();
        final Email email = new Email();

        String host = config.getHost();
        Integer port = config.getPort();
        String from = config.getFrom();
        String pass = config.getPassword();
        email.setFromAddress("", from);
        email.setSubject("TDP Recruitment - Activation Link");
        email.addRecipient("", this.recipient, Message.RecipientType.TO);
        URL url = Resources.getResource("email/template.html");
        String text = null;
        try {
            text = Resources.toString(url, Charsets.UTF_8);
        } catch (IOException e) {
            logger.error("Unable to parse url".concat(e.getMessage()));
        }
        String finalText = text
                .replace("{{domain}}", domain)
                .replace("{{activationLink}}", activationLink);

        email.setTextHTML(finalText);
        try {
            new Mailer(host, port, from, pass, TransportStrategy.SMTP_TLS).sendMail(email);
            logger.info("Send email => {} ",email.getRecipients());

        }catch (Exception e){
            logger.error("Send email error => {} ", e.getMessage());
        }

    }

}
