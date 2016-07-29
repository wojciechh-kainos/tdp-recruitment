package databaseHelper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.io.Resources;
import configuration.TdpRecruitmentApplicationConfiguration;
import io.dropwizard.configuration.ConfigurationFactory;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.jackson.Jackson;
import io.dropwizard.validation.BaseValidator;

import java.io.File;
import java.net.URI;

/**
 * Created by malgorzatas on 29/07/16.
 */
public class DatabaseConfigurationHelper {

    private static DataSourceFactory dataSourceFactory = null;
    private static final ObjectMapper objectMapper = Jackson.newObjectMapper();
    private static final ConfigurationFactory<TdpRecruitmentApplicationConfiguration> factory = new ConfigurationFactory<>(
            TdpRecruitmentApplicationConfiguration.class,
            BaseValidator.newValidator(),
            objectMapper, "dw");

    public static DataSourceFactory getDatabaseConfiguration() throws Exception {
        if(dataSourceFactory == null){
            dataSourceFactory = parseConfiguration().getDataSourceFactory();
        }
        return dataSourceFactory;
    }

    private static TdpRecruitmentApplicationConfiguration parseConfiguration() throws Exception {
        URI path = Resources.getResource("app_config.yml").toURI();
        return factory.build(new File(path));

    }
}
