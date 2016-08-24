package services;

import com.google.inject.Inject;
import configuration.TdpRecruitmentApplicationConfiguration;
import javax.mail.Message;
import java.util.concurrent.ExecutorService;

public class MailService {

    private final ExecutorService executor;

    private final TdpRecruitmentApplicationConfiguration applicationConfiguration;

    @Inject
    public MailService(TdpRecruitmentApplicationConfiguration config, ExecutorService executor) {
        this.applicationConfiguration = config;
        this.executor = executor;
    }


    public void sendEmail(Message message) {
        MailingTask mailingTask = new MailingTask(applicationConfiguration, message);
        executor.execute(mailingTask);
    }

}
