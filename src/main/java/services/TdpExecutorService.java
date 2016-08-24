package services;


import com.google.inject.Inject;
import com.google.inject.Singleton;
import configuration.TdpRecruitmentApplicationConfiguration;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Singleton
public class TdpExecutorService {

    private ExecutorService executor;

    @Inject
    public TdpExecutorService(TdpRecruitmentApplicationConfiguration config) {
        this.executor = Executors.newFixedThreadPool(config.getThreadPoolSize());
    }

    public void execute(Runnable command) {
        executor.execute(command);
    }

}
