package databaseHelper;

import com.google.inject.Guice;
import com.google.inject.Injector;
import configuration.TdpRecruitmentApplicationConfiguration;
import configuration.TdpRecruitmentModule;
import dao.PersonsDao;
import domain.Persons;
import domain.Slots;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.hibernate.HibernateBundle;
import org.hibernate.Session;
import org.hibernate.SessionException;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.AnnotationConfiguration;
import org.junit.BeforeClass;

/**
 * Created by malgorzatas on 29/07/16.
 */
public class BaseTest {

    private static Injector injector;
    protected static PersonsDao personsDao;
    protected static SessionFactory sessionFactory;

    public Injector getInjector() {
        return injector;
    }

    @BeforeClass
    public static void createInjector() {

        AnnotationConfiguration config=new AnnotationConfiguration();
        config.setProperty("hibernate.connection.url","jdbc:postgresql://localhost/postgres");
        config.setProperty("hibernate.connection.username","postgres");
        config.setProperty("hibernate.connection.driver_class","org.postgresql.Driver");
        config.setProperty("hibernate.current_session_context_class", "thread");
        config.setProperty("hibernate.show_sql", "false");
        config.addAnnotatedClass(Persons.class);
        sessionFactory = config.buildSessionFactory();
        TdpRecruitmentModule module = new TdpRecruitmentModule();
        module.setSessionFactory(sessionFactory);
        injector = Guice.createInjector(module);
        personsDao = injector.getInstance(PersonsDao.class);
    }

    public Session getSession()
    {
        Session session;

        try {
            session = sessionFactory.getCurrentSession();
        } catch (SessionException se) {
            session = sessionFactory.openSession();
        }

        return session;
    }
}
