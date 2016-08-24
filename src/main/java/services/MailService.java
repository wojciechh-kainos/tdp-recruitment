package services;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import configuration.TdpRecruitmentApplicationConfiguration;

import javax.mail.Message;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Singleton
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
