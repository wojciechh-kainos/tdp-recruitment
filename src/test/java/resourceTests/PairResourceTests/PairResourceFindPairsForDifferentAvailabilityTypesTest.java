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
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)

public class PairResourceFindPairsForDifferentAvailabilityTypesTest {

    @Mock
    private static SlotDao mockDao;

    @Mock
    private static PairFinder mockPairFinder;

    private List<Slot> mockSlots = new ArrayList<>();
    private List<Person> persons;

    @Before
    public void setUp() {
        final Time startTime = Time.valueOf("08:00:00");
        final Time endTime = Time.valueOf("17:00:00");
        final Boolean isTest = false;
        String startDate;
        String endDate;
        int TODAY_OFFSET = 0;
        Date date = MockDataUtil.createDate(TODAY_OFFSET);
        int TOMORROW_OFFSET = 1;
        Date nextDate = MockDataUtil.createDate(TOMORROW_OFFSET);
        startDate = MockDataUtil.convertDateToString(date);
        endDate = MockDataUtil.convertDateToString(nextDate);

        AvailabilityType typeAvailable = MockDataUtil.createAvailableType((long) 1, AvailabilityTypeEnum.available);
        AvailabilityType typeMaybe = MockDataUtil.createAvailableType((long) 5, AvailabilityTypeEnum.maybe);
        List<SlotTime> expectedSameSlotsTimes = MockDataUtil.createSlotsTimesList(1, 3);

        Boolean isDev = true;
        Boolean isOps = false;
        Boolean isOther = false;

        Person firstPerson = MockDataUtil.createPerson((long) 1, "FIRST", isDev, isTest, isOps, isOther);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSameSlotsTimes, firstPerson, date, typeAvailable));
        Person secondPerson = MockDataUtil.createPerson((long) 2, "SECOND", isDev, isTest, isOps, isOther);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSameSlotsTimes, secondPerson, date, typeMaybe));

        PairResource resource = new PairResource(mockDao, mockPairFinder);

        when(mockDao.findSlotsForPairMatching(startDate, endDate, startTime, endTime, isDev, isTest, isOps, isOther)).thenReturn(mockSlots);
        persons = resource.findPairs(startDate, endDate, startTime, endTime, isDev, isTest, isOps, isOther);
    }

    @Test
    public void testFindPairForDifferentAvailabilityTypesShouldFindTwoPersons() {
        assertEquals("Two persons should be found", 2, persons.size());
    }

    @Test
    public void testFindPairForDifferentAvailabilityTypesShouldFindThreeSlots() {
        assertTrue("First person should have 3 slots",
                persons
                        .stream()
                        .allMatch(person -> person.getSlotList().size() == 3));
    }
}
