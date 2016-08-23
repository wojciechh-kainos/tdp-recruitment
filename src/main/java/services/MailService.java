package services;

import com.google.inject.Inject;
import configuration.TdpRecruitmentApplicationConfiguration;

import javax.mail.Message;

public class MailService {

    private final TdpRecruitmentApplicationConfiguration applicationConfiguration;

    @Inject
    public MailService(TdpRecruitmentApplicationConfiguration config) {
        this.applicationConfiguration = config;
    }


    public void sendEmail(Message message) {
        MailingThread mailingThread = new MailingThread(applicationConfiguration);
        mailingThread.sendMessage(message).start();
    }


}
