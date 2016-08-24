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
import java.util.*;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PairResourceTest {
    @Mock
    private static SlotDao mockDao;

    private final PairFinder pairFinder = new PairFinder();

    private final Boolean isDev = true;
    private final Boolean isTest = false;
    private final Boolean isOps = false;
    private final Boolean isOther = false;
    private String startDate;
    private String endDate;

    private PairResource resource;
    private List<Slot> mockSlots = new ArrayList<>();
    private List<SlotTime> expectedSlotTimes;
    private List<Person> persons;

    @Before
    public void setUp() {
        final Time startTime = Time.valueOf("08:00:00");
        final Time endTime = Time.valueOf("17:00:00");
        int TODAY_OFFSET = 0;
        int TOMORROW_OFFSET = 1;
        Date sameDate = MockDataUtil.createDate(TODAY_OFFSET);
        Date differentDate = MockDataUtil.createDate(TOMORROW_OFFSET);

        startDate = MockDataUtil.convertDateToString(sameDate);
        endDate = MockDataUtil.convertDateToString(differentDate);

        AvailabilityType availabilityType = MockDataUtil.createAvailableType((long) 1, AvailabilityTypeEnum.available);
        List<SlotTime> differentSlotsTime = MockDataUtil.createSlotsTimesList(5, 5);
        expectedSlotTimes = MockDataUtil.createSlotsTimesList(1, 3);

        Person firstPerson = MockDataUtil.createPerson((long) 1, "FIRST", isDev, isTest, isOps, isOther);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSlotTimes, firstPerson, sameDate, availabilityType));
        mockSlots.add(MockDataUtil.createSlot(expectedSlotTimes.get(0), firstPerson, differentDate, availabilityType));

        Person secondPerson = MockDataUtil.createPerson((long) 2, "SECOND", isDev, isTest, isOps, isOther);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSlotTimes, secondPerson, sameDate, availabilityType));
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(differentSlotsTime, secondPerson, sameDate, availabilityType));

        resource = new PairResource(mockDao, pairFinder);
        when(mockDao.findSlotsForPairMatching(startDate, endDate, startTime, endTime, isDev, isTest, isOps, isOther)).thenReturn(mockSlots);
        persons = resource.findPairs(startDate, endDate, startTime, endTime, isDev, isTest, isOps, isOther);
    }

    @Test
    public void testFindPairsShouldFindTwoPersons() {
        assertEquals("Should find 2 persons with persons", 2, persons.size());
    }

    @Test
    public void testFindPairsEveryPersonShouldHaveThreeSlots() {
        assertTrue("First person should have 3 slots in slotsList",
                persons
                        .stream()
                        .allMatch(person -> person.getSlotList().size() == 3));
    }

    @Test
    public void testFindPairsEveryPairShouldHaveSlotsTimesAsExpected() {
        assertTrue("SlotsTimes of all paired persons should be equal to expectedSlotTimes",
                persons
                        .stream()
                        .allMatch(person -> person
                                .getSlotList()
                                .stream()
                                .map(Slot::getSlotTime)
                                .allMatch(searchedSlotTime -> expectedSlotTimes.contains(searchedSlotTime)))
        );
    }
}
