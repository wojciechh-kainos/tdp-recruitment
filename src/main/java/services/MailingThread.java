package services;

import configuration.TdpRecruitmentApplicationConfiguration;
import configuration.TdpRecruitmentEmailConfiguration;
import org.simplejavamail.email.Email;
import org.simplejavamail.mailer.Mailer;
import org.simplejavamail.mailer.config.TransportStrategy;

import javax.mail.Message;

public class MailingThread extends Thread {

    private TdpRecruitmentApplicationConfiguration config;
    private String recipient;
    private Long personId;

    public MailingThread(TdpRecruitmentApplicationConfiguration config, String recipient, Long id) {
        this.config = config;
        this.recipient = recipient;
        this.personId = id;

    }

    @Override
    public void run() {

        TdpRecruitmentEmailConfiguration config = this.config.getSmtpConfig();
        final Email email = new Email();

        String host = config.getHost();
        Integer port = config.getPort();
        String from = config.getFrom();
        String pass = config.getPassword();
        email.setFromAddress("", from);
        email.setSubject("TDP Recruitment - Activation Link");
        email.addRecipient("", this.recipient, Message.RecipientType.TO);

        email.setText("Please follow this link to activate your account:\n\n"+config.getDomain()+this.personId+"\n\nHappy interviewing!\n\nRegards,\n\nTDP Recruitment Team");

        new Mailer(host, port, from, pass, TransportStrategy.SMTP_TLS).sendMail(email);

    }

}
