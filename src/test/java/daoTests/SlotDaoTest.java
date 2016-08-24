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

import static junit.framework.TestCase.assertTrue;

@Ignore
public class SlotDaoTest extends BaseTest{


    private static final Long FIRST = new Long(1);
    private Long id;
    private Person person;
    private SlotTime slotsTime;
    private AvailabilityType availabilityType;

    @Before
    public void setUp() throws LiquibaseException {
        person = addPersonToDatabase();
        availabilityType = getAvailabilityTypeFromDb(FIRST);
        slotsTime = getSlotTimeFromDb(FIRST);
    }

    @Test
    public void testCreateSlots() throws LiquibaseException {

        getSession().beginTransaction();

        Slot slot = new Slot();
        slot.setSlotDate(new Date(LocalDate.now().toDate().getTime()));
        slot.setPerson(person);
        slot.setSlotTime(slotsTime);
        slot.setType(availabilityType);

        id = slotDao.create(slot);

        getSession().getTransaction().commit();

        getSession().beginTransaction();

        Slot slotFromDb = slotDao.findById(id);

        getSession().getTransaction().commit();

        assertTrue("Slot should be added", slot.getId().equals(slotFromDb.getId()));

    }

    @After
    public void tearDown() throws LiquibaseException {
        getSession().beginTransaction();
        slotDao.deleteById(id);
        personDao.deleteById(person.getId());
        try {
            getSession().getTransaction().commit();
        } catch (LiquibaseException e) {
            e.printStackTrace();
        }
    }

    private Person addPersonToDatabase() throws LiquibaseException {
        getSession().beginTransaction();
        Person person = new Person();
        person.setFirstName("TEST_NAME");
        person.setEmail("TEST@TEST.PL");
        person.setLastName("TEST_SURNAME");
        person.setActivationCode("ACTIVE");
        person.setActive(true);
        person.setAdmin(false);
        person.setBandLevel(2);
        Long id = personDao.create(person);
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        Person personFromDb = personDao.getById(id);
        getSession().getTransaction().commit();

        return personFromDb;
    }
}
