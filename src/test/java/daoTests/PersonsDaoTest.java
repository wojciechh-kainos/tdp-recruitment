package daoTests;

import dao.PersonsDao;
import databaseHelper.BaseTest;
import domain.Persons;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import static junit.framework.TestCase.assertEquals;

public class PersonsDaoTest extends BaseTest{

    private Long newPersonId;
    private PersonsDao personsDao;
    private Persons person;

    @Before
    public void setUp(){
        personsDao = new PersonsDao(sessionFactory);
        person = new Persons();
        person.setFirst_name("TEST_NAME");
        person.setEmail("TEST@TEST.PL");
        person.setLast_name("TEST_SURNAME");
        person.setActivation_code("ACTIVE");
        person.setActive(true);
        person.setAdmin(false);
        person.setBand_level(2);
    }

    @Test
    public void testCreatePersons(){

        getSession().beginTransaction();
        newPersonId = personsDao.create(person);
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        Persons personFromDb = personsDao.findById(newPersonId);
        getSession().getTransaction().commit();

        assertEquals("New person id should be equal added", person.getId(), personFromDb.getId());

    }

    @After
    public void tearDown(){
        getSession().beginTransaction();
        personsDao.deleteById(newPersonId);
        getSession().getTransaction().commit();
    }

}
