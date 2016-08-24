package daoTests;

import databaseHelper.BaseTest;
import domain.AvailabilityType;
import domain.Person;
import domain.Slot;
import domain.SlotTime;
import liquibase.exception.LiquibaseException;
import org.joda.time.LocalDate;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import java.sql.Date;

import static junit.framework.TestCase.assertEquals;

@Ignore
public class PersonDaoTest extends BaseTest {

    private static final Long FIRST = new Long(1) ;
    private Person person;
    private SlotTime slotTime;
    private AvailabilityType availabilityType;
    private Person personFromDb;

    @Before
    public void setUp() throws LiquibaseException {
        person = new Person();
        person.setFirstName("TEST_NAME");
        person.setEmail("TEST@TEST.PL");
        person.setLastName("TEST_SURNAME");
        person.setActivationCode("ACTIVE");
        person.setActive(true);
        person.setAdmin(false);
        person.setBandLevel(2);

        availabilityType = getAvailabilityTypeFromDb(FIRST);
        slotTime = getSlotTimeFromDb(FIRST);
    }

    @Test
    public void testCreatePersonsWithSlots() throws LiquibaseException {

        Slot slot = new Slot();
        slot.setSlotDate(new Date(LocalDate.now().toDate().getTime()));
        slot.setSlotTime(slotTime);
        slot.setType(availabilityType);

        getSession().beginTransaction();

        getSession().save(person);
        slot.setPerson(person);
        person.getSlotList().add(slot);
        getSession().save(slot);

        Long personId = personDao.create(person);
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        personFromDb = personDao.getById(personId);
        getSession().getTransaction().commit();

        assertEquals("New person id should be equal added", person.getId(), personFromDb.getId());
        assertEquals("New person slots list should contain ids of all slots.", person.getSlotList().size(), personFromDb.getSlotList().size());
    }

    @Test
    public void testCreatePersons() throws LiquibaseException {

        getSession().beginTransaction();
        Long id = personDao.create(person);
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        personFromDb = personDao.getById(id);
        getSession().getTransaction().commit();

        assertEquals("New person id should be equal added", person.getId(), personFromDb.getId());
    }

    @After
    public void tearDown() throws LiquibaseException {
        getSession().beginTransaction();
        personFromDb.getSlotList().forEach(s -> slotDao.deleteById(s.getId()));
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        personDao.deleteById(personFromDb.getId());
        getSession().getTransaction().commit();
    }


}