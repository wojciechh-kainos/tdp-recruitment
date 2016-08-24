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
public class PairResourceFindPairsForWeekTest {

    @Mock
    private static SlotDao mockDao;

    private final PairFinder pairFinder = new PairFinder();

    private List<Slot> mockSlots = new ArrayList<>();
    private List<SlotTime> expectedSameSlotsTimes;
    private List<Person> persons;
    private Date expectedDate;

    @Before
    public void setUp() {
        String startDate;
        String endDate;
        final Time startTime = Time.valueOf("08:00:00");
        final Time endTime = Time.valueOf("17:00:00");
        final Boolean isDev = true;
        final Boolean isTest = false;
        final Boolean isOps = false;
        final Boolean isOther = false;
        PairResource resource;
        int TODAY_OFFSET = 0;
        expectedDate = MockDataUtil.createDate(TODAY_OFFSET);
        int TOMORROW_OFFSET = 1;
        Date differentDate = MockDataUtil.createDate(TOMORROW_OFFSET);
        startDate = MockDataUtil.convertDateToString(expectedDate);
        endDate = MockDataUtil.convertDateToString(differentDate);

        AvailabilityType availabilityType = MockDataUtil.createAvailableType((long) 1, AvailabilityTypeEnum.available);
        expectedSameSlotsTimes = MockDataUtil.createSlotsTimesList(1, 3);
        List<SlotTime> threeDifferentSlotsTimes = MockDataUtil.createSlotsTimesList(3, 5);
        List<SlotTime> twoDifferentSlotsTimes = MockDataUtil.createSlotsTimesList(4, 5);

        Person firstPerson = MockDataUtil.createPerson((long) 1, "FIRST", isDev, isTest, isOps, isOther);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSameSlotsTimes, firstPerson, expectedDate, availabilityType));
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(twoDifferentSlotsTimes, firstPerson, differentDate, availabilityType));

        Person secondPerson = MockDataUtil.createPerson((long) 2, "SECOND", isDev, isTest, isOps, isOther);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSameSlotsTimes, secondPerson, expectedDate, availabilityType));
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(threeDifferentSlotsTimes, secondPerson, differentDate, availabilityType));

        resource = new PairResource(mockDao, pairFinder);

        when(mockDao.findSlotsForPairMatching(startDate, endDate, startTime, endTime, isDev, isTest, isOps, isOther)).thenReturn(mockSlots);
        persons = resource.findPairs(startDate, endDate, startTime, endTime, isDev, isTest, isOps, isOther);
    }


    @Test
    public void testFindPairForWeekShouldFindTwoPersons() {
        assertEquals("Should find 2 persons with pairs", 2, persons.size());
    }

    @Test
    public void testFindPairForWeekEachPersonShouldHaveThreeSlots() {
        assertTrue("Every person should have 3 slots in slotsList",
                persons
                        .stream()
                        .allMatch(person -> person.getSlotList().size() == 3));

    }

    @Test
    public void testFindPairForWeekFoundSlotsShouldBeTheSameAsExpected() {
        Person firstPerson = persons.get(0);

        assertTrue("When two people has the same slots in different days only these with minimum 3 slots times should be shown",
                firstPerson
                        .getSlotList()
                        .stream()
                        .map(Slot::getSlotTime)
                        .allMatch(searchedSlotTime -> expectedSameSlotsTimes.contains(searchedSlotTime)));
    }

    @Test
    public void testFindPairForWeekFoundSlotsShouldBeAtExpectedDay() {
        Person firstPerson = persons.get(0);

        assertTrue("Found slots should be at expected day",
                firstPerson
                        .getSlotList()
                        .stream()
                        .allMatch(slot -> slot.getSlotDate().equals(expectedDate)));

    }


}
