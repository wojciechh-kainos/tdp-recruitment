package resourceTests.PairResourceTests;

import dao.SlotDao;
import domain.*;
import org.joda.time.DateTime;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import resources.PairResource;
import services.PairFinder;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PairResourceFindPairsInUnorderedSlotsTest {

    @Mock
    private static SlotDao mockDao;

    private final PairFinder pairFinder = new PairFinder();

    private List<Slot> mockSlots = new ArrayList<>();
    private List<Person> persons;

    @Before
    public void setUp() {
        final Boolean isDev = true;
        final Boolean isTest = false;
        final Boolean isOps = false;
        final Boolean isOther = false;
        final Time startTime = Time.valueOf("08:00:00");
        final Time endTime = Time.valueOf("17:00:00");
        String startDate;
        String endDate;
        PairResource resource;
        int TODAY_OFFSET = 0;
        int TOMORROW_OFFSET = 1;
        Date date = MockDataUtil.createDate(TODAY_OFFSET);
        Date nextDate = MockDataUtil.createDate(TOMORROW_OFFSET);

        startDate = MockDataUtil.convertDateToString(date);
        endDate = MockDataUtil.convertDateToString(nextDate);

        AvailabilityType availabilityType = MockDataUtil.createAvailableType((long) 1, AvailabilityTypeEnum.available);
        SlotTime sameSlotTimesFirst = MockDataUtil.createSlotTime((long) 2, LocalTime.of(8, 30, 0), LocalTime.of(9, 0, 0));
        SlotTime sameSlotTimesSecond = MockDataUtil.createSlotTime((long) 1, LocalTime.of(8, 0, 0), LocalTime.of(8, 30, 0));
        SlotTime sameSlotTimesThird = MockDataUtil.createSlotTime((long) 5, LocalTime.of(10, 0, 0), LocalTime.of(10, 30, 0));
        SlotTime sameSlotTimesFourth = MockDataUtil.createSlotTime((long) 3, LocalTime.of(9, 0, 0), LocalTime.of(9, 30, 0));
        SlotTime sameSlotTimesFifth = MockDataUtil.createSlotTime((long) 9, LocalTime.of(12, 0, 0), LocalTime.of(12, 30, 0));
        SlotTime sameSlotTimesSixth = MockDataUtil.createSlotTime((long) 7, LocalTime.of(11, 0, 0), LocalTime.of(11, 30, 0));
        SlotTime sameSlotTimesSeventh = MockDataUtil.createSlotTime((long) 8, LocalTime.of(11, 30, 0), LocalTime.of(12, 0, 0));

        List<SlotTime> unorderedSlotsTimes = Arrays.asList(sameSlotTimesFirst, sameSlotTimesSecond,
                sameSlotTimesThird, sameSlotTimesFourth,
                sameSlotTimesFifth, sameSlotTimesSixth, sameSlotTimesSeventh);

        Person firstPerson = MockDataUtil.createPerson((long) 1, "FIRST", isDev, isTest, isOps, isOther);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(unorderedSlotsTimes, firstPerson, date, availabilityType));
        Person secondPerson = MockDataUtil.createPerson((long) 2, "SECOND", isDev, isTest, isOps, isOther);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(unorderedSlotsTimes, secondPerson, date, availabilityType));

        resource = new PairResource(mockDao, pairFinder);

        when(mockDao.findSlotsForPairMatching(startDate, endDate, startTime, endTime, isDev, isTest, isOps, isOther)).thenReturn(mockSlots);
        persons = resource.findPairs(startDate, endDate, startTime, endTime, isDev, isTest, isOps, isOther);
    }

    @Test
    public void testFindPairForWeekInUnorderedSlotsShouldFindTwoPersons() {
        assertEquals("Two persons should be found", 2, persons.size());
    }

    @Test
    public void testFindPairForWeekInUnorderedSlotsShouldFindSixSlotsInFirstPerson() {
        Person firstPerson = persons.get(0);
        assertEquals("First person should have 6 slots in slotsList", 6, firstPerson.getSlotList().size());

    }
}
