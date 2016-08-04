package daoTests;

import databaseHelper.BaseTest;
import domain.AvailabilityTypes;
import domain.Persons;
import domain.Slots;
import domain.SlotsTimes;
import org.joda.time.LocalDate;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.sql.Date;

import static junit.framework.TestCase.assertEquals;

public class PersonsDaoTest extends BaseTest {

    private static final Long FIRST = new Long(1) ;
    private Persons person;
    private SlotsTimes slotsTime;
    private AvailabilityTypes availabilityType;
    private Persons personFromDb;

    @Before
    public void setUp() {
        person = new Persons();
        person.setFirstName("TEST_NAME");
        person.setEmail("TEST@TEST.PL");
        person.setLastName("TEST_SURNAME");
        person.setActivationCode("ACTIVE");
        person.setActive(true);
        person.setAdmin(false);
        person.setBandLevel(2);

        availabilityType = getAvailabilityTypeFromDb(FIRST);
        slotsTime = getSlotTimeFromDb(FIRST);
    }

    @Test
    public void testCreatePersonsWithSlots() {

        Slots slot = new Slots();
        slot.setSlotsDate(new Date(LocalDate.now().toDate().getTime()));
        slot.setSlot(slotsTime);
        slot.setType(availabilityType);

        getSession().beginTransaction();

        getSession().save(person);
        slot.setPerson(person);
        person.getSlotsList().add(slot);
        getSession().save(slot);

        Long personId = personsDao.create(person);
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        personFromDb = personsDao.getById(personId);
        getSession().getTransaction().commit();

        assertEquals("New person id should be equal added", person.getId(), personFromDb.getId());
        assertEquals("New person slots list should contain ids of all slots.", person.getSlotsList().size(), personFromDb.getSlotsList().size());
    }

    @Test
    public void testCreatePersons() {

        getSession().beginTransaction();
        Long id = personsDao.create(person);
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        personFromDb = personsDao.getById(id);
        getSession().getTransaction().commit();

        assertEquals("New person id should be equal added", person.getId(), personFromDb.getId());
    }

    @After
    public void tearDown() {
        getSession().beginTransaction();
        personFromDb.getSlotsList().forEach(s -> slotsDao.deleteById(s.getId()));
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        personsDao.deleteById(personFromDb.getId());
        getSession().getTransaction().commit();
    }


}