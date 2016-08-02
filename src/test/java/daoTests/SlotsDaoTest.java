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

import static junit.framework.TestCase.assertTrue;


public class SlotsDaoTest extends BaseTest{


    private static final Long FIRST = new Long(1);
    private Long id;
    private Persons person;
    private SlotsTimes slotsTime;
    private AvailabilityTypes availabilityType;

    @Before
    public void setUp(){
        person = addPersonToDatabase();
        availabilityType = getAvailabilityTypeFromDb(FIRST);
        slotsTime = getSlotTimeFromDb(FIRST);
    }

    @Test
    public void testCreateSlots(){

        getSession().beginTransaction();

        Slots slot = new Slots();
        slot.setSlotsDate(new Date(LocalDate.now().toDate().getTime()));
        slot.setPerson(person);
        slot.setSlot(slotsTime);
        slot.setType(availabilityType);

        id = slotsDao.create(slot);

        getSession().getTransaction().commit();

        getSession().beginTransaction();

        Slots slotFromDb = slotsDao.findById(id);

        getSession().getTransaction().commit();

        assertTrue("Slot should be added", slot.getId().equals(slotFromDb.getId()));

    }

    @After
    public void tearDown(){
        getSession().beginTransaction();
        slotsDao.deleteById(id);
        personsDao.deleteById(person.getId());
        getSession().getTransaction().commit();
    }

    private Persons addPersonToDatabase() {
        getSession().beginTransaction();
        Persons person = new Persons();
        person.setFirstName("TEST_NAME");
        person.setEmail("TEST@TEST.PL");
        person.setLastName("TEST_SURNAME");
        person.setActivationCode("ACTIVE");
        person.setActive(true);
        person.setAdmin(false);
        person.setBandLevel(2);
        Long id = personsDao.create(person);
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        Persons personFromDb = personsDao.getById(id);
        getSession().getTransaction().commit();

        return personFromDb;
    }
}
