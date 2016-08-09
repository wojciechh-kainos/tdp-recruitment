package resources;


import dao.SlotsDao;
import domain.AvailabilityTypes;
import domain.Persons;
import domain.Slots;
import domain.SlotsTimes;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.sql.Date;
import java.sql.Time;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PairResourceTest {

    private static AvailabilityTypes availabilityTypes;
    private static Persons firstPerson;
    private static Persons secondPerson;
    private static PairResource resource;
    private static List<Slots> expectedSlots;

    @Mock
    private static SlotsDao mockDao;


    @Before
    public void setUp(){
        expectedSlots = new ArrayList<>();

        createAvailableType((long)1, "available");
        SlotsTimes sameSlotsTime = createSlotTime((long) 1, new Time(8, 0, 0), new Time(8, 30, 0));
        SlotsTimes differentSlotsTime = createSlotTime((long) 3, new Time(9, 0, 0), new Time(9, 30, 0));

        firstPerson = createPersons((long)1, "FIRST");
        expectedSlots.add(createSlot((long)1, sameSlotsTime, firstPerson));

        secondPerson = createPersons((long)2, "SECOND");
        expectedSlots.add(createSlot((long)2, sameSlotsTime, secondPerson));
        expectedSlots.add(createSlot((long)3, differentSlotsTime, secondPerson));

        resource = new PairResource(mockDao);
    }

    @Test
    public void testFindPairs(){

        String startDate = "01-01-2016";
        String endDate = "02-01-2016";
        Boolean isDev = true;
        Boolean isTest = false;
        Boolean isOps = false;
        when(mockDao.findBetweenPerJobProfile(startDate, endDate, isDev, isTest, isOps)).thenReturn(expectedSlots);

        List<Slots> comparedSlots = resource.findPairs(startDate, endDate, isDev, isTest, isOps);
        assertEquals("Should find pair with two slots", comparedSlots.size(), 2);

    }

    private static Slots createSlot(Long id, SlotsTimes slotsTimes, Persons person){
        Slots slot = new Slots();
        slot.setId(id);
        slot.setType(availabilityTypes);
        slot.setSlot(slotsTimes);
        slot.setPerson(person);
        slot.setSlotsDate(new Date(Calendar.getInstance().getTimeInMillis()));
        return slot;
    }

    private static void createAvailableType(Long id, String type){
        availabilityTypes = new AvailabilityTypes();
        availabilityTypes.setType(type);
        availabilityTypes.setId(id);
    }

    private static SlotsTimes createSlotTime(Long id, Time startTime, Time endTime){
        SlotsTimes slotsTimes = new SlotsTimes();
        slotsTimes.setId(id);
        slotsTimes.setStartTime(startTime);
        slotsTimes.setEndTime(endTime);
        return slotsTimes;
    }

    private static Persons createPersons(Long id, String uniqueValue){
        Persons person = new Persons();
        person.setId(id);
        person.setFirstName("NAME " + uniqueValue);
        person.setLastName("SURNAME " + uniqueValue);
        person.setEmail("EMAIL@EMAIL." + uniqueValue);
        person.setAdmin(false);
        person.setActive(true);
        person.setBandLevel(2);
        person.setIsDev(true);
        person.setIsTest(false);
        person.setIsWeb(false);
        return person;
    }

}
