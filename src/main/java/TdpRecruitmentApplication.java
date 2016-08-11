import com.github.dirkraft.dropwizard.fileassets.FileAssetsBundle;
import com.hubspot.dropwizard.guice.GuiceBundle;
import configuration.TdpRecruitmentApplicationConfiguration;
import configuration.TdpRecruitmentModule;
import domain.*;
import io.dropwizard.Application;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.hibernate.HibernateBundle;
import io.dropwizard.migrations.MigrationsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import resources.SlotsResource;
import resources.SlotsTimesResource;
import resources.PersonResources;

public class TdpRecruitmentApplication extends Application<TdpRecruitmentApplicationConfiguration> {

    private GuiceBundle<TdpRecruitmentApplicationConfiguration> guiceBundle;

    private final HibernateBundle<TdpRecruitmentApplicationConfiguration> hibernateBundle = new HibernateBundle<TdpRecruitmentApplicationConfiguration>(AvailabilityTypes.class, SlotsTimes.class, Slots.class, Persons.class, Notes.class) {
        @Override
        public DataSourceFactory getDataSourceFactory(TdpRecruitmentApplicationConfiguration configuration) {
            return configuration.getDataSourceFactory();
        }
    };

    private final MigrationsBundle<TdpRecruitmentApplicationConfiguration> migrationsBundle = new MigrationsBundle<TdpRecruitmentApplicationConfiguration>() {
        @Override
        public DataSourceFactory getDataSourceFactory(TdpRecruitmentApplicationConfiguration configuration) {
            return configuration.getDataSourceFactory();
        }
    };

    private TdpRecruitmentModule module = new TdpRecruitmentModule();

    @Override
    public void initialize(Bootstrap<TdpRecruitmentApplicationConfiguration> bootstrap) {
        bootstrap.addBundle(new FileAssetsBundle("src/main/resources/assets", "/", "index.html"));
        bootstrap.addBundle(hibernateBundle);
        bootstrap.addBundle(migrationsBundle);

        guiceBundle = GuiceBundle.<TdpRecruitmentApplicationConfiguration>newBuilder()
                .addModule(module)
                .setConfigClass(TdpRecruitmentApplicationConfiguration.class)
                .build();
        bootstrap.addBundle(guiceBundle);
    }

    @Override
    public void run(TdpRecruitmentApplicationConfiguration configuration, Environment environment) {
        module.setSessionFactory(hibernateBundle.getSessionFactory());

        environment.jersey().register(guiceBundle.getInjector().getInstance(PersonResources.class));
        environment.jersey().register(guiceBundle.getInjector().getInstance(SlotsTimesResource.class));
        environment.jersey().register(guiceBundle.getInjector().getInstance(SlotsResource.class));
    }

    public static void main(final String[] args) throws Exception {
        new TdpRecruitmentApplication().run(args);
    }

}
