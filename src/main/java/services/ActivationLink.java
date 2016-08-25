package services;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;
import com.google.inject.Inject;
import configuration.TdpRecruitmentApplicationConfiguration;
import domain.Person;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.IOException;
import java.net.URL;
import java.util.Properties;

public class ActivationLink {

    private String domain;
    private String from;

    @Inject
    public ActivationLink(TdpRecruitmentApplicationConfiguration configuration) {
        this.domain = configuration.getDomain();
        this.from = configuration.getSmtpConfig().getFrom();
    }

    public Message createMessage(Person person) throws MessagingException, IOException {

        Session session = Session.getDefaultInstance(new Properties());
        MimeMessage message = new MimeMessage(session);

        message.setSubject("TDP Recruitment - Activation Link");
        message.setFrom(new InternetAddress(from));
        message.addRecipient(Message.RecipientType.TO, new InternetAddress(person.getEmail()));
        URL url = Resources.getResource("email/template.html");
        String text = Resources.toString(url, Charsets.UTF_8);
        String tempText = text.replace("{{domain}}", domain);
        String finalText = tempText.replace("{{activationLink}}", person.getActivationCode());

        message.setContent(finalText, "text/html; charset=ISO-8859-1");

        return message;
    }
}
