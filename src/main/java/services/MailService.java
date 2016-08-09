package services;

import com.google.inject.Inject;
import configuration.TdpRecruitmentApplicationConfiguration;
import configuration.TdpRecruitmentEmailConfiguration;
import org.simplejavamail.email.Email;
import org.simplejavamail.mailer.Mailer;
import org.simplejavamail.mailer.config.TransportStrategy;


import javax.mail.Message;

public class MailService {

    private final TdpRecruitmentApplicationConfiguration applicationConfiguration;

    @Inject
    public MailService(TdpRecruitmentApplicationConfiguration config) {
        this.applicationConfiguration = config;
    }


    public void sendEmail(String recipient) {

        TdpRecruitmentEmailConfiguration config = applicationConfiguration.getSmtpConfig();
        final Email email = new Email();

        String host = config.getHost();
        Integer port = config.getPort();
        String from = config.getFrom();
//        String pass = config.getPassword();
        String pass = null;
        email.setFromAddress("", from);
        email.setSubject("Test email");
        email.addRecipient("", recipient, Message.RecipientType.TO);

        email.setText("Testing e-mails");


        new Mailer(host, port, from, pass, TransportStrategy.SMTP_TLS).sendMail(email);

    }
}
