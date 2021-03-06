
import auth.TdpRecruitmentAuthenticator;
import auth.TdpRecruitmentAuthorizer;
import auth.TdpRecruitmentPasswordStore;
import auth.TdpRecruitmentUnauthorizedHandler;
import com.hubspot.dropwizard.guice.GuiceBundle;
import configuration.TdpRecruitmentApplicationConfiguration;
import configuration.TdpRecruitmentCacheConfiguration;
import configuration.TdpRecruitmentModule;
import dao.PersonDao;
import domain.*;
import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.auth.AuthDynamicFeature;
import io.dropwizard.auth.AuthValueFactoryProvider;
import io.dropwizard.auth.basic.BasicCredentialAuthFilter;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.hibernate.HibernateBundle;
import io.dropwizard.hibernate.UnitOfWorkAwareProxyFactory;
import io.dropwizard.migrations.MigrationsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import resources.*;

public class TdpRecruitmentApplication extends Application<TdpRecruitmentApplicationConfiguration> {

    private GuiceBundle<TdpRecruitmentApplicationConfiguration> guiceBundle;

    private final HibernateBundle<TdpRecruitmentApplicationConfiguration> hibernateBundle = new HibernateBundle<TdpRecruitmentApplicationConfiguration>(AvailabilityType.class, SlotTime.class, Slot.class, Person.class, Note.class, Candidate.class, RecruiterNote.class) {
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
        bootstrap.addBundle(new AssetsBundle("/assets/", "/", "index.html"));
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

        TdpRecruitmentAuthenticator authenticator = new UnitOfWorkAwareProxyFactory(hibernateBundle).create(TdpRecruitmentAuthenticator.class,
                new Class[]{PersonDao.class, TdpRecruitmentPasswordStore.class, TdpRecruitmentCacheConfiguration.class},
                new Object[]{guiceBundle.getInjector().getInstance(PersonDao.class),
                        guiceBundle.getInjector().getInstance(TdpRecruitmentPasswordStore.class),
                        guiceBundle.getInjector().getInstance(TdpRecruitmentCacheConfiguration.class)});

        environment.jersey().register(new AuthDynamicFeature(new BasicCredentialAuthFilter.Builder<Person>()
                .setAuthenticator(authenticator)
                .setAuthorizer(guiceBundle.getInjector().getInstance(TdpRecruitmentAuthorizer.class))
                .setUnauthorizedHandler(guiceBundle.getInjector().getInstance(TdpRecruitmentUnauthorizedHandler.class))
                .buildAuthFilter()));
        environment.jersey().register(new AuthValueFactoryProvider.Binder<>(Person.class));

        environment.jersey().register(guiceBundle.getInjector().getInstance(PersonResource.class));
        environment.jersey().register(guiceBundle.getInjector().getInstance(PairResource.class));
        environment.jersey().register(guiceBundle.getInjector().getInstance(SlotTimeResource.class));
        environment.jersey().register(guiceBundle.getInjector().getInstance(SlotResource.class));
        environment.jersey().register(guiceBundle.getInjector().getInstance(ReportResource.class));
        environment.jersey().register(guiceBundle.getInjector().getInstance(ScheduleResource.class));
        environment.jersey().register(guiceBundle.getInjector().getInstance(AuthResource.class));
        environment.jersey().register(guiceBundle.getInjector().getInstance(CandidateResource.class));
        environment.jersey().register(guiceBundle.getInjector().getInstance(RecruiterNoteResource.class));
    }

    public static void main(final String[] args) throws Exception {
        new TdpRecruitmentApplication().run(args);
    }

}
