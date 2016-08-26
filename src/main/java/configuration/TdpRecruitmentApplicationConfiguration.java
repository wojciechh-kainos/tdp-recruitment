package configuration;


import com.fasterxml.jackson.annotation.JsonProperty;
import io.dropwizard.Configuration;
import io.dropwizard.db.DataSourceFactory;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

public class TdpRecruitmentApplicationConfiguration extends Configuration {

    @Valid
    @NotNull
    @JsonProperty("database")
    private DataSourceFactory database = new DataSourceFactory();

    public DataSourceFactory getDataSourceFactory() {
        return database;
    }

    @Valid
    @NotNull
    private TdpRecruitmentEmailConfiguration smtpConfig;

    @JsonProperty("smtpConfig")
    public TdpRecruitmentEmailConfiguration getSmtpConfig() {
        return smtpConfig;
    }

    public void setSmtpConfig(TdpRecruitmentEmailConfiguration smtpConfig) {
        this.smtpConfig = smtpConfig;
    }

    @Valid
    @NotNull
    private String domain;

    @JsonProperty("domain")
    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    @NotNull
    private int threadPoolSize;

    public int getThreadPoolSize() { return threadPoolSize; }

    public void setThreadPoolSize(int threadPoolSize) { this.threadPoolSize = threadPoolSize; }


    @Valid
    @NotNull
    private TdpRecruitmentCacheConfiguration tokenCacheConfig;

    @JsonProperty("tokenCacheConfig")
    public TdpRecruitmentCacheConfiguration getTokenCacheConfig() { return tokenCacheConfig; }

    public void setTokenCacheConfig(TdpRecruitmentCacheConfiguration tokenCacheConfig) {
        this.tokenCacheConfig = tokenCacheConfig;
    }
}
