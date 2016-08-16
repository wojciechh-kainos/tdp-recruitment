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
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PairResourceFindPairsInUnorderedSlotsTest {

    private final int TODAY_OFFSET = 0;
    private final int TOMORROW_OFFSET = 1;
    private final Boolean isDev = true;
    private final Boolean isTest = false;
    private final Boolean isOps = false;
    private String startDate;
    private String endDate;

    private PairResource resource;
    private List<Slots> mockSlots = new ArrayList<>();

    @Mock
    private static SlotsDao mockDao;

    @Before
    public void setUp(){

        Date date = MockDataUtil.createDate(TODAY_OFFSET);
        Date nextDate = MockDataUtil.createDate(TOMORROW_OFFSET);

        startDate = MockDataUtil.convertDateToString(date);
        endDate = MockDataUtil.convertDateToString(nextDate);

        AvailabilityTypes availabilityType = MockDataUtil.createAvailableType((long) 1, AvailabilityTypesEnum.available);
        SlotsTimes sameSlotsTimesFirst = MockDataUtil.createSlotsTimes((long) 2, LocalTime.of(8, 30, 0), LocalTime.of(9, 0, 0));
        SlotsTimes sameSlotsTimesSecond = MockDataUtil.createSlotsTimes((long) 1, LocalTime.of(8, 0, 0), LocalTime.of(8, 30, 0));
        SlotsTimes sameSlotsTimeThird = MockDataUtil.createSlotsTimes((long) 5, LocalTime.of(10, 0, 0), LocalTime.of(10, 30, 0));
        SlotsTimes sameSlotsTimeFourth = MockDataUtil.createSlotsTimes((long) 3, LocalTime.of(9, 0, 0), LocalTime.of(9, 30, 0));
        SlotsTimes sameSlotsTimeFifth = MockDataUtil.createSlotsTimes((long) 9, LocalTime.of(12, 0, 0), LocalTime.of(12, 30, 0));
        SlotsTimes sameSlotsTimeSixth = MockDataUtil.createSlotsTimes((long) 7, LocalTime.of(11, 0, 0), LocalTime.of(11, 30, 0));
        SlotsTimes sameSlotsTimeSeventh = MockDataUtil.createSlotsTimes((long) 8, LocalTime.of(11, 30, 0), LocalTime.of(12, 0, 0));

        List<SlotsTimes> unorderedSlotsTimes = Arrays.asList(sameSlotsTimesFirst, sameSlotsTimesSecond,
                                                                sameSlotsTimeThird, sameSlotsTimeFourth,
                                                                     sameSlotsTimeFifth, sameSlotsTimeSixth, sameSlotsTimeSeventh);

        Persons firstPerson = MockDataUtil.createPersons((long)1, "FIRST", isDev, isTest, isOps);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(unorderedSlotsTimes, firstPerson, date, availabilityType));

        Persons secondPerson = MockDataUtil.createPersons((long)2, "SECOND", isDev, isTest, isOps);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(unorderedSlotsTimes, secondPerson, date, availabilityType));

        resource = new PairResource(mockDao);
    }

    @Test
    public void testFindPairForWeekInUnorderedSlots(){
        when(mockDao.findBetweenPerJobProfile(startDate, endDate, isDev, isTest, isOps)).thenReturn(mockSlots);
        List<Pair> pairs  = resource.findPairs(startDate, endDate, isDev, isTest, isOps);

        assertEquals("One pair should be found", 1, pairs.size());

        Pair pair = pairs.get(0);
        assertEquals("Pair should have 6 elements", 6, pair.getSlots().size());
    }
}
