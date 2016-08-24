package services;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;
import configuration.TdpRecruitmentApplicationConfiguration;
import configuration.TdpRecruitmentEmailConfiguration;
import org.simplejavamail.email.Email;
import org.simplejavamail.mailer.Mailer;
import org.simplejavamail.mailer.config.TransportStrategy;

import javax.mail.Message;
import java.io.IOException;
import java.net.URL;

public class MailingThread extends Thread {

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
            e.printStackTrace();
        }
        String tempText = text.replace("{{domain}}", domain);
        String finalText = tempText.replace("{{activationLink}}", activationLink);
        email.setTextHTML(finalText);
        new Mailer(host, port, from, pass, TransportStrategy.SMTP_TLS).sendMail(email);

    }

}
