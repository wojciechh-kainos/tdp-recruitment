package services;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;
import configuration.TdpRecruitmentApplicationConfiguration;
import configuration.TdpRecruitmentEmailConfiguration;
import org.simplejavamail.email.Email;
import org.simplejavamail.mailer.Mailer;
import org.simplejavamail.mailer.config.TransportStrategy;

import javax.activation.MailcapCommandMap;
import javax.activation.MimetypesFileTypeMap;
import javax.mail.*;
import javax.mail.internet.*;
import java.io.IOException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Properties;

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
        String domain = this.config.getDomain();

        String host = config.getHost();
        Integer port = config.getPort();
        String from = config.getFrom();

        Properties props = new Properties();
        props.put("mail.smtp.auth", "false");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.port", port);

        Session session = Session.getDefaultInstance(props);


        MailcapCommandMap mailcap = (MailcapCommandMap) MailcapCommandMap.getDefaultCommandMap();
        mailcap.addMailcap("text/calendar;; x-java-content-handler=com.sun.mail.handlers.text_plain");



        try {
            MimeMessage msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress(from));
            msg.setRecipient(Message.RecipientType.TO, new InternetAddress(this.recipient));
            msg.setSubject("TDP Recruitment - Activation Link");

            Multipart multipart = new MimeMultipart("alternative");

            BodyPart messageBodyPart = buildHtmlTextPart();
            multipart.addBodyPart(messageBodyPart);

            BodyPart calendarPart = buildCalendarPart();
            multipart.addBodyPart(calendarPart);

            msg.setContent(multipart);

            // send the message
            Transport transport = session.getTransport("smtp");
            transport.connect();
            transport.sendMessage(msg, msg.getAllRecipients());
            transport.close();


//            Transport.send(msg);
        } catch (AddressException e) {
            e.printStackTrace();
        } catch (MessagingException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }

//        URL url = Resources.getResource("email/template.html");
//        String text = null;
//        try {
//            text = Resources.toString(url, Charsets.UTF_8);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//        String tempText = text.replace("{{domain}}", domain);
//        String finalText = tempText.replace("{{id}}", personId.toString());
//        email.setTextHTML(finalText);
//        new Mailer(host, port, from, pass, TransportStrategy.SMTP_TLS).sendMail(email);

    }

    private BodyPart buildHtmlTextPart() throws MessagingException {

        MimeBodyPart descriptionPart = new MimeBodyPart();

        //Note: even if the content is specified as being text/html, outlook won't read correctly tables at all
        // and only some properties from div:s. Thus, try to avoid too fancy content
        String content = "bla";
        descriptionPart.setContent(content, "text/html; charset=utf-8");

        return descriptionPart;
    }

    //define somewhere the icalendar date format
    private static SimpleDateFormat iCalendarDateFormat = new SimpleDateFormat("yyyyMMdd'T'HHmm'00'");

    private BodyPart buildCalendarPart() throws Exception {

        BodyPart calendarPart = new MimeBodyPart();

        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, 1);
        Date start = cal.getTime();
        cal.add(Calendar.HOUR_OF_DAY, 3);
        Date end = cal.getTime();

        //check the icalendar spec in order to build a more complicated meeting request
        String calendarContent =
                "BEGIN:VCALENDAR\n" +
                        "METHOD:REQUEST\n" +
                        "PRODID: BCP - Meeting\n" +
                        "VERSION:2.0\n" +
                        "BEGIN:VEVENT\n" +
                        "DTSTAMP:" + iCalendarDateFormat.format(start) + "\n" +
                        "DTSTART:" + iCalendarDateFormat.format(start)+ "\n" +
                        "DTEND:"  + iCalendarDateFormat.format(end)+ "\n" +
                        "SUMMARY:test request\n" +
                        "UID:324\n" +
                        "ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:MAILTO:m.piotrowski@kainos.com\n" +
                        "ORGANIZER:MAILTO:m.piotrowski@kainos.com\n" +
                        "LOCATION:on the net\n" +
                        "DESCRIPTION:learn some stuff\n" +
                        "SEQUENCE:0\n" +
                        "PRIORITY:5\n" +
                        "CLASS:PUBLIC\n" +
                        "STATUS:CONFIRMED\n" +
                        "TRANSP:OPAQUE\n" +
                        "BEGIN:VALARM\n" +
                        "ACTION:DISPLAY\n" +
                        "DESCRIPTION:REMINDER\n" +
                        "TRIGGER;RELATED=START:-PT00H15M00S\n" +
                        "END:VALARM\n" +
                        "END:VEVENT\n" +
                        "END:VCALENDAR";

        calendarPart.addHeader("Content-Class", "urn:content-classes:calendarmessage");
        calendarPart.setContent(calendarContent, "text/calendar;method=CANCEL");

        return calendarPart;
    }

}
