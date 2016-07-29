package daoTests;

import databaseHelper.BaseTest;
import domain.Persons;
import org.hibernate.SessionFactory;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertTrue;

public class PersonsDaoTest extends BaseTest{

    SessionFactory sessionFactory;
    private Long id;

    @Before
    public void setUp(){

    }

    @Test
    public void testCreatePersons(){

        getSession().beginTransaction();

        Persons person = new Persons();
        person.setFirst_name("TEST_NAME");
        person.setEmail("TEST@TEST.PL");
        person.setLast_name("TEST_SURNAME");
        person.setActivation_code("ACTIVE");
        person.setActive(true);
        person.setAdmin(false);
        person.setBand_level(2);
        id = personsDao.create(person);

        getSession().getTransaction().commit();

        getSession().beginTransaction();
        Persons personFromDb = personsDao.findById(id);

        getSession().getTransaction().commit();
        assertTrue("Person should be added", person.getFirst_name().equals(personFromDb.getFirst_name()));

    }

    @After
    public void teadDown(){
        getSession().beginTransaction();
        personsDao.deleteById(id);
        getSession().getTransaction().commit();
    }

}
