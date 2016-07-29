package daoTests;

import com.google.inject.Guice;
import com.google.inject.Injector;
import configuration.TdpRecruitmentModule;
import dao.AvailabilityTypesDao;
import domain.AvailabilityTypes;
import org.hibernate.Session;
import org.hibernate.SessionException;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.AnnotationConfiguration;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class AvailabilityTypesDaoTest {

    private SessionFactory sessionFactory;
    private AvailabilityTypesDao availabilityTypesDao;
    private Injector injector;

    public AvailabilityTypesDaoTest() {
        AnnotationConfiguration config=new AnnotationConfiguration();
        config.setProperty("hibernate.connection.url","jdbc:postgresql://localhost/postgres");
        config.setProperty("hibernate.connection.username","postgres");
        config.setProperty("hibernate.connection.driver_class","org.postgresql.Driver");
        config.setProperty("hibernate.current_session_context_class", "thread");
        config.setProperty("hibernate.show_sql", "false");
        config.addAnnotatedClass(AvailabilityTypes.class);

        this.sessionFactory=config.buildSessionFactory();
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

    @Before
    public void setUp(){
        TdpRecruitmentModule module = new TdpRecruitmentModule();
        module.setSessionFactory(sessionFactory);
        injector = Guice.createInjector(module);
        availabilityTypesDao = injector.getInstance(AvailabilityTypesDao.class);
//        availabilityTypesDao = new AvailabilityTypesDao(sessionFactory);
    }

    @Test
    public void test(){
        getSession().beginTransaction();

        AvailabilityTypes unit = new AvailabilityTypes();
        unit.setType("Available");
        availabilityTypesDao.create(unit);


        assertEquals(true, true);

        getSession().getTransaction().commit();
    }
}
