package daoTests;

import dao.SlotsDao;
import dao.SlotsTimesDao;
import databaseHelper.BaseTest;
import domain.AvailabilityTypes;
import domain.Persons;
import domain.Slots;
import domain.SlotsTimes;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.sql.Time;
import java.util.Date;

import static junit.framework.TestCase.assertTrue;


public class SlotsDaoTest extends BaseTest{

    private Long id;
    private Long personId;
    private Long slotTimeId;
    private Long availabilityTypeId;

    @Before
    public void setUp(){
        personId = addPersonToDatabase();

        availabilityTypeId = addAvailabilityTypeToDatabase();

        slotTimeId = addSlotTimeToDatabase();
    }

    private Long addSlotTimeToDatabase() {
        getSession().beginTransaction();

        Time time = new Time(8,0,0);

        SlotsTimes slotsTimes = new SlotsTimes();
        slotsTimes.setStartTime(time);
        slotsTimes.setEndTime(time);

        Long id = slotsTimesDao.create(slotsTimes);

        getSession().getTransaction().commit();

        return id;
    }

    private Long addAvailabilityTypeToDatabase() {
        getSession().beginTransaction();

        AvailabilityTypes unit = new AvailabilityTypes();
        unit.setType("Available");
        Long id = availabilityTypesDao.create(unit);

        getSession().getTransaction().commit();
        return id;
    }

    private Long addPersonToDatabase() {
        getSession().beginTransaction();

        Persons person = new Persons();
        person.setFirst_name("TEST_NAME");
        person.setEmail("TEST@TEST.PL");
        person.setLast_name("TEST_SURNAME");
        person.setActivation_code("ACTIVE");
        person.setActive(true);
        person.setAdmin(false);
        person.setBand_level(2);
        Long id = personsDao.create(person);

        getSession().getTransaction().commit();

        return id;
    }

    @Test
    public void testCreatePersons(){

        getSession().beginTransaction();

        Slots slot = new Slots();
        slot.setDay(new Date());
        slot.setPerson(personId);
        slot.setSlot(slotTimeId);
        slot.setType(availabilityTypeId);

        id = slotsDao.create(slot);

        getSession().getTransaction().commit();

        getSession().beginTransaction();

        Slots slotFromDb = slotsDao.findById(id);

        getSession().getTransaction().commit();

        assertTrue("Slot should be added", slot.getPerson().equals(slotFromDb.getPerson()));

    }

    @After
    public void teadDown(){
        getSession().beginTransaction();
        slotsDao.deleteById(id);
        getSession().getTransaction().commit();
    }
}
