package resourceTests.PairResourceTests;

import dao.SlotDao;
import domain.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import resources.PairResource;
import services.PairFinder;

import java.sql.Date;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PairResourceFindPairsBetweenThreePersonsTest {

    @Mock
    private static SlotDao mockDao;

    @Mock
    private static PairFinder mockPairFinder;

    private final Boolean isDev = true;
    private final Boolean isTest = false;
    private final Boolean isOps = false;
    private final Boolean isOther = false;
    private String startDate;
    private String endDate;
    private PairResource resource;
    private List<Slot> mockSlots = new ArrayList<>();
    private List<SlotTime> expectedFirstPersonSlotsTimes, expectedSecondPersonSlotsTimes;
    private List<Person> persons;

    @Before
    public void setUp() {
        final Time startTime = Time.valueOf("08:00:00");
        final Time endTime = Time.valueOf("17:00:00");
        int TODAY_OFFSET = 0;
        Date firstDate = MockDataUtil.createDate(TODAY_OFFSET);
        int TOMORROW_OFFSET = 1;
        Date secondDate = MockDataUtil.createDate(TOMORROW_OFFSET);
        startDate = MockDataUtil.convertDateToString(firstDate);
        endDate = MockDataUtil.convertDateToString(secondDate);

        AvailabilityType availabilityType = MockDataUtil.createAvailableType((long) 1, AvailabilityTypeEnum.available);
        expectedFirstPersonSlotsTimes = MockDataUtil.createSlotTimeList(1, 3);
        expectedSecondPersonSlotsTimes = MockDataUtil.createSlotTimeList(1, 5);

        Person firstPerson = MockDataUtil.createPerson((long) 1, "FIRST", isDev, isTest, isOps, isOther);
        mockSlots.addAll(MockDataUtil.createSlotToSlotTime(expectedFirstPersonSlotsTimes, firstPerson, firstDate, availabilityType));
        Person secondPerson = MockDataUtil.createPerson((long) 2, "SECOND", isDev, isTest, isOps, isOther);
        mockSlots.addAll(MockDataUtil.createSlotToSlotTime(expectedFirstPersonSlotsTimes, secondPerson, firstDate, availabilityType));
        mockSlots.addAll(MockDataUtil.createSlotToSlotTime(expectedSecondPersonSlotsTimes, secondPerson, secondDate, availabilityType));
        Person thirdPerson = MockDataUtil.createPerson((long) 3, "THIRD", isDev, isTest, isOps, isOther);
        mockSlots.addAll(MockDataUtil.createSlotToSlotTime(expectedSecondPersonSlotsTimes, thirdPerson, secondDate, availabilityType));

        resource = new PairResource(mockDao, mockPairFinder);

        when(mockDao.findSlotsForPairMatching(startDate, endDate, startTime, endTime, isDev, isTest, isOps, isOther)).thenReturn(mockSlots);
        persons = resource.findPairs(startDate, endDate, startTime, endTime, isDev, isTest, isOps, isOther);
    }

    @Test
    public void testFindTwoDifferentPairsForWeekShouldReturnThreePersons() {
        assertEquals("Three people should be found", 3, persons.size());
    }

    @Test
    public void testFindTwoDifferentPairsForWeekShouldReturnThreeSlotsForFirstPerson() {
        Person firstPair = persons.get(0);

        assertEquals("First person should have 3 slot elements", 3, firstPair.getSlotList().size());
    }

    @Test
    public void testFindTwoDifferentPairsForWeekShouldReturnSlotsInOneDayForFirstPerson() {
        Person firstPair = persons.get(0);

        assertEquals("First person should have slots with one day only",
                firstPair
                        .getSlotList()
                        .stream()
                        .map(Slot::getSlotDate)
                        .distinct()
                        .count(), 1L);
    }

    @Test
    public void testFindTwoDifferentPairsForWeekShouldReturnSlotsWithExpectedSlotsTimes() {
        Person firstPair = persons.get(0);

        assertTrue("First person should have slots with expected slotsTimes",
                firstPair
                        .getSlotList()
                        .stream()
                        .map(Slot::getSlotTime)
                        .allMatch(searchedSlotTime -> expectedFirstPersonSlotsTimes.contains(searchedSlotTime)));
    }

    @Test
    public void testFindTwoDifferentPairsForWeekShouldReturnEightSlotsForSecondPerson() {
        Person secondPair = persons.get(1);

        assertEquals("Second person should have 8 slot elements", 8, secondPair.getSlotList().size());
    }

    @Test
    public void testFindTwoDifferentPairsForWeekShouldReturnSlotsInTwoDaysForSecondPerson() {
        Person secondPair = persons.get(1);

        assertEquals("Second person should have slots with two different days",
                secondPair
                        .getSlotList()
                        .stream()
                        .map(Slot::getSlotDate)
                        .distinct()
                        .count(), 2L);
    }

    @Test
    public void testFindTwoDifferentPairsForWeekShouldReturnFiveSlotsForThirdPerson() {
        Person thirdPair = persons.get(2);

        assertEquals("Third person should have 5 slot elements", 5, thirdPair.getSlotList().size());
    }

    @Test
    public void testFindTwoDifferentPairsForWeekShouldReturnSlotsInOneDayForThirdPerson() {
        Person thirdPair = persons.get(2);

        assertEquals("Third person should have slots with one day only",
                thirdPair
                        .getSlotList()
                        .stream()
                        .map(Slot::getSlotDate)
                        .distinct()
                        .count(), 1L);
    }
}
