package services;

import com.google.inject.Inject;
import configuration.TdpRecruitmentApplicationConfiguration;

import javax.mail.Message;
import javax.mail.internet.MimeMessage;

public class MailService {

    private final TdpRecruitmentApplicationConfiguration applicationConfiguration;

    @Inject
    public MailService(TdpRecruitmentApplicationConfiguration config) {
        this.applicationConfiguration = config;
    }


    public void sendEmail(String recipient, Long id) {
//        MailingThread mt = new MailingThread(applicationConfiguration, recipient, id, msg);
//        mt.start();
    }


}
