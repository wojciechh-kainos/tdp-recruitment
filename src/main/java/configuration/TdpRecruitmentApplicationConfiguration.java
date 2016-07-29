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
    public TdpRecruitmentEmailConfiguration getConfig() {
        return smtpConfig;
    }

    public void setSmtpConfig(TdpRecruitmentEmailConfiguration smtpConfig) {
        this.smtpConfig = smtpConfig;
    }
}
