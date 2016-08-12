package resourceTests.PairResourceTests;

import dao.SlotsDao;
import domain.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import resources.PairResource;

import java.sql.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalTime;
import java.util.*;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PairResourceTest {

    private final int TODAY_OFFSET = 0;
    private final int TOMORROW_OFFSET = 1;
    private final Boolean isDev = true;
    private final Boolean isTest = false;
    private final Boolean isOps = false;
    private String startDate;
    private String endDate;

    private PairResource resource;
    private List<Slots> mockSlots = new ArrayList<>();
    private List<SlotsTimes> expectedSlotsTimes;

    @Mock
    private static SlotsDao mockDao;

    @Before
    public void setUp(){
        Date sameDate = MockDataUtil.createDate(TODAY_OFFSET);
        Date differentDate = MockDataUtil.createDate(TOMORROW_OFFSET);

        startDate = MockDataUtil.convertDateToString(sameDate);
        endDate = MockDataUtil.convertDateToString(differentDate);

        AvailabilityTypes availabilityType = MockDataUtil.createAvailableType((long) 1, AvailabilityTypesEnum.available);
        SlotsTimes sameSlotsTimeFirst = MockDataUtil.createSlotTime((long) 1, LocalTime.of(8, 0, 0), LocalTime.of(8, 30, 0));
        SlotsTimes sameSlotsTimeSecond = MockDataUtil.createSlotTime((long) 2, LocalTime.of(8, 30, 0), LocalTime.of(9, 0, 0));
        SlotsTimes sameSlotsTimeThird = MockDataUtil.createSlotTime((long) 3, LocalTime.of(9, 0, 0), LocalTime.of(9, 30, 0));
        SlotsTimes differentSlotsTime = MockDataUtil.createSlotTime((long) 5, LocalTime.of(10, 0, 0), LocalTime.of(10, 30, 0));
        expectedSlotsTimes = Arrays.asList(sameSlotsTimeFirst,sameSlotsTimeSecond, sameSlotsTimeThird);

        Persons firstPerson = MockDataUtil.createPersons((long)1, "FIRST", isDev, isTest, isOps);
        mockSlots.add(MockDataUtil.createSlot((long)1, sameSlotsTimeFirst, firstPerson, sameDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)2, sameSlotsTimeSecond, firstPerson, sameDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)3, sameSlotsTimeThird, firstPerson, sameDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)4, sameSlotsTimeFirst, firstPerson, differentDate, availabilityType));

        Persons secondPerson = MockDataUtil.createPersons((long)2, "SECOND", isDev, isTest, isOps);
        mockSlots.add(MockDataUtil.createSlot((long)5, sameSlotsTimeFirst, secondPerson, sameDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)6, sameSlotsTimeSecond, secondPerson, sameDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)7, sameSlotsTimeThird, secondPerson, sameDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot((long)8, differentSlotsTime, secondPerson, sameDate, availabilityType));

        resource = new PairResource(mockDao);
    }

    @Test
    public void testFindPairs(){
        when(mockDao.findBetweenPerJobProfile(startDate, endDate, isDev, isTest, isOps)).thenReturn(mockSlots);

        List<Pair> pairs = resource.findPairs(startDate, endDate, isDev, isTest, isOps);

        Pair pair = pairs.get(0);

        assertEquals("One pair should be found", 1, pairs.size());

        assertEquals("Searched slots list should have three expected slot", 3, pair.getSlots().size());

        assertTrue("Searched slots should have the same slotsTime as expected",
                pair.getSlots().stream()
                      .map(searchedSlot -> searchedSlot.getSlot())
                        .allMatch(searchedSlotTime -> expectedSlotsTimes.contains(searchedSlotTime)));
    }
}
