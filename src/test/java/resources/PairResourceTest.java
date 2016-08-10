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
import static junit.framework.TestCase.assertTrue;
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
    private List<SlotsTimes> expectedSlotsTimes;

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
        SlotsTimes sameSlotsTimeFirst = createSlotTime((long) 1, new Time(8, 0, 0), new Time(8, 30, 0));
        SlotsTimes sameSlotsTimeSecond = createSlotTime((long) 2, new Time(8, 30, 0), new Time(9, 0, 0));
        SlotsTimes sameSlotsTimeThird = createSlotTime((long) 3, new Time(9, 0, 0), new Time(9, 30, 0));
        SlotsTimes differentSlotsTime = createSlotTime((long) 5, new Time(10, 0, 0), new Time(10, 30, 0));
        expectedSlotsTimes = Arrays.asList(sameSlotsTimeFirst,sameSlotsTimeSecond, sameSlotsTimeThird);

        Persons firstPerson = createPersons((long)1, "FIRST");
        mockSlots.add(createSlot((long)1, sameSlotsTimeFirst, firstPerson, sameDate));
        mockSlots.add(createSlot((long)2, sameSlotsTimeSecond, firstPerson, sameDate));
        mockSlots.add(createSlot((long)3, sameSlotsTimeThird, firstPerson, sameDate));
        mockSlots.add(createSlot((long)4, sameSlotsTimeFirst, firstPerson, differentDate));

        Persons secondPerson = createPersons((long)2, "SECOND");
        mockSlots.add(createSlot((long)5, sameSlotsTimeFirst, secondPerson, sameDate));
        mockSlots.add(createSlot((long)6, sameSlotsTimeSecond, secondPerson, sameDate));
        mockSlots.add(createSlot((long)7, sameSlotsTimeThird, secondPerson, sameDate));
        mockSlots.add(createSlot((long)8, differentSlotsTime, secondPerson, sameDate));

        resource = new PairResource(mockDao);
    }

    @Test
    public void testFindPairs(){
        when(mockDao.findBetweenPerJobProfile(startDate, endDate, isDev, isTest, isOps)).thenReturn(mockSlots);

        List<Slots> searchedSlotsToPair = resource.findPairs(startDate, endDate, isDev, isTest, isOps);

        assertEquals("Searched slots list should have three expected slot", searchedSlotsToPair.size(), 3);

        assertTrue("Searched slots should have the same slotsTime as expected", searchedSlotsToPair.stream()
                                                                                                  .map(searchedSlot -> searchedSlot.getSlot())
                                                                                                    .allMatch(searchedSlotTime -> expectedSlotsTimes.contains(searchedSlotTime)));
    }

    private Slots createSlot(Long id, SlotsTimes slotsTimes, Persons person, Date date){
        Slots slot = new Slots();
        slot.setId(id);
        slot.setType(availabilityType);
        slot.setSlot(slotsTimes);
        slot.setPerson(person);
        slot.setSlotsDate(date);
        person.getSlotsList().add(slot);
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
