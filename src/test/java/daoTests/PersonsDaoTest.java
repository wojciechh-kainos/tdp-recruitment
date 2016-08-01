package daoTests;

import dao.AvailabilityTypesDao;
import dao.PersonsDao;
import dao.SlotsDao;
import dao.SlotsTimesDao;
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
import java.sql.Time;

import static junit.framework.TestCase.assertEquals;

public class PersonsDaoTest extends BaseTest{

    private PersonsDao personsDao;
    private Persons person;

    private SlotsDao slotsDao;
    private SlotsTimesDao slotsTimesDao;
    private AvailabilityTypesDao availabilityTypesDao;

    private SlotsTimes slotsTime;
    private AvailabilityTypes availabilityType;
    private Persons personFromDb;

    @Before
    public void setUp(){
        personsDao = new PersonsDao(sessionFactory);
        person = new Persons();
        person.setFirstName("TEST_NAME");
        person.setEmail("TEST@TEST.PL");
        person.setLastName("TEST_SURNAME");
        person.setActivationCode("ACTIVE");
        person.setActive(true);
        person.setAdmin(false);
        person.setBandLevel(2);

        slotsDao = new SlotsDao(sessionFactory);
        slotsTimesDao = new SlotsTimesDao(sessionFactory);
        availabilityTypesDao = new AvailabilityTypesDao(sessionFactory);
        availabilityType = addAvailabilityTypeToDatabase();
        slotsTime = addSlotTimeToDatabase();
    }

    @Test
    public void testCreatePersonsWithSlots(){

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
    public void testCreatePersons(){

        getSession().beginTransaction();
        Long id = personsDao.create(person);
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        personFromDb = personsDao.getById(id);
        getSession().getTransaction().commit();

        assertEquals("New person id should be equal added", person.getId(), personFromDb.getId());
    }

    @After
    public void tearDown(){
        getSession().beginTransaction();
        personFromDb.getSlotsList().forEach(s -> slotsDao.deleteById(s.getId()));
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        personsDao.deleteById(personFromDb.getId());
        getSession().getTransaction().commit();
    }

    private SlotsTimes addSlotTimeToDatabase() {
        getSession().beginTransaction();
        Time time = new Time(8,0,0);
        SlotsTimes slotsTimes = new SlotsTimes();
        slotsTimes.setStartTime(time);
        slotsTimes.setEndTime(time);
        Long id = slotsTimesDao.create(slotsTimes);
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        SlotsTimes slotsTimeFromDb = slotsTimesDao.getById(id);
        getSession().getTransaction().commit();

        return slotsTimeFromDb;
    }

    private AvailabilityTypes addAvailabilityTypeToDatabase() {
        getSession().beginTransaction();
        AvailabilityTypes unit = new AvailabilityTypes();
        unit.setType("Available");
        Long id = availabilityTypesDao.create(unit);
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        AvailabilityTypes availabilityTypeFromDb = availabilityTypesDao.getById(id);
        getSession().getTransaction().commit();

        return availabilityTypeFromDb;
    }
}
