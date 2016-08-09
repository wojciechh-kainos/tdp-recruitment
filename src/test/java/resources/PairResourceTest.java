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
import java.util.*;

import static junit.framework.TestCase.assertEquals;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PairResourceTest {

    private final String startDate = "01-01-2016";
    private final String endDate = "02-01-2016";
    private final Boolean isDev = true;
    private final Boolean isTest = false;
    private final Boolean isOps = false;


    private AvailabilityTypes availabilityType;
    private PairResource resource;
    private List<Slots> mockSlots;
    private Slots expectedSlot;

    @Mock
    private static SlotsDao mockDao;

    @Before
    public void setUp(){
        Calendar calendar = Calendar.getInstance();
        Date sameDate = new Date(calendar.getTimeInMillis());
        calendar.add(Calendar.DAY_OF_MONTH, 1);
        Date differentDate = new Date(calendar.getTimeInMillis());
        mockSlots = new ArrayList<>();

        createAvailableType((long)1, "available");
        SlotsTimes sameSlotsTime = createSlotTime((long) 1, new Time(8, 0, 0), new Time(8, 30, 0));
        SlotsTimes differentSlotsTime = createSlotTime((long) 3, new Time(9, 0, 0), new Time(9, 30, 0));

        Persons firstPerson = createPersons((long) 1, "FIRST");
        mockSlots.add(createSlot((long)1, sameSlotsTime, firstPerson, sameDate));
        mockSlots.add(createSlot((long)2, sameSlotsTime, firstPerson, differentDate));

        Persons secondPerson = createPersons((long) 2, "SECOND");
        mockSlots.add(expectedSlot = createSlot((long)3, sameSlotsTime, secondPerson, sameDate));
        mockSlots.add(createSlot((long)4, differentSlotsTime, secondPerson, sameDate));

        resource = new PairResource(mockDao);
    }

    @Test
    public void testFindPairs(){
        when(mockDao.findBetweenPerJobProfile(startDate, endDate, isDev, isTest, isOps)).thenReturn(mockSlots);

        List<Slots> foundSlotsToPair = resource.findPairs(startDate, endDate, isDev, isTest, isOps);

        assertEquals("Found slots list should have one expected slot from pair", foundSlotsToPair.size(), 1);
        assertEquals("Found slot should have the same id as expected", expectedSlot.getId(), foundSlotsToPair.get(0).getId());
    }

    private Slots createSlot(Long id, SlotsTimes slotsTimes, Persons person, Date date){
        Slots slot = new Slots();
        slot.setId(id);
        slot.setType(availabilityType);
        slot.setSlot(slotsTimes);
        slot.setPerson(person);
        slot.setSlotsDate(date);

        person.setSlotsList(new HashSet<Slots>(){{
            add(slot);
        }});
        return slot;
    }

    private void createAvailableType(Long id, String type){
        availabilityType = new AvailabilityTypes();
        availabilityType.setType(type);
        availabilityType.setId(id);
    }

    private SlotsTimes createSlotTime(Long id, Time startTime, Time endTime){
        SlotsTimes slotsTimes = new SlotsTimes();
        slotsTimes.setId(id);
        slotsTimes.setStartTime(startTime);
        slotsTimes.setEndTime(endTime);
        return slotsTimes;
    }

    private Persons createPersons(Long id, String uniqueValue){
        Persons person = new Persons();
        person.setId(id);
        person.setFirstName("NAME " + uniqueValue);
        person.setLastName("SURNAME " + uniqueValue);
        person.setEmail("EMAIL@EMAIL." + uniqueValue);
        person.setAdmin(false);
        person.setActive(true);
        person.setBandLevel(2);
        person.setIsDev(isDev);
        person.setIsTest(isTest);
        person.setIsWeb(isOps);
        return person;
    }

}
