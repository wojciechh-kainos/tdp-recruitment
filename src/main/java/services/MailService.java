package services;

import com.google.inject.Inject;
import configuration.TdpRecruitmentApplicationConfiguration;

public class MailService {

    private final TdpRecruitmentApplicationConfiguration applicationConfiguration;

    @Inject
    public MailService(TdpRecruitmentApplicationConfiguration config) {
        this.applicationConfiguration = config;
    }


    public void sendEmail(String recipient,String activationLink) {
        MailingThread mt = new MailingThread(applicationConfiguration, recipient, activationLink);
        mt.start();
    }


}
