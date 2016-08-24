package services;

import com.google.inject.Inject;
import configuration.TdpRecruitmentApplicationConfiguration;
import javax.mail.Message;

public class MailService {

    private final TdpExecutorService executor;

    private final TdpRecruitmentApplicationConfiguration applicationConfiguration;

    @Inject
    public MailService(TdpRecruitmentApplicationConfiguration config, TdpExecutorService executor) {
        this.applicationConfiguration = config;
        this.executor = executor;
    }


    public void sendEmail(Message message) {
        MailingTask mailingTask = new MailingTask(applicationConfiguration, message);
        executor.execute(mailingTask);
    }

}
